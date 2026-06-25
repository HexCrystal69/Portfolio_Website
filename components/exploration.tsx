"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { gsap } from "gsap"
import { GMAIL_COMPOSE_URL, CHAPTERS, IDENTITY, STATES, type ChapterId } from "@/lib/portrait"
import { MorphingBlob } from "./morphing-blob"
import { SectionContent } from "./sections"

const MONO: React.CSSProperties = {
  fontFamily: "var(--font-ibm-mono), 'Courier New', monospace",
}
const SERIF: React.CSSProperties = {
  fontFamily: "var(--font-instrument-serif), 'Georgia', serif",
}
const TEXT_PRIMARY = "var(--text-color, #F5E6D3)"
const TEXT_SECONDARY = "var(--text-secondary, rgba(245,230,211,0.4))"
const ACCENT = "#FF8C00"
const BG = "#0C0908"

const ALL_COMMANDS = [
  { id: "resume", label: "Resume", category: "Download" },
  { id: "github", label: "GitHub", category: "External Link" },
  { id: "linkedin", label: "LinkedIn", category: "External Link" },
  { id: "email", label: "Email", category: "Contact" },
  { id: "copy-email", label: "Copy Email", category: "Contact" },
  { id: "recruiter", label: "Recruiter Mode", category: "Interactive Guide" },
  { id: "origin", label: "Origin", category: "Section" },
  { id: "systems", label: "Systems", category: "Section" },
  { id: "alignment", label: "Alignment", category: "Section" },
  { id: "work", label: "Work", category: "Section" },
  { id: "trajectory", label: "Trajectory", category: "Section" },
  { id: "home", label: "Return Home", category: "Navigation" }
]

/* ── Live timer ──────────────────────────────────────────────────────────── */
function Timer({ startTime }: { startTime: number }) {
  const [mounted, setMounted] = useState(false)
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    setMounted(true)
    if (startTime === 0) return
    const id = setInterval(() => {
      setElapsed((Date.now() - startTime) / 1000)
    }, 80)
    return () => clearInterval(id)
  }, [startTime])

  const displayTime = (mounted && startTime > 0) ? elapsed : 0

  return (
    <span style={{ ...MONO, color: TEXT_SECONDARY, fontSize: 10, letterSpacing: "0.25em" }}>
      T+ {displayTime.toFixed(2)} SECONDS_IN_TRANSIT
    </span>
  )
}


/* ── Main ─────────────────────────────────────────────────────────────────── */
function useReducedMotion() {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduced(mediaQuery.matches)

    const listener = (event: MediaQueryListEvent) => {
      setReduced(event.matches)
    }

    mediaQuery.addEventListener("change", listener)
    return () => mediaQuery.removeEventListener("change", listener)
  }, [])

  return reduced
}

export function Exploration() {
  const reducedMotion = useReducedMotion()
  const duration = useCallback((d: number) => reducedMotion ? Math.min(d, 0.15) : d, [reducedMotion])
  const stagger = useCallback((s: number) => reducedMotion ? 0 : s, [reducedMotion])
  const yOffset = useCallback((y: number) => reducedMotion ? 0 : y, [reducedMotion])

  const [active, setActive] = useState<ChapterId | null>(null)

  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg)
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current)
    }
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null)
    }, 2000)
  }, [])

  const copyEmailToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText("prayaskar024@gmail.com")
      showToast("Copied email address")
    } catch {
      showToast("Failed to copy email address")
    }
  }, [showToast])

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current)
      }
    }
  }, [])


  const [stateIdx, setStateIdx] = useState(0)
  const [startTime, setStartTime] = useState(0)
  
  useEffect(() => {
    setStartTime(Date.now())
  }, [])

  const [showName, setShowName] = useState(false)
  const [pulse, setPulse] = useState(false)
  const [recruiterStep, setRecruiterStep] = useState<number | null>(null)
  const recruiterRef = useRef<HTMLDivElement>(null)
  const isSecToSecRef = useRef(false)
  const showNameRef = useRef(false)
  const isHoveringRef = useRef(false)
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const [showMobileNav, setShowMobileNav] = useState(false)
  const [mobileHeaderVisible, setMobileHeaderVisible] = useState(true)
  const [showHomeButton, setShowHomeButton] = useState(false)
  const homeButtonTimerRef = useRef<NodeJS.Timeout | null>(null)
  const scrollDebounceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const lastAppearedTimeRef = useRef<number>(0)
  const lastScrollY = useRef(0)

  const [showCue, setShowCue] = useState(false)
  const showCueTimerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    showCueTimerRef.current = setTimeout(() => {
      setShowCue(true)
    }, 1500)
    return () => {
      if (showCueTimerRef.current) clearTimeout(showCueTimerRef.current)
    }
  }, [])

  const mobileNavOverlayRef = useRef<HTMLDivElement>(null)
  const mobileDrawerRef = useRef<HTMLElement>(null)
  const mobileNavLinksRef = useRef<(HTMLAnchorElement | HTMLButtonElement | null)[]>([])
  const chevronRef = useRef<HTMLButtonElement>(null)
  const pageWrapperRef = useRef<HTMLDivElement>(null)

  const handleRecruiterNav = useCallback((nextStep: number | null) => {
    const el = recruiterRef.current
    if (!el) {
      setRecruiterStep(nextStep)
      return
    }
    gsap.to(el, {
      opacity: 0,
      duration: duration(0.15),
      ease: "power2.in",
      onComplete: () => {
        setRecruiterStep(nextStep)
        gsap.to(el, { opacity: 1, duration: duration(0.15), ease: "power2.out" })
      }
    })
  }, [duration])

  // keep refs in sync with React state
  useEffect(() => { showNameRef.current = showName }, [showName])

  // refs for GSAP targets
  const heroRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const wordRef = useRef<HTMLSpanElement>(null)
  const nameWrapperRef = useRef<HTMLSpanElement>(null)
  const rightNavRef = useRef<HTMLElement>(null)
  const identityLabelsRef = useRef<(HTMLSpanElement | null)[]>([])
  const identityZoneRef = useRef<HTMLDivElement>(null)
  const rotationTlRef = useRef<gsap.core.Timeline | null>(null)

  // Build a GSAP timeline for word rotation (replaces setInterval)
  const startWordRotation = useCallback(() => {
    if (rotationTlRef.current) {
      rotationTlRef.current.kill()
      rotationTlRef.current = null
    }

    const el = wordRef.current
    if (!el) return

    gsap.set(el, {
      opacity: 0,
      y: yOffset(20)
    })

    const tl = gsap.timeline({ repeat: -1 })

    // fade-in (0.4s) → hold visible (2.2s) → fade-out (0.4s) → change word → repeat
    // total cycle: 3.0s — matches the original 3000ms setInterval cadence
    tl.fromTo(el, { opacity: 0, y: yOffset(20) }, { opacity: 1, y: 0, duration: duration(0.4), ease: "power2.out" })
      .to(el, { opacity: 0, y: yOffset(-20), duration: duration(0.4), ease: "power2.in" }, "+=2.2")
      .call(() => setStateIdx((i) => (i + 1) % STATES.length))

    rotationTlRef.current = tl
  }, [duration, yOffset])

  // Start / stop rotation based on hero visibility
  useEffect(() => {
    if (!showName && active === null) {
      startWordRotation()
    }
    return () => {
      if (rotationTlRef.current) {
        rotationTlRef.current.kill()
        rotationTlRef.current = null
      }
    }
  }, [showName, active, startWordRotation])

  // 4. Simple fade animation for PRAYAS KAR (whole block)
  // Per-letter staggered motion reveal animation for PRAYAS KAR
  useEffect(() => {
    const letters = document.querySelectorAll(".hero-letter")
    if (letters.length === 0) return

    if (showName) {
      // Fade out rotating word helper
      if (wordRef.current) {
        gsap.killTweensOf(wordRef.current)
        gsap.to(wordRef.current, {
          opacity: 0,
          y: yOffset(-20),
          duration: duration(0.3),
          ease: "power2.inOut",
        })
      }

      // Ensure wrapper is active
      if (nameWrapperRef.current) {
        gsap.killTweensOf(nameWrapperRef.current)
        gsap.set(nameWrapperRef.current, { opacity: 1, pointerEvents: "auto" })
      }

      gsap.killTweensOf(letters)
      gsap.fromTo(
        letters,
        {
          opacity: 0,
          y: (i) => (i % 2 === 0 ? -60 : 60),
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.08,
          ease: "power3.out",
          overwrite: "auto",
        }
      )
    } else {
      // Animate letters back to hidden positions
      gsap.killTweensOf(letters)
      gsap.to(letters, {
        opacity: 0,
        y: (i) => (i % 2 === 0 ? -60 : 60),
        duration: 0.5,
        ease: "power2.inOut",
        overwrite: "auto",
        onComplete: () => {
          if (nameWrapperRef.current) {
            gsap.set(nameWrapperRef.current, { opacity: 0, pointerEvents: "none" })
          }
        }
      })
    }
    return () => {
      gsap.killTweensOf(letters)
    }
  }, [showName, duration, yOffset, startWordRotation])

  // Identity Mode — fade sequenced chapter labels (driven by showName)
  useEffect(() => {
    const labels = identityLabelsRef.current.filter(Boolean) as HTMLElement[]

    if (showName) {
      // Show labels sequentially
      if (labels.length > 0) {
        gsap.killTweensOf(labels)
        gsap.set(labels, { opacity: 0, y: yOffset(12) })
        labels.forEach((el, i) => {
          gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: duration(0.5),
            delay: reducedMotion ? 0 : i * 0.15,
            ease: "power2.out",
          })
        })
      }
    } else {
      // Hide labels
      if (labels.length > 0) {
        gsap.killTweensOf(labels)
        gsap.to(labels, {
          opacity: 0,
          y: yOffset(12),
          duration: duration(0.3),
          ease: "power2.in",
        })
      }
    }
    return () => {
      if (labels.length > 0) gsap.killTweensOf(labels)
    }
  }, [showName, duration, yOffset, reducedMotion])

  const handleMouseEnter = useCallback(() => {
    if (isMobile) return
    isHoveringRef.current = true
    setShowName(true)
  }, [isMobile])

  // Zone enter — keep cursor tracked for hover gating
  const handleZoneEnter = useCallback(() => {
    if (isMobile) return
    isHoveringRef.current = true
  }, [isMobile])

  // Zone leave — cursor has exited the hero region.
  const handleZoneLeave = useCallback(() => {
    if (isMobile) return
    isHoveringRef.current = false
    setShowName(false)
  }, [isMobile])



  // fires after section mounts to animate it in
  useEffect(() => {
    const mainEl = document.querySelector("main")
    const wrapperEl = pageWrapperRef.current
    if (mainEl) {
      gsap.to(mainEl, {
        "--text-color": active ? "#111111" : "#F5E6D3",
        "--text-secondary": active ? "rgba(17,17,17,0.5)" : "rgba(245,230,211,0.4)",
        "--text-secondary-medium": active ? "rgba(17,17,17,0.7)" : "rgba(245,230,211,0.6)",
        "--border-color": active ? "rgba(17,17,17,0.1)" : "rgba(245,230,211,0.1)",
        "--border-color-medium": active ? "rgba(17,17,17,0.2)" : "rgba(245,230,211,0.2)",
        "--hover-bg": active ? "rgba(17,17,17,0.04)" : "rgba(255,140,0,0.04)",
        "--bg-color": active ? "#F5E6D3" : "#0C0908",
        duration: 0.8,
        ease: "power2.out",
      })
    }
    if (wrapperEl) {
      gsap.to(wrapperEl, {
        backgroundColor: active ? "#F5E6D3" : "#0C0908",
        duration: 0.8,
        ease: "power2.out",
      })
    }

    if (active && sectionRef.current) {
      const section = sectionRef.current
      const title = section.querySelector("h2")
      const returnBtn = section.querySelector(".return-to-center")
      const blocks = section.querySelectorAll(".content-block")
      const nav = rightNavRef.current

      // Stability: Kill active tweens
      gsap.killTweensOf(section)
      if (title) gsap.killTweensOf(title)
      if (returnBtn) gsap.killTweensOf(returnBtn)
      if (blocks.length > 0) gsap.killTweensOf(blocks)
      if (nav) gsap.killTweensOf(nav)

      // Set initial hidden states to animate them in cinematic timeline
      gsap.set(section, { opacity: 1 })
      
      const isSecToSec = isSecToSecRef.current
      isSecToSecRef.current = false // Reset ref

      if (isSecToSec) {
        if (title) gsap.set(title, { opacity: 0, y: yOffset(30) })
        if (blocks.length > 0) gsap.set(blocks, { opacity: 0, y: yOffset(20) })

        const tl = gsap.timeline()

        // 5. New title: opacity 0 → 1, y 30 → 0, duration 0.5s, ease power3.out
        if (title) {
          tl.to(title, { opacity: 1, y: 0, duration: duration(0.5), ease: "power3.out" }, 0)
        }

        // 6. New content: opacity 0 → 1, y 20 → 0, stagger 0.1s, duration 0.45s
        if (blocks.length > 0) {
          tl.to(blocks, {
            opacity: 1,
            y: 0,
            duration: duration(0.45),
            stagger: stagger(0.1),
            ease: "power2.out"
          }, reducedMotion ? 0 : 0.1)
        }

        if (returnBtn) gsap.set(returnBtn, { opacity: 1, y: 0 })
        if (nav) gsap.set(nav, { opacity: 1 })
      } else {
        if (title) gsap.set(title, { opacity: 0, y: yOffset(40) })
        if (returnBtn) gsap.set(returnBtn, { opacity: 0, y: yOffset(20) })
        if (blocks.length > 0) gsap.set(blocks, { opacity: 0, y: yOffset(20) })
        if (nav) gsap.set(nav, { opacity: 0 })

        const tl = gsap.timeline({ delay: reducedMotion ? 0 : 0.25 })

        // 4. Section title: opacity 0 -> 1, y 40 -> 0, duration 0.6s, ease power3.out
        if (title) {
          tl.to(title, { opacity: 1, y: 0, duration: duration(0.6), ease: "power3.out" }, 0)
        }

        // 6. Return To Center button: fade in with title, duration 0.4s
        if (returnBtn) {
          tl.to(returnBtn, { opacity: 1, y: 0, duration: duration(0.4), ease: "power2.out" }, 0)
        }

        // 5. Content blocks: reveal after title, stagger 0.12s, opacity 0 -> 1, y 20 -> 0, duration 0.5s
        if (blocks.length > 0) {
          tl.to(blocks, {
            opacity: 1,
            y: 0,
            duration: duration(0.5),
            stagger: stagger(0.12),
            ease: "power2.out"
          }, reducedMotion ? 0 : 0.15)
        }

        // 7. Right navigation: fade in after first content item starts, duration 0.3s
        if (nav) {
          tl.to(nav, { opacity: 1, duration: duration(0.3), ease: "power2.out" }, reducedMotion ? 0 : 0.15)
        }
      }
    }
  }, [active, duration, stagger, yOffset, reducedMotion])

  const openSection = useCallback((id: ChapterId) => {
    if (rotationTlRef.current) {
      rotationTlRef.current.kill()
      rotationTlRef.current = null
    }

    if (active !== null) {
      // SECTION -> SECTION transition
      isSecToSecRef.current = true
      const section = sectionRef.current
      if (section) {
        const title = section.querySelector("h2")
        const blocks = section.querySelectorAll(".content-block")

        // Stability: Kill existing tweens on these elements to prevent overlaps
        if (title) gsap.killTweensOf(title)
        if (blocks.length > 0) gsap.killTweensOf(blocks)

        const tl = gsap.timeline({
          onComplete: () => {
            setActive(id)
          }
        })

        // 1. Current section content: opacity 1 → 0, y 0 → -20, stagger 0.05s, duration 0.3s
        if (blocks.length > 0) {
          tl.to(blocks, {
            opacity: 0,
            y: yOffset(-20),
            duration: duration(0.3),
            stagger: stagger(0.05),
            ease: "power2.in"
          }, 0)
        }

        // 2. Section title: opacity 1 → 0, y 0 → -30, duration 0.3s
        if (title) {
          tl.to(title, {
            opacity: 0,
            y: yOffset(-30),
            duration: duration(0.3),
            ease: "power2.in"
          }, 0)
        }

        // 3. Trigger a short blob pulse: glow intensity +20%, duration 0.25s, return to normal
        if (!reducedMotion) {
          setPulse(true)
          gsap.delayedCall(0.25, () => setPulse(false))
        }
      }
      return
    }

    isSecToSecRef.current = false
    const labels = identityLabelsRef.current.filter(Boolean) as HTMLElement[]
    if (labels.length > 0) {
      gsap.killTweensOf(labels)
      gsap.to(labels, { opacity: 0, y: yOffset(-12), duration: duration(0.2), ease: "power2.in" })
    }
    if (heroRef.current) {
      gsap.killTweensOf(heroRef.current)
      gsap.to(heroRef.current, { opacity: 0, y: yOffset(-20), duration: duration(0.2), ease: "power2.in" })
    }
    setActive(id)
  }, [active, duration, stagger, yOffset, reducedMotion])

  const closeSection = useCallback(() => {
    // 1. Explicitly reset identity state
    setShowName(false)

    // 2. Reset hover tracking
    isHoveringRef.current = false

    // 3. Immediately hide identity labels
    const labels = identityLabelsRef.current.filter(Boolean)
    if (labels.length > 0) {
      gsap.killTweensOf(labels)
      gsap.set(labels, {
        opacity: 0,
        y: yOffset(12)
      })
    }

    // 4. Hide the name wrapper
    if (nameWrapperRef.current) {
      gsap.killTweensOf(nameWrapperRef.current)
      gsap.set(nameWrapperRef.current, {
        opacity: 0,
        pointerEvents: "none"
      })
    }

    // 5. Kill any running hero-letter animations
    const letters = document.querySelectorAll(".hero-letter")
    if (letters.length > 0) {
      gsap.killTweensOf(letters)
    }

    // 6. Reset the rotating state text
    if (wordRef.current) {
      gsap.killTweensOf(wordRef.current)
      gsap.set(wordRef.current, {
        opacity: 1,
        y: 0
      })
    }

    // 7. Continue existing section exit animation
    if (sectionRef.current) {
      const section = sectionRef.current
      const title = section.querySelector("h2")
      const returnBtn = section.querySelector(".return-to-center")
      const blocks = section.querySelectorAll(".content-block")
      const nav = rightNavRef.current

      // Stability: Kill active tweens
      if (nav) gsap.killTweensOf(nav)
      if (returnBtn) gsap.killTweensOf(returnBtn)
      if (blocks.length > 0) gsap.killTweensOf(blocks)
      if (title) gsap.killTweensOf(title)

      // SECTION EXIT TIMELINE
      const tl = gsap.timeline({
        onComplete: () => {
          setActive(null)
          if (heroRef.current) {
            gsap.fromTo(heroRef.current, { opacity: 0 }, { opacity: 1, duration: duration(0.55), ease: "power2.out" })
          }
        }
      })

      if (nav) {
        tl.to(nav, { opacity: 0, duration: duration(0.25), ease: "power2.in" }, 0)
      }

      if (returnBtn) {
        tl.to(returnBtn, { opacity: 0, y: yOffset(-10), duration: duration(0.25), ease: "power2.in" }, 0)
      }

      // 1. Content items: fade out, y: -10, stagger: 0.05s
      if (blocks.length > 0) {
        tl.to(blocks, {
          opacity: 0,
          y: yOffset(-10),
          duration: duration(0.25),
          ease: "power2.in",
          stagger: stagger(0.05)
        }, 0)
      }

      // 2. Title: fade out, y: -20
      if (title) {
        tl.to(title, {
          opacity: 0,
          y: yOffset(-20),
          duration: duration(0.3),
          ease: "power2.in"
        }, 0)
      }
    } else {
      setActive(null)
    }
  }, [duration, stagger, yOffset])

  // Tap outside hero name to return to rotating states on mobile
  useEffect(() => {
    if (!isMobile || !showName) return

    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const isHeroClick = heroRef.current?.contains(target)
      const isToggleClick = target.closest(".mobile-nav-toggle")

      if (!isHeroClick && !isToggleClick) {
        setShowName(false)
      }
    }

    const timer = setTimeout(() => {
      document.addEventListener("click", handleDocumentClick)
    }, 0)

    return () => {
      clearTimeout(timer)
      document.removeEventListener("click", handleDocumentClick)
    }
  }, [isMobile, showName])

  // Leaving mobile navigation must restore correct hero state
  useEffect(() => {
    if (showMobileNav) {
      setShowName(false)
    }
  }, [showMobileNav])

  // Mobile navigation GSAP transition timeline
  useEffect(() => {
    if (!isMobile) return

    const wrapper = pageWrapperRef.current
    const overlay = mobileNavOverlayRef.current
    const drawer = mobileDrawerRef.current
    const scrim = overlay?.firstElementChild as HTMLElement
    const links = mobileNavLinksRef.current.filter(Boolean)

    if (showMobileNav) {
      // Step 2: Pulse the morphing blob
      setPulse(true)
      gsap.delayedCall(0.3, () => setPulse(false))

      // Background retreat (entire app content)
      if (wrapper) {
        gsap.killTweensOf(wrapper)
        gsap.to(wrapper, {
          scale: 0.90,
          x: -80,
          opacity: 0.35,
          filter: "blur(18px)",
          WebkitFilter: "blur(18px)",
          duration: 0.65,
          ease: "power3.inOut"
        })
      }

      // Dimmed scrim opacity fade-in
      if (scrim) {
        gsap.killTweensOf(scrim)
        gsap.to(scrim, {
          opacity: 1,
          pointerEvents: "auto",
          duration: 0.45,
          ease: "power2.out"
        })
      }

      // Drawer panel slide-in
      if (drawer) {
        gsap.killTweensOf(drawer)
        gsap.to(drawer, {
          x: "0%",
          pointerEvents: "auto",
          duration: 0.55,
          ease: "power4.out"
        })
      }

      // Floating navigation reveal (staggered links)
      if (links.length > 0) {
        gsap.killTweensOf(links)
        gsap.set(links, { opacity: 0, x: 40, filter: "blur(8px)", WebkitFilter: "blur(8px)" })
        gsap.to(links, {
          opacity: 1,
          x: 0,
          filter: "blur(0px)",
          WebkitFilter: "blur(0px)",
          duration: 0.55,
          stagger: 0.06,
          ease: "power4.out",
          delay: 0.1
        })
      }
    } else {
      if (wrapper) {
        gsap.killTweensOf(wrapper)
        gsap.to(wrapper, {
          scale: 1,
          x: 0,
          opacity: 1,
          filter: "blur(0px)",
          WebkitFilter: "blur(0px)",
          duration: 0.55,
          ease: "power3.out"
        })
      }

      if (scrim) {
        gsap.killTweensOf(scrim)
        gsap.to(scrim, {
          opacity: 0,
          pointerEvents: "none",
          duration: 0.45,
          ease: "power2.inOut"
        })
      }

      if (drawer) {
        gsap.killTweensOf(drawer)
        gsap.to(drawer, {
          x: "100%",
          pointerEvents: "none",
          duration: 0.45,
          ease: "power3.in"
        })
      }

      if (links.length > 0) {
        gsap.killTweensOf(links)
        gsap.to(links, {
          opacity: 0,
          x: 40,
          filter: "blur(8px)",
          WebkitFilter: "blur(8px)",
          duration: 0.35,
          stagger: 0.04,
          ease: "power3.in"
        })
      }
    }
  }, [showMobileNav, isMobile])

  // Lock body scroll when mobile navigation is open
  useEffect(() => {
    if (!isMobile) return
    if (showMobileNav) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [showMobileNav, isMobile])

  // escape key & command palette state & key down handlers

  useEffect(() => {
    const element = sectionRef.current
    if (!element || !isMobile) return

    const handleScroll = () => {
      const currentScrollY = element.scrollTop
      const isScrollUp = currentScrollY < lastScrollY.current
      const thresholdMet = currentScrollY > 250 || (isScrollUp && currentScrollY > 20)

      if (thresholdMet) {
        setShowHomeButton((prev) => {
          if (!prev) {
            lastAppearedTimeRef.current = Date.now()
          }
          return true
        })

        if (scrollDebounceTimerRef.current) {
          clearTimeout(scrollDebounceTimerRef.current)
          scrollDebounceTimerRef.current = null
        }
        if (homeButtonTimerRef.current) {
          clearTimeout(homeButtonTimerRef.current)
          homeButtonTimerRef.current = null
        }

        // Detect scroll end (250ms debounce)
        scrollDebounceTimerRef.current = setTimeout(() => {
          // Scrolling stopped. Start 2500ms hide timer
          homeButtonTimerRef.current = setTimeout(() => {
            const elapsed = Date.now() - lastAppearedTimeRef.current
            if (elapsed < 3000) {
              homeButtonTimerRef.current = setTimeout(() => {
                setShowHomeButton(false)
              }, 3000 - elapsed)
            } else {
              setShowHomeButton(false)
            }
          }, 2500)
        }, 250)
      } else {
        const elapsed = Date.now() - lastAppearedTimeRef.current
        if (showHomeButton && elapsed < 3000) {
          if (scrollDebounceTimerRef.current) {
            clearTimeout(scrollDebounceTimerRef.current)
            scrollDebounceTimerRef.current = null
          }
          if (homeButtonTimerRef.current) {
            clearTimeout(homeButtonTimerRef.current)
          }
          homeButtonTimerRef.current = setTimeout(() => {
            setShowHomeButton(false)
          }, 3000 - elapsed)
        } else {
          setShowHomeButton(false)
          if (scrollDebounceTimerRef.current) {
            clearTimeout(scrollDebounceTimerRef.current)
            scrollDebounceTimerRef.current = null
          }
          if (homeButtonTimerRef.current) {
            clearTimeout(homeButtonTimerRef.current)
            homeButtonTimerRef.current = null
          }
        }
      }
      lastScrollY.current = currentScrollY
    }

    element.addEventListener("scroll", handleScroll)
    return () => {
      element.removeEventListener("scroll", handleScroll)
      if (scrollDebounceTimerRef.current) {
        clearTimeout(scrollDebounceTimerRef.current)
      }
      if (homeButtonTimerRef.current) {
        clearTimeout(homeButtonTimerRef.current)
      }
    }
  }, [active, isMobile, showHomeButton])

  useEffect(() => {
    if (!active) {
      setShowHomeButton(false)
      if (homeButtonTimerRef.current) {
        clearTimeout(homeButtonTimerRef.current)
        homeButtonTimerRef.current = null
      }
      if (scrollDebounceTimerRef.current) {
        clearTimeout(scrollDebounceTimerRef.current)
        scrollDebounceTimerRef.current = null
      }
    }
  }, [active])

  const [showPalette, setShowPalette] = useState(false)
  const [paletteSearch, setPaletteSearch] = useState("")
  const [selectedPaletteIdx, setSelectedPaletteIdx] = useState(0)
  const paletteRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const togglePalette = useCallback((open: boolean) => {
    if (open) {
      setShowPalette(true)
      setSelectedPaletteIdx(0)
      setPaletteSearch("")
    } else {
      if (paletteRef.current) {
        gsap.to(paletteRef.current, {
          opacity: 0,
          scale: reducedMotion ? 1 : 0.96,
          duration: duration(0.2),
          ease: "power2.in",
          onComplete: () => setShowPalette(false)
        })
      } else {
        setShowPalette(false)
      }
    }
  }, [duration, reducedMotion])

  useEffect(() => {
    if (showPalette && paletteRef.current) {
      gsap.fromTo(paletteRef.current,
        { opacity: 0, scale: reducedMotion ? 1 : 0.96 },
        { opacity: 1, scale: 1, duration: duration(0.25), ease: "power2.out" }
      )
    }
  }, [showPalette, duration, reducedMotion])

  const lastActiveElementRef = useRef<HTMLElement | null>(null)
  useEffect(() => {
    if (showPalette) {
      lastActiveElementRef.current = document.activeElement as HTMLElement
      if (inputRef.current) inputRef.current.focus()
    } else {
      if (lastActiveElementRef.current) {
        lastActiveElementRef.current.focus()
        lastActiveElementRef.current = null
      }
    }
  }, [showPalette])

  useEffect(() => {
    if (recruiterStep !== null) {
      if (!lastActiveElementRef.current) {
        lastActiveElementRef.current = document.activeElement as HTMLElement
      }
      const timer = setTimeout(() => {
        const focusable = recruiterRef.current?.querySelector("button, a") as HTMLElement
        if (focusable) {
          focusable.focus()
        }
      }, 50)
      return () => clearTimeout(timer)
    } else {
      if (lastActiveElementRef.current) {
        lastActiveElementRef.current.focus()
        lastActiveElementRef.current = null
      }
    }
  }, [recruiterStep])

  const executeCommand = useCallback((cmdId: string) => {
    togglePalette(false)
    switch (cmdId) {
      case "resume":
        window.open("https://drive.google.com/file/d/1dZuBDHdfOs1eZYlzUXcmYIOfN_HW-utP/view?usp=sharing", "_blank")
        break
      case "github":
        window.open("https://github.com/HexCrystal69", "_blank")
        break
      case "linkedin":
        window.open("https://www.linkedin.com/in/prayas-kar", "_blank")
        break
      case "email":
        window.open(GMAIL_COMPOSE_URL, "_blank")
        break
      case "copy-email":
        copyEmailToClipboard()
        break
      case "recruiter":
        handleRecruiterNav(0)
        break
      case "origin":
        openSection("origin")
        break
      case "systems":
        openSection("systems")
        break
      case "alignment":
        openSection("alignment")
        break
      case "work":
        openSection("work")
        break
      case "trajectory":
        openSection("trajectory")
        break
      case "home":
        if (recruiterStep !== null) handleRecruiterNav(null)
        closeSection()
        break
    }
  }, [openSection, closeSection, handleRecruiterNav, recruiterStep, togglePalette, copyEmailToClipboard])

  const filteredCommands = ALL_COMMANDS.filter(cmd =>
    cmd.label.toLowerCase().includes(paletteSearch.toLowerCase()) ||
    cmd.category.toLowerCase().includes(paletteSearch.toLowerCase())
  )

  const handleSearchChange = (val: string) => {
    setPaletteSearch(val)
    setSelectedPaletteIdx(0)
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Toggle palette: Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        togglePalette(!showPalette)
        return
      }
      // Slash command trigger (when not typing in an input)
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault()
        togglePalette(true)
        return
      }

      if (showPalette) {
        if (e.key === "Escape") {
          e.preventDefault()
          togglePalette(false)
        } else if (e.key === "ArrowDown") {
          e.preventDefault()
          setSelectedPaletteIdx(prev => 
            filteredCommands.length > 0 ? (prev + 1) % filteredCommands.length : 0
          )
        } else if (e.key === "ArrowUp") {
          e.preventDefault()
          setSelectedPaletteIdx(prev => 
            filteredCommands.length > 0 ? (prev - 1 + filteredCommands.length) % filteredCommands.length : 0
          )
        } else if (e.key === "Enter") {
          e.preventDefault()
          if (filteredCommands[selectedPaletteIdx]) {
            executeCommand(filteredCommands[selectedPaletteIdx].id)
          }
        }
      } else {
        if (e.key === "Escape") closeSection()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [showPalette, filteredCommands, selectedPaletteIdx, executeCommand, togglePalette, closeSection])

  const activeChapter = CHAPTERS.find((c) => c.id === active) ?? null

  return (
    <main
      className="relative h-dvh w-full overflow-hidden"
      style={{ backgroundColor: BG }}
      suppressHydrationWarning
    >
      <div
        ref={pageWrapperRef}
        className="w-full h-full relative"
        inert={showPalette || recruiterStep !== null || showMobileNav ? true : undefined}
        style={{
          pointerEvents: showMobileNav ? "none" : "auto",
          backgroundColor: active ? "#F5E6D3" : "#0C0908",
        }}
        suppressHydrationWarning
      >
        {/* Three.js blob — always rendered, shifts on section open */}
        <MorphingBlob sectionMode={!!active} hoverActive={showName || pulse} reducedMotion={reducedMotion} />

      {/* ── TOP LEFT ──────────────────────────────────────────────────────── */}
      {!isMobile && (
        <header
          className="z-20 px-6 py-6 sm:px-10 sm:py-8 flex flex-col items-start gap-3"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            transform: isMobile && !mobileHeaderVisible ? "translateY(-100%)" : "translateY(0)",
            transition: isMobile ? "transform 250ms cubic-bezier(0.25, 1, 0.5, 1)" : "none",
            backgroundColor: isMobile && active ? "var(--bg-color, #0c0908)" : "transparent",
            pointerEvents: "none",
          }}
          suppressHydrationWarning
        >
          <div className="flex flex-col items-start gap-1.5 w-full pointer-events-auto">
            <div className="flex items-center justify-between w-full">
              <button
                onClick={active ? closeSection : undefined}
                className="flex items-center gap-2 rounded-full px-3 py-1 text-left"
                style={{
                  border: "1px solid var(--border-color-medium, rgba(245,230,211,0.25))",
                  cursor: active ? "pointer" : "default",
                }}
                suppressHydrationWarning
              >
                <span style={{ ...MONO, color: "var(--text-color, #F5E6D3)", fontSize: 11, letterSpacing: "0.2em" }}>
                  {IDENTITY.name}
                </span>
              </button>
            </div>
            <span style={{ ...MONO, color: "var(--text-secondary, rgba(245,230,211,0.4))", fontSize: 10, letterSpacing: "0.25em" }}>
              {IDENTITY.status}
            </span>
            <div className="flex items-center gap-2">
              <span style={{ ...MONO, color: "var(--text-secondary, rgba(245,230,211,0.4))", fontSize: 10, letterSpacing: "0.25em" }}>
                STATUS:
              </span>
              <span style={{ ...MONO, color: "var(--text-secondary, rgba(245,230,211,0.4))", fontSize: 10, letterSpacing: "0.25em" }}>
                {IDENTITY.mode}
              </span>
            </div>
          </div>
          {active && (
            <button
              onClick={closeSection}
              className="return-to-center flex items-center gap-1.5 transition-colors pointer-events-auto"
              style={{
                ...MONO,
                fontSize: 10,
                letterSpacing: "0.25em",
                color: TEXT_SECONDARY,
                cursor: "pointer",
                marginTop: "-4px"
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = TEXT_PRIMARY)}
              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = TEXT_SECONDARY)}
            >
              <span>←</span> RETURN TO CENTER
            </button>
          )}
        </header>
      )}

      {/* ── TOP RIGHT ─────────────────────────────────────────────────────── */}
      {!isMobile && (
        <div 
          className={`absolute right-0 top-0 z-20 flex flex-col items-end gap-3 px-6 py-6 sm:px-10 sm:py-8 ${active && isMobile ? "hidden" : ""}`}
          suppressHydrationWarning
        >
          {!isMobile && (
            <button
              onClick={() => handleRecruiterNav(0)}
              className="rounded-full border px-3 py-1 text-[9px] uppercase tracking-[0.2em] transition-colors"
              style={{
                ...MONO,
                borderColor: "var(--border-color-medium, rgba(245,230,211,0.2))",
                color: "var(--text-color, #F5E6D3)",
                backgroundColor: "transparent",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = ACCENT
                e.currentTarget.style.color = ACCENT
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border-color-medium, rgba(245,230,211,0.2))"
                e.currentTarget.style.color = "var(--text-color, #F5E6D3)"
              }}
              suppressHydrationWarning
            >
              Recruiter Mode
            </button>
          )}
          <div className="hidden flex-col items-end gap-1 sm:flex" suppressHydrationWarning>
            {IDENTITY.meta.map((m) => (
              <span key={m.label} style={{ ...MONO, color: "var(--text-secondary, rgba(245,230,211,0.4))", fontSize: 10, letterSpacing: "0.25em" }} suppressHydrationWarning>
                {m.label}:{" "}
                <span style={{ color: "var(--text-color, #F5E6D3)" }} suppressHydrationWarning>{m.value}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── RIGHT NAV (visible only in Identity Mode) ─────────────────────── */}
      <nav
        ref={rightNavRef}
        className="absolute right-6 top-1/2 z-20 hidden -translate-y-1/2 flex-col items-end gap-5 sm:flex sm:right-10"
        style={{ opacity: 0 }}
        suppressHydrationWarning
      >
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



      {/* ── BOTTOM LEFT ───────────────────────────────────────────────────── */}
      <div className="absolute bottom-0 left-0 z-20 hidden px-6 py-6 sm:block sm:px-10 sm:py-8">
        <Timer startTime={startTime} />
      </div>

      {/* ── BOTTOM RIGHT ──────────────────────────────────────────────────── */}
      <div className="absolute bottom-0 right-0 z-20 hidden px-6 py-6 sm:flex sm:px-10 sm:py-8">
        <div className="flex items-center gap-2">
          {IDENTITY.links.map((link, i) => (
            <span key={link.label} className="flex items-center gap-2">
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
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

      {/* ── IDENTITY INTERACTION ZONE ────────────────────────────────────── */}
      {/* Invisible centered region that covers PRAYAS KAR, the blob, and the
          chapter labels. Identity Mode opens on enter, closes on leave. */}
      {!active && !showMobileNav && (
        <div
          ref={identityZoneRef}
          className="absolute inset-0 z-10"
          onMouseEnter={handleZoneEnter}
          onMouseLeave={handleZoneLeave}
        >
          {/* ── HERO STATE ──────────────────────────────────────────────── */}
          <div
            ref={heroRef}
            className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"
          >
            <span
              style={{
                ...MONO,
                color: TEXT_SECONDARY,
                fontSize: 10,
                letterSpacing: "0.4em",
                marginBottom: 16,
                opacity: isMobile && showName ? 0 : 1,
                transition: isMobile ? "opacity 250ms cubic-bezier(0.25, 1, 0.5, 1)" : "none",
              }}
            >
              CURRENT STATE
            </span>
            {/* crossfade wrapper */}
            <div className="relative" style={{ height: "clamp(3.5rem, 12vw, 9rem)" }}>
              <h1
                className="relative h-full flex items-center justify-center text-center leading-none select-none pointer-events-auto"
                style={{
                  ...SERIF,
                  fontSize: "clamp(3rem, 11vw, 8.5rem)",
                  color: TEXT_PRIMARY,
                  fontStyle: "italic",
                  whiteSpace: "nowrap",
                  cursor: "pointer",
                }}
                onMouseEnter={handleMouseEnter}
                onClick={() => {
                  if (isMobile) {
                    if (showName) {
                      setShowName(false)
                      startWordRotation()
                    } else {
                      if (rotationTlRef.current) {
                        rotationTlRef.current.kill()
                        rotationTlRef.current = null
                      }
                      setShowName(true)
                    }
                  }
                }}
              >
                <span
                  ref={nameWrapperRef}
                  className="absolute flex items-center justify-center font-bold"
                  style={{ opacity: 0, pointerEvents: "none" }}
                >
                  {"PRAYAS KAR".split("").map((char, index) => {
                    if (char === " ") {
                      return <span key={index}>&nbsp;</span>
                    }
                    return (
                      <span
                        key={index}
                        className="hero-letter inline-block"
                        style={{
                          opacity: 0,
                          transform: index % 2 === 0 ? "translateY(-60px)" : "translateY(60px)",
                        }}
                      >
                        {char}
                      </span>
                    )
                  })}
                </span>
                <span
                  ref={wordRef}
                  className="inline-block"
                  style={{ opacity: 1, pointerEvents: "auto" }}
                >
                  {STATES[stateIdx]}
                </span>
              </h1>
            </div>

            {/* Explore Cue */}
            {isMobile && active === null && !showMobileNav && recruiterStep === null && showCue && (
              <>
                <style>{`
                  @keyframes exploreCueAnimation {
                    0% { opacity: 0.55; }
                    50% { opacity: 0.85; }
                    100% { opacity: 0.55; }
                  }
                  .explore-cue-animating {
                    animation: exploreCueAnimation 3s ease-in-out infinite;
                    transition: opacity 250ms cubic-bezier(0.25, 1, 0.5, 1);
                  }
                  .explore-cue-hidden {
                    animation: none !important;
                    opacity: 0 !important;
                  }
                `}</style>
                <div
                  className={`explore-cue-animating ${showName ? "explore-cue-hidden" : ""} pointer-events-none select-none`}
                  style={{
                    ...MONO,
                    fontSize: "11px",
                    fontWeight: 400,
                    letterSpacing: "0.1em",
                    color: TEXT_SECONDARY,
                    textAlign: "center",
                    marginTop: "24px",
                  }}
                >
                  • Tap to enter
                </div>
              </>
            )}
          </div>

          {/* ── IDENTITY MODE LABELS (visible during PRAYAS KAR hover) ─────── */}
          {showName && (
            <div className="absolute inset-0">
              {CHAPTERS.map((c, i) => {
                // Position: ORIGIN top, FRICTION top-left, ALIGNMENT top-right,
                //          WORK bottom-left, RESONANCE bottom-right (5 labels)
                const positionStyles: React.CSSProperties[] = isMobile ? [
                  { top: "24%", left: "50%", transform: "translateX(-50%)" }, // ORIGIN
                  { top: "42%", left: "14%" },                                  // FRICTION
                  { top: "42%", right: "14%", textAlign: "right" } as React.CSSProperties, // ALIGNMENT
                  { bottom: "28%", left: "14%" },                              // WORK
                  { bottom: "28%", right: "14%", textAlign: "right" } as React.CSSProperties, // RESONANCE
                ] : [
                  { top: "18%", left: "50%", transform: "translateX(-50%)" }, // ORIGIN
                  { top: "40%", left: "8%" },                                  // FRICTION
                  { top: "40%", right: "8%", textAlign: "right" } as React.CSSProperties, // ALIGNMENT
                  { bottom: "22%", left: "8%" },                              // WORK
                  { bottom: "22%", right: "8%", textAlign: "right" } as React.CSSProperties, // RESONANCE
                ]
                return (
                  <button
                    key={c.id}
                    ref={(el) => { identityLabelsRef.current[i] = el }}
                    className="absolute cursor-pointer bg-transparent border-none p-0 outline-none"
                    style={{ ...MONO, ...positionStyles[i], color: TEXT_PRIMARY, fontSize: 11, letterSpacing: "0.3em", transition: "color 0.2s ease", pointerEvents: "auto" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = ACCENT)}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = TEXT_PRIMARY)}
                    onClick={() => openSection(c.id)}
                  >
                    {c.nav}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* ── SECTION CONTENT ───────────────────────────────────────────────── */}
      {active && activeChapter && (
        <div
          ref={sectionRef}
          className="absolute inset-0 z-10 overflow-y-auto"
          style={{ opacity: 0 }}
        >

          {/* chapter content area — positioned right-of-center, clear of blob */}
          <div
            className="flex min-h-full flex-col px-6 pt-20 pb-[calc(9rem+env(safe-area-inset-bottom))] sm:pb-24 sm:pl-[clamp(2.5rem,32vw,24rem)] sm:pr-12 sm:pt-40 sm:mx-auto"
            style={{ maxWidth: 1000 }}
          >
            <div style={{ maxWidth: 620 }}>
              <h2
                className="mb-8 italic leading-none"
                style={{
                  ...SERIF,
                  fontSize: isMobile
                    ? "clamp(1.75rem, 5vw, 2.5rem)"
                    : "clamp(2rem, 5vw, 3.5rem)",
                  color: ACCENT,
                }}
              >
                {activeChapter.title}
              </h2>
              <SectionContent content={activeChapter.content} onCopyEmail={copyEmailToClipboard} />
            </div>
          </div>
        </div>
      )}
      </div>

      {/* ── RECRUITER MODE OVERLAY ────────────────────────────────────────── */}
      {recruiterStep !== null && (() => {
        const slides = RECRUITER_SLIDES(!!active, copyEmailToClipboard)
        const currentSlide = slides[recruiterStep]
        return (
          <div
            className="absolute inset-0 z-40 flex items-center justify-center transition-colors duration-300"
            style={{
              backgroundColor: active ? "rgba(245, 230, 211, 0.9)" : "rgba(12, 9, 8, 0.9)"
            }}
          >
            <div
              ref={recruiterRef}
              className="flex w-full max-w-lg flex-col gap-6 border p-8 px-10 mx-4 transition-all duration-300"
              style={{
                borderColor: "var(--border-color-medium, rgba(245,230,211,0.2))",
                backgroundColor: active ? "rgba(245, 230, 211, 0.98)" : "rgba(12, 9, 8, 0.98)",
                boxShadow: active ? "0 20px 50px rgba(0,0,0,0.15)" : "0 20px 50px rgba(0,0,0,0.6)"
              }}
            >
              <div className="flex items-center justify-between">
                <span style={{ ...MONO, color: ACCENT, fontSize: 10, letterSpacing: "0.25em" }}>
                  RECRUITER_GUIDE // STEP {recruiterStep + 1} OF {slides.length}
                </span>
                <button
                  onClick={() => handleRecruiterNav(null)}
                  style={{ ...MONO, color: "var(--text-secondary)", fontSize: 10, letterSpacing: "0.2em" }}
                  className="transition-colors"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = ACCENT
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--text-secondary)"
                  }}
                >
                  [ EXIT ]
                </button>
              </div>

              <div className="flex flex-col gap-4">
                <h2
                  style={{ ...SERIF, fontSize: "2rem", color: "var(--text-color)" }}
                  className="italic leading-none"
                >
                  {currentSlide.title}
                </h2>
                
                <p
                  style={{ ...MONO, color: "var(--text-color)", fontSize: 12, lineHeight: "1.6" }}
                  className="whitespace-pre-line text-left"
                >
                  {currentSlide.desc}
                </p>

                {currentSlide.actions}
              </div>

              <div className="flex items-center justify-between border-t pt-4" style={{ borderColor: "var(--border-color, rgba(245,230,211,0.1))" }}>
                <button
                  disabled={recruiterStep === 0}
                  onClick={() => handleRecruiterNav(recruiterStep - 1)}
                  className="text-[10px] tracking-[0.2em] transition-colors disabled:opacity-30"
                  style={{ ...MONO, color: "var(--text-color)" }}
                  onMouseEnter={(e) => {
                    if (recruiterStep !== 0) e.currentTarget.style.color = ACCENT
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--text-color)"
                  }}
                >
                  ← PREVIOUS
                </button>

                <button
                  onClick={() => {
                    if (recruiterStep < slides.length - 1) {
                      handleRecruiterNav(recruiterStep + 1)
                    } else {
                      handleRecruiterNav(null)
                    }
                  }}
                  className="text-[10px] tracking-[0.2em] transition-colors"
                  style={{ ...MONO, color: ACCENT }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--text-color)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = ACCENT
                  }}
                >
                  {recruiterStep === slides.length - 1 ? (isMobile ? "EXIT MODE →" : "EXIT RECRUITER MODE →") : "NEXT →"}
                </button>
              </div>
            </div>
          </div>
        )
      })()}

      {/* ── COMMAND PALETTE OVERLAY ──────────────────────────────────────── */}
      {showPalette && (
        <div
          className="absolute inset-0 z-50 flex items-center justify-center backdrop-blur-md transition-colors duration-300"
          style={{
            backgroundColor: active ? "rgba(245, 230, 211, 0.6)" : "rgba(12, 9, 8, 0.6)"
          }}
          onClick={() => togglePalette(false)}
        >
          <div
            ref={paletteRef}
            className="w-full max-w-lg flex flex-col border rounded-lg overflow-hidden mx-4 shadow-2xl transition-colors duration-300"
            style={{
              borderColor: "var(--border-color-medium, rgba(245,230,211,0.2))",
              backgroundColor: active ? "rgba(245, 230, 211, 0.98)" : "rgba(12, 9, 8, 0.98)"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input */}
            <div className="flex items-center px-4 py-3 border-b" style={{ borderColor: "var(--border-color, rgba(245,230,211,0.1))" }}>
              <span style={{ ...MONO, color: "var(--text-secondary)", fontSize: 14, marginRight: 8 }}>&gt;</span>
              <input
                ref={inputRef}
                type="text"
                value={paletteSearch}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search commands... (Esc to close)"
                className="w-full bg-transparent border-none outline-none"
                style={{
                  ...MONO,
                  color: "var(--text-color, #F5E6D3)",
                  fontSize: 13,
                }}
                aria-autocomplete="list"
                aria-controls="command-palette-listbox"
              />
            </div>

            {/* Commands List */}
            <div
              id="command-palette-listbox"
              role="listbox"
              aria-label="Commands"
              className="max-h-[300px] overflow-y-auto py-2"
            >
              {filteredCommands.length === 0 ? (
                <div className="px-5 py-4 text-xs" style={{ ...MONO, color: "var(--text-secondary)" }}>
                  No commands found.
                </div>
              ) : (
                filteredCommands.map((cmd, idx) => {
                  const isSelected = idx === selectedPaletteIdx
                  return (
                    <div
                      key={cmd.id}
                      role="option"
                      aria-selected={isSelected}
                      className="flex items-center justify-between px-5 py-3 cursor-pointer transition-all duration-150"
                      style={{
                        backgroundColor: isSelected 
                          ? (active ? "rgba(17, 17, 17, 0.06)" : "rgba(245, 230, 211, 0.06)")
                          : "transparent"
                      }}
                      onMouseEnter={() => setSelectedPaletteIdx(idx)}
                      onClick={() => executeCommand(cmd.id)}
                    >
                      <span
                        style={{
                          ...MONO,
                          fontSize: 12,
                          color: isSelected ? ACCENT : "var(--text-color, #F5E6D3)",
                          letterSpacing: "0.05em",
                        }}
                      >
                        {cmd.label}
                      </span>
                      <span
                        style={{
                          ...MONO,
                          fontSize: 9,
                          color: isSelected ? ACCENT : "var(--text-secondary)",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase"
                        }}
                      >
                        {cmd.category}
                      </span>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── MOBILE FLOATING NAVIGATION ────────────────────────────────────── */}
      {isMobile && (
        <div
          ref={mobileNavOverlayRef}
          className="fixed inset-0 pointer-events-none"
          style={{
            zIndex: 9999,
          }}
        >
          {/* Scrim background */}
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: "rgba(12, 9, 8, 0.45)",
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
              opacity: 0,
              pointerEvents: "none",
              transition: "opacity 0.45s cubic-bezier(0.25, 1, 0.5, 1)",
            }}
            onClick={() => setShowMobileNav(false)}
          />

          {/* Drawer container */}
          <aside
            ref={mobileDrawerRef}
            className="absolute top-0 right-0 h-full flex flex-col justify-center gap-6 shadow-2xl border-l"
            style={{
              width: "min(80vw, 340px)",
              backgroundColor: active ? "rgba(245, 230, 211, 0.98)" : "rgba(12, 9, 8, 0.98)",
              borderColor: "var(--border-color-medium, rgba(245, 230, 211, 0.2))",
              transform: "translateX(100%)",
              pointerEvents: "none",
              paddingTop: "calc(40px + env(safe-area-inset-top))",
              paddingBottom: "calc(40px + env(safe-area-inset-bottom))",
              paddingLeft: "40px",
              paddingRight: "calc(40px + env(safe-area-inset-right))",
            }}
          >
            {/* Close button at top right of the drawer */}
            <button
              onClick={() => setShowMobileNav(false)}
              className="absolute flex items-center justify-center bg-transparent border-none outline-none"
              style={{
                width: 44,
                height: 44,
                top: "calc(20px + env(safe-area-inset-top))",
                right: "calc(20px + env(safe-area-inset-right))",
                fontSize: 32,
                color: "var(--text-color, #F5E6D3)",
                cursor: "pointer",
                pointerEvents: "auto",
              }}
            >
              ×
            </button>

            <div
              className="flex flex-col items-start gap-5"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drawer Header */}
              <span
                style={{
                  ...MONO,
                  fontSize: 10,
                  letterSpacing: "0.25em",
                  color: "var(--text-secondary, rgba(245, 230, 211, 0.4))",
                  textTransform: "uppercase",
                  opacity: 0.5,
                  marginBottom: "8px",
                }}
              >
                NAVIGATION
              </span>

              {/* Primary Navigation Group */}
              {CHAPTERS.map((c, i) => {
                const isActive = c.id === active
                return (
                  <button
                    key={c.id}
                    ref={(el) => { if (el) mobileNavLinksRef.current[i] = el }}
                    onClick={() => {
                      setShowMobileNav(false)
                      if (isActive) {
                        closeSection()
                      } else {
                        openSection(c.id)
                      }
                    }}
                    className="bg-transparent border-none p-0 outline-none flex items-center text-left"
                    style={{
                      cursor: "pointer",
                      pointerEvents: "auto",
                      borderLeft: isActive ? `2px solid ${ACCENT}` : "2px solid transparent",
                      paddingLeft: isActive ? "10px" : "0px",
                      paddingTop: "11px",
                      paddingBottom: "11px",
                      opacity: isActive ? 1.0 : 0.9,
                      transition: "border-left 150ms cubic-bezier(0.25, 1, 0.5, 1), padding-left 150ms cubic-bezier(0.25, 1, 0.5, 1), opacity 150ms cubic-bezier(0.25, 1, 0.5, 1)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = "1.0"
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.opacity = "0.9"
                      }
                    }}
                  >
                    <span
                      style={{
                        ...MONO,
                        fontSize: 18,
                        fontWeight: 600,
                        letterSpacing: "0.25em",
                        color: isActive ? ACCENT : "var(--text-color, #F5E6D3)",
                      }}
                    >
                      {c.nav}
                    </span>
                  </button>
                )
              })}

              {/* Divider */}
              <div
                style={{
                  height: "1px",
                  width: "100%",
                  backgroundColor: "var(--border-color, rgba(245, 230, 211, 0.15))",
                  opacity: 0.25,
                  marginTop: "8px",
                  marginBottom: "8px",
                }}
              />

              {/* Secondary Navigation Group */}
              <a
                ref={(el) => { if (el) mobileNavLinksRef.current[CHAPTERS.length] = el }}
                href="https://drive.google.com/file/d/1dZuBDHdfOs1eZYlzUXcmYIOfN_HW-utP/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  ...MONO,
                  fontSize: 14,
                  letterSpacing: "0.25em",
                  color: "var(--text-color, #F5E6D3)",
                  textDecoration: "none",
                  pointerEvents: "auto",
                  paddingTop: "11px",
                  paddingBottom: "11px",
                  opacity: 0.5,
                  transition: "opacity 150ms cubic-bezier(0.25, 1, 0.5, 1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = "0.85"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = "0.5"
                }}
                onClick={() => setShowMobileNav(false)}
              >
                RESUME →
              </a>

              <a
                ref={(el) => { if (el) mobileNavLinksRef.current[CHAPTERS.length + 1] = el }}
                href="https://github.com/HexCrystal69"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  ...MONO,
                  fontSize: 14,
                  letterSpacing: "0.25em",
                  color: "var(--text-color, #F5E6D3)",
                  textDecoration: "none",
                  pointerEvents: "auto",
                  paddingTop: "11px",
                  paddingBottom: "11px",
                  opacity: 0.5,
                  transition: "opacity 150ms cubic-bezier(0.25, 1, 0.5, 1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = "0.85"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = "0.5"
                }}
                onClick={() => setShowMobileNav(false)}
              >
                GITHUB →
              </a>

              <a
                ref={(el) => { if (el) mobileNavLinksRef.current[CHAPTERS.length + 2] = el }}
                href="https://www.linkedin.com/in/prayas-kar"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  ...MONO,
                  fontSize: 14,
                  letterSpacing: "0.25em",
                  color: "var(--text-color, #F5E6D3)",
                  textDecoration: "none",
                  pointerEvents: "auto",
                  paddingTop: "11px",
                  paddingBottom: "11px",
                  opacity: 0.5,
                  transition: "opacity 150ms cubic-bezier(0.25, 1, 0.5, 1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = "0.85"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = "0.5"
                }}
                onClick={() => setShowMobileNav(false)}
              >
                LINKEDIN →
              </a>
            </div>
          </aside>
        </div>
      )}

      {/* ── MOBILE CHEVRON TRIGGER ───────────────────────────────────────── */}
      {isMobile && activeChapter !== null && (
        <button
          ref={chevronRef}
          onClick={() => setShowMobileNav(true)}
          className="mobile-nav-toggle fixed z-50 flex items-center justify-center"
          style={{
            width: 44,
            height: 44,
            top: "calc(20px + env(safe-area-inset-top))",
            right: "calc(20px + env(safe-area-inset-right))",
            opacity: showMobileNav ? 0 : 0.5,
            pointerEvents: showMobileNav ? "none" : "auto",
            fontSize: 36,
            color: "var(--text-color, #F5E6D3)",
            backgroundColor: "transparent",
            border: "none",
            cursor: "pointer",
            outline: "none",
            fontFamily: "var(--font-ibm-mono), 'Courier New', monospace",
            transition: "opacity 150ms cubic-bezier(0.25, 1, 0.5, 1)",
          }}
          onMouseEnter={(e) => { if (!showMobileNav) e.currentTarget.style.opacity = "1" }}
          onMouseLeave={(e) => { if (!showMobileNav) e.currentTarget.style.opacity = "0.5" }}
        >
          〈
        </button>
      )}
      {isMobile && (
        <button
          onClick={closeSection}
          className="fixed z-50 flex items-center justify-center gap-1.5 shadow-2xl"
          style={{
            bottom: "calc(20px + env(safe-area-inset-bottom))",
            right: "calc(20px + env(safe-area-inset-right))",
            opacity: isMobile && activeChapter !== null && showHomeButton && !showMobileNav ? 1 : 0,
            transform: isMobile && activeChapter !== null && showHomeButton && !showMobileNav ? "translateY(0)" : "translateY(12px)",
            pointerEvents: isMobile && activeChapter !== null && showHomeButton && !showMobileNav ? "auto" : "none",
            backgroundColor: "rgba(245, 230, 211, 0.95)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            color: "#0c0908",
            border: "1px solid rgba(245, 230, 211, 0.2)",
            borderRadius: "9999px",
            padding: "10px 20px",
            cursor: "pointer",
            outline: "none",
            ...MONO,
            fontSize: 11,
            fontWeight: "bold",
            letterSpacing: "0.15em",
            transition: isMobile && activeChapter !== null && showHomeButton && !showMobileNav
              ? "opacity 250ms cubic-bezier(0.25, 1, 0.5, 1), transform 250ms cubic-bezier(0.25, 1, 0.5, 1)"
              : "opacity 200ms cubic-bezier(0.25, 1, 0.5, 1), transform 200ms cubic-bezier(0.25, 1, 0.5, 1)",
          }}
        >
          ← HOME
        </button>
      )}
      {toastMessage && (
        <div
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-4 py-2 border text-[10px] tracking-[0.2em] uppercase transition-opacity duration-300"
          style={{
            ...MONO,
            color: "var(--text-color, #F5E6D3)",
            borderColor: "var(--border-color-medium, rgba(245,230,211,0.2))",
            backgroundColor: "rgba(12, 9, 8, 0.95)",
            backdropFilter: "blur(8px)",
            borderRadius: "9999px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
          }}
        >
          {toastMessage}
        </div>
      )}
    </main>
  )
}

/* ── RECRUITER MODE WALKTHROUGH SLIDES ──────────────────────────────────── */
const RECRUITER_SLIDES = (active: boolean, onCopyEmail: () => void) => [
  {
    title: "01 // NAME",
    desc: "PRAYAS KAR",
    actions: (
      <div className="flex flex-wrap gap-2 mt-3">
        <a
          href="https://drive.google.com/file/d/1dZuBDHdfOs1eZYlzUXcmYIOfN_HW-utP/view?usp=sharing"
          target="_blank"
          rel="noopener noreferrer"
          className="px-2.5 py-1.5 border text-[9px] tracking-[0.2em] transition-colors"
          style={{
            fontFamily: "var(--font-ibm-mono), 'Courier New', monospace",
            borderColor: active ? "rgba(17,17,17,0.2)" : "rgba(245,230,211,0.2)",
            color: "var(--text-color)",
            textDecoration: "none"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = ACCENT
            e.currentTarget.style.color = ACCENT
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = active ? "rgba(17,17,17,0.2)" : "rgba(245,230,211,0.2)"
            e.currentTarget.style.color = "var(--text-color)"
          }}
        >
          RESUME.PDF →
        </a>
        <a
          href="https://github.com/HexCrystal69"
          target="_blank"
          rel="noopener noreferrer"
          className="px-2.5 py-1.5 border text-[9px] tracking-[0.2em] transition-colors"
          style={{
            fontFamily: "var(--font-ibm-mono), 'Courier New', monospace",
            borderColor: active ? "rgba(17,17,17,0.2)" : "rgba(245,230,211,0.2)",
            color: "var(--text-color)",
            textDecoration: "none"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = ACCENT
            e.currentTarget.style.color = ACCENT
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = active ? "rgba(17,17,17,0.2)" : "rgba(245,230,211,0.2)"
            e.currentTarget.style.color = "var(--text-color)"
          }}
        >
          GITHUB →
        </a>
        <a
          href="https://www.linkedin.com/in/prayas-kar"
          target="_blank"
          rel="noopener noreferrer"
          className="px-2.5 py-1.5 border text-[9px] tracking-[0.2em] transition-colors"
          style={{
            fontFamily: "var(--font-ibm-mono), 'Courier New', monospace",
            borderColor: active ? "rgba(17,17,17,0.2)" : "rgba(245,230,211,0.2)",
            color: "var(--text-color)",
            textDecoration: "none"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = ACCENT
            e.currentTarget.style.color = ACCENT
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = active ? "rgba(17,17,17,0.2)" : "rgba(245,230,211,0.2)"
            e.currentTarget.style.color = "var(--text-color)"
          }}
        >
          LINKEDIN →
        </a>
        <a
          href={GMAIL_COMPOSE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="px-2.5 py-1.5 border text-[9px] tracking-[0.2em] transition-colors"
          style={{
            fontFamily: "var(--font-ibm-mono), 'Courier New', monospace",
            borderColor: active ? "rgba(17,17,17,0.2)" : "rgba(245,230,211,0.2)",
            color: "var(--text-color)",
            textDecoration: "none"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = ACCENT
            e.currentTarget.style.color = ACCENT
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = active ? "rgba(17,17,17,0.2)" : "rgba(245,230,211,0.2)"
            e.currentTarget.style.color = "var(--text-color)"
          }}
        >
          EMAIL →
        </a>
        <button
          onClick={onCopyEmail}
          className="px-2.5 py-1.5 border text-[9px] tracking-[0.2em] transition-colors bg-transparent cursor-pointer"
          style={{
            fontFamily: "var(--font-ibm-mono), 'Courier New', monospace",
            borderColor: active ? "rgba(17,17,17,0.2)" : "rgba(245,230,211,0.2)",
            color: "var(--text-color)",
            outline: "none"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = ACCENT
            e.currentTarget.style.color = ACCENT
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = active ? "rgba(17,17,17,0.2)" : "rgba(245,230,211,0.2)"
            e.currentTarget.style.color = "var(--text-color)"
          }}
        >
          COPY_EMAIL →
        </button>
      </div>
    )
  },
  {
    title: "02 // ROLE SUMMARY",
    desc: "Computer Science Engineering student specializing in AI Engineering, Data Engineering, Generative AI, and Backend Systems.",
    actions: null
  },
  {
    title: "03 // EDUCATION",
    desc: "Computer Science Engineering at SRM Institute of Science and Technology\nCGPA: 9.30 / 10.00 | Kolkata, India",
    actions: null
  },
  {
    title: "04 // CORE SKILLS",
    desc: "Languages: Python, Java, SQL, JavaScript\nAI Engineering: PyTorch, TensorFlow, LangChain, FAISS, Ollama, NLP, Computer Vision, RAG\nData & Backend: Kafka, Spark, ETL, PostgreSQL, FastAPI, SQLAlchemy, Docker, WebSockets",
    actions: null
  },
  {
    title: "05 // RESUME",
    desc: "Download my technical CV mapping projects in AI, data pipelines, and backend systems.",
    actions: (
      <a
        href="https://drive.google.com/file/d/1dZuBDHdfOs1eZYlzUXcmYIOfN_HW-utP/view?usp=sharing"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block mt-3 px-3 py-1.5 border text-[10px] tracking-[0.2em] transition-colors self-start"
        style={{
          fontFamily: "var(--font-ibm-mono), 'Courier New', monospace",
          borderColor: active ? "rgba(17,17,17,0.2)" : "rgba(245,230,211,0.2)",
          color: "var(--text-color)",
          textDecoration: "none"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = ACCENT
          e.currentTarget.style.color = ACCENT
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = active ? "rgba(17,17,17,0.2)" : "rgba(245,230,211,0.2)"
          e.currentTarget.style.color = "var(--text-color)"
        }}
      >
        DOWNLOAD_RESUME.PDF →
      </a>
    )
  },
  {
    title: "06 // GITHUB",
    desc: "Review my open-source AI models, data pipelines, and backend repositories.",
    actions: (
      <a
        href="https://github.com/HexCrystal69"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block mt-3 px-3 py-1.5 border text-[10px] tracking-[0.2em] transition-colors self-start"
        style={{
          fontFamily: "var(--font-ibm-mono), 'Courier New', monospace",
          borderColor: active ? "rgba(17,17,17,0.2)" : "rgba(245,230,211,0.2)",
          color: "var(--text-color)",
          textDecoration: "none"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = ACCENT
          e.currentTarget.style.color = ACCENT
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = active ? "rgba(17,17,17,0.2)" : "rgba(245,230,211,0.2)"
          e.currentTarget.style.color = "var(--text-color)"
        }}
      >
        VIEW_GITHUB_PROFILE →
      </a>
    )
  },
  {
    title: "07 // LINKEDIN",
    desc: "Connect to discuss AI systems design, data infrastructure, and internships or full-time opportunities.",
    actions: (
      <a
        href="https://www.linkedin.com/in/prayas-kar"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block mt-3 px-3 py-1.5 border text-[10px] tracking-[0.2em] transition-colors self-start"
        style={{
          fontFamily: "var(--font-ibm-mono), 'Courier New', monospace",
          borderColor: active ? "rgba(17,17,17,0.2)" : "rgba(245,230,211,0.2)",
          color: "var(--text-color)",
          textDecoration: "none"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = ACCENT
          e.currentTarget.style.color = ACCENT
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = active ? "rgba(17,17,17,0.2)" : "rgba(245,230,211,0.2)"
          e.currentTarget.style.color = "var(--text-color)"
        }}
      >
        CONNECT_ON_LINKEDIN →
      </a>
    )
  },
  {
    title: "08 // EMAIL",
    desc: "Reach out directly for data engineering projects, AI model pipelines, or backend collaborations.",
    actions: (
      <div className="flex gap-2 mt-3">
        <a
          href={GMAIL_COMPOSE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-3 py-1.5 border text-[10px] tracking-[0.2em] transition-colors self-start"
          style={{
            fontFamily: "var(--font-ibm-mono), 'Courier New', monospace",
            borderColor: active ? "rgba(17,17,17,0.2)" : "rgba(245,230,211,0.2)",
            color: "var(--text-color)",
            textDecoration: "none"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = ACCENT
            e.currentTarget.style.color = ACCENT
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = active ? "rgba(17,17,17,0.2)" : "rgba(245,230,211,0.2)"
            e.currentTarget.style.color = "var(--text-color)"
          }}
        >
          SEND_EMAIL →
        </a>
        <button
          onClick={onCopyEmail}
          className="inline-block px-3 py-1.5 border text-[10px] tracking-[0.2em] transition-colors self-start bg-transparent cursor-pointer"
          style={{
            fontFamily: "var(--font-ibm-mono), 'Courier New', monospace",
            borderColor: active ? "rgba(17,17,17,0.2)" : "rgba(245,230,211,0.2)",
            color: "var(--text-color)",
            outline: "none"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = ACCENT
            e.currentTarget.style.color = ACCENT
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = active ? "rgba(17,17,17,0.2)" : "rgba(245,230,211,0.2)"
            e.currentTarget.style.color = "var(--text-color)"
          }}
        >
          COPY_EMAIL →
        </button>
      </div>
    )
  }
]
