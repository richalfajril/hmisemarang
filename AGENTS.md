# AGENTS.md

Welcome. This document serves as the routing guide for AI Agents working on this project.

## Single Source of Truth

**Documentation is the ultimate source of truth.** All code must strictly follow the specifications outlined in the documentation. Do not invent new architecture, dependencies, or UI patterns without updating the documentation first.

## Required Reading

Before starting any feature implementation or refactoring, you MUST read the following documentation files to align with the project requirements:

1. **[PRD](docs/PRD.md)** - Product Requirements Document.
2. **[TECH_STACK](docs/architecture/TECH_STACK.md)** - Official technology stack constraints and forbidden libraries.
3. **[DESIGN](docs/design/DESIGN.md)** - UI/UX rules and theming details.
4. **[SKILLS](docs/development/SKILLS.md)** - Implementation patterns for specific technologies.
5. **[DOCUMENTATION_RULES](docs/development/DOCUMENTATION_RULES.md)** - Guidelines for maintaining and updating this documentation.
6. **[ROADMAP](docs/development/ROADMAP.md)** - Project milestones and technical goals.
7. **[CHANGELOG](docs/development/CHANGELOG.md)** - History of technical and feature changes.

Additionally, refer to `docs/features/`, `docs/decisions/`, and the rest of `docs/architecture/` for granular details.

**Rule**: Always search and rely on `docs/` before making architectural decisions.

## Agent Workflow & Planning Mode

As an AI Agent, you MUST follow this strict procedure when building or altering features:
1. **Implementation Plan First**: Always create an `implementation_plan.md` artifact before writing or modifying any code.
2. **Open Questions**: If you have any clarifying questions or design ambiguities, embed them as "Open Questions" within the implementation plan. 
3. **Stop & Wait**: STOP execution and allow the user to answer the open questions. Do NOT proceed to write code yet.
4. **Update the Plan**: Update the implementation plan to reflect the user's answers.
5. **Manual Proceed Required**: You MUST STOP again and wait for the user to explicitly read the plan and say "proceed" (or click proceed) before you execute any commands or file changes.
6. **Unplanned Adjustments**: Any adjustments or revisions made mid-flight MUST be PROACTIVELY documented in the version of `ROADMAP.md` and `CHANGELOG.md` whose focus matches the context of the adjustment. Do this immediately without waiting for the user to remind you.
