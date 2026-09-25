// Google Analytics stays off until both values are configured.
const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ""

export const googleAnalytics = {
  measurementId,
  enabled:
    process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === "true" &&
    /^G-[A-Z0-9]+$/.test(measurementId),
} as const
