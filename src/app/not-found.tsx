import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, ArrowRight, LayoutGrid, Briefcase, Mail } from "lucide-react"
import { SiteHeader } from "@/components/navigation/site-header"
import { SiteFooter } from "@/components/sections/site-footer"

export const metadata: Metadata = {
  title: "Page Not Found (404)",
  description: "The page you are looking for does not exist or has been moved.",
  robots: {
    index: false,
    follow: false,
  },
}

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            404 Error · Page Not Found
          </div>

          <h1 className="mt-6 font-heading text-4xl font-bold tracking-tight sm:text-5xl">
            Looks like this job went off course.
          </h1>

          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            The page you requested doesn&apos;t exist, may have moved, or the URL was mistyped.
            Let&apos;s get you back on track to winning more qualified trade enquiries.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <ArrowLeft className="size-4" />
              Back to Home
            </Link>
            <Link
              href="/#contact"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border bg-card px-6 text-sm font-medium text-foreground shadow-sm transition hover:bg-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              Get in touch
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="mt-12 rounded-2xl border border-border/60 bg-card/50 p-6 text-left shadow-xs backdrop-blur-xs">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Quick links
            </h2>
            <ul className="mt-3 divide-y divide-border/60">
              <li>
                <Link
                  href="/#services"
                  className="flex items-center justify-between py-2.5 text-sm font-medium text-foreground transition hover:text-primary"
                >
                  <span className="flex items-center gap-2.5">
                    <LayoutGrid className="size-4 text-muted-foreground" />
                    Our Services & Trade PPC
                  </span>
                  <ArrowRight className="size-3.5 text-muted-foreground" />
                </Link>
              </li>
              <li>
                <Link
                  href="/#approach"
                  className="flex items-center justify-between py-2.5 text-sm font-medium text-foreground transition hover:text-primary"
                >
                  <span className="flex items-center gap-2.5">
                    <Briefcase className="size-4 text-muted-foreground" />
                    How We Work & Direct Google Billing
                  </span>
                  <ArrowRight className="size-3.5 text-muted-foreground" />
                </Link>
              </li>
              <li>
                <Link
                  href="/#contact"
                  className="flex items-center justify-between py-2.5 text-sm font-medium text-foreground transition hover:text-primary"
                >
                  <span className="flex items-center gap-2.5">
                    <Mail className="size-4 text-muted-foreground" />
                    Request a Free Trade Demand Review
                  </span>
                  <ArrowRight className="size-3.5 text-muted-foreground" />
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
