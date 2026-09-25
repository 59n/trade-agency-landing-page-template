import * as z from "zod"

const PHONE_PATTERN = /^[+0-9() .\-]*$/

export const ADS_STATUS_OPTIONS = [
  "Nog nooit Google Ads gebruikt",
  "Ik beheer de advertenties zelf",
  "Ik werk met een ander bureau",
  "Eerder geprobeerd, maar gestopt",
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
  z.string().trim().max(100, { error: "De Google Ads-status is te lang" }).optional(),
)

const optionalPhone = z.preprocess(
  emptyToUndefined,
  z
    .string()
    .trim()
    .max(40, { error: "Het telefoonnummer is te lang" })
    .regex(PHONE_PATTERN, {
      error: "Vul een telefoonnummer in met cijfers en gangbare scheidingstekens",
    })
    .optional(),
)

const optionalWebsite = z.preprocess(
  emptyToUndefined,
  z
    .string()
    .trim()
    .max(200, { error: "Het websiteadres is te lang" })
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
          message: "Vul een geldig websiteadres in",
        })
        return z.NEVER
      }
    }),
)

export const enquiryFieldsSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { error: "Vul minimaal 2 tekens in" })
    .max(100, { error: "De naam mag maximaal 100 tekens bevatten" }),
  businessName: z
    .string()
    .trim()
    .min(2, { error: "Vul minimaal 2 tekens in" })
    .max(150, { error: "De bedrijfsnaam mag maximaal 150 tekens bevatten" }),
  email: z
    .email({ error: "Vul een geldig e-mailadres in" })
    .max(254, { error: "Het e-mailadres is te lang" }),
  adsStatus: optionalAdsStatus,
  phone: optionalPhone,
  website: optionalWebsite,
  message: z
    .string()
    .trim()
    .min(10, { error: "Vul minimaal 10 tekens in" })
    .max(3000, { error: "Het bericht mag maximaal 3.000 tekens bevatten" }),
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
