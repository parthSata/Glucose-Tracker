# AGENTS.md — Sweety

Blood glucose tracker built with React, Vite, TypeScript, Bun, Express,
PostgreSQL/Prisma, JWT + bcrypt, Zod, Axios, and Tailwind.

This file owns **how to work**. It does not restate the rules — each topic
has exactly one owner below. Change a rule in its owning file, never here.

## Read these before writing code

| File | Owns | Read it when |
|---|---|---|
| [context/project-overview.md](context/project-overview.md) | Scope: modules, validation messages, reports, screens, sprints, exclusions | Always — before adding anything |
| [context/architecture-context.md](context/architecture-context.md) | Stack, folders, API/DB/auth, ApiError utils contracts | Touching API, database, auth, or utils |
| [context/ui-context.md](context/ui-context.md) | Design, screens, responsive, UI states | Touching any screen or component |
| [context/code-standards.md](context/code-standards.md) | Naming, one-component-per-file, reuse, security, git safety | Writing any code |
| [context/stack-standards.md](context/stack-standards.md) | Bun, Express, Prisma, Zod, Axios, JWT idioms | Using those libraries |
| [context/progress-tracker.md](context/progress-tracker.md) | What is done, current task, what's next (gitignored) | Starting and finishing a task |

@context/project-overview.md
@context/architecture-context.md
@context/ui-context.md
@context/code-standards.md
@context/stack-standards.md
@context/progress-tracker.md

## Workflow (binding)

1. **Understand first.** Read the owning context file for what you're about
   to touch. Don't guess how this project works.
2. **Check scope.** If the screen, endpoint, table, or field isn't in
   `project-overview.md`, it does not exist yet. Ask before inventing it.
3. **Check the sprint.** `progress-tracker.md` names the current sprint.
   Do not build a later sprint's feature because it seems convenient.
4. **Before every tool/command:** re-confirm Bun-only, dual Zod validation
   messages, user ownership, and one-component-per-file rules that apply.
5. **After every command / tool result:** re-check the same rules. If
   something drifted (wrong package manager, multi-component file, missing
   validation message, unscoped query), fix it before continuing.
6. **State the plan** before multi-file work: files, endpoints, tables,
   assumptions. Wait for go if ambiguous or larger than ~three files.
7. **Implement the smallest version that works.** Simplicity limits in
   `code-standards.md` are binding.
8. **Verify** using the checklist below before calling anything done.
9. **Update `progress-tracker.md`:** tick finished work, set Current Task
   and Next, add Known Issues.
10. **Git:** never `commit`, `push`, or open a PR unless the user explicitly
    asks in the current message.

## Phase gate

Sprint 0 is context-only. Do **not** scaffold `client/` or `server/` or
create `api-error.ts` / `api-response.ts` / `async-handler.ts` until the
user explicitly asks for folder structure / scaffolding.

## Definition of done

A task is not done until all of these are true. Say which ones you skipped
and why.

- [ ] Server-side Zod validation with assignment error strings
- [ ] Client-side Zod validation with the same strings (for forms)
- [ ] Every reading/report query scoped to authenticated user id
- [ ] Loading, empty, and error states for data views
- [ ] Responsive at 375px, 768px, and 1024px+
- [ ] One React component per `.tsx` file; reuse searched first
- [ ] Feature logic in hooks; pages only compose
- [ ] ApiError / ApiResponse / asyncHandler used on new API handlers (once scaffolded)
- [ ] `bun run typecheck` and lint pass when configured
- [ ] `progress-tracker.md` updated
- [ ] No git commit / push / PR without explicit permission

## When unsure

Ask. If requirements conflict or are ambiguous, stop and say so — a wrong
guess costs more than a question. Do not silently pick an interpretation
and build on it. Document lasting assumptions in README Notes later.

## Tool wiring

Every AI tool is pointed at this file rather than holding its own copy of
the rules:

| Tool | Entry point it loads automatically | How it pulls in `context/` |
|---|---|---|
| Claude Code | `CLAUDE.md` → `@AGENTS.md` | `@context/…` imports above |
| Cursor (IDE + CLI) | `.cursor/rules/00-sweety.mdc` (`alwaysApply: true`) | `@context/…` listed in that rule |
| Antigravity | `.agents/rules/sweety.md` (`always_on`) | `@../../context/…` listed in that rule |
| GitHub Copilot | `.github/copilot-instructions.md` → `@AGENTS.md` | `@context/…` via AGENTS.md |

If you rename or move a file in `context/`, update the import lists in
`.cursor/rules/00-sweety.mdc` and `.agents/rules/sweety.md` — a broken
import fails silently, with the agent loading fewer rules than expected.
