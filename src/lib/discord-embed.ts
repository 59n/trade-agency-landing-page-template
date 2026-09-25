import { site } from "@/config/site"
import { configuredSiteUrl } from "@/lib/enquiries/env"

/**
 * Discord Component Types per Discord API Docs (PR #8606):
 * 1: Action Row
 * 2: Button (Style 5 = Link Button only)
 * 9: Section
 * 10: Text Display (Discord Markdown)
 * 11: Thumbnail
 * 12: Media Gallery
 * 14: Separator
 * 17: Container
 */

export interface DiscordLinkButton {
  type: 2
  style: 5
  url: string
  label: string
  emoji?: { name: string; id?: string }
  disabled?: boolean
}

export interface DiscordTextDisplay {
  type: 10
  content: string
}

export interface DiscordSection {
  type: 9
  components: DiscordTextDisplay[]
  accessory?: DiscordLinkButton | { type: 11; media: { url: string }; spoiler?: boolean }
}

export interface DiscordMediaGalleryItem {
  media: { url: string }
  description?: string
}

export interface DiscordMediaGallery {
  type: 12
  items: DiscordMediaGalleryItem[]
}

export interface DiscordSeparator {
  type: 14
  spacing?: number
}

export interface DiscordActionRow {
  type: 1
  components: DiscordLinkButton[]
}

export type DiscordEmbedComponent =
  | DiscordSection
  | DiscordMediaGallery
  | DiscordSeparator
  | DiscordActionRow

export interface DiscordComponentEmbedPayload {
  component: {
    type: 17
    accent_color?: number
    spoiler?: boolean
    components: DiscordEmbedComponent[]
  }
}

/**
 * Decimal representation of hex color (e.g. #2563EB -> 2450411)
 */
export const BRAND_ACCENT_COLOR_DECIMAL = 0x2563eb

/**
 * Generates the Discord Component Embed payload matching Discord's
 * component-embed specification.
 */
export function buildDiscordComponentEmbed(baseUrl?: string): DiscordComponentEmbedPayload {
  const rootUrl = baseUrl ?? configuredSiteUrl()

  return {
    component: {
      type: 17,
      accent_color: BRAND_ACCENT_COLOR_DECIMAL,
      spoiler: false,
      components: [
        {
          type: 9,
          components: [
            {
              type: 10,
              content: `# **[${site.name}](${rootUrl})**\n*${site.hero.heading}*\n${site.hero.body}`,
            },
          ],
          accessory: {
            type: 2,
            style: 5,
            url: `${rootUrl}/#contact`,
            label: "Get in touch",
          },
        },
        {
          type: 12,
          items: [
            {
              media: {
                url: `${rootUrl}/opengraph-image`,
              },
              description: `${site.name} - ${site.hero.heading}`,
            },
          ],
        },
        {
          type: 14,
          spacing: 1,
        },
        {
          type: 1,
          components: [
            {
              type: 2,
              style: 5,
              url: `${rootUrl}/#services`,
              label: "Services",
            },
            {
              type: 2,
              style: 5,
              url: `${rootUrl}/#approach`,
              label: "Approach",
            },
            {
              type: 2,
              style: 5,
              url: `${rootUrl}/#about`,
              label: "About",
            },
          ],
        },
      ],
    },
  }
}
