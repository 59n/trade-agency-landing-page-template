import { BarChart3, Info, Megaphone, Target } from "lucide-react"
import { Reveal } from "@/components/motion/reveal"
import { site } from "@/config/site"

const ICONS = [Target, Megaphone, BarChart3]

export function ApproachSection() {
  return (
    <section id="approach" className="scroll-mt-28 px-4 py-8 sm:px-6 sm:py-12">
      <Reveal className="mx-auto max-w-[1160px] rounded-[1.75rem] bg-[#eef3fb] px-6 py-10 sm:px-10 sm:py-14">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
              {site.approachEyebrow}
            </p>
            <h2 className="mt-3 max-w-xl text-[clamp(1.8rem,3.4vw,2.8rem)] leading-tight font-semibold tracking-tight">
              {site.approachHeading}
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground lg:text-right">
            {site.approachIntro}
          </p>
        </div>
        <ol className="mt-12 grid gap-8 md:grid-cols-3">
          {site.approach.map((step, index) => {
            const Icon = ICONS[index]
            return (
              <li key={step.title} className="relative">
                {index < site.approach.length - 1 ? (
                  <span
                    aria-hidden="true"
                    className="absolute top-3 -right-4 hidden text-lg text-primary md:block"
                  >
                    →
                  </span>
                ) : null}
                <div className="flex items-center gap-3 text-primary">
                  <Icon className="size-5" aria-hidden="true" />
                  <span className="text-sm font-medium tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-semibold tracking-tight">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
              </li>
            )
          })}
        </ol>
        <p className="mt-10 flex items-start gap-2 text-sm text-muted-foreground">
          <Info className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
          Advertentiekosten staan los van de bureaukosten.
        </p>
      </Reveal>
    </section>
  )
}
