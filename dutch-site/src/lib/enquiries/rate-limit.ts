import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"
import type { EnquiryDependencies } from "./handler"

const memoryCounts = new Map<string, { count: number; resetAt: number }>()

export function createMemoryRateLimiter(
  max: number,
  windowSeconds: number,
): EnquiryDependencies["rateLimit"] {
  return {
    async consume(key) {
      const now = Date.now()
      const current = memoryCounts.get(key)
      if (!current || current.resetAt <= now) {
        memoryCounts.set(key, { count: 1, resetAt: now + windowSeconds * 1000 })
        return { allowed: true, remaining: max - 1 }
      }

      current.count += 1
      return {
        allowed: current.count <= max,
        remaining: Math.max(0, max - current.count),
      }
    },
  }
}

export function createUpstashRateLimiter(
  max: number,
  windowSeconds: number,
): EnquiryDependencies["rateLimit"] {
  const redis = Redis.fromEnv()
  const limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(max, `${windowSeconds} s`),
    prefix: "enquiry-rl",
  })

  return {
    async consume(key) {
      const result = await limiter.limit(key)
      return { allowed: result.success, remaining: result.remaining }
    },
  }
}
