import assert from "node:assert/strict"
import { test } from "node:test"
import robots from "./robots"
import sitemap from "./sitemap"
import { generateStructuredData } from "@/components/seo/json-ld"
import { buildMetadata } from "@/lib/metadata"
import { publicProductionUrl } from "@/lib/enquiries/env"

const previousSiteUrl = process.env.SITE_URL
function withSiteUrl(value: string | undefined, check: () => void) {
  if (value === undefined) delete process.env.SITE_URL
  else process.env.SITE_URL = value
  try { check() } finally {
    if (previousSiteUrl === undefined) delete process.env.SITE_URL
    else process.env.SITE_URL = previousSiteUrl
  }
}

test("unconfigured template stays out of search indexes", () => withSiteUrl(undefined, () => {
  assert.equal(publicProductionUrl(), undefined)
  assert.deepEqual(sitemap(), [])
  assert.equal(robots().sitemap, undefined)
  assert.deepEqual(generateStructuredData(), [])
  const metadata = buildMetadata()
  assert.equal(metadata.alternates, undefined)
  assert.deepEqual(metadata.robots && (metadata.robots as { index: boolean }).index, false)
}))

test("configured site uses its own domain", () => withSiteUrl("https://agency-domain.co.uk", () => {
  assert.equal(publicProductionUrl(), "https://agency-domain.co.uk")
  assert.equal(robots().sitemap, "https://agency-domain.co.uk/sitemap.xml")
  assert.deepEqual(sitemap().map((entry) => entry.url), ["https://agency-domain.co.uk", "https://agency-domain.co.uk/privacy"])
  const schemas = generateStructuredData()
  assert.equal(schemas.length, 2)
  assert.equal(schemas[0].url, "https://agency-domain.co.uk")
  assert.equal(buildMetadata().metadataBase?.toString(), "https://agency-domain.co.uk/")
}))

test("placeholder domains cannot be indexed", () => withSiteUrl("https://your-domain.example.com", () => {
  assert.equal(publicProductionUrl(), undefined)
}))
