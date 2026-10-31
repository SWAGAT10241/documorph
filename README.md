# 📘 DocuMorph: Multimodal Living Documentation & Interactive API Playground

> **Built for Global Hack Week: Builders Week (MLH, Nov 6–12)**  
> *Transform static technical documentation, architecture specs, and API manuals into interactive, runnable system diagrams and live sandboxes.*

---

## 🌟 Why DocuMorph?

Technical specifications and architecture PDFs are typically passive, dense, and disconnected from runtime reality:
1. **Developers scan without grasping architecture:** Complex data flows and event backbones get buried in paragraphs of text.
2. **Disconnected testing:** Developers copy-paste cURL commands or endpoints back and forth into external tools (Postman, terminal).
3. **Static diagrams:** Architecture figures in markdown are dead pixels—you cannot click a microservice node to see its schema or live endpoint status.

**DocuMorph** bridges documentation and runtime execution into a single unified workspace.

---

## 🚀 Key Features

- **Living Architecture Canvas:** Powered by `@xyflow/react` (React Flow), rendering custom microservice nodes with real-time health indicators, latency metrics, and SLA badges.
- **Interactive Node Inspector:** Click any service node to view its technical stack, upstream/downstream dependencies, and exposed API endpoints.
- **In-Browser Living API Sandbox:** Built-in payload editor with Monaco Editor support and instant simulated packet traversal across the architecture graph.
- **Real-Time Trace Stream:** Visual event log tracking packet movements, latency benchmarks, and status codes across microservices.
- **Multimodal Technical Co-Pilot:** Context-aware AI assistant focused on the active architecture spec, offering failover strategies and latency optimizations.
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

## 🏁 Quickstart

```bash
# 1. Clone or navigate to the project directory
cd /Users/swagatsouravdhar/.gemini/antigravity/scratch/documorph

# 2. Install dependencies (if not already installed)
pnpm install

# 3. Start the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to experience DocuMorph.
