import { Code2, UserRound } from "lucide-react"
import { Reveal } from "@/components/motion/reveal"
import { site } from "@/config/site"

const ICONS = [Code2, UserRound]

export function AboutSection() {
  return (
    <section id="about" className="scroll-mt-28 px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-[1160px]">
        <Reveal className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
              {site.aboutEyebrow}
            </p>
            <h2 className="mt-3 max-w-xl text-[clamp(1.8rem,3.4vw,2.8rem)] leading-tight font-semibold tracking-tight">
              {site.aboutHeading}
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground lg:text-right">
            {site.aboutIntro}
          </p>
        </Reveal>
        <div className="mt-12 grid gap-8 md:grid-cols-2 md:divide-x md:divide-border">
          {site.founders.map((founder, index) => {
            const Icon = ICONS[index]
            return (
              <Reveal key={founder.role} className={index === 1 ? "md:pl-10" : "md:pr-10"}>
                <article className="flex gap-4">
                  <Icon className="mt-1 size-6 shrink-0 text-primary" aria-hidden="true" />
                  <div>
                    <h3 className="text-lg font-semibold tracking-tight">
                      {founder.name || founder.role}
                    </h3>
                    {founder.name ? (
                      <p className="mt-1 text-sm font-medium text-primary">{founder.role}</p>
                    ) : null}
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {founder.bio}
                    </p>
                  </div>
                </article>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
