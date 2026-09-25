import type { MetadataRoute } from "next"
import { site } from "@/config/site"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} - Marketingbureau voor vakbedrijven`,
    short_name: site.name,
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0f172a",
    icons: [
      {
        src: "/icon",
        sizes: "any",
        type: "image/png",
      },
    ],
  }
}
