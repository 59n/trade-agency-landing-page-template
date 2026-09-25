import { SiteHeader } from "@/components/navigation/site-header"
import { StructuredData } from "@/components/seo/json-ld"
import { AboutSection } from "@/components/sections/about"
import { ApproachSection } from "@/components/sections/approach"
import { ContactSection } from "@/components/sections/contact"
import { FaqSection } from "@/components/sections/faq"
import { HeroSection } from "@/components/sections/hero"
import { ServicesSection } from "@/components/sections/services"
import { SiteFooter } from "@/components/sections/site-footer"

export default function Home() {
  return (
    <>
      <StructuredData />
      <SiteHeader />
      <main id="main">
        <HeroSection />
        <ServicesSection />
        <ApproachSection />
        <AboutSection />
        <FaqSection />
        <ContactSection />
      </main>
      <SiteFooter />
    </>
  )
}
