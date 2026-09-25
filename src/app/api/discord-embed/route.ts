import { NextResponse } from "next/server"
import { buildDiscordComponentEmbed } from "@/lib/discord-embed"

export function GET() {
  const payload = buildDiscordComponentEmbed()
  return NextResponse.json(payload, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      "Content-Type": "application/json",
    },
  })
}
