"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import Script from "next/script"
import { googleAnalytics } from "@/config/analytics"
import { setAnalyticsAdapter, type AnalyticsEvent } from "@/lib/analytics"

type Gtag = (command: "js" | "config" | "event", ...args: unknown[]) => void

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: Gtag
    configuredGaId?: string
  }
}

function eventParameters(event: AnalyticsEvent): Record<string, string> {
  if (event.name === "cta_click") return { location: event.ctaLocation }
  if (event.name === "enquiry_submit_error") return { category: event.category }
  return {}
}

function GoogleAnalyticsTracker() {
  const pathname = usePathname()
  const lastPageView = useRef<string | null>(null)

  useEffect(() => {
    setAnalyticsAdapter({
      track(event) {
        window.gtag?.("event", event.name, eventParameters(event))
      },
    })
    return () => setAnalyticsAdapter({ track() {} })
  }, [])

  useEffect(() => {
    if (!pathname || lastPageView.current === pathname) return
    lastPageView.current = pathname
    window.gtag?.("event", "page_view", {
      page_path: pathname,
      page_location: `${window.location.origin}${pathname}`,
    })
  }, [pathname])

  return null
}

export function GoogleAnalytics() {
  const { measurementId } = googleAnalytics
  const [ready, setReady] = useState(false)

  useEffect(() => {
    (window as unknown as Record<string, boolean>)[`ga-disable-${measurementId}`] = false
    return () => {
      (window as unknown as Record<string, boolean>)[`ga-disable-${measurementId}`] = true
      setAnalyticsAdapter({ track() {} })
    }
  }, [measurementId])

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`}
        strategy="afterInteractive"
        onReady={() => {
          window.dataLayer = window.dataLayer || []
          window.gtag = (...args) => { window.dataLayer?.push(args) }
          if (window.configuredGaId !== measurementId) {
            window.gtag("js", new Date())
            window.gtag("config", measurementId, {
              send_page_view: false,
              allow_google_signals: false,
              allow_ad_personalization_signals: false,
            })
            window.configuredGaId = measurementId
          }
          setReady(true)
        }}
      />
      {ready ? <GoogleAnalyticsTracker /> : null}
    </>
  )
}
