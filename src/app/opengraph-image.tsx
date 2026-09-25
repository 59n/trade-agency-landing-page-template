import { ImageResponse } from "next/og"
import { site } from "@/config/site"

export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 72, background: "#f4f7fb", color: "#101827", fontFamily: "sans-serif" }}>
      <div style={{ fontSize: 28, letterSpacing: 3, color: "#2563eb", textTransform: "uppercase" }}>{site.name}</div>
      <div style={{ marginTop: 32, maxWidth: 940, fontSize: 76, fontWeight: 700, lineHeight: 1.08 }}>{site.hero.heading}</div>
      <div style={{ marginTop: 30, maxWidth: 900, fontSize: 28, color: "#536174" }}>{site.description}</div>
    </div>,
    size,
  )
}
