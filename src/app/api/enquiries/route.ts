import { createEnquiryDependencies, EnquiryConfigurationError } from "@/lib/enquiries/deps"
import { handleEnquiryRequest } from "@/lib/enquiries/handler"

export const dynamic = "force-dynamic"

function configurationResponse(error: string) {
  return Response.json({ ok: false, error }, { status: 503 })
}

export async function POST(request: Request) {
  try {
    const deps = createEnquiryDependencies()
    return await handleEnquiryRequest(request, deps)
  } catch (error) {
    if (error instanceof EnquiryConfigurationError) {
      return configurationResponse(error.message)
    }

    console.info("enquiry_unhandled")
    return Response.json({ ok: false, error: "delivery_failed" }, { status: 502 })
  }
}
