"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { gsap } from "gsap"
import { CHAPTERS, IDENTITY, STATES, type ChapterId } from "@/lib/portrait"
import { MorphingBlob } from "./morphing-blob"
import { SectionContent } from "./sections"

const MONO: React.CSSProperties = {
  fontFamily: "var(--font-ibm-mono), 'Courier New', monospace",
}
const SERIF: React.CSSProperties = {
  fontFamily: "var(--font-instrument-serif), 'Georgia', serif",
}
const TEXT_PRIMARY = "#F5E6D3"
const TEXT_SECONDARY = "rgba(245,230,211,0.4)"
const ACCENT = "#FF8C00"
const BG = "#0C0908"

/* ── Live timer ──────────────────────────────────────────────────────────── */
function Timer({ startTime }: { startTime: number }) {
  const [elapsed, setElapsed] = useState(0)
  useEffect(() => {
    const id = setInterval(() => {
      setElapsed((Date.now() - startTime) / 1000)
    }, 80)
    return () => clearInterval(id)
  }, [startTime])
  return (
    <span style={{ ...MONO, color: TEXT_SECONDARY, fontSize: 10, letterSpacing: "0.25em" }}>
      T+ {elapsed.toFixed(2)} SECONDS_IN_TRANSIT
    </span>
  )
}

/* ── Concentric rings background decoration ──────────────────────────────── */
function ConcentricRings() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
      style={{ opacity: 0.04 }}
    >
      {[120, 200, 280, 360, 440, 520, 600].map((r, i) => (
        <circle
          key={i}
          cx="50%"
          cy="50%"
          r={r}
          fill="none"
          stroke={TEXT_PRIMARY}
          strokeWidth="1"
        />
      ))}
    </svg>
  )
}

/* ── Main ─────────────────────────────────────────────────────────────────── */
export function Exploration() {
  const [active, setActive] = useState<ChapterId | null>(null)
  const [stateIdx, setStateIdx] = useState(0)
  const [prevStateIdx, setPrevStateIdx] = useState<number | null>(null)
  const [startTime] = useState(Date.now())

  // refs for GSAP targets
  const heroRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const wordRef = useRef<HTMLHeadingElement>(null)
  const prevWordRef = useRef<HTMLHeadingElement>(null)
  const wordTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // state word rotation — only when in hero
  const startWordRotation = useCallback(() => {
    if (wordTimerRef.current) clearInterval(wordTimerRef.current)
    wordTimerRef.current = setInterval(() => {
      setStateIdx((i) => {
        const next = (i + 1) % STATES.length
        setPrevStateIdx(i)
        return next
      })
    }, 3000)
  }, [])

  useEffect(() => {
    startWordRotation()
    return () => {
      if (wordTimerRef.current) clearInterval(wordTimerRef.current)
    }
  }, [startWordRotation])

  // crossfade the word
  useEffect(() => {
    if (prevStateIdx === null) return
    if (prevWordRef.current) {
      gsap.fromTo(prevWordRef.current, { opacity: 1 }, { opacity: 0, duration: 0.6, ease: "power2.inOut" })
    }
    if (wordRef.current) {
      gsap.fromTo(wordRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" })
    }
  }, [stateIdx, prevStateIdx])

  // escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeSection() }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // fires after section mounts to animate it in
  useEffect(() => {
    if (active && sectionRef.current) {
      gsap.fromTo(sectionRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.55, ease: "power2.out" })
    }
  }, [active])

  const openSection = useCallback((id: ChapterId) => {
    if (wordTimerRef.current) clearInterval(wordTimerRef.current)
    if (heroRef.current) {
      gsap.to(heroRef.current, { opacity: 0, duration: 0.35, ease: "power2.in", onComplete: () => {
        setActive(id)
      }})
    } else {
      setActive(id)
    }
  }, [])

  const closeSection = useCallback(() => {
    if (sectionRef.current) {
      gsap.to(sectionRef.current, { opacity: 0, y: -10, duration: 0.3, ease: "power2.in", onComplete: () => {
        setActive(null)
        startWordRotation()
        if (heroRef.current) {
          gsap.fromTo(heroRef.current, { opacity: 0 }, { opacity: 1, duration: 0.55, ease: "power2.out" })
        }
      }})
    } else {
      setActive(null)
      startWordRotation()
    }
  }, [startWordRotation])

  const activeChapter = CHAPTERS.find((c) => c.id === active) ?? null

  return (
    <main
      className="relative h-dvh w-full overflow-hidden"
      style={{ backgroundColor: BG }}
    >
      {/* Three.js blob — always rendered, shifts on section open */}
      <MorphingBlob sectionMode={!!active} />

      {/* Concentric rings */}
      <ConcentricRings />

      {/* ── TOP LEFT ──────────────────────────────────────────────────────── */}
      <header className="absolute left-0 top-0 z-20 px-6 py-6 sm:px-10 sm:py-8">
        <button
          onClick={active ? closeSection : undefined}
          className="flex flex-col items-start gap-1.5"
          style={{ cursor: active ? "pointer" : "default" }}
        >
          <div
            className="flex items-center gap-2 rounded-full px-3 py-1"
            style={{ border: "1px solid rgba(245,230,211,0.25)" }}
          >
            <span style={{ ...MONO, color: TEXT_PRIMARY, fontSize: 11, letterSpacing: "0.2em" }}>
              {IDENTITY.name}
            </span>
          </div>
          <span style={{ ...MONO, color: TEXT_SECONDARY, fontSize: 10, letterSpacing: "0.25em" }}>
            {IDENTITY.status}
          </span>
          <div className="flex items-center gap-2">
            <span style={{ ...MONO, color: TEXT_SECONDARY, fontSize: 10, letterSpacing: "0.25em" }}>
              STATUS:
            </span>
            <span style={{ ...MONO, color: TEXT_SECONDARY, fontSize: 10, letterSpacing: "0.25em" }}>
              {IDENTITY.mode}
            </span>
          </div>
        </button>
      </header>

      {/* ── TOP RIGHT ─────────────────────────────────────────────────────── */}
      <div className="absolute right-0 top-0 z-20 hidden flex-col items-end gap-1 px-6 py-6 sm:flex sm:px-10 sm:py-8">
        {IDENTITY.meta.map((m) => (
          <span key={m.label} style={{ ...MONO, color: TEXT_SECONDARY, fontSize: 10, letterSpacing: "0.25em" }}>
            {m.label}:{" "}
            <span style={{ color: TEXT_PRIMARY }}>{m.value}</span>
          </span>
        ))}
      </div>

      {/* ── RIGHT NAV ─────────────────────────────────────────────────────── */}
      <nav className="absolute right-6 top-1/2 z-20 hidden -translate-y-1/2 flex-col items-end gap-5 sm:flex sm:right-10">
        {CHAPTERS.map((c) => {
          const isActive = c.id === active
          return (
            <button
              key={c.id}
              onClick={() => isActive ? closeSection() : openSection(c.id)}
              className="flex items-center gap-2.5 transition-opacity"
              style={{ opacity: isActive ? 1 : 0.5 }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = isActive ? "1" : "0.5")}
            >
              <span style={{
                ...MONO,
                fontSize: 11,
                letterSpacing: "0.25em",
                color: isActive ? ACCENT : TEXT_PRIMARY,
                transition: "color 0.2s",
              }}>
                {c.nav}
              </span>
              <span
                className="rounded-full transition-all"
                style={{
                  width: isActive ? 7 : 4,
                  height: isActive ? 7 : 4,
                  backgroundColor: isActive ? ACCENT : "rgba(245,230,211,0.3)",
                  transition: "all 0.3s",
                }}
              />
            </button>
          )
        })}
      </nav>

      {/* ── MOBILE BOTTOM NAV ─────────────────────────────────────────────── */}
      <nav className="absolute inset-x-0 bottom-12 z-20 flex justify-center sm:hidden">
        <div className="hide-scrollbar flex gap-1 overflow-x-auto px-4">
          {CHAPTERS.map((c) => {
            const isActive = c.id === active
            return (
              <button
                key={c.id}
                onClick={() => isActive ? closeSection() : openSection(c.id)}
                className="whitespace-nowrap rounded-full px-3 py-1.5 transition-colors"
                style={{
                  border: `1px solid ${isActive ? ACCENT : "rgba(245,230,211,0.2)"}`,
                  color: isActive ? ACCENT : TEXT_SECONDARY,
                  ...MONO,
                  fontSize: 10,
                  letterSpacing: "0.2em",
                }}
              >
                {c.nav}
              </button>
            )
          })}
        </div>
      </nav>

      {/* ── BOTTOM LEFT ───────────────────────────────────────────────────── */}
      <div className="absolute bottom-0 left-0 z-20 px-6 py-6 sm:px-10 sm:py-8">
        <Timer startTime={startTime} />
      </div>

      {/* ── BOTTOM RIGHT ──────────────────────────────────────────────────── */}
      <div className="absolute bottom-0 right-0 z-20 hidden px-6 py-6 sm:flex sm:px-10 sm:py-8">
        <div className="flex items-center gap-2">
          {IDENTITY.links.map((link, i) => (
            <span key={link.label} className="flex items-center gap-2">
              <a
                href={link.href}
                style={{
                  ...MONO,
                  fontSize: 10,
                  letterSpacing: "0.25em",
                  color: TEXT_SECONDARY,
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => ((e.target as HTMLAnchorElement).style.color = TEXT_PRIMARY)}
                onMouseLeave={(e) => ((e.target as HTMLAnchorElement).style.color = TEXT_SECONDARY)}
              >
                {link.label}
              </a>
              {i < IDENTITY.links.length - 1 && (
                <span style={{ color: "rgba(245,230,211,0.2)", ...MONO, fontSize: 10 }}>/</span>
              )}
            </span>
          ))}
        </div>
      </div>

      {/* ── HERO STATE ────────────────────────────────────────────────────── */}
      {!active && (
        <div
          ref={heroRef}
          className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center"
        >
          <span style={{ ...MONO, color: TEXT_SECONDARY, fontSize: 10, letterSpacing: "0.4em", marginBottom: 16 }}>
            CURRENT STATE
          </span>
          {/* crossfade wrapper */}
          <div className="relative" style={{ height: "clamp(3.5rem, 12vw, 9rem)" }}>
            {/* previous word fading out */}
            {prevStateIdx !== null && prevStateIdx !== stateIdx && (
              <h1
                ref={prevWordRef}
                className="absolute inset-0 text-center leading-none"
                style={{
                  ...SERIF,
                  fontSize: "clamp(3rem, 11vw, 8.5rem)",
                  color: TEXT_PRIMARY,
                  fontStyle: "italic",
                  whiteSpace: "nowrap",
                }}
              >
                {STATES[prevStateIdx]}
              </h1>
            )}
            {/* current word */}
            <h1
              ref={wordRef}
              className="absolute inset-0 text-center leading-none"
              style={{
                ...SERIF,
                fontSize: "clamp(3rem, 11vw, 8.5rem)",
                color: TEXT_PRIMARY,
                fontStyle: "italic",
                whiteSpace: "nowrap",
              }}
            >
              {STATES[stateIdx]}
            </h1>
          </div>
        </div>
      )}

      {/* ── SECTION CONTENT ───────────────────────────────────────────────── */}
      {active && activeChapter && (
        <div
          ref={sectionRef}
          className="absolute inset-0 z-10 overflow-y-auto"
          style={{ opacity: 0 }}
        >
          {/* return link */}
          <button
            onClick={closeSection}
            className="absolute left-6 top-28 z-30 flex items-center gap-2 transition-colors sm:left-10 sm:top-32"
            style={{
              ...MONO,
              fontSize: 11,
              letterSpacing: "0.25em",
              color: TEXT_SECONDARY,
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = TEXT_PRIMARY)}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = TEXT_SECONDARY)}
          >
            <span style={{ fontSize: 14 }}>←</span> RETURN TO CENTER
          </button>

          {/* chapter content area — positioned right-of-center, clear of blob */}
          <div
            className="flex min-h-full flex-col px-6 pt-40 pb-24 sm:pl-[clamp(2.5rem,22vw,20rem)] sm:pr-20"
            style={{ maxWidth: "100%" }}
          >
            <div style={{ maxWidth: 620 }}>
              <h2
                className="mb-8 italic leading-none"
                style={{
                  ...SERIF,
                  fontSize: "clamp(2rem, 5vw, 3.5rem)",
                  color: ACCENT,
                }}
              >
                {activeChapter.title}
              </h2>
              <SectionContent content={activeChapter.content} />
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
