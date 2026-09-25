import assert from "node:assert/strict"
import { test } from "node:test"
import { escapeHtml } from "./html"
import { buildEnquiryEmail } from "./handler"

test("escapes HTML special characters", () => {
  assert.equal(escapeHtml(`<img src=x onerror="alert('x')">`), "&lt;img src=x onerror=&quot;alert(&#39;x&#39;)&quot;&gt;")
})

test("escapes enquiry fields before they are placed in HTML email", () => {
  const { html } = buildEnquiryEmail({
    name: "<script>alert(1)</script>",
    businessName: "Test & Co",
    email: "owner@example.com",
    phone: undefined,
    website: undefined,
    message: "Hello <b>there</b>",
  })

  assert.equal(html.includes("<script>"), false)
  assert.equal(html.includes("&lt;script&gt;"), true)
  assert.equal(html.includes("Test &amp; Co"), true)
})
