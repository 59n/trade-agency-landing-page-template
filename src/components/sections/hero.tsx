"use client"

import { ArrowRight } from "lucide-react"
import { ProcessIllustration } from "@/components/process-illustration"
import { site } from "@/config/site"
import { track } from "@/lib/analytics"

export function HeroSection() {
  return (
    <section className="px-4 pt-10 pb-16 sm:px-6 sm:pt-16 sm:pb-20">
      <div className="mx-auto grid max-w-[1160px] items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <div data-reveal="">
          <p className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
            {site.hero.eyebrow}
          </p>
          <h1 className="mt-4 max-w-xl text-[clamp(2.4rem,5vw,4.4rem)] leading-[1.02] font-semibold tracking-tight text-foreground">
            {site.hero.heading}
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
            {site.hero.body}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <a
              href={site.cta.href}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground"
              onClick={() => track({ name: "cta_click", ctaLocation: "hero" })}
            >
              {site.cta.label}
              <ArrowRight className="size-4" />
            </a>
            <a
              href={site.hero.secondaryCta.href}
              className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-foreground"
            >
              {site.hero.secondaryCta.label}
              <ArrowRight className="size-4" />
            </a>
          </div>
        </div>
        <ProcessIllustration />
      </div>
    </section>
  )
}
