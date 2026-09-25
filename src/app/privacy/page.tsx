import type { Metadata } from "next"
import Link from "next/link"
import { SiteHeader } from "@/components/navigation/site-header"
import { SiteFooter } from "@/components/sections/site-footer"
import { publicProductionUrl } from "@/lib/enquiries/env"

export const metadata: Metadata = {
  title: "Privacy notice (draft)",
  description: "Template privacy notice requiring review before publication.",
  alternates: publicProductionUrl() ? { canonical: "/privacy" } : undefined,
}

export default function PrivacyPage() {
  return <>
    <SiteHeader />
    <main id="main" className="px-4 py-16 sm:px-6">
      <article className="mx-auto max-w-3xl space-y-8 text-foreground">
        <Link href="/" className="text-sm text-primary underline">Back to homepage</Link>
        <h1 className="font-heading text-4xl font-bold">Privacy notice (draft)</h1>
        <p className="rounded-xl border border-border bg-slate-50 p-4 text-muted-foreground">This is template text. Add the real controller, retention periods, legal basis and service providers, then have the notice reviewed before publishing.</p>
        <section className="space-y-2"><h2 className="text-2xl font-semibold">Who runs this site</h2><p className="text-muted-foreground leading-relaxed">Add the legal name, contact details and address of the organisation responsible for this site.</p></section>
        <section className="space-y-2"><h2 className="text-2xl font-semibold">Enquiries</h2><p className="text-muted-foreground leading-relaxed">The form asks for a name, business name, email, optional phone and website, and a message. The server processes these details to handle an enquiry. Configure a real recipient and verified sender before using the form live.</p></section>
        <section className="space-y-2"><h2 className="text-2xl font-semibold">Security and service providers</h2><p className="text-muted-foreground leading-relaxed">The template supports Resend for email and Upstash Redis for rate limiting and idempotency. Describe your actual hosting, providers, transfers and security measures.</p></section>
        <section className="space-y-2"><h2 className="text-2xl font-semibold">Analytics and retention</h2><p className="text-muted-foreground leading-relaxed">Analytics is disabled by default. If you enable Google Analytics, describe your GA4 property, cookies, data sharing and consent process. Set retention periods that match your actual practice.</p></section>
        <section className="space-y-2"><h2 className="text-2xl font-semibold">Your rights</h2><p className="text-muted-foreground leading-relaxed">Explain how visitors can request access, correction or deletion, and identify the relevant regulator.</p></section>
      </article>
    </main>
    <SiteFooter />
  </>
}
