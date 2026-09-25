import { createResendDelivery, mockDelivery } from "./delivery"
import { readEnquiryEnv, hasRedisCredentials } from "./env"
import type { EnquiryDependencies } from "./handler"
import { createMemoryIdempotencyStore, createRedisIdempotencyStore } from "./idempotency"
import { createMemoryRateLimiter, createUpstashRateLimiter } from "./rate-limit"

export class EnquiryConfigurationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "EnquiryConfigurationError"
  }
}

export function createEnquiryDependencies(): EnquiryDependencies {
  const env = readEnquiryEnv()
  const production = env.nodeEnv === "production"

  if (production && !hasRedisCredentials()) {
    throw new EnquiryConfigurationError("rate_limit_unconfigured")
  }

  if (env.deliveryMode === "resend") {
    if (!process.env.RESEND_API_KEY || !env.fromEmail || !env.toEmail) {
      throw new EnquiryConfigurationError("delivery_unconfigured")
    }
  }

  const delivery =
    env.deliveryMode === "resend"
      ? createResendDelivery(process.env.RESEND_API_KEY as string)
      : mockDelivery

  return {
    env,
    delivery,
    rateLimit: hasRedisCredentials()
      ? createUpstashRateLimiter(env.rateLimitMax, env.rateLimitWindowSeconds)
      : createMemoryRateLimiter(env.rateLimitMax, env.rateLimitWindowSeconds),
    idempotency: hasRedisCredentials()
      ? createRedisIdempotencyStore()
      : createMemoryIdempotencyStore(),
    log: (message) => {
      console.info(message)
    },
  }
}
