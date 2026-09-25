import type { EnquiryEnv } from "./handler"

function parsePositiveInt(value: string | undefined, fallback: number): number {
  if (!value) {
    return fallback
  }
  const parsed = Number.parseInt(value, 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

export function deliveryModeFor(nodeEnv: string): "resend" | "mock" {
  const explicit = process.env.ENQUIRY_DELIVERY_MODE
  if (explicit === "mock") {
    return "mock"
  }
  if (explicit === "resend") {
    return "resend"
  }
  return nodeEnv === "production" ? "resend" : "mock"
}

export function configuredSiteUrl(): string {
  return (process.env.SITE_URL || "http://localhost:3000").replace(/\/$/, "")
}

export function publicProductionUrl(): string | undefined {
  if (!process.env.SITE_URL) return undefined
  try {
    const parsed = new URL(process.env.SITE_URL)
    if (parsed.protocol !== "https:" || /^(?:.+\.)?example\.(?:com|org|net)$/.test(parsed.hostname) || parsed.hostname.endsWith(".example")) return undefined
    return parsed.origin
  } catch {
    return undefined
  }
}

export function readEnquiryEnv(): EnquiryEnv {
  const nodeEnv = process.env.NODE_ENV ?? "development"
  const siteUrl = configuredSiteUrl()
  const extraOrigins = (process.env.SITE_ORIGINS ?? "")
    .split(",")
    .map((origin) => origin.trim().replace(/\/$/, ""))
    .filter(Boolean)
  const localOrigins =
    nodeEnv === "production"
      ? []
      : ["http://localhost:3000", "http://localhost:3001"]

  return {
    nodeEnv,
    deliveryMode: deliveryModeFor(nodeEnv),
    siteOrigins: Array.from(
      new Set([siteUrl, ...localOrigins, ...extraOrigins]),
    ),
    rateLimitMax: parsePositiveInt(process.env.RATE_LIMIT_MAX, 5),
    rateLimitWindowSeconds: parsePositiveInt(process.env.RATE_LIMIT_WINDOW_SECONDS, 600),
    fromEmail:
      process.env.ENQUIRY_FROM_EMAIL ?? process.env.RESEND_FROM_EMAIL ?? "",
    toEmail: process.env.ENQUIRY_TO_EMAIL ?? "",
    maxBodyBytes: 16_384,
    trustProxy:
      process.env.VERCEL === "1" ||
      process.env.TRUST_PROXY === "true",
  }
}

export function hasRedisCredentials(): boolean {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)
}
