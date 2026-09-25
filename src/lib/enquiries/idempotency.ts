import { Redis } from "@upstash/redis"
import type { EnquiryDependencies } from "./handler"

type StoredResponse = {
  status: number
  body: string
  headers: Record<string, string>
}

const memoryStore = new Map<string, StoredResponse>()
const IDEMPOTENCY_TTL_SECONDS = 60 * 60 * 24

function toStored(response: Response): Promise<StoredResponse> {
  return response.clone().text().then((body) => ({
    status: response.status,
    body,
    headers: { "content-type": response.headers.get("content-type") ?? "application/json" },
  }))
}

function fromStored(stored: StoredResponse): Response {
  return new Response(stored.body, {
    status: stored.status,
    headers: stored.headers,
  })
}

export function createMemoryIdempotencyStore(): EnquiryDependencies["idempotency"] {
  return {
    async get(key) {
      const stored = memoryStore.get(key)
      return stored ? fromStored(stored) : null
    },
    async set(key, response) {
      memoryStore.set(key, await toStored(response))
    },
  }
}

export function createRedisIdempotencyStore(): EnquiryDependencies["idempotency"] {
  const redis = Redis.fromEnv()

  return {
    async get(key) {
      const stored = await redis.get<StoredResponse>(`enquiry-idemp:${key}`)
      return stored ? fromStored(stored) : null
    },
    async set(key, response) {
      const stored = await toStored(response)
      await redis.set(`enquiry-idemp:${key}`, stored, {
        nx: true,
        ex: IDEMPOTENCY_TTL_SECONDS,
      })
    },
  }
}
