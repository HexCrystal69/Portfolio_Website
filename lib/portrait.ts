// Content model for Prayas Kar's interactive exploration.
// All text, projects, and links live here — zero component changes needed.

export const IDENTITY = {
  name: "PRAYAS KAR",
  status: "BUILDING IN PUBLIC",
  mode: "CONTINUOUS EMERGENCE",
  meta: [
    { label: "VERSION", value: "2026.1" },
    { label: "MODE", value: "EXPLORATION" },
    { label: "STATE", value: "UNFOLDING" },
  ],
  links: [
    { label: "GITHUB", href: "#" },
    { label: "LINKEDIN", href: "#" },
    { label: "RESUME", href: "#" },
  ],
}

export const STATES = [
  "Learning",
  "Building",
  "Exploring",
  "Refining",
  "Becoming",
  "Unfolding",
]

export type ChapterId = "origin" | "friction" | "alignment" | "resonance" | "work"

export type Layer = {
  label: string
  body: string
}

export type Column = {
  label: string
  body: string
}

export type Project = {
  id: string
  title: string
  description: string
  tags: string[]
  href?: string
}

export type ChapterContent =
  | { type: "layers"; items: Layer[] }
  | { type: "phases"; items: Layer[] }
  | { type: "columns"; items: Column[]; quote: string }
  | { type: "editorial"; body: string; bullets: string[] }
  | { type: "work"; projects: Project[] }

export type Chapter = {
  id: ChapterId
  nav: string
  title: string
  subtitle: string
  content: ChapterContent
}

export const CHAPTERS: Chapter[] = [
  {
    id: "origin",
    nav: "ORIGIN",
    title: "The Foundations",
    subtitle: "",
    content: {
      type: "layers",
      items: [
        {
          label: "CURIOSITY",
          body: "Early fascination with how complex systems organize themselves from chaos. A childhood spent dismantling clocks to understand time.",
        },
        {
          label: "CORE MOTIVATION",
          body: "The drive to build tools that expand human capability. Technology is not the end, but the lever for the mind.",
        },
        {
          label: "VALUES",
          body: "Precision over speed. Clarity over complexity. The belief that aesthetics are a functional requirement of good engineering.",
        },
        {
          label: "BACKGROUND",
          body: "Formed at the intersection of classical logic and digital experimentation. Seeing code as a medium for sculpture.",
        },
      ],
    },
  },
  {
    id: "friction",
    nav: "FRICTION",
    title: "Growth through Resistance",
    subtitle: "",
    content: {
      type: "phases",
      items: [
        {
          label: "PHASE 01: THE WALL OF INCOMPETENCE",
          body: "Every significant breakthrough was preceded by a period of total confusion. Learning to sit with the discomfort of not knowing is the primary skill.",
        },
        {
          label: "PHASE 02: PRODUCTIVE FAILURE",
          body: 'Rebuilding the same engine four times until the architecture felt "honest". Friction is the heat that tempers the steel.',
        },
        {
          label: "PHASE 03: THE REFINEMENT LOOP",
          body: "Stripping away features until only the essential remains. The hardest part of building is knowing what to kill.",
        },
      ],
    },
  },
  {
    id: "alignment",
    nav: "ALIGNMENT",
    title: "The Intersection",
    subtitle: "",
    content: {
      type: "columns",
      items: [
        {
          label: "TECHNICAL MASTERY",
          body: "Fluent in the languages of the machine, but obsessed with the user's pulse.",
        },
        {
          label: "DESIGN INTUITION",
          body: 'Spacing, rhythm, and weight. The invisible forces that make software feel "right".',
        },
        {
          label: "STRATEGIC VISION",
          body: "Connecting today's code to a five-year trajectory of impact.",
        },
      ],
      quote: '"Alignment is the moment when what you are doing, what you are good at, and what the world needs stop being three different things."',
    },
  },
  {
    id: "resonance",
    nav: "RESONANCE",
    title: "Future Direction",
    subtitle: "",
    content: {
      type: "editorial",
      body: "I am moving toward systems that feel biological — growing with use, adapting to the user, and maintaining a sense of poetic utility.",
      bullets: [
        "Developing interfaces for deep focus and cognitive extension.",
        "Exploring the frontier where AI becomes a collaborative brush, not a replacement for the artist.",
        "Building software that respects human attention as the world's scarcest resource.",
      ],
    },
  },
  {
    id: "work",
    nav: "WORK",
    title: "Evidence of Progress",
    subtitle: "",
    content: {
      type: "work",
      projects: [
        {
          id: "P-042",
          title: "Kinetics Engine",
          description: "A physics-based layout system for web applications that mimics fluid dynamics.",
          tags: ["THREE.JS", "GLSL"],
          href: "#",
        },
        {
          id: "P-038",
          title: "Loom Interface",
          description: "A productivity environment designed around the concept of thread-based focus.",
          tags: ["REACT", "RUST"],
          href: "#",
        },
        {
          id: "P-021",
          title: "Synapse UI",
          description: "An experimental component library leveraging neuro-morphic design principles.",
          tags: ["TYPESCRIPT", "FRAME MOTION"],
          href: "#",
        },
      ],
    },
  },
]
