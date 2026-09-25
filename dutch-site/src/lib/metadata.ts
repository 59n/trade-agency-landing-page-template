import type { Metadata } from "next"
import { site } from "@/config/site"
import { publicProductionUrl } from "@/lib/enquiries/env"

export function buildMetadata(): Metadata {
  const base = publicProductionUrl()
  const pageTitle = `${site.name} | Google Ads voor vakbedrijven`
  const pageDescription = site.description
  const image = base ? {
    url: new URL("/opengraph-image", base),
    width: 1200,
    height: 630,
    alt: `${site.name} social preview`,
  } : undefined

  return {
    metadataBase: new URL(base ?? "http://localhost:3000"),
    title: {
      default: pageTitle,
      template: `%s · ${site.name}`,
    },
    description: pageDescription,
    keywords: ["Google Ads", "marketing voor vakbedrijven", "aanvraagtracking"],
    authors: [{ name: site.name }],
    creator: site.name,
    publisher: site.name,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    category: "Marketing",
    alternates: base ? { canonical: "/" } : undefined,
    openGraph: {
      type: "website",
      url: base,
      locale: "nl_NL",
      siteName: site.name,
      title: pageTitle,
      description: pageDescription,
      images: image ? [image] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      images: image ? [image] : undefined,
    },
    robots: {
      index: Boolean(base),
      follow: Boolean(base),
      googleBot: {
        index: Boolean(base),
        follow: Boolean(base),
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: site.name,
    },
  }
}
