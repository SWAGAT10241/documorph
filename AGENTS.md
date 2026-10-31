# 🤖 AGENTS.md — Agentic Contributor & LLM Pair Programming Guide

> **Target Audience:** Autonomous coding agents (Antigravity, Claude Code, Cursor, Copilot Workspace, Devin) and LLM pair programmers contributing to `DocuMorph`.

Welcome, synthetic collaborator. This document establishes operational instructions, system invariants, development toolchains, and quality protocols for editing, refactoring, and extending `DocuMorph`.

---

## 🧭 Repository Identity & Mission

- **Project:** `DocuMorph`
- **Target Event:** Global Hack Week: Builders Week (MLH, Nov 6–12, 2026)
- **Mission:** A multimodal living documentation platform, architecture diagram studio (`@xyflow/react`), living API playground (Monaco Editor), and Grafana-style distributed trace & telemetry dashboard.
- **Tech Stack:** Next.js 16 (App Router, Webpack build), React 19, Tailwind CSS v4, Zustand, `@xyflow/react`, `@monaco-editor/react`, Lucide Icons, pnpm.

---

## ⚡ Core Invariants (DO NOT VIOLATE)

Whenever you generate code or make changes, you **must adhere to these 4 strict invariants**:

### 1. 🛡️ React Flow Node Data Serialization
- **Rule:** Every custom node interface (e.g., `ServiceNodeData`) **MUST** extend `Record<string, unknown>`:
  ```typescript
  export interface ServiceNodeData extends Record<string, unknown> {
    id: string;
    label: string;
    nodeType: NodeType;
    ...
  }
  ```
- **Why:** React Flow v12 strictly checks that node `data` satisfies `Record<string, unknown>`. Omitting this causes TypeScript compilation failure (`TS2345`).

### 2. ⚡ No Synchronous `setState` in `useEffect` (React 19 Rule)
- **Rule:** Never call `setState` synchronously within a `useEffect` body to reset component state on prop changes.
- **Solution:** Instead, use React's idiomatic `key={id}` prop pattern on the parent/wrapper element so the component remounts cleanly with initial state, or compute state during render.

### 3. 🔒 Safe Webpack Production Build
- **Rule:** The build script must run `next build --webpack` (configured in `package.json`). Turbopack currently has an issue spawning node subprocesses for CSS loaders on some environments.

### 4. 🌐 Client-Side Sandbox Boundary
- **Rule:** Ingested documentation and simulated API requests run client-side in browser state. Never expose arbitrary user inputs or credentials to unauthenticated remote telemetry servers.

---

## 🗺️ Graphify Knowledge Graph (`graphify-out/`)

This repository is indexed by **Graphify**. A persistent structural and semantic graph of all components, types, and hooks lives in `graphify-out/`:

- **Interactive Visualizer:** Open `graphify-out/graph.html` in your browser.
- **Comprehensive Graph Report:** Read [`graphify-out/GRAPH_REPORT.md`](graphify-out/GRAPH_REPORT.md).
- **Raw Graph Data:** `graphify-out/graph.json` (226+ nodes, 343+ edges).

### Querying the Codebase via Graphify CLI
If you have questions about architecture flows, component call-stacks, or dependencies, run:
```bash
# Query natural language questions across the codebase
/Users/swagatsouravdhar/.graphify-venv/bin/graphify query "How does endpoint simulation route through edges?"

# Trace shortest path between two components/types
/Users/swagatsouravdhar/.graphify-venv/bin/graphify path "ArchitectureCanvas" "useDocuMorphStore"

# Explain a specific node
/Users/swagatsouravdhar/.graphify-venv/bin/graphify explain "ServiceNode"
```

---

## 🛠️ Development Environment & Toolchain

```bash
# 1. Install dependencies
pnpm install

# 2. Type-checking (Must pass with 0 errors)
pnpm tsc --noEmit

# 3. Linting (Must pass with 0 errors)
pnpm lint

# 4. Production Build Verification
pnpm build

# 5. Local Development Server
pnpm dev
```

---

## 🧩 Architectural Directory Map

```plaintext
src/
├── app/
│   ├── layout.tsx         # Root layout with dark mode slate styling & metadata
│   ├── page.tsx           # Main workspace coordinating Header, Canvas, Inspector, Sandbox
│   └── globals.css        # Tailwind v4 import & custom scrollbar styling
├── components/
│   ├── canvas/            # React Flow Architecture Canvas & ServiceNode components
│   ├── header/            # Universal top navbar, view switcher, and spec ingestion modal
│   ├── inspector/         # Right-hand drawer inspecting clicked node endpoints and trace logs
│   ├── playground/        # Monaco-powered Living API sandbox & request runner
│   ├── observability/     # Grafana-style telemetry dashboard & Tempo waterfall trace viewer
│   ├── editor/            # Full-document Markdown specification editor
│   └── copilot/           # Gemini 2.0 reasoning technical co-pilot chat
├── data/
│   └── showcaseTemplates.ts # High-fidelity pre-bundled architecture templates
├── store/
│   └── useDocuMorphStore.ts # Global Zustand state engine (nodes, edges, spans, simulations)
└── types/
    └── documorph.ts       # TypeScript schemas for nodes, endpoints, spans, and telemetry
```

<!-- BEGIN:nextjs-agent-rules -->
## Next.js Conventions
Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
