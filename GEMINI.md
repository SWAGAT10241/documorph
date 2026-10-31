# AI Coding Assistant Rules & Engineering Guidelines
<!--
  PROJECT: DocuMorph (Multimodal Living Documentation & Interactive API Playground)
  PURPOSE: Strict guidelines and architectural standards for AI pair-programming agents.
  APPLIES TO: Antigravity, Gemini CLI, Cursor, GitHub Copilot, and subagents.
-->

You are an expert full-stack principal engineer and pair programmer. Whenever generating, refactoring, modifying, or reviewing code in this codebase, you MUST adhere strictly to the following engineering rules and architectural standards.

---

## 1. Project Organization & Feature-Driven Structure
Organize codebase logic by domain feature rather than loose technical layers.
- **Root Directory Layout**:
  - `src/app/` : App Router route segments, layouts, and page entrypoints ONLY (keep pages thin).
  - `src/features/` : Domain-specific business logic, UI, hooks, and services grouped together:
    - `src/features/<feature-name>/components/` : Feature-specific UI components.
    - `src/features/<feature-name>/hooks/` : Encapsulated business logic and lifecycle hooks.
    - `src/features/<feature-name>/services/` : API client calls and external integrations.
    - `src/features/<feature-name>/types/` : Feature-specific domain types and Zod schemas.
  - `src/components/ui/` : Primitive, domain-agnostic UI building blocks (buttons, modals, inputs, badges).
  - `src/store/` : Global reactive state stores (Zustand).
  - `src/lib/` : Shared utilities, configuration singletons, and helper functions.
  - `src/config/` : Type-safe environment variables and application constants.

---

## 2. Separation of Business Logic from UI Components
Never mix network calls, state mutations, heavy algorithmic calculations, or complex event handling directly inside JSX view components.
- **Rule of Thumb**: Components should render UI and dispatch events.
- Extract complex logic into dedicated custom hooks (`use<Feature>Logic.ts`).
- Route all data fetching and external service communication through service modules (`src/services/` or `src/features/<feature>/services/`).
- Presentational components must receive data and callbacks via typed props, making them pure and testable.

---

## 3. Dead Code & Duplicate Code Elimination
Maintain an austere, lean codebase.
- **Zero Dead Code**: Never leave commented-out blocks of code, unused imports, abandoned test routines, or obsolete utility functions.
- **DRY (Don't Repeat Yourself)**: If an algorithm, styling pattern, or data transformation is used more than twice, extract it into a reusable function or component under `src/lib/` or `src/components/ui/`.
- Run ESLint dead-code/unused-var rules before concluding changes.

---

## 4. Consistent Naming Conventions
Follow standard TypeScript and React naming rules uniformly:
- **Components & Types/Interfaces**: `PascalCase` (e.g., `ArchitectureCanvas.tsx`, `ServiceNodeData`).
- **Files & Directories**:
  - React Components: `PascalCase.tsx`
  - Hooks: `camelCase.ts` prefixed with `use` (e.g., `useMetricsStream.ts`).
  - Utilities/Services: `camelCase.ts` (e.g., `apiClient.ts`, `formatBytes.ts`).
- **Variables & Functions**: `camelCase` (e.g., `handleNodeConnect`, `activeServiceId`).
- **Constants & Enums**: `SCREAMING_SNAKE_CASE` (e.g., `MAX_RETRY_COUNT`, `DEFAULT_CANVAS_ZOOM`).
- **Boolean Variables**: Must begin with an auxiliary verb (e.g., `isOpen`, `isLoading`, `hasPermission`).

---

## 5. Robust Error Handling Everywhere
Never silently swallow errors or leave unhandled Promise rejections.
- Wrap asynchronous API and I/O operations in structured `try...catch` blocks.
- Map errors to standardized error objects containing `{ code, message, details }`.
- Provide user-friendly UI fallbacks (Error Boundaries, toast notifications, inline warning alerts).
- Log unexpected server-side/client errors with contextual metadata for debugging.

---

## 6. Strict Environment Configuration & Secrets Separation
Never hardcode API keys, service endpoints, credentials, or environment-dependent values in source files.
- Store secrets exclusively in `.env.local` (local) and deployment secret managers (production).
- Validate all environment variables at startup using **Zod** schema definitions in `src/config/env.ts`.
- Expose only explicitly prefixed variables (`NEXT_PUBLIC_*`) to client components; keep all server secrets strictly isolated.

---

## 7. Modular, Reusable Component Architecture
- Build components according to Single Responsibility Principle (SRP).
- Avoid monolithic components exceeding 250 lines; break them down into composable child components.
- Enforce strict typing on component `props` with TypeScript interfaces.
- Avoid prop drilling deeper than 2 levels; use Zustand stores or React Context where appropriate.

---

## 8. Predictable State Management
- Use **Zustand** for global, cross-component state (architecture canvas state, active documentation, user preferences).
- Keep state normalized: store entities by ID to prevent sync bugs and redundant re-renders.
- Derive computed values using selectors (`useDocuMorphStore((state) => state.selectedNode)`).
- Never trigger synchronous state updates (`setState`) directly inside `useEffect` bodies to avoid cascading render cycles in React 19.

---

## 9. Codebase Documentation & Self-Explaining Code
- Write self-documenting code with meaningful identifiers rather than cryptic abbreviations.
- Document all public exports, custom hooks, and utility functions using **TSDoc / JSDoc** comments.
- Keep `ARCHITECTURE.md` and `AGENTS.md` updated when introducing new modules or changing state models.
- Include Mermaid diagrams for non-trivial state machines or asynchronous event workflows.

---

## 10. Scalable API Structure & Routing
- Place Next.js Route Handlers under `src/app/api/<version>/<resource>/route.ts`.
- Standardize API JSON response formats:
  ```ts
  type ApiResponse<T> =
    | { success: true; data: T; timestamp: string }
    | { success: false; error: { code: string; message: string }; timestamp: string };
  ```
- Use standard HTTP status codes (`200 OK`, `201 Created`, `400 Bad Request`, `401 Unauthorized`, `404 Not Found`, `500 Internal Server Error`).

---

## 11. Runtime Schema Validation with Zod
- Enforce Zod schema validation on:
  1. All incoming request bodies and query parameters in API route handlers.
  2. All external payloads received from third-party APIs or simulated microservices.
  3. User input forms and file imports (e.g., OpenAPI / Swagger / Markdown imports).
- Use `z.infer<typeof Schema>` to keep TypeScript types directly synchronized with runtime schemas.

---

## 12. React 19 & Next.js App Router Invariants
- **Client vs Server Boundary**: Default to Server Components; add `'use client'` strictly when using React hooks, browser APIs, or interactive event listeners.
- **Dynamic Imports**: Use `next/dynamic` with `ssr: false` for heavy client-only packages (e.g., `@monaco-editor/react`, `@xyflow/react`).
- **Build Engine**: Next.js builds run with Webpack (`next build --webpack`) to ensure 100% compatibility with client-side CSS loaders and AST parsers.

---

## 13. Quality Gates & Verification Checklist
Before declaring any task or ticket complete, the AI agent MUST execute and verify:
1. `pnpm tsc --noEmit` — Type-check succeeds with **0 errors**.
2. `pnpm lint` — ESLint passes with **0 warnings and 0 errors**.
3. `pnpm build` — Production build completes cleanly without asset or page generation panics.
