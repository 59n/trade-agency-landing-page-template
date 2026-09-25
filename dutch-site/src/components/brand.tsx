import { cn } from "@/lib/utils"
import { site } from "@/config/site"

export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn("size-6 text-primary", className)}
    >
      <path
        fill="currentColor"
        d="M12.2 3.1 20.6 11a1.4 1.4 0 0 1 0 2l-8.4 7.9a.9.9 0 0 1-1.5-.7v-5.2H4.8a.9.9 0 0 1-.9-.9V9.9a.9.9 0 0 1 .9-.9h5.9V3.8a.9.9 0 0 1 1.5-.7Z"
      />
    </svg>
  )
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 font-semibold tracking-tight", className)}>
      <BrandMark />
      {site.name}
    </span>
  )
}
