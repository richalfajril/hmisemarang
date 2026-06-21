# Engineering Foundation Review

This document evaluates the proposed infrastructure, deployment, and backend strategy for the HMI Semarang CMS project to ensure a robust foundation before entering the architecture and implementation phases.

---

## 1. Git Workflow

### Review of Proposed Strategy
The proposed dual-branch strategy (`production` and `development`) is highly effective and standard for a modern Next.js + Vercel application. It strikes the perfect balance between stability and agility for an MVP.

### Recommendations
* **Branching Strategy:** 
  * Adopt a simplified GitHub Flow.
  * Developers branch off from `development` using prefixes: `feat/*`, `fix/*`, `docs/*`, `refactor/*`.
  * Pull Requests (PRs) merge into `development`.
* **Release Workflow:**
  * When `development` is stable and ready for release, a PR is opened from `development` → `production`.
  * Merging to `production` automatically triggers the live Vercel deployment.
* **Rollback Workflow:**
  * **Code Rollback:** Use GitHub's "Revert PR" on the `production` branch.
  * **Instant Rollback:** Use the Vercel Dashboard to instantly "Promote" a previous successful deployment back to production while the code is being fixed.

---

## 2. Vercel Deployment Strategy

### Review of Proposed Strategy
Mapping the `production` branch to `hmisemarang.vercel.app` and `development` to `dev-hmisemarang.vercel.app` natively aligns with Vercel's preview deployment model.

### Recommendations
* **Project Structure:** Use a **single Vercel project**. Do not create separate Vercel projects for Dev and Prod. 
* **Domain Strategy:**
  * Assign the custom domain (or `hmisemarang.vercel.app`) as the Production Domain.
  * Assign `dev-hmisemarang.vercel.app` as a **Branch Domain** tied strictly to the `development` branch.
* **Environment Separation:**
  * Utilize Vercel's native environment variable scopes (`Production`, `Preview`, `Development`).
  * Ensure the `Preview` environment variables point to a dedicated Supabase Staging/Dev database, NOT the production database.
* **Deployment Workflow:**
  * Every PR against `development` gets an ephemeral preview URL.
  * Merges to `development` update the `dev-hmisemarang.vercel.app` domain.
  * Merges to `production` update the live domain.

---

## 3. Supabase Architecture

### Database Ownership & Prisma Integration
Since the stack utilizes **Prisma ORM** combined with Next.js Server Actions (as per `TECH_STACK.md`), the application backend acts as a trusted client.
* **Recommendation:** Use **Application-Level Authorization** rather than Supabase Row Level Security (RLS). Prisma will connect to Postgres via a connection pooler (Transaction pooling) using the direct database URL. Ownership rules (e.g., locking articles to `commissariat_id`) will be enforced inside the Next.js Server Actions.

### Auth Architecture
* Use **Supabase Auth** (Email/Password). 
* Since Prisma is used, user metadata (role, commissariat_id) must be kept in sync between Supabase Auth (`auth.users`) and the public `users` table defined in `DATABASE_SCHEMA.md`. A Supabase Database Trigger should be used to automatically insert a row into the `public.users` table upon signup/invite.

### Storage Architecture
Supabase Storage must be utilized for all media. 
**Recommended Buckets:**
1. `public-media` (Publicly accessible) - For Commissariat logos, Gallery photos, and Agenda flyers.
2. `public-documents` (Publicly accessible) - For PDF documents.
3. `secure-verifications` (Private) - For Excel files uploaded during Cadre Verification. Only accessible by authenticated Admins.

### Migration Workflow
* Use **Prisma Migrations** (`prisma migrate dev` locally, `prisma migrate deploy` in CI).
* Since Vercel builds the project, the `build` script in `package.json` should run `prisma generate && prisma migrate deploy && next build` to ensure the database schema matches the deployed code.

---

## 4. Missing Documentation

Before moving into the folder structures of `FSD_ARCHITECTURE.md`, the engineering baseline must be documented.

**Required:**
* `docs/SUPABASE_SETUP.md`: Must define the exact Database Triggers (for user sync), Storage Bucket configurations, and Prisma migration commands required to provision a fresh environment.
* `docs/ENVIRONMENT_VARIABLES.md`: Must list all required `.env` keys (e.g., `DATABASE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`) and their purposes so developers know what to inject into Vercel and local setups.

**Optional (Can be created later):**
* `docs/GIT_WORKFLOW.md`: Can be deferred to a `CONTRIBUTING.md` file later.
* `docs/DEPLOYMENT.md`: Vercel configuration is mostly automatic, but a short CI/CD guide can be written later if GitHub Actions are added.

---

## 5. Recommended Workflow

Based on the current state, the ideal progression to ensure no missing dependencies is:

1. `DATABASE_SCHEMA.md` (✅ Completed)
2. `SUPABASE_SETUP.md` (Define buckets, triggers, and DB provisioning steps)
3. `ENVIRONMENT_VARIABLES.md` (Define the secrets contract)
4. `API_SPECIFICATION.md` (Define Server Actions and data payloads)
5. `FSD_ARCHITECTURE.md` (Map the above into physical folders and components)

---

## 6. Final Verdict

Are we ready to create `FSD_ARCHITECTURE.md`?

**NO**

**Reasoning:**
Feature-Sliced Design (FSD) dictates exactly where configuration files, API clients, and environment variables live in the folder structure (e.g., inside the `shared/config` or `shared/api` layers). If we design the FSD architecture now without explicitly defining our Environment Variables and Supabase provisioning strategy, the architecture will lack the foundational "Shared" layer specifications.

**Action Required:**
Please instruct the creation of `docs/SUPABASE_SETUP.md` and `docs/ENVIRONMENT_VARIABLES.md` to solidify the DevOps baseline before we map out the folder architecture.
