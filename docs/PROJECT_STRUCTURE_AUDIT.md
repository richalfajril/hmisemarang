# Project Structure Audit

This document audits the newly generated `shadcn` monorepo structure against the agreed-upon technical stack and FSD architecture for the HMI Semarang CMS.

---

## 1. Current Folder Structure

The project was generated using `shadcn init --monorepo`, resulting in a Turborepo-based workspace:

```txt
hmisemarang/ (Nested duplicate root)
├── apps/
│   └── web/
│       ├── app/
│       ├── components/
│       ├── hooks/
│       └── lib/
└── packages/
    ├── ui/
    │   └── src/
    │       ├── components/
    │       └── lib/
    ├── eslint-config/
    └── typescript-config/
```

**Notable issues:** 
* The CLI command created a nested directory (`hmisemarang/hmisemarang`).
* The architecture splits UI components into a separate NPM package (`packages/ui`).

---

## 2. Architecture Alignment

Does the generated structure match our foundational documents?

* **TECH_STACK.md:** **YES.** It correctly uses Next.js, Tailwind, TypeScript, and shadcn/ui.
* **FSD_ARCHITECTURE.md:** **NO.** The structure defaults to standard React patterns (`components/`, `hooks/`, `lib/`) inside `apps/web`. It completely lacks the FSD `features/`, `entities/`, `widgets/`, and `shared/` directories.

---

## 3. Identification of Gaps & Conflicts

* **Unnecessary Folders:** 
  * The nested root (`hmisemarang/hmisemarang`).
  * `apps/` and `packages/` are unnecessary. The PRD and Sitemaps define a **single application** where Public and CMS routes live together in one Next.js app (`src/app/(public)` and `src/app/dashboard`). A monorepo is designed for multiple apps (e.g., a separate mobile app or a completely decoupled admin panel repo).
* **Missing Folders:** 
  * FSD layers: `widgets/`, `features/`, `entities/`, `shared/`, `pages/`.
* **Conflicts with FSD:**
  * In our `FSD_ARCHITECTURE.md`, `shadcn/ui` is supposed to live inside `src/shared/ui`. However, the monorepo preset forces UI components into a completely separate workspace package (`packages/ui`). While technically workable, this fragments the `shared` layer across different workspace packages, adding immense cognitive load for a small team.

---

## 4. Evaluation of Options

### Option A: Keep current monorepo structure
* **Impact:** You would have to map FSD inside `apps/web/src/`. You would also need to create a `packages/database` for Prisma to share types across the workspace, increasing tooling complexity.
* **Vercel Impact:** Vercel supports Turborepo natively, but requires configuring the Root Directory properly.

### Option B: Regenerate project
* **Impact:** Delete the nested `hmisemarang` folder and run `npx create-next-app` followed by a standard `npx shadcn-ui@latest init` (without the `--monorepo` flag). This takes 2 minutes and guarantees a clean slate.

### Option C: Restructure project
* **Impact:** Manually move `apps/web` to the root, delete `turbo.json`, merge `packages/ui` into `src/shared/ui`, and fix all path aliases in `tsconfig.json`. Very tedious and prone to alias breaking.

---

## 5. Final Verdict

**REGENERATE**

### Reasoning:
1. **Severe Overengineering:** A monorepo (Turborepo) is fantastic for large enterprise teams sharing code across 3+ different applications (Web, React Native, Background Workers). For HMI Semarang, Public and CMS are tightly coupled within the same Next.js routing system. The monorepo introduces a steep learning curve for workspace dependency management without providing actual value.
2. **Breaks FSD Philosophy:** FSD relies on a highly cohesive `src/` directory. Splitting `shared/ui` into a separate NPM package breaks the natural flow of FSD boundaries.
3. **The Double-Folder Bug:** The CLI accidentally nested the project (`hmisemarang/hmisemarang`), which will cause issues with Git roots and IDE configurations.

### Recommended Action Plan:
1. Delete the nested `hmisemarang/hmisemarang` folder.
2. Initialize a standard Next.js app in the current root.
3. Install Shadcn UI standard mode.
4. Manually create the FSD directories (`src/app`, `src/pages`, `src/widgets`, `src/features`, `src/entities`, `src/shared`).
