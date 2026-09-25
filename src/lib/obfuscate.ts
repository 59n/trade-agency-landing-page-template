/**
 * Base64 encodes an email address for safe embedding without exposing
 * plain text or 'mailto:' links in static server-rendered HTML or RSC flight streams.
 */
export function encodeEmail(email: string): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(email).toString("base64")
  }
  return typeof btoa !== "undefined" ? btoa(email) : email
}

export function decodeEmail(encoded: string): string {
  try {
    if (typeof atob !== "undefined") {
      return atob(encoded)
    }
    if (typeof Buffer !== "undefined") {
      return Buffer.from(encoded, "base64").toString("utf-8")
    }
  } catch {
    // Fallback if decoding fails
  }
  return encoded
}
