"use client"

import { useState } from "react"
import { GMAIL_COMPOSE_URL, type ChapterContent, type Project } from "@/lib/portrait"

const DIVIDER = (
  <div
    style={{ borderColor: "var(--border-color, rgba(245,230,211,0.1))" }}
    className="w-full border-t"
  />
)

/* ── ORIGIN: layers list ─────────────────────────────────────────────────── */
function LayersSection({ items }: { items: { label: string; body: string }[] }) {
  return (
    <div className="flex w-full flex-col">
      {DIVIDER}
      {items.map((item, i) => (
        <div key={i}>
          <div className="content-block flex items-start gap-4 py-8">
            <span
              className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ backgroundColor: "#FF8C00", marginTop: "0.35rem" }}
            />
            <div className="flex flex-col gap-2">
              <span
                className="text-[10px] tracking-[0.25em]"
                style={{ color: "#FF8C00", fontFamily: "var(--font-ibm-mono)" }}
              >
                {item.label}
              </span>
              <p
                className="text-sm leading-relaxed"
                style={{
                  fontFamily: "var(--font-ibm-mono)",
                  color: "var(--text-color, #F5E6D3)",
                }}
              >
                {item.body}
              </p>
            </div>
          </div>
          {i < items.length - 1 && DIVIDER}
        </div>
      ))}
    </div>
  )
}

/* ── SYSTEMS: phases list ────────────────────────────────────────────────── */
function PhasesSection({ items }: { items: { label: string; body: string }[] }) {
  return (
    <div className="flex w-full flex-col">
      {DIVIDER}
      {items.map((item, i) => (
        <div key={i}>
          <div className="content-block flex items-start gap-4 py-8">
            <span
              className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ backgroundColor: "#FF8C00", marginTop: "0.35rem" }}
            />
            <div className="flex flex-col gap-2">
              <span
                className="text-[10px] tracking-[0.25em]"
                style={{ color: "var(--text-secondary, rgba(245,230,211,0.4))", fontFamily: "var(--font-ibm-mono)" }}
              >
                {item.label}
              </span>
              <p
                className="text-sm leading-relaxed"
                style={{
                  fontFamily: "var(--font-ibm-mono)",
                  color: "var(--text-color, #F5E6D3)",
                }}
              >
                {item.body}
              </p>
            </div>
          </div>
          {i < items.length - 1 && DIVIDER}
        </div>
      ))}
    </div>
  )
}

/* ── ALIGNMENT: three columns + quote ───────────────────────────────────── */
function ColumnsSection({
  items,
  quote,
}: {
  items: { label: string; body: string }[]
  quote: string
}) {
  return (
    <div className="flex w-full flex-col gap-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {items.map((col, i) => (
          <div
            key={i}
            className="content-block flex flex-col gap-3 pb-6 border-b last:border-b-0 last:border-r-0 last:pb-0 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-6"
            style={{
              borderColor: "var(--border-color, rgba(245,230,211,0.1))",
            }}
          >
            <span
              className="text-[10px] tracking-[0.25em]"
              style={{ color: "var(--text-secondary, rgba(245,230,211,0.4))", fontFamily: "var(--font-ibm-mono)" }}
            >
              {col.label}
            </span>
            <p
              className="text-sm leading-relaxed"
              style={{ fontFamily: "var(--font-ibm-mono)", color: "var(--text-color, #F5E6D3)" }}
            >
              {col.body}
            </p>
          </div>
        ))}
      </div>
      {DIVIDER}
      <p
        className="content-block text-base leading-relaxed italic"
        style={{
          fontFamily: "var(--font-ibm-mono)",
          color: "var(--text-color, #F5E6D3)",
        }}
      >
        {quote}
      </p>
    </div>
  )
}

/* ── TRAJECTORY: editorial + bullets + contact CTAs ───────────────────────── */
function EditorialSection({
  body,
  bullets,
  onCopyEmail,
}: {
  body: string
  bullets: string[]
  onCopyEmail?: () => void
}) {
  return (
    <div className="flex w-full flex-col gap-8">
      <p
        className="content-block text-base leading-relaxed"
        style={{ fontFamily: "var(--font-ibm-mono)", color: "var(--text-color, #F5E6D3)" }}
      >
        {body}
      </p>
      {DIVIDER}
      <ul className="flex flex-col gap-4">
        {bullets.map((b, i) => (
          <li key={i} className="content-block flex items-start gap-3">
            <span
              className="mt-1.5 h-1 w-1 shrink-0 rounded-full"
              style={{ backgroundColor: "#FF8C00" }}
            />
            <p
              className="text-sm leading-relaxed"
              style={{ fontFamily: "var(--font-ibm-mono)", color: "var(--text-color, #F5E6D3)" }}
            >
              {b}
            </p>
          </li>
        ))}
      </ul>
      {DIVIDER}
      <div className="content-block flex flex-wrap gap-x-6 gap-y-4 pt-4">
        <a
          href="https://drive.google.com/file/d/1dZuBDHdfOs1eZYlzUXcmYIOfN_HW-utP/view?usp=sharing"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs hover:text-[#FF8C00] transition-colors"
          style={{ fontFamily: "var(--font-ibm-mono)", color: "var(--text-color, #F5E6D3)" }}
        >
          [ RESUME ]
        </a>
        <a
          href="https://github.com/HexCrystal69"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs hover:text-[#FF8C00] transition-colors"
          style={{ fontFamily: "var(--font-ibm-mono)", color: "var(--text-color, #F5E6D3)" }}
        >
          [ GITHUB ]
        </a>
        <a
          href="https://www.linkedin.com/in/prayas-kar"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs hover:text-[#FF8C00] transition-colors"
          style={{ fontFamily: "var(--font-ibm-mono)", color: "var(--text-color, #F5E6D3)" }}
        >
          [ LINKEDIN ]
        </a>
        <a
          href={GMAIL_COMPOSE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs hover:text-[#FF8C00] transition-colors"
          style={{ fontFamily: "var(--font-ibm-mono)", color: "var(--text-color, #F5E6D3)" }}
        >
          [ EMAIL ]
        </a>
        <button
          onClick={onCopyEmail}
          className="text-xs hover:text-[#FF8C00] transition-colors bg-transparent border-none p-0 cursor-pointer"
          style={{ fontFamily: "var(--font-ibm-mono)", color: "var(--text-color, #F5E6D3)", outline: "none" }}
        >
          [ COPY ]
        </button>
      </div>
    </div>
  )
}

/* ── WORK: project cards ─────────────────────────────────────────────────── */
function WorkSection({
  projects,
}: {
  projects: Project[]
}) {
  const [activeViews, setActiveViews] = useState<Record<string, "architecture" | "deep-dive" | null>>({})

  const toggleView = (projectId: string, view: "architecture" | "deep-dive") => {
    setActiveViews((prev) => {
      const current = prev[projectId]
      return {
        ...prev,
        [projectId]: current === view ? null : view,
      }
    })
  }

  return (
    <div className="flex w-full flex-col gap-0">
      {DIVIDER}
      {projects.map((p, i) => {
        const activeView = activeViews[p.id] || null

        return (
          <div
            key={p.id}
            className={`content-block flex flex-col gap-3 px-4 py-6 transition-colors ${i < projects.length - 1 ? "border-b" : ""}`}
            style={{
              borderColor: "var(--border-color, rgba(245,230,211,0.1))",
            }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <span
                className="text-[10px] tracking-[0.25em]"
                style={{ color: "#FF8C00", fontFamily: "var(--font-ibm-mono)" }}
              >
                {p.category} // {p.status}
              </span>
            </div>
            
            <h3
              className="text-xl italic leading-none"
              style={{
                fontFamily: "var(--font-instrument-serif)",
                color: "var(--text-color, #F5E6D3)",
              }}
            >
              {p.title}
            </h3>
            
            <p
              className="text-sm leading-relaxed"
              style={{
                fontFamily: "var(--font-ibm-mono)",
                color: "var(--text-secondary-medium, rgba(245,230,211,0.6))",
              }}
            >
              {p.description}
            </p>
            
            <div className="flex flex-wrap gap-2">
              {p.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-[10px] tracking-[0.2em]"
                  style={{
                    border: "1px solid var(--border-color-medium, rgba(245,230,211,0.2))",
                    color: "var(--text-color, #F5E6D3)",
                    fontFamily: "var(--font-ibm-mono)",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Interactive Toggle Buttons */}
            <div className="flex flex-wrap gap-3 mt-2">
              <button
                onClick={() => toggleView(p.id, "architecture")}
                className="text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 transition-colors border cursor-pointer"
                style={{
                  fontFamily: "var(--font-ibm-mono)",
                  borderColor: activeView === "architecture" ? "#FF8C00" : "var(--border-color-medium, rgba(245,230,211,0.2))",
                  color: activeView === "architecture" ? "#FF8C00" : "var(--text-color, #F5E6D3)",
                  backgroundColor: activeView === "architecture" ? "rgba(255, 140, 0, 0.05)" : "transparent",
                }}
              >
                [ {activeView === "architecture" ? "Hide Architecture" : "View Architecture"} ]
              </button>
              <button
                onClick={() => toggleView(p.id, "deep-dive")}
                className="text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 transition-colors border cursor-pointer"
                style={{
                  fontFamily: "var(--font-ibm-mono)",
                  borderColor: activeView === "deep-dive" ? "#FF8C00" : "var(--border-color-medium, rgba(245,230,211,0.2))",
                  color: activeView === "deep-dive" ? "#FF8C00" : "var(--text-color, #F5E6D3)",
                  backgroundColor: activeView === "deep-dive" ? "rgba(255, 140, 0, 0.05)" : "transparent",
                }}
              >
                [ {activeView === "deep-dive" ? "Hide Deep Dive" : "View Deep Dive"} ]
              </button>
              <a
                href={p.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 transition-colors border hover:text-[#FF8C00] hover:border-[#FF8C00]"
                style={{
                  fontFamily: "var(--font-ibm-mono)",
                  borderColor: "var(--border-color-medium, rgba(245,230,211,0.2))",
                  color: "var(--text-color, #F5E6D3)",
                  backgroundColor: "transparent",
                }}
              >
                [ GitHub ]
              </a>
            </div>

            {/* Collapsible Content Panels */}
            <div
              className="overflow-hidden"
              style={{
                maxHeight: activeView ? "800px" : "0px",
                opacity: activeView ? 1 : 0,
                transition: "max-height 0.4s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.4s ease-out"
              }}
            >
              {activeView && (
                <div
                  className="flex flex-col gap-5 pt-5 pb-2 mt-4 border-t border-dashed"
                  style={{ borderColor: "var(--border-color, rgba(245,230,211,0.15))" }}
                >
                  {activeView === "architecture" && (
                    <div className="flex flex-col gap-2">
                      <span className="text-[9px] tracking-[0.2em]" style={{ color: "#FF8C00", fontFamily: "var(--font-ibm-mono)" }}>SYSTEM_ARCHITECTURE</span>
                      <p className="text-xs leading-relaxed" style={{ fontFamily: "var(--font-ibm-mono)", color: "var(--text-color, #F5E6D3)" }}>
                        {p.architecture}
                      </p>
                    </div>
                  )}

                  {activeView === "deep-dive" && (
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[9px] tracking-[0.2em]" style={{ color: "#FF8C00", fontFamily: "var(--font-ibm-mono)" }}>01_PROBLEM</span>
                        <p className="text-xs leading-relaxed" style={{ fontFamily: "var(--font-ibm-mono)", color: "var(--text-color, #F5E6D3)" }}>
                          {p.problem}
                        </p>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[9px] tracking-[0.2em]" style={{ color: "#FF8C00", fontFamily: "var(--font-ibm-mono)" }}>02_CHALLENGES</span>
                        <p className="text-xs leading-relaxed" style={{ fontFamily: "var(--font-ibm-mono)", color: "var(--text-color, #F5E6D3)" }}>
                          {p.challenges}
                        </p>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[9px] tracking-[0.2em]" style={{ color: "#FF8C00", fontFamily: "var(--font-ibm-mono)" }}>03_OUTCOMES</span>
                        <p className="text-xs leading-relaxed" style={{ fontFamily: "var(--font-ibm-mono)", color: "var(--text-color, #F5E6D3)" }}>
                          {p.outcomes}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ── Dispatcher ──────────────────────────────────────────────────────────── */
export function SectionContent({ content, onCopyEmail }: { content: ChapterContent; onCopyEmail?: () => void }) {
  switch (content.type) {
    case "layers":
      return <LayersSection items={content.items} />
    case "phases":
      return <PhasesSection items={content.items} />
    case "columns":
      return <ColumnsSection items={content.items} quote={content.quote} />
    case "editorial":
      return <EditorialSection body={content.body} bullets={content.bullets} onCopyEmail={onCopyEmail} />
    case "work":
      return <WorkSection projects={content.projects} />
    default:
      return null
  }
}
