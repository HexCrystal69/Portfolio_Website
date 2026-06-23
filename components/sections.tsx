"use client"

import type { ChapterContent } from "@/lib/portrait"

const DIVIDER = (
  <div
    style={{ borderColor: "rgba(245,230,211,0.1)" }}
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
          <div className="flex items-start gap-4 py-8">
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
                  color: "#F5E6D3",
                }}
              >
                {item.body}
              </p>
            </div>
          </div>
          {DIVIDER}
        </div>
      ))}
    </div>
  )
}

/* ── FRICTION: phases list ───────────────────────────────────────────────── */
function PhasesSection({ items }: { items: { label: string; body: string }[] }) {
  return (
    <div className="flex w-full flex-col">
      {DIVIDER}
      {items.map((item, i) => (
        <div key={i}>
          <div className="flex items-start gap-4 py-8">
            <span
              className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ backgroundColor: "#FF8C00", marginTop: "0.35rem" }}
            />
            <div className="flex flex-col gap-2">
              <span
                className="text-[10px] tracking-[0.25em]"
                style={{ color: "rgba(245,230,211,0.4)", fontFamily: "var(--font-ibm-mono)" }}
              >
                {item.label}
              </span>
              <p
                className="text-sm leading-relaxed"
                style={{
                  fontFamily: "var(--font-ibm-mono)",
                  color: "#F5E6D3",
                }}
              >
                {item.body}
              </p>
            </div>
          </div>
          {DIVIDER}
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
            className="flex flex-col gap-3 pr-6"
            style={{
              borderRight:
                i < items.length - 1 ? "1px solid rgba(245,230,211,0.1)" : "none",
            }}
          >
            <span
              className="text-[10px] tracking-[0.25em]"
              style={{ color: "rgba(245,230,211,0.4)", fontFamily: "var(--font-ibm-mono)" }}
            >
              {col.label}
            </span>
            <p
              className="text-sm leading-relaxed"
              style={{ fontFamily: "var(--font-ibm-mono)", color: "#F5E6D3" }}
            >
              {col.body}
            </p>
          </div>
        ))}
      </div>
      {DIVIDER}
      <p
        className="text-base leading-relaxed italic"
        style={{
          fontFamily: "var(--font-ibm-mono)",
          color: "#F5E6D3",
        }}
      >
        {quote}
      </p>
    </div>
  )
}

/* ── RESONANCE: editorial + bullets ─────────────────────────────────────── */
function EditorialSection({
  body,
  bullets,
}: {
  body: string
  bullets: string[]
}) {
  // The body has the word "biological" crossed out — split and inject
  const parts = body.split("biological")

  return (
    <div className="flex w-full flex-col gap-8">
      <p
        className="text-base leading-relaxed"
        style={{ fontFamily: "var(--font-ibm-mono)", color: "#F5E6D3" }}
      >
        {parts[0]}
        <span
          style={{
            textDecoration: "line-through",
            color: "rgba(245,230,211,0.4)",
          }}
        >
          biological
        </span>
        {parts[1]}
      </p>
      {DIVIDER}
      <ul className="flex flex-col gap-4">
        {bullets.map((b, i) => (
          <li key={i} className="flex items-start gap-3">
            <span
              className="mt-1.5 h-1 w-1 shrink-0 rounded-full"
              style={{ backgroundColor: "#FF8C00" }}
            />
            <p
              className="text-sm leading-relaxed"
              style={{ fontFamily: "var(--font-ibm-mono)", color: "#F5E6D3" }}
            >
              {b}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ── WORK: project cards ─────────────────────────────────────────────────── */
function WorkSection({
  projects,
}: {
  projects: {
    id: string
    title: string
    description: string
    tags: string[]
    href?: string
  }[]
}) {
  return (
    <div className="flex w-full flex-col gap-0">
      {DIVIDER}
      {projects.map((p) => (
        <a
          key={p.id}
          href={p.href ?? "#"}
          className="group block transition-colors"
          style={{
            borderBottom: "1px solid rgba(245,230,211,0.1)",
          }}
        >
          <div
            className="flex flex-col gap-3 px-4 py-6 transition-colors"
            style={{
              borderLeft: "2px solid transparent",
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLDivElement).style.borderLeftColor = "#FF8C00"
              ;(e.currentTarget as HTMLDivElement).style.backgroundColor =
                "rgba(255,140,0,0.04)"
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLDivElement).style.borderLeftColor = "transparent"
              ;(e.currentTarget as HTMLDivElement).style.backgroundColor = "transparent"
            }}
          >
            <span
              className="text-[10px] tracking-[0.25em]"
              style={{ color: "rgba(245,230,211,0.4)", fontFamily: "var(--font-ibm-mono)" }}
            >
              PROJECT: {p.id}
            </span>
            <h3
              className="text-xl italic leading-none"
              style={{
                fontFamily: "var(--font-instrument-serif)",
                color: "#F5E6D3",
              }}
            >
              {p.title}
            </h3>
            <p
              className="text-sm leading-relaxed"
              style={{
                fontFamily: "var(--font-ibm-mono)",
                color: "rgba(245,230,211,0.6)",
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
                    border: "1px solid rgba(245,230,211,0.2)",
                    color: "#F5E6D3",
                    fontFamily: "var(--font-ibm-mono)",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </a>
      ))}
    </div>
  )
}

/* ── Dispatcher ──────────────────────────────────────────────────────────── */
export function SectionContent({ content }: { content: ChapterContent }) {
  switch (content.type) {
    case "layers":
      return <LayersSection items={content.items} />
    case "phases":
      return <PhasesSection items={content.items} />
    case "columns":
      return <ColumnsSection items={content.items} quote={content.quote} />
    case "editorial":
      return <EditorialSection body={content.body} bullets={content.bullets} />
    case "work":
      return <WorkSection projects={content.projects} />
    default:
      return null
  }
}
