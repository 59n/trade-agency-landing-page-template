import { BarChart3, PhoneCall, Search } from "lucide-react"
import { Reveal } from "@/components/motion/reveal"
import { site } from "@/config/site"

const ICONS = {
  "google-ads": Search,
  "call-tracking": PhoneCall,
  "performance-reviews": BarChart3,
}

export function ServicesSection() {
  return (
    <section id="services" className="scroll-mt-28 px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-[1160px] border-t border-border pt-16">
        <Reveal>
          <p className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
            {site.servicesEyebrow}
          </p>
          <h2 className="mt-3 max-w-xl text-[clamp(1.8rem,3.4vw,2.8rem)] leading-tight font-semibold tracking-tight">
            {site.servicesHeading}
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-8 md:grid-cols-3 md:gap-10">
          {site.services.map((service, index) => {
            const Icon = ICONS[service.id]
            return (
              <Reveal key={service.id} delay={index * 0.08}>
                <article className="h-full">
                  <div className="flex items-center gap-3 text-primary">
                    <Icon className="size-5" aria-hidden="true" />
                    <span className="text-sm font-medium tabular-nums">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="mt-4 text-xl font-semibold tracking-tight">{service.title}</h3>
                  <p className="mt-3 text-[0.95rem] leading-relaxed text-muted-foreground">
                    {service.summary}
                  </p>
                </article>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
