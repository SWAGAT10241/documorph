# 🤝 Contributing to DocuMorph

Thank you for your interest in contributing to **DocuMorph**! Whether you are fixing bugs, improving documentation, designing new architecture templates, or enhancing the visual diagramming engine, we welcome your contributions.

---

## 🛠️ Local Development Setup

### Prerequisites
- **Node.js:** v20.x or v22.x (LTS recommended)
- **Package Manager:** `pnpm` (v11+)
- **Git:** Standard Git CLI

### Quickstart
```bash
# 1. Clone the repository
git clone https://github.com/SWAGAT10241/documorph.git
cd documorph

# 2. Install dependencies
pnpm install

# 3. Start local dev server
pnpm dev
```
Navigate to [http://localhost:3000](http://localhost:3000) to see your local instance.

---

## 🌿 Branching Strategy & Workflow

1. Fork the repo and create your branch from `main`:
   ```bash
   git checkout -b feat/your-feature-name
   # or
   git checkout -b fix/issue-description
   ```
2. Make your edits cleanly and verify code quality:
   ```bash
   # Run type checks
   pnpm tsc --noEmit

   # Run linter
   pnpm lint

   # Verify production build
   pnpm build
   ```
3. Commit your changes using **Conventional Commits**:
   - `feat: add Redis cluster node type to canvas`
   - `fix: resolve edge connection disconnect on template switch`
   - `docs: update OpenAPI ingestion guide`
4. Open a Pull Request referencing any open issue.

---

## 📋 Code Standards

- **Strict TypeScript:** Avoid `any` where possible. Extend `Record<string, unknown>` for React Flow node data to ensure canvas serialization.
- **Tailwind CSS:** Keep UI styling consistent with the dark-mode slate theme (`bg-slate-950`, `border-slate-800`, `text-slate-100`).
- **State Separation:** Handle global graph state through Zustand (`useDocuMorphStore.ts`) rather than deep prop-drilling.

---

## 📜 Code of Conduct
Please review and adhere to our [Code of Conduct](CODE_OF_CONDUCT.md) during all project interactions.
