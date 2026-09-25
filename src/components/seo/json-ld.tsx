import { site } from "@/config/site"
import { publicProductionUrl } from "@/lib/enquiries/env"

export function generateStructuredData() {
  const base = publicProductionUrl()
  if (!base) return []
  return [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${base}/#website`,
      name: site.name,
      url: base,
      description: site.description,
      inLanguage: site.locale,
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": `${base}/#organization`,
      name: site.name,
      url: base,
      description: site.description,
      ...(site.legalName ? { legalName: site.legalName } : {}),
      ...(site.contactEmail ? { email: site.contactEmail } : {}),
    },
  ]
}

export function StructuredData() {
  const schemas = generateStructuredData()
  if (!schemas.length) return null
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas).replace(/</g, "\\u003c") }} />
}
