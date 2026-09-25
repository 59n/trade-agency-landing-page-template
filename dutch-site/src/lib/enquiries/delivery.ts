import { Resend } from "resend"
import type { DeliveryResult, EnquiryDependencies } from "./handler"

export const mockDelivery: EnquiryDependencies["delivery"] = {
  async send() {
    return { ok: true, id: "mock", mock: true }
  },
}

export function createResendDelivery(apiKey: string): EnquiryDependencies["delivery"] {
  const resend = new Resend(apiKey)

  return {
    async send({ fields, html, text, from, to, replyTo }) {
      const { data, error } = await resend.emails.send({
        from,
        to,
        replyTo,
        subject: `Websiteaanvraag van ${fields.businessName}`,
        html,
        text,
      })

      if (error || !data?.id) {
        return { ok: false, error: error?.message ?? "provider_rejected" } satisfies DeliveryResult
      }

      return { ok: true, id: data.id }
    },
  }
}
