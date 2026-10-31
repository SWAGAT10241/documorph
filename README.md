# 📘 DocuMorph: Multimodal Living Documentation & Interactive API Playground

[![CI Pipeline](https://github.com/SWAGAT10241/documorph/actions/workflows/ci.yml/badge.svg)](https://github.com/SWAGAT10241/documorph/actions/workflows/ci.yml)
[![Security Scan](https://github.com/SWAGAT10241/documorph/actions/workflows/security.yml/badge.svg)](https://github.com/SWAGAT10241/documorph/actions/workflows/security.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Next.js 16](https://img.shields.io/badge/Next.js-16.4-black)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.3-blue)](https://react.dev/)
[![MLH GHW: Builders Week](https://img.shields.io/badge/MLH-Builders%20Week%202026-red)](https://events.mlh.io)

> **Built for Global Hack Week: Builders Week (MLH, Nov 6–12, 2026)**  
> *Transform static technical documentation, architecture specs, and API manuals into interactive, runnable system diagrams and living sandboxes.*

---

## 🌟 Why DocuMorph?

Technical specifications and architecture PDFs are typically passive, dense, and disconnected from runtime reality:
1. **Developers scan without grasping architecture:** Complex data flows and event backbones get buried in paragraphs of text.
2. **Disconnected testing:** Developers copy-paste cURL commands or endpoints back and forth into external tools (Postman, terminal).
3. **Static diagrams:** Architecture figures in markdown are dead pixels—you cannot click a microservice node to see its schema or live endpoint status.

**DocuMorph** bridges documentation, diagramming, sandboxing, and observability into a single unified workspace.

---

## 🚀 Key Features

- **Living Architecture Canvas:** Powered by `@xyflow/react` (React Flow), rendering custom microservice nodes with real-time health indicators, latency metrics, and SLA badges.
- **Architecture Diagram Creator & Studio:** Quick-add node palette (`+ Gateway`, `+ Service`, `+ DB`, `+ Queue`, `+ Agent`, `+ Cache`), drag-and-drop edge wiring, and text-to-architecture generator.
- **Grafana-Style Observability Dashboard:** Real-time throughput (RPS), P95 latency stats, pod health, and Grafana Tempo-style waterfall span viewer.
- **In-Browser Living API Sandbox:** Built-in payload editor with Monaco Editor support and instant simulated packet traversal across the architecture graph.
- **Real-Time Trace Stream:** Visual event log tracking packet movements, latency benchmarks, and status codes across microservices.
- **Multimodal Technical Co-Pilot:** Context-aware AI assistant focused on the active architecture spec, offering failover strategies and latency optimizations.
- **Mermaid.js Exporter:** Export graphs to standard markdown diagrams with one click.
- **Spec Ingestion Engine:** Upload custom OpenAPI / Markdown specs to synthesize living architecture graphs on the fly.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack, React 19)
- **Styling:** Tailwind CSS v4, Lucide Icons
- **Visuals & Graphs:** `@xyflow/react` (React Flow)
- **Editor:** `@monaco-editor/react`
- **State Management:** Zustand
- **Package Manager:** pnpm

---

## 📚 Project Documentation

- 🏛️ [ARCHITECTURE.md](ARCHITECTURE.md) — Comprehensive technical architecture, topology, and subsystem specifications.
- 🛡️ [SECURITY.md](SECURITY.md) — Vulnerability disclosure policy, response SLAs, and client-side sandbox isolation.
- 🤝 [CONTRIBUTING.md](CONTRIBUTING.md) — Local development guidelines, branching strategy, and PR workflow.
- 📜 [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) — Contributor Covenant Code of Conduct.
- ⚖️ [LICENSE](LICENSE) — MIT License.

---

## 🏁 Quickstart

```bash
# 1. Clone the repository
git clone https://github.com/SWAGAT10241/documorph.git
cd documorph

# 2. Install dependencies
pnpm install

# 3. Start the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to experience DocuMorph.
