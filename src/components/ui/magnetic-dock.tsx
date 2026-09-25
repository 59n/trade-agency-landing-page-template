"use client"

import * as React from "react"
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react"
import { cn } from "@/lib/utils"

interface MagneticDockProps {
  items: DockItemData[]
  iconSize?: number
  maxScale?: number
  magneticDistance?: number
  showLabels?: boolean
  persistentLabels?: boolean
  position?: "bottom" | "top" | "left" | "right"
  variant?: "glass" | "solid" | "transparent"
  className?: string
}

export interface DockItemData {
  id: string
  label: string
  icon: React.ReactNode
  href?: string
  onClick?: () => void
  isActive?: boolean
  badge?: number
}

interface DockItemProps {
  item: DockItemData
  mouseX: MotionValue<number>
  iconSize: number
  maxScale: number
  magneticDistance: number
  showLabels: boolean
  persistentLabels: boolean
  isVertical: boolean
  reducedMotion: boolean
}

function DockItem({
  item,
  mouseX,
  iconSize,
  maxScale,
  magneticDistance,
  showLabels,
  persistentLabels,
  isVertical,
  reducedMotion,
}: DockItemProps) {
  const ref = React.useRef<HTMLAnchorElement | HTMLButtonElement | null>(null)
  const [isHovered, setIsHovered] = React.useState(false)
  const [isFocused, setIsFocused] = React.useState(false)
  const showTooltip = showLabels && !persistentLabels && (isHovered || isFocused)

  const distance = useTransform(mouseX, (val: number) => {
    if (!ref.current) return magneticDistance + 1
    const rect = ref.current.getBoundingClientRect()
    const center = isVertical
      ? rect.top + rect.height / 2
      : rect.left + rect.width / 2
    return val - center
  })

  const scale = useTransform(
    distance,
    [-magneticDistance, 0, magneticDistance],
    [1, maxScale, 1],
  )
  const springConfig = { damping: 20, stiffness: 300, mass: 0.5 }
  const smoothScale = useSpring(scale, springConfig)
  const size = useTransform(smoothScale, (s) => Math.max(s * iconSize, 44))
  const y = useTransform(smoothScale, (s) => (s - 1) * -8)
  const smoothY = useSpring(y, springConfig)

  const sharedProps = {
    tabIndex: 0 as const,
    ...(persistentLabels ? {} : { "aria-label": item.label }),
    "aria-current": item.isActive ? ("page" as const) : undefined,
    onClick: item.onClick,
    onFocus: () => setIsFocused(true),
    onBlur: () => setIsFocused(false),
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
    className: cn(
      "relative flex min-h-11 items-center justify-center rounded-full transition-colors duration-200",
      "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
      persistentLabels
        ? "gap-1.5 px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
        : "min-w-11 flex-col gap-1",
      item.isActive && (persistentLabels ? "bg-muted text-primary" : "bg-primary/10"),
    ),
    style: persistentLabels
      ? {
          scale: reducedMotion ? 1 : smoothScale,
        }
      : {
          width: reducedMotion ? Math.max(iconSize, 44) : size,
          height: reducedMotion ? Math.max(iconSize, 44) : size,
          y: reducedMotion || isVertical ? 0 : smoothY,
          x: reducedMotion || !isVertical ? 0 : smoothY,
        },
    whileTap: reducedMotion ? undefined : { scale: 0.97 },
  }

  const content = persistentLabels ? (
    <>
      <span aria-hidden="true" className="inline-flex size-4 text-muted-foreground">
        {item.icon}
      </span>
      <span>{item.label}</span>
      {typeof item.badge === "number" && item.badge > 0 && (
        <span className="ml-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
          {item.badge}
        </span>
      )}
    </>
  ) : (
    <>
      <motion.div
        className={cn(
          "relative flex h-full w-full items-center justify-center overflow-hidden rounded-xl",
          "border border-border bg-card text-foreground shadow-sm",
        )}
      >
        <div
          aria-hidden="true"
          className="flex h-[58%] w-[58%] items-center justify-center text-primary"
        >
          {item.icon}
        </div>
      </motion.div>

      <AnimatePresence initial={false}>
        {item.isActive && (
          <motion.div
            initial={reducedMotion ? false : { scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { scale: 0, opacity: 0 }}
            className="absolute -bottom-1.5 h-1.5 w-1.5 rounded-full bg-primary"
          />
        )}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {showTooltip && (
          <motion.div
            aria-hidden="true"
            initial={reducedMotion ? false : { opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.9 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="pointer-events-none absolute -top-10 left-1/2 z-50 -translate-x-1/2 rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-medium whitespace-nowrap text-foreground shadow-sm"
          >
            {item.label}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )

  if (item.href) {
    return (
      <motion.a
        ref={ref as React.RefObject<HTMLAnchorElement | null>}
        href={item.href}
        {...sharedProps}
      >
        {content}
      </motion.a>
    )
  }

  return (
    <motion.button
      ref={ref as React.RefObject<HTMLButtonElement | null>}
      type="button"
      {...sharedProps}
    >
      {content}
    </motion.button>
  )
}

export function MagneticDock({
  items,
  iconSize = 44,
  maxScale = 1.28,
  magneticDistance = 120,
  showLabels = true,
  persistentLabels = false,
  position = "bottom",
  variant = "glass",
  className,
}: MagneticDockProps) {
  const dockRef = React.useRef<HTMLDivElement>(null)
  const mousePosition = useMotionValue(Infinity)
  const reducedMotion = useReducedMotion() ?? false
  const isVertical = position === "left" || position === "right"

  const handleMouseMove = React.useCallback(
    (event: React.MouseEvent) => {
      mousePosition.set(isVertical ? event.clientY : event.clientX)
    },
    [mousePosition, isVertical],
  )

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (!dockRef.current) return
      const focusable = Array.from(
        dockRef.current.querySelectorAll<HTMLElement>("a, button"),
      )
      if (focusable.length === 0) return

      const currentIndex = focusable.findIndex((el) => el === document.activeElement)
      if (currentIndex === -1) return

      let nextIndex = currentIndex
      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        event.preventDefault()
        nextIndex = (currentIndex + 1) % focusable.length
      } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        event.preventDefault()
        nextIndex = (currentIndex - 1 + focusable.length) % focusable.length
      } else if (event.key === "Home") {
        event.preventDefault()
        nextIndex = 0
      } else if (event.key === "End") {
        event.preventDefault()
        nextIndex = focusable.length - 1
      }

      if (nextIndex !== currentIndex) {
        focusable[nextIndex]?.focus()
      }
    },
    [],
  )

  const variantStyles = {
    glass:
      "border border-border bg-card/90 shadow-sm backdrop-blur-md",
    solid: "border border-border bg-card shadow-sm",
    transparent: "border-0 bg-transparent shadow-none",
  }

  return (
    <motion.div
      ref={dockRef}
      role="toolbar"
      aria-label="Navigation dock"
      tabIndex={-1}
      onKeyDown={handleKeyDown}
      onMouseMove={reducedMotion ? undefined : handleMouseMove}
      onMouseLeave={() => mousePosition.set(Infinity)}
      className={cn(
        "inline-flex gap-1 rounded-full p-1 focus:outline-none",
        persistentLabels ? "items-center" : "items-end gap-2 rounded-2xl p-2",
        variantStyles[variant],
        isVertical ? "flex-col" : "flex-row",
        className,
      )}
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {items.map((item) => (
        <DockItem
          key={item.id}
          item={item}
          mouseX={mousePosition}
          iconSize={iconSize}
          maxScale={maxScale}
          magneticDistance={magneticDistance}
          showLabels={showLabels}
          persistentLabels={persistentLabels}
          isVertical={isVertical}
          reducedMotion={reducedMotion}
        />
      ))}
    </motion.div>
  )
}
