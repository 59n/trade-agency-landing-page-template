"use client"

import { useSyncExternalStore } from "react"
import { Mail } from "lucide-react"
import { decodeEmail } from "@/lib/obfuscate"

const emptySubscribe = () => () => {}

function useIsClient(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  )
}

interface ObfuscatedEmailLinkProps {
  /** Plain text or base64 encoded email address */
  email?: string
  /** Pre-encoded base64 email address (prevents email leaking into RSC flight payload) */
  encoded?: string
  className?: string
  showIcon?: boolean
  children?: React.ReactNode
}

/**
 * Renders an email mailto link assembled entirely on the client.
 *
 * Scrapers, bots, and crawlers parsing static HTML or regex-matching
 * 'mailto:' / 'user@domain' see zero raw email strings in the server-rendered HTML.
 * For human visitors with JS enabled, the email assembles seamlessly after mount.
 */
export function ObfuscatedEmailLink({
  email,
  encoded,
  className,
  showIcon = false,
  children,
}: ObfuscatedEmailLinkProps) {
  const isClient = useIsClient()

  if (!email && !encoded) return null

  // Pre-mount / SSR fallback (scrapers only see this)
  if (!isClient) {
    return (
      <span className={className} aria-label="Contact per e-mail">
        {showIcon && <Mail className="size-4 shrink-0" />}
        <span className="truncate">{children ?? "Contact via e-mail"}</span>
      </span>
    )
  }

  const assembledEmail = encoded ? decodeEmail(encoded) : email

  return (
    <a
      href={`mailto:${assembledEmail}`}
      className={className}
    >
      {showIcon && <Mail className="size-4 shrink-0" />}
      <span className="truncate">{children ?? assembledEmail}</span>
    </a>
  )
}
