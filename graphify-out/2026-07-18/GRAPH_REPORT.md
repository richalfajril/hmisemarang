# Graph Report - hmisemarang  (2026-07-18)

## Corpus Check
- 350 files · ~140,815 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1498 nodes · 3784 edges · 128 communities (78 shown, 50 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 67 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `37776bbd`
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
- actions.ts
- shadcn Logos
- pickField
- page.tsx
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

## Communities (128 total, 50 thin omitted)

### Community 0 - "Cabang Dashboard Sections"
Cohesion: 0.09
Nodes (61): AgendaFormProps, FIELD_LABELS, ArticleFormProps, FIELD_LABELS, PreviewSnap, Account, ImportResult, ProfileFormProps (+53 more)

### Community 1 - "Public Listing Pages"
Cohesion: 0.09
Nodes (58): metadata, getPublicDocuments(), metadata, Page(), AgendaListProps, statusColorMap, ArticleListProps, ArticleWithRelations (+50 more)

### Community 2 - "UI Primitives (cn/Drawer)"
Cohesion: 0.06
Nodes (35): cn(), Props, DialogOverlay(), DrawerContent(), DrawerDescription(), DrawerFooter(), DrawerHeader(), DrawerOverlay() (+27 more)

### Community 3 - "Project Governance & Stack Concepts"
Cohesion: 0.05
Nodes (48): Agent Workflow & Planning Mode, AGENTS.md Routing Guide, Documentation as Single Source of Truth, Graphify Knowledge Graph Workflow, CLAUDE.md Project Instructions, Cloudinary Media Storage, Prisma ORM, ADMIN_CABANG Role (+40 more)

### Community 4 - "Dev Dependencies & Tooling"
Cohesion: 0.04
Nodes (45): dotenv, eslint, eslint-config-next, browserslist, devDependencies, dotenv, eslint, eslint-config-next (+37 more)

### Community 5 - "Sidebar & Navigation Shell"
Cohesion: 0.43
Nodes (5): Toggle(), toggleVariants, ToggleGroup(), ToggleGroupContext, ToggleGroupItem()

### Community 6 - "CMS Create/Edit Pages"
Cohesion: 0.28
Nodes (6): EditAgendaPage(), EditArticlePage(), AgendaForm(), formatDatetimeForInput(), RevisionNotes(), RevisionNotesProps

### Community 7 - "SEO & Public Detail Pages"
Cohesion: 0.16
Nodes (20): generateMetadata(), getCommissariat(), Page(), FALLBACK, metadata, Page(), ArticleReadingView(), ArticleReadingViewProps (+12 more)

### Community 8 - "Architecture Decision Records"
Cohesion: 0.05
Nodes (37): Approval Metadata, Authentication & Product Refinements (ADR 001), No Member Accounts Decision, Public Documents Module, Rejected Content Resubmission, Revision Notes Requirement, Document Module (ADR 002), Document Draft Workflow (+29 more)

### Community 9 - "CMS Admin Settings Pages"
Cohesion: 0.07
Nodes (43): react, react, useIsMobile(), BackButton(), BackButtonProps, Sidebar(), SidebarContent(), SidebarContext (+35 more)

### Community 10 - "Agenda/Article Schemas & Actions"
Cohesion: 0.12
Nodes (21): AgendaFormValues, agendaSchema, ACCEPTED_FILE_TYPES, cadreVerificationSchema, ProfileSubmissionFormValues, profileSubmissionSchema, bulkArchiveAgendasAction(), generateSlug() (+13 more)

### Community 11 - "Public Article Queries"
Cohesion: 0.10
Nodes (31): metadata, Page(), generateMetadata(), Page(), ARTICLE_FALLBACK, firstParagraph(), getAllPublicArticles, getArticleBySlug (+23 more)

### Community 12 - "Homepage Sections"
Cohesion: 0.12
Nodes (19): metadata, MISI, VALUES, getOptimizedUrl(), FadeIn(), Props, BaseProps, LeftProps (+11 more)

### Community 13 - "Route Handlers & CMS Pages"
Cohesion: 0.10
Nodes (24): AuditLogsPage(), ChangePasswordPage(), CommissariatAccountsPage(), MediaCleanupPage(), NotificationsPage(), PeriodsPage(), SettingsPage(), metadata (+16 more)

### Community 14 - "TypeScript Config"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 15 - "Commissariat Account Management"
Cohesion: 0.12
Nodes (20): createUserSchema, forceResetSchema, authorize(), createCommissariatAccountAction(), deleteCommissariatAccountAction(), ensureCommissariat(), importCommissariatAccountsAction(), ImportResult (+12 more)

### Community 16 - "Global Search & Command Palette"
Cohesion: 0.13
Nodes (20): SearchResult, GlobalSearch(), useDebounce(), ComboboxOption, ComboboxProps, Command(), CommandDialog(), CommandEmpty() (+12 more)

### Community 17 - "Organization Actions"
Cohesion: 0.15
Nodes (22): activatePeriodAction(), archivePeriodAction(), BoardImportResult, boardMemberSchema, checkAuth(), createBoardMemberAction(), createPositionAction(), createPositionStructureAction() (+14 more)

### Community 18 - "shadcn components.json Config"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 19 - "Chart Components"
Cohesion: 0.17
Nodes (13): ChartConfig, ChartContainer(), ChartContext, ChartContextProps, ChartLegendContent(), ChartTooltipContent(), getPayloadConfigFromPayload(), INITIAL_DIMENSION (+5 more)

### Community 20 - "Review & Document Schemas"
Cohesion: 0.22
Nodes (11): ReviewDetailPage(), ACCEPTED_FILE_TYPES, DocumentFormValues, documentSchema, ReviewSplitScreen(), getPublicDocumentUrlAction(), getSignedDocumentUrlAction(), softDeleteDocumentAction() (+3 more)

### Community 21 - "Public Agenda Grid & Status"
Cohesion: 0.21
Nodes (20): metadata, Page(), generateMetadata(), Page(), timeFmt, AgendaGrid(), AgendaGridCard(), AgendaStatus (+12 more)

### Community 22 - "Public Landing & Search Box"
Cohesion: 0.16
Nodes (16): metadata, Page(), metadata, Page(), HeroSearchBox(), PageHero(), AGENDA_FALLBACK, GALLERY_FALLBACK (+8 more)

### Community 23 - "Website Layout & Hero"
Cohesion: 0.18
Nodes (10): STATIC_PATHS, generateMetadata(), WebsiteLayout(), getWebsiteSettings, NavLink, PUBLIC_NAV_LINKS, SITE_KEYWORDS, SITE_URL (+2 more)

### Community 24 - "Homepage Carousels"
Cohesion: 0.15
Nodes (13): containerVariants, GalleryBento(), GalleryPhoto, itemVariants, SPANS, useHorizontalWheel(), AgendaCarousel(), CircularGallery() (+5 more)

### Community 25 - "About/Gallery Sections"
Cohesion: 0.19
Nodes (13): AlbumDetailsPage(), ACCEPTED_IMAGE_TYPES, AlbumFormValues, albumSchema, photoSchema, deletePhotoAction(), setAlbumCoverAction(), softDeleteAlbumAction() (+5 more)

### Community 26 - "Login & Auth Form"
Cohesion: 0.15
Nodes (16): getDashboardLogo(), LoginPage(), metadata, loginAction(), LoginForm(), Field(), FieldContent(), FieldDescription() (+8 more)

### Community 27 - "Design System Concepts"
Cohesion: 0.14
Nodes (16): Audit Log withAuditLog Wrapper, Zod Validation Strategy, Public Website Data States Standard, audit_logs table, Design System & UI/UX Guidelines, OKLCH Color System (HMI Green), Strict Media Aspect Ratios, Public Website Data States (Section 16) (+8 more)

### Community 28 - "Gallery Album Schema & Actions"
Cohesion: 0.08
Nodes (30): CreateAgendaPage(), AgendasPage(), CreateArticlePage(), ArticlesPage(), EditDocumentPage(), NewDocumentPage(), EditAlbumPage(), NewAlbumPage() (+22 more)

### Community 29 - "Review Queue & Taxonomy Tabs"
Cohesion: 0.08
Nodes (41): CadreVerificationPage(), CabangLeaderboardData(), CabangStatsSection(), CommissariatDashboardSection(), DashboardOverview(), metadata, ReviewActionEnum, ReviewActionEnumSchema (+33 more)

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
Cohesion: 0.22
Nodes (10): Deployment Strategy, Vercel Hosting & CI/CD, Environment Variables, Cloudinary Keys, Supabase Keys (URL/Anon/Service Role), Zustand + TanStack Query Division, Git Workflow, Branch Strategy (production/development) (+2 more)

### Community 35 - "Period Detail & Board"
Cohesion: 0.27
Nodes (9): metadata, Pagination(), PaginationContent(), PaginationEllipsis(), PaginationItem(), PaginationLink(), PaginationLinkProps, PaginationNext() (+1 more)

### Community 36 - "Error/Empty States & Search"
Cohesion: 0.21
Nodes (6): ForbiddenPage(), NotFoundPage(), metadata, buttonVariants, EmptyState(), EmptyStateProps

### Community 37 - "Supabase Client & Avatar"
Cohesion: 0.10
Nodes (21): AnimatedSection(), getFeaturedArticles, FEATURES, HomeAbout(), Article, dateFmt, FALLBACK, formatMeta() (+13 more)

### Community 38 - "Media Cleanup"
Cohesion: 0.44
Nodes (7): extractPublicId(), OrphanReport, publicIdsFromHtml(), scanOrphanMediaAction(), fmtBytes(), MediaCleanupPanel(), listCloudinaryImages()

### Community 39 - "Styling & Theming Concepts"
Cohesion: 0.22
Nodes (11): CSS Variable Tokens, Adding Custom Colors, Customization & Theming, Dark Mode (next-themes), OKLCH Color Format, className for Layout Only, cn() Utility, gap-* over space-* (+3 more)

### Community 40 - "Core Runtime Dependencies"
Cohesion: 0.18
Nodes (11): @base-ui/react, date-fns, dependencies, @base-ui/react, date-fns, tailwind-merge, @tanstack/react-query, zod (+3 more)

### Community 41 - "Dashboard Layout & Header"
Cohesion: 0.36
Nodes (7): TestimonialFormValues, testimonialSchema, canManage(), deleteTestimonialAction(), saveTestimonialAction(), togglePublishTestimonialAction(), TestimonialList()

### Community 42 - "Review Schema & Split Screen"
Cohesion: 0.22
Nodes (10): createClient(), Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount(), AvatarImage(), DropdownMenuGroup() (+2 more)

### Community 43 - "Board Member Card & Socials"
Cohesion: 0.17
Nodes (13): metadata, PeriodDetailPage(), toSocialLinks(), ImportPengurusModal(), PengurusCardData, MemberItem, Option, SusunanKepengurusan() (+5 more)

### Community 44 - "shadcn CLI Concepts"
Cohesion: 0.20
Nodes (10): add Command, apply Command, build Command, docs Command, Dry-Run Mode, info Command, init Command, Preset (+2 more)

### Community 45 - "Article Editor Concepts"
Cohesion: 0.27
Nodes (10): data-icon Attribute, Configured iconLibrary, Icons Rules, BubbleMenu (Text Selection), MediumEditor Component, Medium-Style Article Editor Plan, Tiptap Extensions (Image/Youtube/Table), ArticleForm (+2 more)

### Community 46 - "Server Actions Architecture"
Cohesion: 0.17
Nodes (13): App Shell Loading Pattern, Server Actions First Architecture, board_members table, Manual Prisma Migration Policy, DATABASE_URL / DIRECT_URL (Prisma), Prisma Client Singleton (shared/api), Server Actions Placement Strategy, Application-Level Authorization (+5 more)

### Community 47 - "Roles & Permissions Concepts"
Cohesion: 0.29
Nodes (9): deleteBoardMemberAction(), formatPosition(), PengurusCard(), FORM_SOCIAL_PLATFORMS, getSocialIcon(), ICONS, SOCIAL_PLATFORMS, SocialLink (+1 more)

### Community 48 - "Taxonomy Import Actions"
Cohesion: 0.22
Nodes (8): bricolage, geistMono, metadata, RootLayout(), rubik, viewport, Providers(), ConfirmProvider()

### Community 49 - "Profile & Settings Schemas"
Cohesion: 0.14
Nodes (14): metadata, metadata, DocumentsPage(), metadata, metadata, metadata, metadata, TaxonomyPage() (+6 more)

### Community 51 - "Root Layout & Providers"
Cohesion: 0.24
Nodes (8): DashboardLayout(), Separator(), SidebarInset(), SidebarTrigger(), AppSidebar(), getPageTitle(), PAGE_TITLES, SiteHeader()

### Community 52 - "NotificationBell.tsx"
Cohesion: 0.29
Nodes (6): CountUp(), HeroBackground(), isVideo(), HeroSearchBar(), FALLBACK, METRICS

### Community 53 - "InputGroup Component"
Cohesion: 0.28
Nodes (8): InputGroup(), InputGroupAddon(), inputGroupAddonVariants, InputGroupButton(), inputGroupButtonVariants, InputGroupInput(), InputGroupText(), InputGroupTextarea()

### Community 54 - "Database Schema Concepts"
Cohesion: 0.17
Nodes (13): Database Schema, Ownership Rules (commissariat_id scoping), users table, Features Discovery Mapping, content-review Feature (polymorphic), DRY Centralized Review Rationale, Role Permission Matrix (RBAC), ADMIN_CABANG Role (+5 more)

### Community 55 - "Cadre Verification & Storage"
Cohesion: 0.17
Nodes (12): Cadre Verification APIs, Storage APIs uploadFileToStorage, compressImageToWebp Client Optimizer, Orphan Media Cleanup Scanner, cadre_verifications table, Documentation Rules (SSOT), Documentation-Driven Development, Product Requirements Document (+4 more)

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

### Community 67 - "actions.ts"
Cohesion: 0.24
Nodes (9): xlsx, createTaxonomyAction(), importUniversitiesAction(), taxonomySchema, UniversityImportResult, updateTaxonomyAction(), EditTaxonomyModal(), slugify() (+1 more)

### Community 69 - "pickField"
Cohesion: 0.38
Nodes (7): importBoardMembersAction(), buildSocialLinks(), links, row, SOCIAL_COLS, normHeader(), pickField()

### Community 70 - "page.tsx"
Cohesion: 0.36
Nodes (7): getAllPeriods(), getOrganizationByPeriod(), GROUP_TITLES, metadata, Page(), toSocialLinks(), PeriodArrow()

## Knowledge Gaps
- **395 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+390 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **50 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `UI Primitives (cn/Drawer)` to `Cabang Dashboard Sections`, `Public Listing Pages`, `Sidebar & Navigation Shell`, `SEO & Public Detail Pages`, `CMS Admin Settings Pages`, `Homepage Sections`, `Global Search & Command Palette`, `Chart Components`, `Public Landing & Search Box`, `Homepage Carousels`, `Login & Auth Form`, `Review Queue & Taxonomy Tabs`, `Sheet & Public Header`, `Period Detail & Board`, `Error/Empty States & Search`, `Supabase Client & Avatar`, `Review Schema & Split Screen`, `Taxonomy Import Actions`, `Profile & Settings Schemas`, `Root Layout & Providers`, `InputGroup Component`?**
  _High betweenness centrality (0.177) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Core Runtime Dependencies` to `Dev Dependencies & Tooling`, `CMS Admin Settings Pages`, `Excel Import Helpers`, `actions.ts`, `clsx`, `cmdk`, `@dnd-kit/core`, `@dnd-kit/modifiers`, `@dnd-kit/sortable`, `@dnd-kit/utilities`, `@google/model-viewer`, `lucide-react`, `next`, `radix-ui`, `react-dom`, `react-icons`, `recharts`, `shadcn`, `sonner`, `@supabase/ssr`, `@supabase/supabase-js`, `@tanstack/react-table`, `@tiptap/extension-image`, `@tiptap/extension-link`, `@tiptap/extension-placeholder`, `@tiptap/extension-youtube`, `@tiptap/pm`, `@tiptap/react`, `@tiptap/starter-kit`, `tw-animate-css`, `vaul`, `@vercel/analytics`, `@vercel/speed-insights`, `zustand`, `class-variance-authority`, `class-variance-authority`?**
  _High betweenness centrality (0.119) - this node is a cross-community bridge._
- **Why does `react` connect `CMS Admin Settings Pages` to `Cabang Dashboard Sections`, `Sidebar & Navigation Shell`, `Core Runtime Dependencies`, `Global Search & Command Palette`, `Chart Components`?**
  _High betweenness centrality (0.076) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _395 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Cabang Dashboard Sections` be split into smaller, more focused modules?**
  _Cohesion score 0.08707070707070708 - nodes in this community are weakly interconnected._
- **Should `Public Listing Pages` be split into smaller, more focused modules?**
  _Cohesion score 0.08627450980392157 - nodes in this community are weakly interconnected._
- **Should `UI Primitives (cn/Drawer)` be split into smaller, more focused modules?**
  _Cohesion score 0.06292517006802721 - nodes in this community are weakly interconnected._