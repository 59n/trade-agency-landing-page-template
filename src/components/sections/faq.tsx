import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Reveal } from "@/components/motion/reveal"
import { site } from "@/config/site"

export function FaqSection() {
  return (
    <section id="faq" className="scroll-mt-28 px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto grid max-w-[1160px] items-start gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <Reveal>
          <p className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
            FAQ
          </p>
          <h2 className="mt-3 text-[clamp(1.8rem,3.4vw,2.8rem)] leading-tight font-semibold tracking-tight">
            Common questions.
          </h2>
        </Reveal>
        <Reveal>
          <Accordion className="rounded-2xl border border-border bg-white px-4 sm:px-5">
            {site.faqs.map((item) => (
              <AccordionItem key={item.question} value={item.question} className="border-border">
                <AccordionTrigger className="min-h-14 py-4 text-base font-medium hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="pb-4 text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  )
}
