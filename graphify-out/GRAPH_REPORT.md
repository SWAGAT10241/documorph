# Graph Report - documorph  (2026-10-31)

## Corpus Check
- 29 files · ~11,454 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 2, .ico 1, .css 1)

## Summary
- 226 nodes · 343 edges · 15 communities (12 shown, 3 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8f0abdd7`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- package.json
- Contributor Covenant Code of Conduct
- useDocuMorphStore
- useDocuMorphStore.ts
- steps
- with
- compilerOptions
- 3. Core Subsystems
- next
- on
- PULL_REQUEST_TEMPLATE.md
- allowBuilds
- AGENTS.md

## God Nodes (most connected - your core abstractions)
1. `useDocuMorphStore` - 22 edges
2. `compilerOptions` - 16 edges
3. `react` - 11 edges
4. `lucide-react` - 10 edges
5. `Home()` - 9 edges
6. `DocuMorphStore` - 8 edges
7. `with` - 7 edges
8. `steps` - 6 edges
9. `next` - 6 edges
10. `ApiEndpoint` - 6 edges

## Surprising Connections (you probably didn't know these)
- `A. Dynamic Canvas Engine (`src/components/canvas/`)` --references--> `ServiceNode()`  [INFERRED]
  ARCHITECTURE.md → src/components/canvas/ServiceNode.tsx
- `ServiceNode()` --calls--> `useDocuMorphStore`  [EXTRACTED]
  src/components/canvas/ServiceNode.tsx → src/store/useDocuMorphStore.ts
- `NodeContentProps` --references--> `ServiceNodeData`  [EXTRACTED]
  src/components/inspector/NodeInspector.tsx → src/types/documorph.ts
- `SandboxProps` --references--> `ApiEndpoint`  [EXTRACTED]
  src/components/playground/ApiPlayground.tsx → src/types/documorph.ts
- `Home()` --calls--> `ArchitectureCanvas()`  [EXTRACTED]
  src/app/page.tsx → src/components/canvas/ArchitectureCanvas.tsx

## Import Cycles
- None detected.

## Communities (15 total, 3 thin omitted)

### Community 0 - "package.json"
Cohesion: 0.06
Nodes (40): eslintConfig, dependencies, clsx@^2.1.1, lucide-react@^1.64.0, @monaco-editor/react@^4.7.0, react@19.3.0, react-dom@19.3.0, tailwind-merge@^3.7.0 (+32 more)

### Community 1 - "Contributor Covenant Code of Conduct"
Cohesion: 0.08
Nodes (23): Contributor Covenant Code of Conduct, Enforcement & Reporting, Enforcement Responsibilities, Our Pledge, Our Standards, Scope, 🌿 Branching Strategy & Workflow, 📜 Code of Conduct (+15 more)

### Community 2 - "useDocuMorphStore"
Cohesion: 0.22
Nodes (18): lucide-react, @monaco-editor/react, react, Home(), ArchitectureCanvas(), ChatMessage, MultimodalCopilot(), DocEditor() (+10 more)

### Community 3 - "useDocuMorphStore.ts"
Cohesion: 0.16
Nodes (21): @xyflow/react, nodeTypes, ServiceNode(), TYPE_BADGE_COLORS, TYPE_ICONS, NodeContentProps, SandboxProps, SHOWCASE_TEMPLATES (+13 more)

### Community 4 - "steps"
Cohesion: 0.08
Nodes (23): name, runs-on, steps, strategy, NEXT_TELEMETRY_DISABLED, jobs, build-and-test, node-version (+15 more)

### Community 5 - "with"
Cohesion: 0.09
Nodes (23): name, runs-on, steps, name, permissions, runs-on, steps, jobs (+15 more)

### Community 6 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 7 - "3. Core Subsystems"
Cohesion: 0.22
Nodes (8): 1. System Philosophy & Objectives, 2. High-Level Topology, 3. Core Subsystems, A. Dynamic Canvas Engine (`src/components/canvas/`), B. Living API Sandbox (`src/components/playground/`), C. Grafana-Style Observability Engine (`src/components/observability/`), D. AI Architecture Generator & Mermaid Serializer, 🏛️ DocuMorph Technical Architecture Specification

### Community 8 - "next"
Cohesion: 0.25
Nodes (4): nextConfig, next@16.4.3, next, metadata

### Community 9 - "on"
Cohesion: 0.29
Nodes (7): on, pull_request, push, schedule, branches, branches, cron

### Community 10 - "PULL_REQUEST_TEMPLATE.md"
Cohesion: 0.33
Nodes (5): 📌 Description, 📸 Screenshots / Demos (if applicable), 🛡️ Security & Privacy Checklist, 🧪 Testing Performed, 🔍 Type of Change

### Community 11 - "allowBuilds"
Cohesion: 0.50
Nodes (3): allowBuilds, sharp, unrs-resolver

## Knowledge Gaps
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `ServiceNode()` connect `useDocuMorphStore.ts` to `useDocuMorphStore`, `3. Core Subsystems`?**
  _High betweenness centrality (0.144) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.0627177700348432 - nodes in this community are weakly interconnected._
- **Why does `A. Dynamic Canvas Engine (`src/components/canvas/`)` connect `3. Core Subsystems` to `useDocuMorphStore.ts`?**
  _High betweenness centrality (0.142) - this node is a cross-community bridge._
- **Should `Contributor Covenant Code of Conduct` be split into smaller, more focused modules?**
  _Cohesion score 0.07692307692307693 - nodes in this community are weakly interconnected._
- **Should `steps` be split into smaller, more focused modules?**
  _Cohesion score 0.08333333333333333 - nodes in this community are weakly interconnected._
- **Should `with` be split into smaller, more focused modules?**
  _Cohesion score 0.09420289855072464 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._