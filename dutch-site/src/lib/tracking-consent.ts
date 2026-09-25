export const TRACKING_CONSENT_KEY = "google-analytics-consent-v1"

export type TrackingConsent = "accepted" | "rejected"

const listeners = new Set<() => void>()

function emit() {
  listeners.forEach((listener) => listener())
}

export function subscribeTrackingConsent(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function readTrackingConsent(): TrackingConsent | null {
  if (typeof window === "undefined") {
    return null
  }
  const value = window.localStorage.getItem(TRACKING_CONSENT_KEY)
  return value === "accepted" || value === "rejected" ? value : null
}

export function writeTrackingConsent(value: TrackingConsent) {
  window.localStorage.setItem(TRACKING_CONSENT_KEY, value)
  emit()
}

export function getTrackingConsentSnapshot(): TrackingConsent | "default" {
  return readTrackingConsent() ?? "default"
}
