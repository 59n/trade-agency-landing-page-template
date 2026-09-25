import Link from "next/link"
import { TrackingChoicesButton } from "@/components/analytics/tracking-choices-button"
import { Wordmark } from "@/components/brand"
import { ObfuscatedEmailLink } from "@/components/obfuscated-email-link"
import { encodeEmail } from "@/lib/obfuscate"
import { site } from "@/config/site"

export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-16 border-t border-border bg-slate-50/50 px-4 pt-12 pb-10 sm:px-6">
      <div className="mx-auto max-w-[1160px]">
        {/* Main Footer Grid */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1fr_auto_1fr]">
          {/* Brand & Positioning */}
          <div className="space-y-3">
            <Link href="/" className="inline-block" aria-label="Naar de homepage">
              <Wordmark />
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              Gericht Google Ads-beheer en betrouwbare tracking van telefonische aanvragen voor vakbedrijven.
            </p>
          </div>

          {/* Centered Navigation */}
          <div className="lg:flex lg:flex-col lg:items-center">
            <p className="text-xs font-semibold tracking-wider text-foreground uppercase">
              Navigatie
            </p>
            <ul className="mt-3.5 space-y-2 text-sm text-muted-foreground lg:text-center">
              {site.navigation.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className="inline-block transition-colors hover:text-foreground underline-offset-4 hover:underline"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Direct Contact */}
          <div className="space-y-3 lg:flex lg:flex-col lg:items-end lg:text-right">
            <p className="text-xs font-semibold tracking-wider text-foreground uppercase">
              Contact
            </p>
            <p className="max-w-xs text-xs text-muted-foreground leading-relaxed">
              Vul hier de echte contactgegevens van je bedrijf in.
            </p>
            {site.contactEmail ? (
              <ObfuscatedEmailLink
                encoded={encodeEmail(site.contactEmail)}
                showIcon
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
              />
            ) : null}
          </div>
        </div>

        {/* Statutory trading information and disclosures */}
        <div className="mt-10 border-t border-border pt-6 space-y-3 text-xs text-muted-foreground leading-relaxed">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            {site.legalName ? <span className="font-medium text-foreground">{site.legalName}</span> : null}
            {site.companyJurisdiction ? (
              <>
                <span>·</span>
                <span>{site.companyJurisdiction}</span>
              </>
            ) : null}
            {site.companyNumber ? (
              <>
                <span>·</span>
                <span>KvK-nummer {site.companyNumber}</span>
              </>
            ) : null}
            {site.vatNumber ? (
              <>
                <span>·</span>
                <span>Btw-id {site.vatNumber}</span>
              </>
            ) : null}
          </div>

          <p className="text-[0.7rem] text-slate-400 leading-normal">
            Google Ads is een handelsmerk van Google LLC. Vervang deze voorbeeldtekst vóór publicatie door je eigen voorwaarden.
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2 border-t border-slate-200/60">
            <p>© {year} {site.name}. Alle rechten voorbehouden.</p>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <Link
                href="/sitemap.xml"
                className="underline-offset-4 hover:underline hover:text-foreground"
              >
                Sitemap
              </Link>
              <Link
                href="/privacy"
                className="underline-offset-4 hover:underline hover:text-foreground"
              >
                Privacybeleid
              </Link>
              <TrackingChoicesButton />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
