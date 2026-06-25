"use client"

import { useEffect, useRef, useState } from "react"

const SIZE = 20
const DOT_SIZE = 3
const HOVER_SCALE = 1.35

const INTERACTIVE =
  "a,button,[role='button'],[role='option'],input,textarea,select,label[for],.cursor-interactive"

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const [hovering, setHovering] = useState(false)
  const [visible, setVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(true)

  useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth < 768 || "ontouchstart" in window)
    }
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  useEffect(() => {
    if (isMobile) return

    const el = cursorRef.current
    if (!el) return

    const onMove = (e: MouseEvent) => {
      el.style.transform = `translate(${e.clientX - SIZE / 2}px, ${e.clientY - SIZE / 2}px)`
      if (!visible) setVisible(true)
    }

    const onPointerMove = (e: PointerEvent) => {
      const target = e.target as HTMLElement
      setHovering(!!target?.closest(INTERACTIVE))
    }

    const onLeave = () => setVisible(false)
    const onEnter = () => setVisible(true)

    document.addEventListener("mousemove", onMove)
    document.addEventListener("pointermove", onPointerMove)
    document.documentElement.addEventListener("mouseleave", onLeave)
    document.documentElement.addEventListener("mouseenter", onEnter)

    return () => {
      document.removeEventListener("mousemove", onMove)
      document.removeEventListener("pointermove", onPointerMove)
      document.documentElement.removeEventListener("mouseleave", onLeave)
      document.documentElement.removeEventListener("mouseenter", onEnter)
    }
  }, [isMobile, visible])

  if (isMobile) return null

  return (
    <div
      ref={cursorRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: SIZE,
        height: SIZE,
        pointerEvents: "none",
        zIndex: 99999,
        opacity: visible ? 1 : 0,
        willChange: "transform",
        transition: "opacity 0.12s ease",
      }}
    >
      {/* Outer ring */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          border: "1px solid var(--accent-color, #FF8C00)",
          transition: "transform 0.18s ease-out",
          transform: hovering ? `scale(${HOVER_SCALE})` : "scale(1)",
        }}
      />
      {/* Center dot */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: DOT_SIZE,
          height: DOT_SIZE,
          borderRadius: "50%",
          backgroundColor: "var(--accent-color, #FF8C00)",
          transform: "translate(-50%, -50%)",
          transition: "opacity 0.18s ease-out",
          opacity: hovering ? 0.45 : 1,
        }}
      />
    </div>
  )
}
