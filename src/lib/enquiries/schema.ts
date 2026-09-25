import * as z from "zod"

const PHONE_PATTERN = /^[+0-9() .\-]*$/

export const ADS_STATUS_OPTIONS = [
  "Never run Google Ads",
  "Running ads myself",
  "Using another agency",
  "Tried before but stopped",
] as const

export function normaliseWebsite(value: string): string {
  const trimmed = value.trim()
  const hasScheme = /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed)
  const candidate = hasScheme ? trimmed : `https://${trimmed}`
  const url = new URL(candidate)

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("Unsupported website protocol")
  }

  if (!url.hostname) {
    throw new Error("Website is missing a host")
  }

  return url.toString()
}

function emptyToUndefined(value: unknown) {
  if (typeof value === "string" && value.trim() === "") {
    return undefined
  }
  return value
}

const optionalAdsStatus = z.preprocess(
  emptyToUndefined,
  z.string().trim().max(100, { error: "Google Ads status is too long" }).optional(),
)

const optionalPhone = z.preprocess(
  emptyToUndefined,
  z
    .string()
    .trim()
    .max(40, { error: "Phone number is too long" })
    .regex(PHONE_PATTERN, {
      error: "Enter a phone number using digits and common separators",
    })
    .optional(),
)

const optionalWebsite = z.preprocess(
  emptyToUndefined,
  z
    .string()
    .trim()
    .max(200, { error: "Website address is too long" })
    .optional()
    .transform((value, ctx) => {
      if (!value) {
        return undefined
      }

      try {
        return normaliseWebsite(value)
      } catch {
        ctx.addIssue({
          code: "custom",
          message: "Enter a valid website address",
        })
        return z.NEVER
      }
    }),
)

export const enquiryFieldsSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { error: "Enter at least 2 characters" })
    .max(100, { error: "Name must be 100 characters or fewer" }),
  businessName: z
    .string()
    .trim()
    .min(2, { error: "Enter at least 2 characters" })
    .max(150, { error: "Business name must be 150 characters or fewer" }),
  email: z
    .email({ error: "Enter a valid email address" })
    .max(254, { error: "Email address is too long" }),
  adsStatus: optionalAdsStatus,
  phone: optionalPhone,
  website: optionalWebsite,
  message: z
    .string()
    .trim()
    .min(10, { error: "Enter at least 10 characters" })
    .max(3000, { error: "Message must be 3,000 characters or fewer" }),
})

export const enquiryRequestSchema = enquiryFieldsSchema.extend({
  websiteConfirm: z.string().max(200).optional(),
})

export type EnquiryFields = z.infer<typeof enquiryFieldsSchema>
export type EnquiryRequest = z.infer<typeof enquiryRequestSchema>

export function fieldErrorsFromZod(error: z.ZodError): Record<string, string> {
  const flattened = z.flattenError(error)
  const fieldErrors: Record<string, string> = {}

  for (const [field, messages] of Object.entries(flattened.fieldErrors)) {
    const first = Array.isArray(messages) ? messages[0] : undefined
    if (typeof first === "string") {
      fieldErrors[field] = first
    }
  }

  return fieldErrors
}
