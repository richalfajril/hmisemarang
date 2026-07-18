# Graph Report - hmisemarang  (2026-07-18)

## Corpus Check
- 349 files · ~139,348 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1493 nodes · 3773 edges · 127 communities (75 shown, 52 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 67 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ad03e66f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Cabang Dashboard Sections
- Public Listing Pages
- UI Primitives (cn/Drawer)
- Project Governance & Stack Concepts
- Dev Dependencies & Tooling
- Sidebar & Navigation Shell
- CMS Create/Edit Pages
- SEO & Public Detail Pages
- Architecture Decision Records
- CMS Admin Settings Pages
- Agenda/Article Schemas & Actions
- Public Article Queries
- Homepage Sections
- Route Handlers & CMS Pages
- TypeScript Config
- Commissariat Account Management
- Global Search & Command Palette
- Organization Actions
- shadcn components.json Config
- Chart Components
- Review & Document Schemas
- Public Agenda Grid & Status
- Public Landing & Search Box
- Website Layout & Hero
- Homepage Carousels
- About/Gallery Sections
- Login & Auth Form
- Design System Concepts
- Gallery Album Schema & Actions
- Review Queue & Taxonomy Tabs
- Sheet & Public Header
- shadcn MCP Concepts
- API Spec & DB Tables
- Editors & SEO Infrastructure
- Deployment & Environment
- Period Detail & Board
- Error/Empty States & Search
- Supabase Client & Avatar
- Media Cleanup
- Styling & Theming Concepts
- Core Runtime Dependencies
- Dashboard Layout & Header
- Review Schema & Split Screen
- Board Member Card & Socials
- shadcn CLI Concepts
- Article Editor Concepts
- Server Actions Architecture
- Roles & Permissions Concepts
- Taxonomy Import Actions
- Profile & Settings Schemas
- Excel Import Helpers
- Root Layout & Providers
- NotificationBell.tsx
- InputGroup Component
- Database Schema Concepts
- Cadre Verification & Storage
- Testimonial & Gallery Concepts
- Floating Menu & Media Upload
- shadcn Registry Concepts
- Supabase Session Proxy
- Homepage Stats
- Component Composition Concepts
- Cloudinary Migration Concepts
- State Management Concepts
- Organization Hierarchy Concepts
- Prisma Seed
- Next.js Default Icons
- notification-service.ts
- shadcn Logos
- FigureVideo.tsx
- cloudinary
- clsx
- cmdk
- date-fns
- @dnd-kit/core
- @dnd-kit/modifiers
- @dnd-kit/sortable
- @dnd-kit/utilities
- Single App Decision
- FSD Decision
- Website Settings Concepts
- Featured Articles Section
- Public Smoke Test
- eslint.config.mjs
- @google/model-viewer
- lucide-react
- next
- next.config.ts
- radix-ui
- react-dom
- react-icons
- recharts
- shadcn
- sonner
- @supabase/ssr
- @supabase/supabase-js
- @tanstack/react-table
- @tiptap/extension-image
- @tiptap/extension-link
- @tiptap/extension-placeholder
- @tiptap/extension-youtube
- @tiptap/pm
- @tiptap/react
- @tiptap/starter-kit
- tw-animate-css
- vaul
- @vercel/analytics
- @vercel/speed-insights
- zustand
- postcss.config.mjs
- Site Favicon
- Next/Vercel Logos
- Vercel Cron Config
- Documents Table
- Gallery Albums Table
- Project README
- class-variance-authority

## God Nodes (most connected - your core abstractions)
1. `cn()` - 212 edges
2. `getUserSession()` - 78 edges
3. `Button()` - 67 edges
4. `createClient()` - 48 edges
5. `logAuditAction()` - 30 edges
6. `initialActionState` - 29 edges
7. `Input()` - 27 edges
8. `PageHeader()` - 27 edges
9. `useClientPagination()` - 25 edges
10. `Label()` - 25 edges

## Surprising Connections (you probably didn't know these)
- `MediumEditor Component` --semantically_similar_to--> `Configured iconLibrary`  [INFERRED] [semantically similar]
  docs/superpowers/plans/2026-07-12-medium-style-article-editor.md → .agents/skills/shadcn/rules/icons.md
- `GlobalSearch()` --references--> `react`  [EXTRACTED]
  src/features/search/ui/GlobalSearch.tsx → package.json
- `ChartContainer()` --references--> `react`  [EXTRACTED]
  src/shared/ui/Chart.tsx → package.json
- `ChartTooltipContent()` --references--> `react`  [EXTRACTED]
  src/shared/ui/Chart.tsx → package.json
- `useChart()` --references--> `react`  [EXTRACTED]
  src/shared/ui/Chart.tsx → package.json

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **shadcn Critical Rule Files** — _agents_skills_shadcn_rules_styling_styling_rules, _agents_skills_shadcn_rules_forms_forms_inputs, _agents_skills_shadcn_rules_composition_component_composition, _agents_skills_shadcn_rules_icons_icons_rules, _agents_skills_shadcn_rules_base_vs_radix_base_vs_radix [EXTRACTED 1.00]
- **Polymorphic Content Review Workflow** — docs_features_discovery_content_review, docs_database_schema_review_histories_table, docs_database_schema_articles_table, docs_database_schema_agendas_table, docs_database_schema_commissariat_profile_submissions_table [EXTRACTED 1.00]
- **RBAC Application-Level Authorization Model** — docs_role_permission_matrix_system_admin, docs_role_permission_matrix_admin_cabang, docs_role_permission_matrix_admin_komisariat, docs_role_permission_matrix_app_level_authz, docs_supabase_setup_trusted_client [EXTRACTED 1.00]
- **Core Tech Stack (Next.js + Prisma + Supabase + Cloudinary)** — docs_tech_stack_nextjs, docs_tech_stack_prisma, docs_tech_stack_supabase, docs_tech_stack_cloudinary [EXTRACTED 1.00]
- **Polymorphic Content Review Architecture** — docs_decisions_004_polymorphic_content_review_polymorphic_content_review, docs_decisions_004_polymorphic_content_review_review_histories_table, docs_decisions_003_database_readiness_review_history, docs_decisions_007_dual_entity_commissariat_profile_dual_entity_commissariat_profile [INFERRED 0.85]
- **Server Actions Security & Authorization Stack** — docs_decisions_003_server_actions_for_mutations_server_actions_for_mutations, docs_decisions_006_application_level_authorization_application_level_authorization, docs_decisions_003_server_actions_for_mutations_zod_validation [INFERRED 0.85]
- **Polymorphic Content Review across Article, Agenda, Profile, Cadre** — docs_features_content_review_content_review_workflow, docs_features_article_article_management, docs_features_agenda_agenda_management, docs_features_commissariat_commissariat_profile, docs_features_cadre_verification_cadre_verification [EXTRACTED 0.90]
- **Review triggers Notification and Audit Log** — docs_features_content_review_content_review_workflow, docs_features_notifications_notification_management, docs_features_audit_log_audit_log_viewer [EXTRACTED 0.85]
- **Global Search aggregates multiple content entities** — docs_features_search_global_search, docs_features_article_article_management, docs_features_document_document_management, docs_features_commissariat_commissariat_profile [EXTRACTED 0.85]
- **Homepage Section User Flow** — docs_public_website_homepage_opening_screen_opening_screen_section, docs_public_website_homepage_hero_hero_section, docs_public_website_homepage_about_about_section, docs_public_website_homepage_featured_articel_featured_articles_section, docs_public_website_homepage_agendas_carousel_upcoming_agenda_section, docs_public_website_homepage_gallery_section_gallery_preview_section, docs_public_website_homepage_cta_section_cta_banner_section, docs_public_website_homepage_kata_mereka_section_testimonials_section [EXTRACTED 1.00]
- **Medium Editor Menu System** — docs_superpowers_plans_2026_07_12_medium_style_article_editor_medium_editor_component, docs_superpowers_plans_2026_07_12_medium_style_article_editor_bubble_menu, docs_superpowers_plans_2026_07_12_medium_style_article_editor_floating_menu, docs_superpowers_plans_2026_07_12_medium_style_article_editor_insert_items [EXTRACTED 1.00]
- **Medium Editor Image Insert Flow** — docs_superpowers_plans_2026_07_12_medium_style_article_editor_image_upload_cloudinary, docs_superpowers_specs_2026_07_12_medium_style_article_editor_design_compress_image, docs_superpowers_specs_2026_07_12_medium_style_article_editor_design_upload_media_action [EXTRACTED 1.00]

## Communities (127 total, 52 thin omitted)

### Community 0 - "Cabang Dashboard Sections"
Cohesion: 0.06
Nodes (81): AgendaFormProps, FIELD_LABELS, ArticleFormProps, FIELD_LABELS, Account, ImportResult, ProfileFormProps, DocumentFormProps (+73 more)

### Community 1 - "Public Listing Pages"
Cohesion: 0.06
Nodes (82): AgendaListProps, statusColorMap, ArticleListProps, ArticleWithRelations, statusColorMap, CadreVerificationData, CadreVerificationTable(), AccountData (+74 more)

### Community 2 - "UI Primitives (cn/Drawer)"
Cohesion: 0.06
Nodes (39): cn(), Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount(), AvatarImage(), DialogOverlay() (+31 more)

### Community 3 - "Project Governance & Stack Concepts"
Cohesion: 0.05
Nodes (48): Agent Workflow & Planning Mode, AGENTS.md Routing Guide, Documentation as Single Source of Truth, Graphify Knowledge Graph Workflow, CLAUDE.md Project Instructions, Cloudinary Media Storage, Prisma ORM, ADMIN_CABANG Role (+40 more)

### Community 4 - "Dev Dependencies & Tooling"
Cohesion: 0.04
Nodes (45): dotenv, eslint, eslint-config-next, browserslist, devDependencies, dotenv, eslint, eslint-config-next (+37 more)

### Community 5 - "Sidebar & Navigation Shell"
Cohesion: 0.23
Nodes (9): react, react, useIsMobile(), SidebarProvider(), Toggle(), toggleVariants, ToggleGroup(), ToggleGroupContext (+1 more)

### Community 6 - "CMS Create/Edit Pages"
Cohesion: 0.18
Nodes (9): EditAgendaPage(), CreateArticlePage(), EditArticlePage(), AgendaForm(), formatDatetimeForInput(), ArticleForm(), toLocalInput(), RevisionNotes() (+1 more)

### Community 7 - "SEO & Public Detail Pages"
Cohesion: 0.18
Nodes (17): dateFmt, generateMetadata(), getCommissariat(), Page(), FALLBACK, metadata, ReadingProgressBar(), ShareButtons() (+9 more)

### Community 8 - "Architecture Decision Records"
Cohesion: 0.05
Nodes (37): Approval Metadata, Authentication & Product Refinements (ADR 001), No Member Accounts Decision, Public Documents Module, Rejected Content Resubmission, Revision Notes Requirement, Document Module (ADR 002), Document Draft Workflow (+29 more)

### Community 9 - "CMS Admin Settings Pages"
Cohesion: 0.19
Nodes (11): AuditLogsPage(), ChangePasswordPage(), MediaCleanupPage(), PeriodsPage(), SettingsPage(), UsersPage(), changePasswordAction(), logoutAction() (+3 more)

### Community 10 - "Agenda/Article Schemas & Actions"
Cohesion: 0.11
Nodes (24): AgendaFormValues, agendaSchema, ArticleFormValues, articleSchema, ProfileSubmissionFormValues, profileSubmissionSchema, bulkArchiveAgendasAction(), generateSlug() (+16 more)

### Community 11 - "Public Article Queries"
Cohesion: 0.12
Nodes (25): metadata, Page(), generateMetadata(), Page(), ARTICLE_FALLBACK, firstParagraph(), getAllPublicArticles, getArticleBySlug (+17 more)

### Community 12 - "Homepage Sections"
Cohesion: 0.13
Nodes (17): getFeaturedArticles, dateFmt, FeaturedCarousel(), FeaturedItem, formatMeta(), Article, dateFmt, FALLBACK (+9 more)

### Community 13 - "Route Handlers & CMS Pages"
Cohesion: 0.13
Nodes (15): metadata, DocumentsPage(), metadata, metadata, metadata, TaxonomyPage(), metadata, UniversitiesPage() (+7 more)

### Community 14 - "TypeScript Config"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 15 - "Commissariat Account Management"
Cohesion: 0.24
Nodes (13): xlsx, authorize(), createCommissariatAccountAction(), deleteCommissariatAccountAction(), ensureCommissariat(), importCommissariatAccountsAction(), ImportResult, pick() (+5 more)

### Community 16 - "Global Search & Command Palette"
Cohesion: 0.11
Nodes (24): globalSearchAction(), SearchResult, GlobalSearch(), useDebounce(), ComboboxOption, ComboboxProps, Command(), CommandDialog() (+16 more)

### Community 17 - "Organization Actions"
Cohesion: 0.06
Nodes (54): metadata, PeriodDetailPage(), toSocialLinks(), getAllPeriods(), getOrganizationByPeriod(), GROUP_TITLES, metadata, Page() (+46 more)

### Community 18 - "shadcn components.json Config"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 19 - "Chart Components"
Cohesion: 0.17
Nodes (13): ChartConfig, ChartContainer(), ChartContext, ChartContextProps, ChartLegendContent(), ChartTooltipContent(), getPayloadConfigFromPayload(), INITIAL_DIMENSION (+5 more)

### Community 20 - "Review & Document Schemas"
Cohesion: 0.16
Nodes (15): ReviewDetailPage(), ACCEPTED_FILE_TYPES, cadreVerificationSchema, ACCEPTED_FILE_TYPES, DocumentFormValues, documentSchema, uploadCadreFileAction(), ReviewSplitScreen() (+7 more)

### Community 21 - "Public Agenda Grid & Status"
Cohesion: 0.25
Nodes (17): generateMetadata(), Page(), timeFmt, AgendaGridCard(), AgendaStatus, now, dayFmt, formatAgendaDate() (+9 more)

### Community 22 - "Public Landing & Search Box"
Cohesion: 0.13
Nodes (20): metadata, Page(), metadata, Page(), metadata, Page(), AgendaGrid(), FadeIn() (+12 more)

### Community 23 - "Website Layout & Hero"
Cohesion: 0.07
Nodes (25): bricolage, geistMono, metadata, RootLayout(), rubik, viewport, STATIC_PATHS, Page() (+17 more)

### Community 24 - "Homepage Carousels"
Cohesion: 0.11
Nodes (21): PopularCarousel(), containerVariants, GalleryBento(), GalleryPhoto, itemVariants, SPANS, getOptimizedUrl(), useHorizontalWheel() (+13 more)

### Community 25 - "About/Gallery Sections"
Cohesion: 0.32
Nodes (6): getPublicDocuments(), metadata, Page(), DocumentSearchBox(), PublicDocument, PublicDocumentTable()

### Community 26 - "Login & Auth Form"
Cohesion: 0.14
Nodes (17): getDashboardLogo(), LoginPage(), metadata, loginAction(), LoginForm(), Field(), FieldContent(), FieldDescription() (+9 more)

### Community 27 - "Design System Concepts"
Cohesion: 0.14
Nodes (16): Audit Log withAuditLog Wrapper, Zod Validation Strategy, Public Website Data States Standard, audit_logs table, Design System & UI/UX Guidelines, OKLCH Color System (HMI Green), Strict Media Aspect Ratios, Public Website Data States (Section 16) (+8 more)

### Community 28 - "Gallery Album Schema & Actions"
Cohesion: 0.10
Nodes (27): CreateAgendaPage(), AgendasPage(), ArticlesPage(), EditDocumentPage(), NewDocumentPage(), EditAlbumPage(), AlbumDetailsPage(), NewAlbumPage() (+19 more)

### Community 29 - "Review Queue & Taxonomy Tabs"
Cohesion: 0.09
Nodes (34): CadreVerificationPage(), CabangLeaderboardData(), CabangStatsSection(), CommissariatDashboardSection(), DashboardOverview(), metadata, VerificationForm(), VerificationFormProps (+26 more)

### Community 30 - "Sheet & Public Header"
Cohesion: 0.19
Nodes (11): Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay(), SheetTitle(), SheetTrigger() (+3 more)

### Community 31 - "shadcn MCP Concepts"
Cohesion: 0.16
Nodes (14): shadcn OpenAI Agent Interface, get_audit_checklist Tool, shadcn MCP Server, search_items_in_registries Tool, asChild vs render Composition, Base vs Radix Rules, Field Validation States, FieldGroup + Field Layout (+6 more)

### Community 32 - "API Spec & DB Tables"
Cohesion: 0.20
Nodes (14): ActionState Return Type, Agenda APIs, Article APIs, Commissariat Profile Review APIs, agendas table, articles table, commissariat_profile_submissions table, commissariats table (+6 more)

### Community 33 - "Editors & SEO Infrastructure"
Cohesion: 0.22
Nodes (13): AGENTS.md Single Source of Truth, CMS HMI Cabang Semarang Project, Project Changelog, MediumEditor (Medium-style Article Editor), SEO Infrastructure (sitemap, robots, OpenGraph, JSON-LD), TiptapEditor (Agenda Editor), Project Roadmap, Tech Stack (+5 more)

### Community 34 - "Deployment & Environment"
Cohesion: 0.18
Nodes (13): Deployment Strategy, Vercel Hosting & CI/CD, Environment Variables, Cloudinary Keys, DATABASE_URL / DIRECT_URL (Prisma), Supabase Keys (URL/Anon/Service Role), Zustand + TanStack Query Division, Git Workflow (+5 more)

### Community 35 - "Period Detail & Board"
Cohesion: 0.28
Nodes (10): metadata, metadata, Pagination(), PaginationContent(), PaginationEllipsis(), PaginationItem(), PaginationLink(), PaginationLinkProps (+2 more)

### Community 36 - "Error/Empty States & Search"
Cohesion: 0.24
Nodes (6): ForbiddenPage(), NotFoundPage(), metadata, buttonVariants, EmptyState(), EmptyStateProps

### Community 37 - "Supabase Client & Avatar"
Cohesion: 0.10
Nodes (20): metadata, MISI, VALUES, AnimatedSection(), Props, Props, Section(), BaseProps (+12 more)

### Community 38 - "Media Cleanup"
Cohesion: 0.35
Nodes (8): metadata, extractPublicId(), OrphanReport, publicIdsFromHtml(), scanOrphanMediaAction(), fmtBytes(), MediaCleanupPanel(), listCloudinaryImages()

### Community 39 - "Styling & Theming Concepts"
Cohesion: 0.22
Nodes (11): CSS Variable Tokens, Adding Custom Colors, Customization & Theming, Dark Mode (next-themes), OKLCH Color Format, className for Layout Only, cn() Utility, gap-* over space-* (+3 more)

### Community 40 - "Core Runtime Dependencies"
Cohesion: 0.18
Nodes (11): @base-ui/react, class-variance-authority, dependencies, @base-ui/react, class-variance-authority, tailwind-merge, @tanstack/react-query, zod (+3 more)

### Community 41 - "Dashboard Layout & Header"
Cohesion: 0.20
Nodes (10): EditTestimonialPage(), NewTestimonialPage(), TestimonialFormValues, testimonialSchema, canManage(), deleteTestimonialAction(), saveTestimonialAction(), togglePublishTestimonialAction() (+2 more)

### Community 42 - "Review Schema & Split Screen"
Cohesion: 0.25
Nodes (7): ReviewActionEnum, ReviewActionEnumSchema, ReviewEntityType, ReviewEntityTypeSchema, ReviewFormValues, reviewSchema, ReviewSplitScreenProps

### Community 43 - "Board Member Card & Socials"
Cohesion: 0.24
Nodes (7): createUserSchema, forceResetSchema, createUserAction(), CreateUserModal(), supabaseAdmin, envSchema, parsedEnv

### Community 44 - "shadcn CLI Concepts"
Cohesion: 0.20
Nodes (10): add Command, apply Command, build Command, docs Command, Dry-Run Mode, info Command, init Command, Preset (+2 more)

### Community 45 - "Article Editor Concepts"
Cohesion: 0.27
Nodes (10): data-icon Attribute, Configured iconLibrary, Icons Rules, BubbleMenu (Text Selection), MediumEditor Component, Medium-Style Article Editor Plan, Tiptap Extensions (Image/Youtube/Table), ArticleForm (+2 more)

### Community 46 - "Server Actions Architecture"
Cohesion: 0.20
Nodes (10): App Shell Loading Pattern, Server Actions First Architecture, board_members table, Manual Prisma Migration Policy, Prisma Client Singleton (shared/api), Server Actions Placement Strategy, Application-Level Authorization, Trusted Client Architecture (No RLS) (+2 more)

### Community 47 - "Roles & Permissions Concepts"
Cohesion: 0.20
Nodes (10): Ownership Rules (commissariat_id scoping), Documentation Rules (SSOT), Documentation-Driven Development, Product Requirements Document, MVP Scope, Role Permission Matrix (RBAC), ADMIN_CABANG Role, ADMIN_KOMISARIAT Role (Scoped Access) (+2 more)

### Community 48 - "Taxonomy Import Actions"
Cohesion: 0.28
Nodes (8): createTaxonomyAction(), importUniversitiesAction(), taxonomySchema, UniversityImportResult, updateTaxonomyAction(), CreateTaxonomyModal(), ImportUniversitiesModal(), slugify()

### Community 49 - "Profile & Settings Schemas"
Cohesion: 0.50
Nodes (3): updateSettingsAction(), websiteSettingsSchema, SettingsForm()

### Community 51 - "Root Layout & Providers"
Cohesion: 0.32
Nodes (6): DashboardLayout(), SidebarInset(), AppSidebar(), getPageTitle(), PAGE_TITLES, SiteHeader()

### Community 52 - "NotificationBell.tsx"
Cohesion: 0.57
Nodes (5): NotificationsPage(), getUnreadNotificationsAction(), markAllAsReadAction(), markAsReadAction(), NotificationBell()

### Community 53 - "InputGroup Component"
Cohesion: 0.40
Nodes (4): CommissariatAccountsPage(), metadata, CreateAccountModal(), ImportAccountsModal()

### Community 54 - "Database Schema Concepts"
Cohesion: 0.29
Nodes (8): Database Schema, users table, Features Discovery Mapping, content-review Feature (polymorphic), DRY Centralized Review Rationale, CMS Sitemap, Review Center Route, User Synchronization DB Trigger

### Community 55 - "Cadre Verification & Storage"
Cohesion: 0.29
Nodes (7): Cadre Verification APIs, Storage APIs uploadFileToStorage, compressImageToWebp Client Optimizer, Orphan Media Cleanup Scanner, cadre_verifications table, Cadre Verification Workflow, Cloudinary Media Storage

### Community 56 - "Testimonial & Gallery Concepts"
Cohesion: 0.33
Nodes (7): Homepage Call To Action Banner (Section 07), CircularGallery Component, Presentational Component Contract, Homepage Gallery Preview Section (Section 07), TestimonialCarousel Component, Testimonial Entity, Homepage Kata Mereka Testimonials (Section 08)

### Community 57 - "Floating Menu & Media Upload"
Cohesion: 0.33
Nodes (6): FloatingMenu (Plus Button), Inline Image Upload via Cloudinary, insertItems Data-Driven Array, YouTube URL Parser (Conditional), compressImageToWebp, uploadMediaAction

### Community 58 - "shadcn Registry Concepts"
Cohesion: 0.50
Nodes (5): GitHub Registry, Registry Authoring, Registry Dependencies, registry.json, Source Registry

### Community 59 - "Supabase Session Proxy"
Cohesion: 0.60
Nodes (3): config, proxy(), updateSession()

### Community 60 - "Homepage Stats"
Cohesion: 0.67
Nodes (3): formatNumber(), HomeStats(), Props

### Community 61 - "Component Composition Concepts"
Cohesion: 0.67
Nodes (3): Component Composition Rules, Items Inside Group Component, Overlay Title Required

### Community 62 - "Cloudinary Migration Concepts"
Cohesion: 1.00
Nodes (3): Cloudinary, Cloudinary Media Storage Migration (ADR 004), Supabase Storage (replaced)

### Community 63 - "State Management Concepts"
Cohesion: 0.67
Nodes (3): State Management Division: Zustand vs TanStack Query (ADR 008), TanStack Query (Server Data State), Zustand (Client UI State)

### Community 64 - "Organization Hierarchy Concepts"
Cohesion: 0.67
Nodes (3): Board Member Excel Import, Organization Management, Periods-Positions-BoardMembers Hierarchy

### Community 66 - "Next.js Default Icons"
Cohesion: 0.67
Nodes (3): File Icon, Globe Icon, Window Icon

## Knowledge Gaps
- **393 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+388 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **52 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `UI Primitives (cn/Drawer)` to `Cabang Dashboard Sections`, `Public Listing Pages`, `Sidebar & Navigation Shell`, `SEO & Public Detail Pages`, `Route Handlers & CMS Pages`, `Global Search & Command Palette`, `Chart Components`, `Public Landing & Search Box`, `Website Layout & Hero`, `Homepage Carousels`, `Login & Auth Form`, `Review Queue & Taxonomy Tabs`, `Sheet & Public Header`, `Period Detail & Board`, `Error/Empty States & Search`, `Supabase Client & Avatar`, `Root Layout & Providers`, `FigureVideo.tsx`, `cloudinary`?**
  _High betweenness centrality (0.177) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Core Runtime Dependencies` to `Dev Dependencies & Tooling`, `Sidebar & Navigation Shell`, `Commissariat Account Management`, `Excel Import Helpers`, `clsx`, `cmdk`, `date-fns`, `@dnd-kit/core`, `@dnd-kit/modifiers`, `@dnd-kit/sortable`, `@dnd-kit/utilities`, `@google/model-viewer`, `lucide-react`, `next`, `radix-ui`, `react-dom`, `react-icons`, `recharts`, `shadcn`, `sonner`, `@supabase/ssr`, `@supabase/supabase-js`, `@tanstack/react-table`, `@tiptap/extension-image`, `@tiptap/extension-link`, `@tiptap/extension-placeholder`, `@tiptap/extension-youtube`, `@tiptap/pm`, `@tiptap/react`, `@tiptap/starter-kit`, `tw-animate-css`, `vaul`, `@vercel/analytics`, `@vercel/speed-insights`, `zustand`, `class-variance-authority`?**
  _High betweenness centrality (0.126) - this node is a cross-community bridge._
- **Why does `react` connect `Sidebar & Navigation Shell` to `Cabang Dashboard Sections`, `Public Listing Pages`, `Core Runtime Dependencies`, `Global Search & Command Palette`, `Chart Components`?**
  _High betweenness centrality (0.077) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _393 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Cabang Dashboard Sections` be split into smaller, more focused modules?**
  _Cohesion score 0.061303581914268934 - nodes in this community are weakly interconnected._
- **Should `Public Listing Pages` be split into smaller, more focused modules?**
  _Cohesion score 0.0585487906588824 - nodes in this community are weakly interconnected._
- **Should `UI Primitives (cn/Drawer)` be split into smaller, more focused modules?**
  _Cohesion score 0.055272108843537414 - nodes in this community are weakly interconnected._