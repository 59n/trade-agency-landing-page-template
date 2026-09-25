"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import {
  ArrowRight,
  Briefcase,
  LayoutGrid,
  Mail,
  Menu,
  UserRound,
  X,
} from "lucide-react"
import { Wordmark } from "@/components/brand"
import { MagneticDock, type DockItemData } from "@/components/ui/magnetic-dock"
import { site } from "@/config/site"
import { track } from "@/lib/analytics"
import { cn } from "@/lib/utils"

const SECTION_IDS = ["services", "approach", "about", "contact"] as const

const ICONS = {
  services: LayoutGrid,
  approach: Briefcase,
  about: UserRound,
  contact: Mail,
}

function sectionFromScroll(): string {
  const marker = 120
  let current: string = SECTION_IDS[0]
  for (const id of SECTION_IDS) {
    const element = document.getElementById(id)
    if (!element) {
      continue
    }
    if (element.getBoundingClientRect().top - marker <= 0) {
      current = id
    }
  }

  const scrolledToEnd =
    window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 24
  if (scrolledToEnd) {
    return SECTION_IDS[SECTION_IDS.length - 1]
  }

  return current
}

export function SiteHeader() {
  const [active, setActive] = useState<string>("")
  const [menuOpen, setMenuOpen] = useState(false)
  const locked = useRef(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  function activate(id: string) {
    setActive(id)
    locked.current = true
    window.setTimeout(() => {
      locked.current = false
    }, 700)
  }

  useEffect(() => {
    const sync = () => {
      if (locked.current) {
        return
      }
      setActive(sectionFromScroll())
    }

    sync()
    window.addEventListener("scroll", sync, { passive: true })
    window.addEventListener("hashchange", sync)
    window.addEventListener("resize", sync)
    return () => {
      window.removeEventListener("scroll", sync)
      window.removeEventListener("hashchange", sync)
      window.removeEventListener("resize", sync)
    }
  }, [])

  // Keyboard navigation: Close mobile menu on Escape and return focus
  useEffect(() => {
    if (!menuOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false)
        menuButtonRef.current?.focus()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [menuOpen])

  const dockItems: DockItemData[] = site.navigation.map((item) => {
    const Icon = ICONS[item.id as keyof typeof ICONS]
    return {
      id: item.id,
      label: item.label,
      href: item.href,
      isActive: active === item.id,
      icon: <Icon className="h-full w-full" />,
      onClick: () => activate(item.id),
    }
  })

  return (
    <header className="sticky top-0 z-40 bg-background/90 pt-[max(0.5rem,env(safe-area-inset-top))] backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-[1160px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:grid lg:grid-cols-[1fr_auto_1fr]">
        <div className="flex items-center justify-start">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center rounded-lg text-[0.95rem] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <Wordmark />
          </Link>
        </div>

        <nav aria-label="Hoofdnavigatie" className="hidden lg:flex justify-center">
          <MagneticDock
            items={dockItems}
            persistentLabels
            showLabels
            position="top"
            variant="solid"
            iconSize={16}
            maxScale={1.06}
            className="border-border/80 bg-white shadow-sm"
          />
        </nav>

        <div className="flex items-center justify-end gap-2">
          <Link
            href={site.headerCta.href}
            className="hidden min-h-11 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:inline-flex"
            onClick={() => {
              activate("contact")
              track({ name: "cta_click", ctaLocation: "header" })
            }}
          >
            {site.headerCta.label}
            <ArrowRight className="size-4" />
          </Link>

          <button
            ref={menuButtonRef}
            type="button"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-border focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            <span className="sr-only">{menuOpen ? "Menu sluiten" : "Menu openen"}</span>
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div
          id="mobile-navigation"
          role="region"
          aria-label="Mobiele navigatie"
          className="border-b border-border bg-background px-4 py-4 sm:px-6 lg:hidden"
        >
          <nav aria-label="Mobiele navigatie" className="flex flex-col gap-2">
            {site.navigation.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className={cn(
                  "inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  active === item.id
                    ? "bg-secondary text-primary font-semibold"
                    : "text-foreground hover:bg-secondary/60",
                )}
                onClick={() => {
                  activate(item.id)
                  setMenuOpen(false)
                }}
              >
                {item.label}
              </a>
            ))}
            <Link
              href={site.headerCta.href}
              className="mt-2 inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              onClick={() => {
                activate("contact")
                setMenuOpen(false)
                track({ name: "cta_click", ctaLocation: "header_mobile" })
              }}
            >
              {site.headerCta.label}
              <ArrowRight className="size-4" />
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  )
}
