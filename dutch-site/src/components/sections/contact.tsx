import { CheckCircle2 } from "lucide-react"
import { EnquiryForm } from "@/components/enquiry-form"
import { Reveal } from "@/components/motion/reveal"
import { site } from "@/config/site"

export function ContactSection() {
  return (
    <section id="contact" className="scroll-mt-28 px-4 py-10 sm:px-6 sm:py-16">
      <div className="mx-auto grid max-w-[1160px] gap-10 overflow-x-clip rounded-[1.75rem] border border-border bg-white p-6 sm:p-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <Reveal>
          <p className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
            Contact & analyse
          </p>
          <h2 className="mt-3 max-w-md text-[clamp(1.8rem,3.4vw,2.8rem)] leading-tight font-semibold tracking-tight">
            {site.contactHeading}
          </h2>
          <p className="mt-4 max-w-sm text-muted-foreground leading-relaxed">
            {site.contactBody}
          </p>

          <div className="mt-6 space-y-3 pt-2">
            <div className="flex items-start gap-2.5 text-xs sm:text-sm text-muted-foreground">
              <CheckCircle2 className="size-4 shrink-0 text-primary mt-0.5" />
              <span>Rechtstreeks antwoord per e-mail, zonder ongevraagde verkoopgesprekken of druk.</span>
            </div>
            <div className="flex items-start gap-2.5 text-xs sm:text-sm text-muted-foreground">
              <CheckCircle2 className="size-4 shrink-0 text-primary mt-0.5" />
              <span>Op verzoek een gratis analyse van lokaal zoekvolume en concurrentie in jouw vakgebied.</span>
            </div>
            <div className="flex items-start gap-2.5 text-xs sm:text-sm text-muted-foreground">
              <CheckCircle2 className="size-4 shrink-0 text-primary mt-0.5" />
              <span>Beschrijf hier hoe jouw bedrijf contact opneemt.</span>
            </div>
          </div>
        </Reveal>

        <Reveal>
          <EnquiryForm />
        </Reveal>
      </div>
    </section>
  )
}
