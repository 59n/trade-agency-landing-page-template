"use client"

import { useEffect, useState } from "react"
import { motion } from "motion/react"
import {
  CheckCircle2,
  ExternalLink,
  MapPin,
  PhoneCall,
  Search,
  ShieldCheck,
  Sparkles,
  Volume2,
} from "lucide-react"

const SEARCH_QUERIES = [
  { term: "cv-ketel installeren amsterdam", trade: "Verwarming & gas", area: "Amsterdam-Zuid" },
  { term: "spoed dakdekker utrecht", trade: "Dakdekker", area: "Utrecht" },
  { term: "badkamer renovatie rotterdam", trade: "Badkamers & tegelwerk", area: "Rotterdam" },
  { term: "elektricien bedrijf den haag", trade: "Erkend elektricien", area: "Den Haag" },
]

export function ProcessIllustration() {
  const [activeQueryIndex, setActiveQueryIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const currentQuery = SEARCH_QUERIES[activeQueryIndex]

  useEffect(() => {
    if (isPaused) return
    // 9-second rotation gives visitors ample time to read through all 3 stages comfortably
    const timer = setInterval(() => {
      setActiveQueryIndex((prev) => (prev + 1) % SEARCH_QUERIES.length)
    }, 9000)
    return () => clearInterval(timer)
  }, [isPaused])

  return (
    <figure
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative mx-auto w-full min-w-0 max-w-lg rounded-3xl border border-primary/20 bg-linear-to-b from-white via-slate-50/50 to-primary/5 p-5 sm:p-7 shadow-[0_12px_36px_rgba(37,99,235,0.08)]"
      aria-labelledby="process-illustration-title"
    >
      <figcaption id="process-illustration-title" className="sr-only">
        Visuele simulatie: van een Nederlandse Google-zoekopdracht naar een telefonische voorbeeldaanvraag.
      </figcaption>

      {/* Floating Sparkle / Hand-drawn Accents */}
      <div className="absolute -top-3 right-0 flex items-center gap-1.5 rounded-full border border-primary/20 bg-white px-3 py-1 text-xs font-semibold text-primary shadow-sm sm:-right-3">
        <Sparkles className="size-3.5 animate-spin" style={{ animationDuration: "8s" }} />
        <span>Voorbeeld</span>
      </div>

      {/* STEP 1: Search Bar with animated query cycling */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            Zoekintentie van een woningeigenaar
          </span>
          <span className="text-[0.7rem] text-slate-400">Stap 01</span>
        </div>

        <div className="relative flex items-center gap-3 rounded-2xl border border-primary/25 bg-white px-4 py-3 shadow-xs">
          <Search className="size-4.5 text-primary shrink-0" />
          <motion.p
            key={currentQuery.term}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.3 }}
            className="min-w-0 flex-1 font-mono text-xs sm:text-sm font-medium text-foreground truncate"
          >
            {currentQuery.term}
          </motion.p>
          <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-0.5 text-[0.65rem] font-semibold text-slate-600">
            Google
          </span>
        </div>
      </div>

      {/* Connector Arrow 1 */}
      <div className="flex justify-center py-2">
        <div className="flex flex-col items-center">
          <span className="h-4 w-px bg-primary/30" />
          <span className="size-1.5 rounded-full bg-primary" />
        </div>
      </div>

      {/* STEP 2: Top Google Ad Placement Card */}
      <div className="space-y-2.5 rounded-2xl border border-border bg-white p-4 shadow-xs">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[0.7rem] text-muted-foreground font-mono">jouwvakbedrijf.nl</span>
          <span className="text-[0.7rem] text-slate-400">Stap 02</span>
        </div>

        <div>
          <motion.p
            key={`headline-${currentQuery.trade}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm sm:text-base font-semibold text-primary hover:underline cursor-pointer flex items-center gap-1.5"
          >
            Lokale {currentQuery.trade} in {currentQuery.area}
            <ExternalLink className="size-3 text-primary/60 inline" />
          </motion.p>
          <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
            Snelle reactie in {currentQuery.area}. Gekwalificeerd, verzekerd en gecontroleerd vakbedrijf. Duidelijke offertes voor geplande werkzaamheden.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[0.65rem] font-medium text-emerald-700">
            <ShieldCheck className="size-3 text-emerald-600" />
            Geverifieerd & verzekerd
          </span>
          <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-[0.65rem] font-medium text-blue-700">
            <MapPin className="size-3 text-blue-600" />
            {currentQuery.area}
          </span>
        </div>
      </div>

      {/* Connector Arrow 2 */}
      <div className="flex justify-center py-2">
        <div className="flex flex-col items-center">
          <span className="h-4 w-px bg-primary/30" />
          <span className="size-1.5 rounded-full bg-primary" />
        </div>
      </div>

      {/* STEP 3: Verified Phone Lead Call / Enquiry */}
      <div className="space-y-3 rounded-2xl border border-primary/20 bg-linear-to-r from-blue-500/10 via-primary/5 to-white p-4 shadow-xs">
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5 font-semibold text-foreground">
            <PhoneCall className="size-3.5 text-primary" />
            Geverifieerde telefonische aanvraag
          </span>
          <span className="text-[0.7rem] text-slate-400">Stap 03</span>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-white p-3 border border-border">
          <div className="flex items-center gap-3">
            <div className="relative flex size-9 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600">
              <PhoneCall className="size-4 animate-bounce" style={{ animationDuration: "2s" }} />
              <span className="absolute -top-0.5 -right-0.5 size-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground">Klantgesprek verbonden</p>
              <p className="text-[0.7rem] text-muted-foreground">Regio beller: {currentQuery.area}</p>
            </div>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 font-mono text-[0.68rem] font-bold text-emerald-700">
              <Volume2 className="size-3 text-emerald-600" />
              2m 45s
            </span>
            <p className="text-[0.62rem] text-muted-foreground mt-0.5 font-semibold text-emerald-600">GEKWALIFICEERDE LEAD</p>
          </div>
        </div>

        <div className="flex flex-col items-start gap-1 text-[0.7rem] text-muted-foreground pt-0.5 sm:flex-row sm:items-center sm:justify-between">
          <span className="italic">“Woningeigenaar vraagt een opname en offerte voor volgende maand”</span>
          <span className="font-semibold text-primary inline-flex items-center gap-1">
            <CheckCircle2 className="size-3 text-emerald-600" />
            Opname ingepland
          </span>
        </div>
      </div>
    </figure>
  )
}
