import type { Metadata, Viewport } from "next"
import { Geist } from "next/font/google"
import { AnalyticsConsent } from "@/components/analytics/analytics-consent"
import { ScrollProgress } from "@/components/navigation/scroll-progress"
import { MotionProvider } from "@/components/motion/provider"
import { buildDiscordComponentEmbed } from "@/lib/discord-embed"
import { buildMetadata } from "@/lib/metadata"
import { site } from "@/config/site"
import "./globals.css"

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist",
})

export const metadata: Metadata = buildMetadata()

export const viewport: Viewport = {
  themeColor: "#2563eb",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  const discordEmbed = buildDiscordComponentEmbed()

  return (
    <html lang={site.locale} className={`${geist.variable} h-full antialiased`}>
      <head>
        <script
          id="discord:component-embed"
          type="application/json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(discordEmbed) }}
        />
      </head>
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-primary focus:px-4 focus:py-2.5 focus:text-sm focus:font-medium focus:text-primary-foreground focus:shadow-lg focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none"
        >
          Skip to content
        </a>
        <noscript>
          <style>{`[data-motion],[data-reveal]{opacity:1!important;transform:none!important;animation:none!important}`}</style>
        </noscript>
        <AnalyticsConsent />
        <MotionProvider>
          <ScrollProgress />
          {children}
        </MotionProvider>
      </body>
    </html>
  )
}
