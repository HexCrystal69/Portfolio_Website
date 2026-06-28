// Content model for Prayas Kar's interactive exploration.
// All text, projects, and links live here — zero component changes needed.

export const GMAIL_COMPOSE_URL = "https://mail.google.com/mail/u/0/?view=cm&fs=1&to=prayaskar024@gmail.com&su=Regarding%20Your%20Portfolio&body=Hi%20Prayas,%0A%0A"

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
    { label: "RESUME", href: "https://drive.google.com/file/d/1dZuBDHdfOs1eZYlzUXcmYIOfN_HW-utP/view?usp=sharing" },
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

export type ChapterId = "origin" | "systems" | "alignment" | "trajectory" | "work"

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
  category: string
  status: string
  problem: string
  architecture: string
  challenges: string
  outcomes: string
  github: string
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
    title: "Origin",
    subtitle: "",
    content: {
      type: "layers",
      items: [
        {
          label: "IDENTITY",
          body: "Prayas Kar — Kolkata, India. Final-year Computer Science Engineering student at SRM Institute of Science and Technology (CGPA: 9.30/10.00).",
        },
        {
          label: "CORE FOCUS",
          body: "Specializing in AI Engineering, Data Engineering, Generative AI, and Backend Systems.",
        },
        {
          label: "MISSION",
          body: "Focusing on the transition from foundational computer science theory toward constructing intelligent, context-aware systems and scalable data infrastructure.",
        },
      ],
    },
  },
  {
    id: "systems",
    nav: "SYSTEMS",
    title: "Systems",
    subtitle: "",
    content: {
      type: "phases",
      items: [
        {
          label: "PHASE 01: LOCAL INFERENCE & RETRIEVAL WORKFLOWS",
          body: "Designed retrieval and indexing workflows optimized for local inference environments. Built structured document chunking and metadata association schemas to ensure model accuracy and reduce search index latency.",
        },
        {
          label: "PHASE 02: MULTIMODAL FORECASTING ALIGNMENT",
          body: "Aligned temporal sequences between high-frequency numerical data feeds and textual sentiment inputs to support multi-dimensional risk prediction.",
        },
        {
          label: "PHASE 03: DISTRIBUTED TELEMETRY STREAMING",
          body: "Implemented structured event ingestion and processing workflows across distributed streams to capture and serialize telemetry logs.",
        },
      ],
    },
  },
  {
    id: "alignment",
    nav: "ALIGNMENT",
    title: "Alignment",
    subtitle: "",
    content: {
      type: "columns",
      items: [
        {
          label: "AI ENGINEERING",
          body: "PyTorch, TensorFlow, LangChain, FAISS, Ollama, NLP, Computer Vision, RAG.",
        },
        {
          label: "DATA ENGINEERING",
          body: "Kafka, Spark, ETL, PostgreSQL, Data Warehousing.",
        },
        {
          label: "SYSTEMS & LANGUAGES",
          body: "FastAPI, SQLAlchemy, REST APIs, Docker, WebSockets, Python, Java, SQL, JavaScript.",
        },
      ],
      quote: '"Alignment is the convergence of high-efficiency systems execution, expressive data design, and clear interface utility."',
    },
  },
  {
    id: "trajectory",
    nav: "TRAJECTORY",
    title: "Trajectory",
    subtitle: "",
    content: {
      type: "editorial",
      body: "I build software that bridges the gap between scalable data pipelines and practical machine learning applications, focusing on low-latency utility and production-ready architectures.",
      bullets: [
        "Internship (1Stop Technologies): Conducted Android Penetration Testing using Burp Suite, MobSF, Frida, and Kali Linux.",
        "Internship (LearnNex): Executed Data Cleaning, Data Visualization, Predictive Analytics, and Machine Learning modeling.",
        "Professional Certifications: Google AI Essentials, Google Data Analytics, IBM RAG and Agentic AI, Microsoft AI Product Manager.",
      ],
    },
  },
  {
    id: "work",
    nav: "ARTFACTS",
    title: "Artifacts",
    subtitle: "",
    content: {
      type: "work",
      projects: [
        {
          id: "medical-rag",
          title: "Medical-RAG Pipeline",
          description: "A local retrieval-augmented generation system for clinical document question answering with vector indexing.",
          tags: ["PYTHON", "FAISS", "OLLAMA", "RAG"],
          category: "AI SYSTEM",
          status: "COMPLETED / LOCAL INFERENCE",
          problem: "Specialized clinical files require domain-specific terminology grounding to prevent general model hallucinations.",
          architecture: "Text ingestion pipeline extracting document chunks into a local FAISS vector index, querying a self-hosted local model (Ollama) with injected context.",
          challenges: "Optimizing retrieval search queries and managing memory configurations in local runtimes.",
          outcomes: "Verified local question answering with context grounding.",
          github: "https://github.com/HexCrystal69/medical-rag",
        },
        {
          id: "mfis",
          title: "Multimodal Financial Intelligence System",
          description: "An analytics engine processing textual transcripts and market metrics for financial risk prediction.",
          tags: ["PYTHON", "MACHINE LEARNING", "NLP"],
          category: "AI / DATA SYSTEM",
          status: "ACTIVE DEVELOPMENT",
          problem: "Quantitative forecasting models analyze tabular metrics in isolation, omitting textual sentiment indicators.",
          architecture: "Text processing engine extracting sentiment indicators coupled with historical price data trends.",
          challenges: "Structuring disparate textual transcripts alongside numerical time-series price data.",
          outcomes: "Consolidated pipeline analyzing text sentiment alongside financial metrics.",
          github: "https://github.com/HexCrystal69/mfis",
        },
        {
          id: "realtime-event",
          title: "Real-Time Event Processing Platform",
          description: "An event-driven streaming pipeline capturing and processing telemetry data at scale.",
          tags: ["KAFKA", "SPARK", "POSTGRESQL", "ETL"],
          category: "DATA SYSTEM",
          status: "COMPLETED",
          problem: "Live telemetry logs require robust ingestion and buffering pipelines to prevent message loss.",
          architecture: "Event-driven streaming pipeline using Kafka for message queueing, Spark for data processing, and PostgreSQL/NoSQL databases for storage.",
          challenges: "Handling event serialization and managing pipeline throughput.",
          outcomes: "Operational analytics pipeline capable of capturing event logs.",
          github: "https://github.com/HexCrystal69/Real-Time-Event-Processing-Platform",
        },
      ],
    },
  },
]
