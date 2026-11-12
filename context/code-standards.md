# Sweety — Code Standards

Owns: how code is written. Stack and layer boundaries live in
`architecture-context.md`. Screens and visuals live in `ui-context.md`.

---

# 1. General Principle

Code should be:

- Simple
- Readable
- Maintainable
- Reusable
- Type-safe
- Secure

Do not over-engineer. This is a fresher-level assignment with a short
deadline. Prefer the smallest correct solution.

---

# 2. Language & Runtime

- TypeScript only for app code (no new `.js` source files)
- Bun for install and scripts — see `stack-standards.md`
- Strict TypeScript; no `any`, no `@ts-ignore`

---

# 3. Naming

## Files

kebab-case:

- `reading-form.tsx`
- `reading-service.ts`
- `use-readings.ts`
- `api-error.ts`

## Components

PascalCase: `ReadingForm`, `StatCard`

## Functions / variables

camelCase: `isAuthenticated`, `createReading`

## Constants

UPPER_SNAKE_CASE: `MAX_READINGS_PER_DAY`

---

# 4. One Component Per File (binding)

- Exactly **one** React component export per `.tsx` file
- Filename matches the component (`stat-card.tsx` → `StatCard`)
- Do not define `ReadingForm`, `ReadingRow`, and `EmptyState` in one file
- Pages compose imported components; they must not declare additional
  named components inline — extract them to their own files
- Tiny local helpers/types in the same file are fine; second components
  are not

---

# 5. Reusability

## Shared UI — `client/src/components/ui/`

Generic primitives (props-driven, no hard-coded Sweety copy unless via
props): Button, Input, Select, Modal, EmptyState, Spinner, StatCard,
Label, ErrorText.

## Feature UI — `client/src/components/features/<feature>/`

Domain components reused across pages in that feature (e.g.
`reading-form.tsx`, `reading-list-item.tsx`, `report-summary.tsx`).

## Rules

1. Search `components/ui` and `components/features/*` before creating
2. Reuse or extend via props when possible
3. Extract shared UI on the **second** clear reuse
4. Business logic belongs in hooks (`hooks/use-readings.ts`), not in
   fat components

---

# 6. Optimization (practical)

- Keep components / modules under ~150 lines; split when larger
- Early returns; max ~3 levels of nesting
- Do **not** add `useMemo` / `useCallback` by default
- Lists: stable `key={id}`; extract row components
- Avoid prop-drilling auth — use one auth store/context

---

# 7. Readability

- Prefer clear names over short names
- Derive types from Zod / Prisma instead of parallel interfaces
- Small pure helpers in `lib/`; no god `utils.ts` dumping ground
- Comments only for non-obvious why (date/TZ, duplicate-slot messaging)
- Consistent form error placement under fields

---

# 8. Validation

- Zod on frontend forms and backend requests
- Exact messages from `project-overview.md` §5
- Backend is authoritative; frontend improves UX
- Centralize schemas under `server/src/validators/` and mirror on client

---

# 9. API & Errors

- Controllers use `asyncHandler` and `ApiResponse`
- Services throw `ApiError`
- Never leak `password_hash` or stack traces to clients in production
- Consistent JSON shape — see `stack-standards.md`

---

# 10. Security

- bcrypt for passwords
- JWT on protected routes
- Scope every reading query by authenticated user id
- Validate env on server startup
- CORS limited to `CLIENT_ORIGIN`
- No secrets in the repo; use `.env` + `.env.example`

---

# 11. Git Safety (binding)

Do **not** run `git commit`, `git push`, `gh pr create`, or equivalent
unless the user explicitly asks for that action in the current message.

`context/progress-tracker.md` is gitignored — update it locally; do not
force-add it.

---

# 12. Verification (no automated tests)

Before calling a task done:

1. `bun run typecheck` (and lint when configured)
2. Manual smoke of the touched flow
3. Confirm FE + BE validation messages
4. Confirm responsive at 375 / 768 / 1024+
5. Confirm one-component-per-file and reuse rules
6. Update `progress-tracker.md`

Do not add Jest/Vitest/RTL/Supertest unless the user reopens scope.

---

# 13. Simplicity Limits

Allowed without asking:

- The approved screens and endpoints in `project-overview.md`
- Pagination and Recharts after required features work

Ask first:

- New roles, tables, or screens
- Redis, queues, Docker (unless user requests)
- Extra dependencies not in the locked stack

Forbidden:

- Rewriting the stack (e.g. Next.js, MongoDB) without approval
- Multi-component files
- Trusting client validation alone
