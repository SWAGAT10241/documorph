---
description: "Core engineering standards, architecture patterns, and AI code generation rules for DocuMorph"
globs: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.json"]
always_on: true
---

# DocuMorph Coding Standards & AI Pair-Programming Rules

Refer to the primary guidelines in [GEMINI.md](file:///Users/swagatsouravdhar/WEB%20DEVELOPMENT/documorph/GEMINI.md).

### Summary Checklist for Every Code Modification:
1. **Folder Structure**: Organize by feature domain (`src/features/<feature>/`) or primitive UI (`src/components/ui/`).
2. **Logic Separation**: Extract business and network logic into custom hooks and services; keep JSX view components declarative.
3. **Dead Code**: Remove all unused code, dead imports, and obsolete test scripts.
4. **Naming Conventions**: Strict `PascalCase` for components/types, `camelCase` for variables/functions/hooks, and `SCREAMING_SNAKE_CASE` for constants.
5. **Error Handling**: Wrap asynchronous I/O in structured `try...catch` blocks with typed error responses and UI fallbacks.
6. **Config Isolation**: Validate all environment variables with Zod schemas in `src/config/env.ts`. Zero hardcoded secrets.
7. **Modular Components**: Enforce SRP and avoid components larger than 250 lines.
8. **State Management**: Use Zustand with normalized states; avoid cascading `setState` calls in `useEffect`.
9. **Documentation**: Provide TSDoc comments for public APIs and maintain `ARCHITECTURE.md` and `AGENTS.md`.
10. **Scalable API**: Standardized JSON response envelope with HTTP status codes and versioned routing.
11. **Runtime Validation**: Validate all external inputs with Zod schemas.
12. **Quality Gate**: Execute `pnpm tsc --noEmit && pnpm lint && pnpm build` before finishing.
