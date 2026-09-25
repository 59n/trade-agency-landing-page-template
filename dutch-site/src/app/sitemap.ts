import type { MetadataRoute } from "next"
import { publicProductionUrl } from "@/lib/enquiries/env"

export default function sitemap(): MetadataRoute.Sitemap {
  const base = publicProductionUrl()
  if (!base) {
    return []
  }

  return [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/privacy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ]
}
