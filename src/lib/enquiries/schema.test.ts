import assert from "node:assert/strict"
import { test } from "node:test"
import { enquiryFieldsSchema, enquiryRequestSchema } from "./schema"

const valid = {
  name: "Jane Owner",
  businessName: "Owner Roofing Ltd",
  email: "jane@example.com",
  adsStatus: "Never run Google Ads",
  phone: "+44 151 000 0000",
  website: "ownerroofing.co.uk",
  message: "We want help with Google Ads for roofing enquiries.",
}

test("accepts a valid enquiry and normalises a website without a protocol", () => {
  const result = enquiryFieldsSchema.safeParse(valid)
  assert.equal(result.success, true)
  if (result.success) {
    assert.equal(result.data.website, "https://ownerroofing.co.uk/")
    assert.equal(result.data.adsStatus, "Never run Google Ads")
  }
})

test("rejects a name that is too short", () => {
  const result = enquiryFieldsSchema.safeParse({ ...valid, name: "J" })
  assert.equal(result.success, false)
})

test("rejects an invalid email", () => {
  const result = enquiryFieldsSchema.safeParse({ ...valid, email: "not-an-email" })
  assert.equal(result.success, false)
})

test("rejects a message that is too short", () => {
  const result = enquiryFieldsSchema.safeParse({ ...valid, message: "Hello" })
  assert.equal(result.success, false)
})

test("treats empty optional phone, website, and adsStatus as omitted", () => {
  const result = enquiryFieldsSchema.safeParse({
    ...valid,
    adsStatus: "   ",
    phone: "",
    website: "   ",
  })
  assert.equal(result.success, true)
  if (result.success) {
    assert.equal(result.data.adsStatus, undefined)
    assert.equal(result.data.phone, undefined)
    assert.equal(result.data.website, undefined)
  }
})

test("allows an omitted optional phone and website", () => {
  const result = enquiryFieldsSchema.safeParse({
    name: valid.name,
    businessName: valid.businessName,
    email: valid.email,
    message: valid.message,
  })
  assert.equal(result.success, true)
  if (result.success) {
    assert.equal(result.data.adsStatus, undefined)
    assert.equal(result.data.phone, undefined)
    assert.equal(result.data.website, undefined)
  }
})

test("rejects a website with a non-http protocol", () => {
  const result = enquiryFieldsSchema.safeParse({
    ...valid,
    website: "javascript:alert(1)",
  })
  assert.equal(result.success, false)
})

test("keeps a honeypot field on the request schema", () => {
  const result = enquiryRequestSchema.safeParse({
    ...valid,
    websiteConfirm: "bot-filled",
  })
  assert.equal(result.success, true)
  if (result.success) {
    assert.equal(result.data.websiteConfirm, "bot-filled")
  }
})
