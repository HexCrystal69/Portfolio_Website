# Interactive Portfolio Website

A highly interactive, data-driven, cinematic developer portfolio built with Next.js, React, Tailwind CSS v4, GSAP, and Three.js.

The site features a dynamic Three.js canvas (morphing blob & particle rings), custom interactive animations via GSAP, and a fully modular design where all textual content, social links, project artifacts, and layout structures are defined in a single configuration file.

---

## 🛠️ Tech Stack & Key Libraries

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Static Site Generation)
- **Runtime & UI**: [React](https://react.dev/) (v19)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (v4.x)
- **3D Canvas**: [Three.js](https://threejs.org/) (Custom shader-based morphing blob)
- **Animations**: [GSAP (GreenSock Animation Platform)](https://gsap.com/)
- **Language**: TypeScript

---

## 📂 Project Architecture

```
├── app/
│   ├── globals.css      # Core Design Tokens, HSL Color System, CSS custom properties
│   ├── layout.tsx       # Root layout, HTML metadata, and Font configurations
│   └── page.tsx         # Root page mounting the main Exploration system
├── components/
│   ├── exploration.tsx  # Central controller: Handles mouse tracking, navigation, GSAP animations, & layout state
│   ├── morphing-blob.tsx# Three.js canvas containing the morphing interactive sphere and rings
│   └── sections.tsx     # Renders the specific layout templates dynamically based on active chapter data
└── lib/
    └── portrait.ts      # Core content database: Links, chapters, text, stats, and project details
```

---

## ⚙️ Content & Link Upgrades (`lib/portrait.ts`)

To update any copy, links, resume, social accounts, or projects, **you do not need to modify any React components**. Simply edit the central data model in [`lib/portrait.ts`](file:///d:/Mini/Portfolio_Website/lib/portrait.ts).

### 1. Modifying Identity, Social Links, and Resume
At the top of [`lib/portrait.ts`](file:///d:/Mini/Portfolio_Website/lib/portrait.ts), update the `IDENTITY` object:
```typescript
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
    { label: "GITHUB", href: "https://github.com/HexCrystal69" },
    { label: "LINKEDIN", href: "https://www.linkedin.com/in/prayas-kar" },
    { label: "RESUME", href: "https://drive.google.com/file/d/1dZu..." },
  ],
}
```

### 2. Modifying Rotating Hero States
Update the `STATES` array to change the words rotating underneath the center blob on the homepage:
```typescript
export const STATES = [
  "Learning",
  "Building",
  "Exploring",
  "Refining",
  "Becoming",
  "Unfolding",
]
```

### 3. Adding/Updating Chapters and Layouts
Each chapter is rendered using a specific `content.type` in the `CHAPTERS` array. The following templates are supported by [`components/sections.tsx`](file:///d:/Mini/Portfolio_Website/components/sections.tsx):

| Layout `type` | Best For | JSON Schema Structure |
| :--- | :--- | :--- |
| **`layers`** | Vertical structured bullet details | `items: { label: string, body: string }[]` |
| **`phases`** | Sequential phases / process details | `items: { label: string, body: string }[]` |
| **`columns`** | Multi-column lists + summary quote | `items: { label: string, body: string }[], quote: string` |
| **`editorial`** | Narrative paragraphs + list items | `body: string, bullets: string[]` |
| **`work`** | Project grids / project case studies | `projects: Project[]` |

#### Example: Modifying the "Work" Artifacts & Repositories
Update the `projects` array inside the `work` chapter config:
```typescript
{
  id: "medical-rag",
  title: "Medical-RAG Pipeline",
  description: "A local retrieval-augmented generation system...",
  tags: ["PYTHON", "FAISS", "OLLAMA", "RAG"],
  category: "AI SYSTEM",
  status: "COMPLETED / LOCAL INFERENCE",
  problem: "Specialized clinical files require...",
  architecture: "Text ingestion pipeline...",
  challenges: "Optimizing retrieval search...",
  outcomes: "Verified local question answering...",
  github: "https://github.com/HexCrystal69/medical-rag",
}
```

---

## 🎨 Theme & Styles (`app/globals.css`)

All color variables support automatic themes (dark mode by default, switching to light mode inside active chapters). 
To change fonts, theme colors, spacing tokens, or scrollbar behaviors:
* Open [`app/globals.css`](file:///d:/Mini/Portfolio_Website/app/globals.css).
* Modify custom CSS variables defined under `:root` and `main` elements (e.g., `--bg-color`, `--text-color`, `--accent-color`).

---

## 🎬 Animation Adjustments (`components/exploration.tsx`)

Animations are handled cleanly by GSAP in [`components/exploration.tsx`](file:///d:/Mini/Portfolio_Website/components/exploration.tsx).

### Character Reveal Speeds
The hero name reveal animation maps over each letter of the name (split in the JSX code) and uses the `.hero-letter` selector.
```typescript
gsap.fromTo(
  letters,
  {
    opacity: 0,
    y: (i) => (i % 2 === 0 ? -60 : 60), // Start offsets (alternating)
  },
  {
    opacity: 1,
    y: 0,
    duration: 0.9,      // Animation duration (seconds)
    stagger: 0.08,      // Stagger offset between letters (seconds)
    ease: "power3.out", // GSAP ease function
  }
)
```

### Rotating State Cadence
The rotating word helper is managed via a GSAP timeline in the `startWordRotation` callback:
* Hold time is defined by the delay parameter: `"+=2.2"` (hold for 2.2 seconds).
* Transition durations: `duration(0.4)` (0.4s fade-in/out).

---

## 🚀 Development & Commands

### Prerequisites
Make sure you have Node.js (v18+) and your package manager of choice (`npm` / `pnpm`) installed.

### Install Dependencies
```bash
npm install
```

### Run Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build and Validate for Production
```bash
# On systems supporting powershell where execution scripts are restricted:
powershell -ExecutionPolicy Bypass -Command "npm run build"

# Standard build command:
npm run build
```
The output will compile statically into `.next/` with zero warnings.
