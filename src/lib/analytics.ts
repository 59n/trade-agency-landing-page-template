import { googleAnalytics } from "@/config/analytics"

export type AnalyticsEvent =
  | { name: "cta_click"; ctaLocation: string }
  | { name: "form_start" }
  | { name: "enquiry_submit_success" }
  | { name: "enquiry_submit_error"; category: string }

export type AnalyticsAdapter = {
  track: (event: AnalyticsEvent) => void
}

const noopAdapter: AnalyticsAdapter = {
  track() {},
}

let adapter: AnalyticsAdapter = noopAdapter
let formStartRecorded = false

export function analyticsEnabled(): boolean {
  return googleAnalytics.enabled
}

export function setAnalyticsAdapter(next: AnalyticsAdapter) {
  adapter = next
}

export function track(event: AnalyticsEvent) {
  if (!analyticsEnabled()) {
    return
  }

  if (event.name === "form_start") {
    if (formStartRecorded) {
      return
    }
    formStartRecorded = true
  }

  adapter.track(event)
}

export function resetAnalyticsForTests() {
  formStartRecorded = false
  adapter = noopAdapter
}

/**
 * Future Google Ads conversion tracking should call this only after
 * `enquiry_submit_success`. Leave GOOGLE_ADS_CONVERSION_ID empty until a
 * real conversion action exists. Do not fire conversions from button clicks.
 */
export function googleAdsConversionId(): string {
  return process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID ?? ""
}
