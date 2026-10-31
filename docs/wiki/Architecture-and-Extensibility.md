# 🏛️ Architecture & Extensibility Guide

This document details the core architectural patterns, reactive state machine, and component extension guidelines for DocuMorph.

---

## 1. Directory Structure

DocuMorph follows a strict **Feature-Driven Architecture** adhering to our engineering guidelines in [`GEMINI.md`](../../GEMINI.md):

```
documorph/
├── .agents/                    # Workspace-level AI agent rules & standards
├── .github/                    # CI/CD Workflows, security scans & PR templates
│   └── workflows/
│       ├── ci.yml              # Node 22 + pnpm 11 build, lint & type-check
│       └── security.yml        # pnpm audit + CodeQL static analysis
├── docs/                       # Project documentation & GitHub Wiki
│   └── wiki/                   # Complete Wiki chapters
├── src/
│   ├── app/                    # Next.js App Router segements
│   │   ├── api/v1/ingest/      # Rate-limited GitHub AST Ingestion API
│   │   ├── layout.tsx          # Root layout & font definition
│   │   └── page.tsx            # Main workspace viewport
│   ├── components/
│   │   ├── canvas/             # React Flow 2D Architecture Canvas & Studio
│   │   ├── canvas3d/           # Three.js 3D WebGL Hologram Constellation
│   │   ├── copilot/            # Multimodal AI Architecture Co-Pilot
│   │   ├── editor/             # Living Markdown Spec Editor
│   │   ├── header/             # Universal Navigation & View Switcher
│   │   ├── ingest/             # Code Link Ingest Modal
│   │   ├── inspector/          # Node Inspector & Endpoint Manager
│   │   ├── observability/      # Grafana Metrics & Waterfall Trace Viewer
│   │   ├── playground/         # Living API Sandbox with Monaco Editor
│   │   └── ui/                 # Reusable UI primitives (Card3DTilt, Buttons)
│   ├── data/                   # Showcase Templates & Architecture Samples
│   ├── lib/
│   │   ├── ingest/             # GitHub Ingestion AST & Manifest Analyzer
│   │   └── security/           # Rate limiter, SSRF validator & Sanitizer
│   ├── store/                  # Global Zustand State Machine
│   └── types/                  # Strict TypeScript domain interfaces
├── AGENTS.md                   # Autonomous agent guidelines & Graphify index
├── ARCHITECTURE.md             # Subsystem technical architecture
├── GEMINI.md                   # Master AI pair-programming rules & quality gates
├── package.json                # Dependencies & scripts
└── pnpm-workspace.yaml         # Supply chain overrides (dompurify CVE patch)
```

---

## 2. Global State Machine (`useDocuMorphStore`)

Global state is managed using **Zustand** (`src/store/useDocuMorphStore.ts`):
- **Template Management**: `templates`, `activeTemplate`, `setActiveTemplate()`, `loadCustomTemplate()`.
- **Selection State**: `selectedNode`, `selectedEndpoint`, `setSelectedNode()`, `setSelectedEndpoint()`.
- **View Navigation**: `activeTab` (`diagram` | `hologram3d` | `playground` | `metrics` | `editor` | `copilot`).
- **Architecture Creator Studio**: `addNode()`, `deleteNode()`, `updateNodeData()`, `addEdgeConnection()`, `deleteEdge()`, `exportToMermaid()`.
- **End-to-End Simulation**: `isSimulating`, `runEndpointSimulation()`, `traceEvents`, `spans`.

---

## 3. Core Invariants (Must Be Preserved)

When extending DocuMorph, maintain these four fundamental invariants:
1. **Node Data Typing**: All node data must extend `Record<string, unknown>` to ensure compatibility with `@xyflow/react` v12.
2. **React 19 State Discipline**: Prohibit synchronous `setState` calls directly inside `useEffect` bodies to prevent cascading re-render warnings. Pass entity IDs via `key={entity.id}` to reinitialize component state naturally.
3. **Webpack Build Flag**: Maintain `"build": "next build --webpack"` in `package.json` to guarantee complete compatibility with external CSS loaders (`@xyflow/react/dist/style.css`).
4. **Security & Sandbox Isolation**: Never execute untrusted code or arbitrary scripts on the server. All simulated API responses run within the client-side browser sandbox.
