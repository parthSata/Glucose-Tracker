# Sweety — Stack Standards

Owns: library-specific conventions — how to use each technology correctly.

General practice lives in `code-standards.md`. Layer boundaries live in
`architecture-context.md`. This file does not repeat product scope.

---

# 1. Bun

- Install: `bun install`
- Run scripts: `bun run <script>`
- Execute TS: `bun run path/to/file.ts` or package scripts
- Never introduce npm / yarn / pnpm lockfiles or workflows
- Never hand-edit `bun.lock`

---

# 2. TypeScript

- `strict: true`
- Prefer `z.infer<typeof schema>` and Prisma generated types over
  hand-duplicated interfaces
- `catch (e: unknown)` — narrow before use
- No `any`, no `@ts-ignore`, no `as` used only to silence errors

---

# 3. Express

Middleware order (typical):

```text
cors → express.json → logger (optional) → routes → error middleware
```

Protected route order:

```text
authMiddleware → zodValidate → asyncHandler(controller)
```

- One router per domain: `auth.routes.ts`, `readings.routes.ts`,
  `reports.routes.ts`
- Controllers stay thin; services own business rules
- Always use `asyncHandler` around async controllers

---

# 4. ApiError / ApiResponse / asyncHandler

- Throw `ApiError` from services for expected failures (400/401/403/404/409)
- Return `ApiResponse` from controllers for success
- Never `res.json({ msg: ... })` with ad-hoc shapes
- Prisma `P2002` on readings unique → 409 / 400 with:
  `You already have an <Slot Label> reading for this date.`
- Zod failures → 400; map issues to field errors when possible

Success JSON:

```json
{ "success": true, "statusCode": 200, "message": "...", "data": {} }
```

Error JSON:

```json
{ "success": false, "statusCode": 400, "message": "...", "errors": {} }
```

(`statusCode` may live only on the HTTP status line if preferred, but
`success` + `message` + `data`/`errors` are required.)

---

# 5. Prisma

- All schema changes via migrations
- Use `prisma.reading` / `prisma.user` — no raw SQL unless necessary
- Always scope readings by `userId` from the JWT user
- Prefer `findFirst({ where: { id, userId } })` for get/update/delete
- Use transactions only when multi-step writes must be atomic

---

# 6. Zod (frontend + backend)

Share the same rules and messages from `project-overview.md` §5.

Backend example intents:

- `value`: integer, min 40, max 600, required message as specified
- `readingDate`: string `YYYY-MM-DD`, refine not in the future
- `timeSlot`: enum of the four slots

Frontend:

- Same schema (or shared package / duplicated schema kept in sync)
- Show field-level errors under inputs
- On API error, prefer server `message` for business rules (duplicate
  slot, max 4)

Never skip backend validation because the form already validated.

---

# 7. bcrypt + JWT

- Hash with bcrypt (`BCRYPT_SALT_ROUNDS` from env, default 10)
- Compare with `bcrypt.compare`
- Sign JWT with `JWT_SECRET`; include `sub` (user id), email, name as needed
- Middleware verifies signature and expiry
- Never return `password_hash` in any response

---

# 8. React + Vite

- Functional components only
- Vite env vars: `VITE_API_URL` (or similar) — no secrets in `VITE_*`
- Router: simple React Router is fine for this assignment
- Pages under `pages/`; keep them thin composers

---

# 9. Tailwind CSS

- Utility-first; avoid large custom CSS files
- Mobile-first breakpoints (`sm`, `md`, `lg`)
- Prefer design tokens via CSS variables in one global stylesheet
- See `ui-context.md` for visual direction and responsive checks

---

# 10. Axios

- Single instance in `client/src/lib/api-client.ts`
- Request interceptor: attach `Authorization: Bearer <token>`
- Response interceptor: normalize ApiError shape; handle 401
- Do not mix bare `fetch` for the same API without a reason

---

# 11. State

- Auth session: small Zustand store or React context — one approach only
- Server data: fetch in hooks (React Query optional; plain async state
  is acceptable for this assignment’s size)
- Do not dump server lists into a global store without need

---

# 12. Do Not Add

- Test runners / RTL / Supertest
- Cloudinary, Nodemailer, chat SDKs
- Redux
- A second ORM or database
- MongoDB drivers
