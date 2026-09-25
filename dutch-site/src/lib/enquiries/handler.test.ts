import assert from "node:assert/strict"
import { test } from "node:test"
import {
  handleEnquiryRequest,
  isAllowedOrigin,
  type EnquiryDependencies,
} from "./handler"
import type { EnquiryFields } from "./schema"

const validBody = {
  name: "Jan Eigenaar",
  businessName: "Eigenaar Dakwerken B.V.",
  email: "jane@example.com",
  phone: "+31 20 000 0000",
  website: "eigenaar-dakwerken.nl",
  message: "We willen hulp met Google Ads voor aanvragen voor dakwerk.",
}

function createMemoryDeps(
  overrides: Partial<EnquiryDependencies> = {},
): EnquiryDependencies & {
  sent: EnquiryFields[]
  logs: string[]
} {
  const sent: EnquiryFields[] = []
  const logs: string[] = []
  const rateCounts = new Map<string, number>()
  const idempotency = new Map<string, Response>()

  const deps: EnquiryDependencies & { sent: EnquiryFields[]; logs: string[] } = {
    sent,
    logs,
    env: {
      nodeEnv: "test",
      deliveryMode: "resend",
      siteOrigins: ["http://localhost:3000"],
      rateLimitMax: 5,
      rateLimitWindowSeconds: 600,
      fromEmail: "Agency Name <hello@example.com>",
      toEmail: "hello@example.com",
      maxBodyBytes: 16_384,
      trustProxy: true,
    },
    delivery: {
      async send({ fields }) {
        sent.push(fields)
        return { ok: true, id: "msg_1" }
      },
    },
    rateLimit: {
      async consume(key) {
        const count = (rateCounts.get(key) ?? 0) + 1
        rateCounts.set(key, count)
        return { allowed: count <= 5, remaining: Math.max(0, 5 - count) }
      },
    },
    idempotency: {
      async get(key) {
        const stored = idempotency.get(key)
        return stored ? stored.clone() : null
      },
      async set(key, response) {
        idempotency.set(key, response.clone())
      },
    },
    log: (message) => {
      logs.push(message)
    },
    ...overrides,
  }

  return deps
}

function request(init: {
  body?: unknown
  json?: boolean
  origin?: string
  ip?: string
  idempotencyKey?: string
  contentLength?: string
}): Request {
  const headers = new Headers()
  if (init.json !== false) {
    headers.set("content-type", "application/json")
  }
  if (init.origin) {
    headers.set("origin", init.origin)
  }
  if (init.ip) {
    headers.set("x-forwarded-for", init.ip)
  }
  if (init.idempotencyKey) {
    headers.set("idempotency-key", init.idempotencyKey)
  }
  if (init.contentLength) {
    headers.set("content-length", init.contentLength)
  }

  return new Request("http://localhost:3000/api/enquiries", {
    method: "POST",
    headers,
    body: init.body === undefined ? JSON.stringify(validBody) : JSON.stringify(init.body),
  })
}

test("accepts a valid enquiry and delivers it", async () => {
  const deps = createMemoryDeps()
  const response = await handleEnquiryRequest(
    request({ origin: "http://localhost:3000" }),
    deps,
  )
  const payload = await response.json()

  assert.equal(response.status, 200)
  assert.equal(payload.ok, true)
  assert.equal(payload.delivery, "accepted")
  assert.equal(deps.sent.length, 1)
  assert.equal(deps.sent[0]?.email, "jane@example.com")
})

test("rejects invalid input with structured field errors", async () => {
  const deps = createMemoryDeps()
  const response = await handleEnquiryRequest(
    request({
      origin: "http://localhost:3000",
      body: { ...validBody, email: "nope", message: "short" },
    }),
    deps,
  )
  const payload = await response.json()

  assert.equal(response.status, 400)
  assert.equal(payload.ok, false)
  assert.equal(payload.error, "validation")
  assert.ok(payload.fields.email)
  assert.ok(payload.fields.message)
  assert.equal(deps.sent.length, 0)
})

test("does not report success when the provider fails", async () => {
  const deps = createMemoryDeps({
    delivery: {
      async send() {
        return { ok: false, error: "provider_unavailable" }
      },
    },
  })
  const response = await handleEnquiryRequest(
    request({ origin: "http://localhost:3000" }),
    deps,
  )
  const payload = await response.json()

  assert.equal(response.status, 502)
  assert.equal(payload.ok, false)
  assert.equal(payload.error, "delivery_failed")
  assert.notEqual(payload.error, undefined)
})

test("rate limits repeated submissions from the same client", async () => {
  const deps = createMemoryDeps()
  let last = new Response()

  for (let i = 0; i < 6; i += 1) {
    last = await handleEnquiryRequest(
      request({ origin: "http://localhost:3000", ip: "203.0.113.10" }),
      deps,
    )
  }

  const payload = await last.json()
  assert.equal(last.status, 429)
  assert.equal(payload.error, "rate_limited")
  assert.equal(deps.sent.length, 5)
})

test("does not send a second email for a retried idempotent request", async () => {
  const deps = createMemoryDeps()
  const first = await handleEnquiryRequest(
    request({ origin: "http://localhost:3000", idempotencyKey: "abc-123" }),
    deps,
  )
  const second = await handleEnquiryRequest(
    request({ origin: "http://localhost:3000", idempotencyKey: "abc-123" }),
    deps,
  )

  assert.equal(first.status, 200)
  assert.equal(second.status, 200)
  assert.equal(deps.sent.length, 1)
})

test("ignores honeypot submissions without delivering", async () => {
  const deps = createMemoryDeps()
  const response = await handleEnquiryRequest(
    request({
      origin: "http://localhost:3000",
      body: { ...validBody, websiteConfirm: "spam" },
    }),
    deps,
  )
  const payload = await response.json()

  assert.equal(response.status, 200)
  assert.equal(payload.ok, true)
  assert.equal(deps.sent.length, 0)
})

test("allows the production site origin", () => {
  const request = new Request("https://agency-domain.co.uk/api/enquiries", {
    method: "POST",
    headers: { origin: "https://agency-domain.co.uk" },
  })
  assert.equal(isAllowedOrigin(request, ["https://agency-domain.co.uk"]), true)
})

test("rejects a disallowed origin", async () => {
  const deps = createMemoryDeps()
  const response = await handleEnquiryRequest(
    request({ origin: "https://evil.example" }),
    deps,
  )
  const payload = await response.json()

  assert.equal(response.status, 403)
  assert.equal(payload.error, "forbidden_origin")
  assert.equal(deps.sent.length, 0)
})

test("labels mock delivery instead of claiming a real send", async () => {
  const deps = createMemoryDeps({
    env: {
      nodeEnv: "development",
      deliveryMode: "mock",
      siteOrigins: ["http://localhost:3000"],
      rateLimitMax: 5,
      rateLimitWindowSeconds: 600,
      fromEmail: "Agency Name <hello@example.com>",
      toEmail: "hello@example.com",
      maxBodyBytes: 16_384,
      trustProxy: true,
    },
    delivery: {
      async send() {
        return { ok: true, id: "mock", mock: true }
      },
    },
  })
  const response = await handleEnquiryRequest(
    request({ origin: "http://localhost:3000" }),
    deps,
  )
  const payload = await response.json()

  assert.equal(response.status, 200)
  assert.equal(payload.delivery, "mock")
  assert.equal(payload.mock, true)
})

test("fails clearly in production when mock mode is configured", async () => {
  const deps = createMemoryDeps({
    env: {
      nodeEnv: "production",
      deliveryMode: "mock",
      siteOrigins: ["https://example.com"],
      rateLimitMax: 5,
      rateLimitWindowSeconds: 600,
      fromEmail: "Agency Name <hello@example.com>",
      toEmail: "hello@example.com",
      maxBodyBytes: 16_384,
      trustProxy: true,
    },
  })
  const response = await handleEnquiryRequest(
    request({ origin: "https://example.com" }),
    deps,
  )
  const payload = await response.json()

  assert.equal(response.status, 503)
  assert.equal(payload.error, "delivery_unconfigured")
  assert.equal(deps.sent.length, 0)
})

test("does not log the message body or email address", async () => {
  const deps = createMemoryDeps()
  await handleEnquiryRequest(request({ origin: "http://localhost:3000" }), deps)

  const combined = deps.logs.join(" ")
  assert.equal(combined.includes("jane@example.com"), false)
  assert.equal(combined.includes("Google Ads"), false)
})
