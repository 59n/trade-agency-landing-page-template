import type { MetadataRoute } from "next"
import { publicProductionUrl } from "@/lib/enquiries/env"

export default function robots(): MetadataRoute.Robots {
  const base = publicProductionUrl()
  if (!base) {
    return { rules: { userAgent: "*", disallow: "/" } }
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  }
}
