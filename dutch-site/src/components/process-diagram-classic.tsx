"use client"

import { Search, MessageSquare, FileCheck2, UserCheck } from "lucide-react"
import { site } from "@/config/site"

const outcomes = [
  {
    icon: MessageSquare,
    title: "Echte aanvraag",
    body: "Rechtstreeks telefoongesprek of offerteaanvraag van een woningeigenaar die iemand wil inhuren.",
  },
  {
    icon: FileCheck2,
    title: "Opname & offerte",
    body: "Je bekijkt het werk of stelt een prijs op volgens je gebruikelijke voorwaarden.",
  },
  {
    icon: UserCheck,
    title: "Betaalde vakklus",
    body: "Het werk is afgerond en de klant betaalt jou rechtstreeks, zonder commissie voor een tussenpartij.",
  },
]

/**
 * Clean SVG-anchored process diagram for hero section.
 * Illustrates trade customer acquisition flow with crisp typography and subtle micro-motions.
 */
export function ProcessDiagramClassic() {
  return (
    <figure className="process-diagram relative" aria-labelledby="process-illustration-title">
      <figcaption id="process-illustration-title" className="sr-only">
        Proces van zoekopdracht tot klant: iemand zoekt een vakbedrijf, doet een aanvraag, ontvangt een offerte en wordt klant.
      </figcaption>

      <span className="process-sparkle" aria-hidden="true">
        <svg viewBox="0 0 28 28" className="size-7 text-primary" aria-hidden="true">
          <path
            d="M18 4 L26 2 M20 10 L27 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
        </svg>
      </span>

      <div className="process-search mx-auto flex max-w-md items-center gap-3 rounded-full border border-primary/35 bg-white px-4 py-3 text-primary shadow-[0_8px_24px_rgba(37,99,235,0.08)]">
        <Search className="size-5 shrink-0" aria-hidden="true" />
        <p className="search-type-line min-w-0 flex-1 text-sm font-medium tracking-tight sm:text-base">
          <span className="search-type">{site.hero.searchExample}</span>
          <span className="search-caret" aria-hidden="true" />
        </p>
      </div>

      <svg
        className="process-links mx-auto hidden h-[4.25rem] w-full text-primary sm:block"
        viewBox="0 0 600 80"
        fill="none"
        aria-hidden="true"
      >
        <path
          className="process-branch process-branch-stem"
          d="M300 0 V28"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
        <path
          className="process-branch process-branch-left"
          d="M300 28 C300 40 288 40 276 40 H124 C112 40 100 52 100 64 V80"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          className="process-branch process-branch-mid"
          d="M300 28 V80"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
        <path
          className="process-branch process-branch-right"
          d="M300 28 C300 40 312 40 324 40 H476 C488 40 500 52 500 64 V80"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <ul className="mt-1 grid gap-3 sm:grid-cols-3 sm:gap-4">
        {outcomes.map((item, index) => (
          <li key={item.title} className="relative">
            {index < outcomes.length - 1 ? (
              <span
                aria-hidden="true"
                className="process-step-arrow absolute top-1/2 -right-3 z-10 hidden -translate-y-1/2 text-primary sm:block"
                style={{ animationDelay: `${1.15 + index * 0.2}s` }}
              >
                <svg viewBox="0 0 16 16" className="size-4" aria-hidden="true">
                  <path
                    d="M3 8 H12 M9 4 L13 8 L9 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            ) : null}
            <div
              className="process-card flex h-full min-h-[12.5rem] flex-col items-start justify-center gap-3 rounded-2xl border border-primary/30 bg-white px-5 py-6 shadow-[0_8px_20px_rgba(37,99,235,0.05)]"
              style={{ animationDelay: `${0.95 + index * 0.2}s` }}
            >
              <item.icon className="size-6 text-primary" strokeWidth={1.6} aria-hidden="true" />
              <p className="font-semibold">{item.title}</p>
              <p className="text-sm leading-snug text-muted-foreground">{item.body}</p>
            </div>
          </li>
        ))}
      </ul>
    </figure>
  )
}
