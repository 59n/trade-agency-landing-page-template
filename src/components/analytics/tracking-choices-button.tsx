"use client"

import { googleAnalytics } from "@/config/analytics"
import { openTrackingConsent } from "@/components/analytics/analytics-consent"

export function TrackingChoicesButton() {
  if (!googleAnalytics.enabled) return null
  return (
    <button
      type="button"
      className="inline-flex min-h-11 items-center underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:rounded"
      onClick={() => openTrackingConsent()}
    >
      Tracking choices
    </button>
  )
}
