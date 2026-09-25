"use client"

import { useRef, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { ArrowRight, ChevronDown } from "lucide-react"
import { site } from "@/config/site"
import { track } from "@/lib/analytics"
import {
  ADS_STATUS_OPTIONS,
  enquiryRequestSchema,
  fieldErrorsFromZod,
} from "@/lib/enquiries/schema"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

type FormState =
  | "idle"
  | "validating"
  | "submitting"
  | "success"
  | "validation_error"
  | "rate_limited"
  | "delivery_failed"

type FormValues = {
  name: string
  businessName: string
  email: string
  adsStatus: string
  phone: string
  website: string
  message: string
  websiteConfirm: string
}

const emptyValues: FormValues = {
  name: "",
  businessName: "",
  email: "",
  adsStatus: "",
  phone: "",
  website: "",
  message: "",
  websiteConfirm: "",
}

const inputClass = "min-h-11 rounded-xl bg-white text-base md:text-base border-border"

const managerIgnore = {
  "data-1p-ignore": true,
  "data-lpignore": "true",
  "data-bwignore": true,
  "data-protonpass-ignore": true,
} as const

function statusMessage(state: FormState, mock: boolean): string {
  switch (state) {
    case "validating":
      return "Checking your details…"
    case "submitting":
      return "Sending your message…"
    case "success":
      return mock
        ? "Enquiry recorded in development mock mode. Live email sending was not triggered."
        : "Thank you. Your message has been received. We will reply via email within 1–2 business days."
    case "validation_error":
      return "Please correct the highlighted fields."
    case "rate_limited":
      return "Too many attempts. Please wait a few minutes and try again."
    case "delivery_failed":
      return "We could not send your message just now. Please try again."
    default:
      return ""
  }
}

export function EnquiryForm() {
  const reduceMotion = useReducedMotion()
  const [values, setValues] = useState<FormValues>(emptyValues)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [state, setState] = useState<FormState>("idle")
  const [mock, setMock] = useState(false)
  const idempotencyKey = useRef("")

  const pending = state === "validating" || state === "submitting"
  const announcement = statusMessage(state, mock)

  function update(field: keyof FormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }))
    track({ name: "form_start" })
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending) {
      return
    }

    setState("validating")
    setErrors({})
    setMock(false)

    const parsed = enquiryRequestSchema.safeParse(values)
    if (!parsed.success) {
      setErrors(fieldErrorsFromZod(parsed.error))
      setState("validation_error")
      track({ name: "enquiry_submit_error", category: "validation" })
      return
    }

    setState("submitting")
    if (!idempotencyKey.current) {
      idempotencyKey.current =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : "local-enquiry-key"
    }

    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "idempotency-key": idempotencyKey.current,
        },
        body: JSON.stringify(parsed.data),
      })
      const payload = (await response.json()) as {
        ok?: boolean
        error?: string
        fields?: Record<string, string>
        delivery?: string
        mock?: boolean
      }

      if (response.status === 429) {
        setState("rate_limited")
        track({ name: "enquiry_submit_error", category: "rate_limited" })
        return
      }

      if (response.status === 400 && payload.fields) {
        setErrors(payload.fields)
        setState("validation_error")
        track({ name: "enquiry_submit_error", category: "validation" })
        return
      }

      if (!response.ok || !payload.ok) {
        setState("delivery_failed")
        track({ name: "enquiry_submit_error", category: "delivery" })
        return
      }

      setMock(payload.delivery === "mock" || payload.mock === true)
      setValues(emptyValues)
      idempotencyKey.current = ""
      setState("success")
      track({ name: "enquiry_submit_success" })
    } catch {
      setState("delivery_failed")
      track({ name: "enquiry_submit_error", category: "network" })
    }
  }

  return (
    <form
      id="enquiry-form"
      onSubmit={onSubmit}
      noValidate
      className="relative space-y-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="name" label="Name" required error={errors.name}>
          <Input
            id="name"
            name="name"
            autoComplete="name"
            required
            minLength={2}
            maxLength={100}
            placeholder="Your name"
            value={values.name}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={inputClass}
            suppressHydrationWarning
            {...managerIgnore}
            onChange={(event) => update("name", event.target.value)}
          />
        </Field>
        <Field id="businessName" label="Business name" required error={errors.businessName}>
          <Input
            id="businessName"
            name="businessName"
            autoComplete="organization"
            required
            minLength={2}
            maxLength={150}
            placeholder="Your business name"
            value={values.businessName}
            aria-invalid={Boolean(errors.businessName)}
            aria-describedby={errors.businessName ? "businessName-error" : undefined}
            className={inputClass}
            suppressHydrationWarning
            {...managerIgnore}
            onChange={(event) => update("businessName", event.target.value)}
          />
        </Field>
        <Field id="email" label="Email" required error={errors.email}>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
            placeholder="you@business.co.uk"
            value={values.email}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={inputClass}
            suppressHydrationWarning
            {...managerIgnore}
            onChange={(event) => update("email", event.target.value)}
          />
        </Field>
        <Field id="website" label="Website" error={errors.website}>
          <Input
            id="website"
            name="website"
            autoComplete="url"
            placeholder="https:// (optional)"
            value={values.website}
            aria-invalid={Boolean(errors.website)}
            aria-describedby={errors.website ? "website-error" : undefined}
            className={inputClass}
            suppressHydrationWarning
            {...managerIgnore}
            onChange={(event) => update("website", event.target.value)}
          />
        </Field>
      </div>

      {/* Clean, uncrowded dropdown select matching Input styling perfectly */}
      <Field id="adsStatus" label="Are you currently running Google Ads?">
        <div className="relative">
          <select
            id="adsStatus"
            name="adsStatus"
            value={values.adsStatus}
            onChange={(event) => update("adsStatus", event.target.value)}
            className="box-border flex min-h-11 w-full appearance-none rounded-xl border-2 border-input bg-white px-3.5 pr-10 py-2 text-sm text-foreground transition-[border-color] outline-none focus:border-primary"
          >
            <option value="">Select option (optional)...</option>
            {ADS_STATUS_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        </div>
      </Field>

      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="websiteConfirm" aria-hidden="true">Company website</label>
        <input
          id="websiteConfirm"
          name="websiteConfirm"
          tabIndex={-1}
          aria-hidden="true"
          autoComplete="off"
          value={values.websiteConfirm}
          onChange={(event) => update("websiteConfirm", event.target.value)}
        />
      </div>

      <Field
        id="message"
        label="How can we help?"
        required
        error={errors.message}
      >
        <Textarea
          id="message"
          name="message"
          required
          minLength={10}
          maxLength={3000}
          placeholder="Ask a question about our services, or let us know what trade jobs you want more of for a free local review…"
          value={values.message}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
          className="min-h-28 rounded-xl bg-white"
          suppressHydrationWarning
          {...managerIgnore}
          onChange={(event) => update("message", event.target.value)}
        />
      </Field>

      <Button
        type="submit"
        disabled={pending}
        className="h-12 w-full min-h-11 rounded-full text-sm font-medium"
      >
        {pending ? "Sending…" : site.formSubmitLabel}
        <ArrowRight className="size-4" />
      </Button>

      <p className="text-sm text-muted-foreground">
        We will only use your details to reply to your enquiry. See our{" "}
        <a className="underline underline-offset-4" href="/privacy">
          Privacy Policy
        </a>
        .
      </p>

      <div aria-live="polite" aria-atomic="true" className="min-h-6 text-sm">
        <AnimatePresence initial={false}>
          {announcement ? (
            <motion.p
              key={state}
              initial={reduceMotion ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
              transition={{ duration: 0.22 }}
              className={
                state === "success"
                  ? "text-primary font-medium"
                  : state === "idle"
                    ? ""
                    : "text-destructive"
              }
            >
              {announcement}
            </motion.p>
          ) : null}
        </AnimatePresence>
      </div>
    </form>
  )
}

function Field({
  id,
  label,
  required,
  error,
  children,
}: {
  id: string
  label: string
  required?: boolean
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <Label htmlFor={id} className="font-medium">
          {label}
          {required ? <span className="text-primary ml-1">*</span> : null}
        </Label>
        {!required ? (
          <span className="text-xs text-muted-foreground">(optional)</span>
        ) : null}
      </div>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  )
}
