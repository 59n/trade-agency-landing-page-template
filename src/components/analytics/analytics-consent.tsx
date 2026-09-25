"use client"

import { useEffect, useState, useSyncExternalStore } from "react"
import Link from "next/link"
import { GoogleAnalytics } from "@/components/analytics/google-analytics"
import { googleAnalytics } from "@/config/analytics"
import {
  getTrackingConsentSnapshot,
  subscribeTrackingConsent,
  writeTrackingConsent,
  type TrackingConsent,
} from "@/lib/tracking-consent"

function getServerSnapshot(): "ssr" {
  return "ssr"
}

export function AnalyticsConsent() {
  const stored = useSyncExternalStore(
    subscribeTrackingConsent,
    getTrackingConsentSnapshot,
    getServerSnapshot,
  )
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    const onOpen = () => setEditing(true)
    window.addEventListener("open-tracking-consent", onOpen)
    return () => window.removeEventListener("open-tracking-consent", onOpen)
  }, [])

  // Keyboard navigation: Escape key closes the choices modal when editing
  useEffect(() => {
    if (!editing) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setEditing(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [editing])

  function decide(next: TrackingConsent) {
    writeTrackingConsent(next)
    setEditing(false)
  }

  const configured = googleAnalytics.enabled
  const trackingOn = configured && stored === "accepted"
  const showBanner = configured && (stored === "default" || editing)

  return (
    <>
      {trackingOn ? <GoogleAnalytics /> : null}

      {showBanner ? (
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <div
            role="dialog"
            aria-labelledby="tracking-consent-title"
            aria-describedby="tracking-consent-body"
            className="pointer-events-auto w-full max-w-md rounded-2xl border border-border bg-white/95 p-4 shadow-[0_16px_48px_rgba(15,23,42,0.12)] backdrop-blur-md"
          >
            <p id="tracking-consent-title" className="sr-only">
              Analytics
            </p>
            <p id="tracking-consent-body" className="text-sm leading-relaxed text-muted-foreground">
              Google Analytics loads only if you accept. It may set cookies.{" "}
              <Link
                href="/privacy"
                className="underline underline-offset-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:rounded"
              >
                Privacy
              </Link>
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                className="inline-flex min-h-11 min-w-24 items-center justify-center rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                onClick={() => decide("accepted")}
              >
                OK
              </button>
              <button
                type="button"
                className="inline-flex min-h-11 min-w-24 items-center justify-center rounded-full border border-border px-4 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                onClick={() => decide("rejected")}
              >
                Opt out
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}

export function openTrackingConsent() {
  window.dispatchEvent(new Event("open-tracking-consent"))
}
