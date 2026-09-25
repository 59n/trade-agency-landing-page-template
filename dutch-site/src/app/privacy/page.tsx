import type { Metadata } from "next"
import Link from "next/link"
import { SiteHeader } from "@/components/navigation/site-header"
import { SiteFooter } from "@/components/sections/site-footer"
import { publicProductionUrl } from "@/lib/enquiries/env"

export const metadata: Metadata = {
  title: "Privacybeleid (concept)",
  description: "Template privacy notice requiring review before publication.",
  alternates: publicProductionUrl() ? { canonical: "/privacy" } : undefined,
}

export default function PrivacyPage() {
  return <>
    <SiteHeader />
    <main id="main" className="px-4 py-16 sm:px-6">
      <article className="mx-auto max-w-3xl space-y-8 text-foreground">
        <Link href="/" className="text-sm text-primary underline">Terug naar de homepage</Link>
        <h1 className="font-heading text-4xl font-bold">Privacybeleid (concept)</h1>
        <p className="rounded-xl border border-border bg-slate-50 p-4 text-muted-foreground">Dit is een voorbeeldtekst. Vul de gegevens van de verwerkingsverantwoordelijke, bewaartermijnen, grondslagen en gebruikte leveranciers in en laat de tekst beoordelen voordat je de site publiceert.</p>
        <section className="space-y-2"><h2 className="text-2xl font-semibold">Verwerkingsverantwoordelijke</h2><p className="text-muted-foreground leading-relaxed">Vermeld hier de juridische naam, contactgegevens en het adres van de organisatie.</p></section>
        <section className="space-y-2"><h2 className="text-2xl font-semibold">Contactformulier</h2><p className="text-muted-foreground leading-relaxed">Het formulier vraagt om naam, bedrijfsnaam, e-mailadres, optioneel telefoonnummer en website, en een bericht. De server verwerkt deze gegevens om een aanvraag af te handelen. Configureer de e-mailontvanger en een geverifieerde afzender voordat je het formulier live gebruikt.</p></section>
        <section className="space-y-2"><h2 className="text-2xl font-semibold">Beveiliging en leveranciers</h2><p className="text-muted-foreground leading-relaxed">De template ondersteunt Resend voor e-mail en Upstash Redis voor rate limiting en idempotentie. Beschrijf je werkelijke hosting, leveranciers, doorgiften en beveiligingsmaatregelen.</p></section>
        <section className="space-y-2"><h2 className="text-2xl font-semibold">Analytics en bewaartermijnen</h2><p className="text-muted-foreground leading-relaxed">Analytics staat standaard uit. Als je Google Analytics inschakelt, beschrijf dan jouw GA4-configuratie, cookies, gegevensdeling en toestemming. Vul bewaartermijnen in die bij je eigen proces passen.</p></section>
        <section className="space-y-2"><h2 className="text-2xl font-semibold">Rechten en klachten</h2><p className="text-muted-foreground leading-relaxed">Beschrijf hoe bezoekers inzage, correctie of verwijdering kunnen aanvragen en noem de relevante toezichthouder.</p></section>
      </article>
    </main>
    <SiteFooter />
  </>
}
