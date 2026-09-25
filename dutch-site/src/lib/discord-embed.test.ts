import assert from "node:assert/strict"
import { test } from "node:test"
import {
  buildDiscordComponentEmbed,
  BRAND_ACCENT_COLOR_DECIMAL,
  type DiscordComponentEmbedPayload,
} from "./discord-embed"
import { GET as getDiscordEmbedRoute } from "@/app/api/discord-embed/route"

test("buildDiscordComponentEmbed generates a valid payload per Discord spec", () => {
  const payload: DiscordComponentEmbedPayload = buildDiscordComponentEmbed("https://agency-domain.co.uk")

  // Top level must be Container (type 17)
  assert.equal(payload.component.type, 17)
  assert.equal(payload.component.accent_color, BRAND_ACCENT_COLOR_DECIMAL)
  assert.equal(payload.component.spoiler, false)
  assert.ok(Array.isArray(payload.component.components))
  assert.ok(payload.component.components.length > 0)
  assert.ok(payload.component.components.length <= 40, "Must not exceed 40 components")

  // Check section
  const section = payload.component.components[0]
  assert.equal(section.type, 9)
  assert.equal(section.components[0].type, 10)
  assert.ok(section.components[0].content.includes("https://agency-domain.co.uk"))

  // Accessory button
  assert.ok(section.accessory)
  if (section.accessory && section.accessory.type === 2) {
    assert.equal(section.accessory.style, 5, "Button must use link style 5")
    assert.ok(section.accessory.url.startsWith("https://"))
    assert.ok(section.accessory.label)
    // Verify no forbidden keys exist on button
    const rawAccessory = section.accessory as unknown as Record<string, unknown>
    assert.equal(rawAccessory.id, undefined)
    assert.equal(rawAccessory.custom_id, undefined)
  }

  // Media gallery
  const gallery = payload.component.components[1]
  assert.equal(gallery.type, 12)
  assert.ok(gallery.items.length >= 1 && gallery.items.length <= 4)
  assert.ok(gallery.items[0].media.url.endsWith("/opengraph-image"))

  // Separator
  const separator = payload.component.components[2]
  assert.equal(separator.type, 14)

  // Action row
  const actionRow = payload.component.components[3]
  assert.equal(actionRow.type, 1)
  assert.ok(actionRow.components.length > 0)
  for (const btn of actionRow.components) {
    assert.equal(btn.type, 2)
    assert.equal(btn.style, 5, "Every button in action row must be link style 5")
    assert.ok(btn.url.startsWith("https://"))
    assert.ok(btn.label)
    const rawBtn = btn as unknown as Record<string, unknown>
    assert.equal(rawBtn.id, undefined)
    assert.equal(rawBtn.custom_id, undefined)
  }
})

test("api/discord-embed route returns a 200 response with correct headers and JSON payload", async () => {
  const response = getDiscordEmbedRoute()
  assert.equal(response.status, 200)
  assert.equal(response.headers.get("content-type"), "application/json")
  assert.ok(response.headers.get("cache-control")?.includes("public"))

  const data = (await response.json()) as DiscordComponentEmbedPayload
  assert.equal(data.component.type, 17)
  assert.equal(data.component.accent_color, BRAND_ACCENT_COLOR_DECIMAL)
})
