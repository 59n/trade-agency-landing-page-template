import { createHash } from "node:crypto"
import { escapeHtml } from "./html"
import {
  enquiryRequestSchema,
  fieldErrorsFromZod,
  type EnquiryFields,
} from "./schema"

export type DeliveryResult =
  | { ok: true; id: string; mock?: boolean }
  | { ok: false; error: string }

export type EnquiryEnv = {
  nodeEnv: string
  deliveryMode: "resend" | "mock"
  siteOrigins: string[]
  rateLimitMax: number
  rateLimitWindowSeconds: number
  fromEmail: string
  toEmail: string
  maxBodyBytes: number
  trustProxy: boolean
}

export type EnquiryDependencies = {
  env: EnquiryEnv
  delivery: {
    send: (input: {
      fields: EnquiryFields
      html: string
      text: string
      from: string
      to: string
      replyTo: string
    }) => Promise<DeliveryResult>
  }
  rateLimit: {
    consume: (key: string) => Promise<{ allowed: boolean; remaining: number }>
  }
  idempotency: {
    get: (key: string) => Promise<Response | null>
    set: (key: string, response: Response) => Promise<void>
  }
  log: (message: string) => void
}

const JSON_TYPE = /^application\/json(?:;|$)/i

function json(status: number, body: unknown, extraHeaders?: HeadersInit) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...extraHeaders,
    },
  })
}

export function clientIp(request: Request, trustProxy: boolean): string {
  if (!trustProxy) {
    return "untrusted"
  }

  const forwarded = request.headers.get("x-forwarded-for")
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim()
    if (first) {
      return first
    }
  }

  return request.headers.get("x-real-ip")?.trim() || "unknown"
}

export function isAllowedOrigin(request: Request, allowedOrigins: string[]): boolean {
  const allowed = new Set(allowedOrigins.map((origin) => origin.replace(/\/$/, "")))
  const origin = request.headers.get("origin")

  if (origin) {
    return allowed.has(origin.replace(/\/$/, ""))
  }

  const referer = request.headers.get("referer")
  if (!referer) {
    return false
  }

  try {
    const refererOrigin = new URL(referer).origin
    return allowed.has(refererOrigin)
  } catch {
    return false
  }
}

function hashValue(value: string): string {
  return createHash("sha256").update(value).digest("hex").slice(0, 12)
}

export function buildEnquiryEmail(fields: EnquiryFields): { html: string; text: string } {
  const rows: Array<[string, string | undefined]> = [
    ["Name", fields.name],
    ["Business", fields.businessName],
    ["Email", fields.email],
    ["Google Ads Status", fields.adsStatus],
    ["Phone", fields.phone],
    ["Website", fields.website],
    ["Message", fields.message],
  ]

  const htmlRows = rows
    .filter(([, value]) => value)
    .map(
      ([label, value]) =>
        `<p><strong>${escapeHtml(label)}:</strong><br>${escapeHtml(value ?? "").replace(/\n/g, "<br>")}</p>`,
    )
    .join("")

  const text = rows
    .filter(([, value]) => value)
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n")

  return {
    html: `<div>${htmlRows}</div>`,
    text,
  }
}

async function storeAndReturn(
  deps: EnquiryDependencies,
  idempotencyKey: string | undefined,
  response: Response,
): Promise<Response> {
  if (idempotencyKey) {
    await deps.idempotency.set(idempotencyKey, response.clone())
  }
  return response
}

export async function handleEnquiryRequest(
  request: Request,
  deps: EnquiryDependencies,
): Promise<Response> {
  const { env } = deps

  if (request.method !== "POST") {
    return json(405, { ok: false, error: "method_not_allowed" })
  }

  if (env.nodeEnv === "production" && env.deliveryMode !== "resend") {
    deps.log("enquiry_blocked delivery_unconfigured")
    return json(503, { ok: false, error: "delivery_unconfigured" })
  }

  if (!isAllowedOrigin(request, env.siteOrigins)) {
    deps.log("enquiry_blocked forbidden_origin")
    return json(403, { ok: false, error: "forbidden_origin" })
  }

  const contentType = request.headers.get("content-type") ?? ""
  if (!JSON_TYPE.test(contentType)) {
    return json(415, { ok: false, error: "unsupported_media_type" })
  }

  const declaredLength = request.headers.get("content-length")
  if (declaredLength && Number.parseInt(declaredLength, 10) > env.maxBodyBytes) {
    return json(413, { ok: false, error: "payload_too_large" })
  }

  const rawBody = await request.text()
  if (rawBody.length > env.maxBodyBytes) {
    return json(413, { ok: false, error: "payload_too_large" })
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(rawBody) as unknown
  } catch {
    return json(400, { ok: false, error: "malformed_json" })
  }

  const ip = clientIp(request, env.trustProxy)
  const ipHash = hashValue(ip)
  const idempotencyKey = request.headers.get("idempotency-key")?.trim() || undefined

  if (idempotencyKey) {
    const cached = await deps.idempotency.get(idempotencyKey)
    if (cached) {
      deps.log(`enquiry_idempotent ip=${ipHash}`)
      return cached
    }
  }

  const limited = await deps.rateLimit.consume(`enquiry:${ip}`)
  if (!limited.allowed) {
    deps.log(`enquiry_rate_limited ip=${ipHash}`)
    return json(429, { ok: false, error: "rate_limited" }, { "retry-after": String(env.rateLimitWindowSeconds) })
  }

  const result = enquiryRequestSchema.safeParse(parsed)
  if (!result.success) {
    return json(400, {
      ok: false,
      error: "validation",
      fields: fieldErrorsFromZod(result.error),
    })
  }

  const { websiteConfirm, ...fields } = result.data
  if (websiteConfirm && websiteConfirm.trim() !== "") {
    deps.log(`enquiry_honeypot ip=${ipHash}`)
    return storeAndReturn(deps, idempotencyKey, json(200, { ok: true, delivery: "accepted" }))
  }

  const email = buildEnquiryEmail(fields)
  const delivery = await deps.delivery.send({
    fields,
    html: email.html,
    text: email.text,
    from: env.fromEmail,
    to: env.toEmail,
    replyTo: fields.email,
  })

  if (!delivery.ok) {
    deps.log(`enquiry_delivery_failed ip=${ipHash}`)
    return json(502, { ok: false, error: "delivery_failed" })
  }

  const mock = delivery.mock === true || env.deliveryMode === "mock"
  deps.log(
    `enquiry_accepted ip=${ipHash} delivery=${mock ? "mock" : "accepted"} hasPhone=${Boolean(fields.phone)} hasWebsite=${Boolean(fields.website)}`,
  )

  return storeAndReturn(
    deps,
    idempotencyKey,
    json(200, {
      ok: true,
      delivery: mock ? "mock" : "accepted",
      ...(mock ? { mock: true } : {}),
    }),
  )
}
