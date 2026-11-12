# Sweety — Architecture Context

Owns: the stack, folder layout, API/DB/auth boundaries, and backend
utils contracts. Code style lives in `code-standards.md`. Screens live
in `ui-context.md`. Product scope lives in `project-overview.md`.

**Do not create `client/` or `server/` until the user explicitly asks
for folder structure / scaffolding.** This file documents the target.

---

# 1. Technology Stack

## Runtime / Package Manager

- Bun

Use Bun for installing dependencies, running scripts, and running the
server/client. Use `bun install`, `bun run`, `bunx`. Never npm, yarn,
or pnpm. Never edit lockfiles by hand.

## Frontend

- React + TypeScript
- Vite
- Tailwind CSS
- Axios (single API client instance)
- Zod (forms and shared schemas)
- Optional later: Recharts (bonus chart only)

## Backend

- Express + TypeScript (run with Bun)
- Layered: routes → controllers → services → Prisma
- Zod for request validation
- bcrypt for password hashing
- jsonwebtoken (JWT Bearer)

## Database

- PostgreSQL
- Prisma ORM (schema, migrations, queries)

## Explicitly Excluded

- MongoDB
- Jest / Vitest / Supertest / React Testing Library (unless scope reopened)
- Cloudinary, email, chat, notification utilities
- Redis, BullMQ (unless user asks)
- npm / yarn / pnpm

---

# 2. Repository Layout (target)

```text
Glucose-Tracker/
├── client/                 # React + Vite
│   └── src/
│       ├── components/
│       │   ├── ui/         # shared primitives (one component per file)
│       │   └── features/
│       │       ├── auth/
│       │       ├── readings/
│       │       └── reports/
│       ├── hooks/
│       ├── pages/          # thin screens that compose features
│       ├── lib/            # api-client, cn helpers
│       ├── store/          # auth store only if needed
│       ├── types/
│       └── App.tsx
├── server/
│   └── src/
│       ├── config/
│       ├── middleware/     # auth, error, validate
│       ├── routes/
│       ├── controllers/
│       ├── services/
│       ├── validators/     # Zod schemas
│       ├── utils/          # api-error, api-response, async-handler
│       ├── app.ts
│       └── server.ts
│   └── prisma/
│       └── schema.prisma
├── context/                # AI + human source of truth
├── AGENTS.md
├── .env.example            # later, at scaffold
└── .gitignore
```

One concern per file on the server (do not merge controller + service
into one module).

---

# 3. Required Scripts (when scaffolded)

Root or package scripts via Bun (adjust paths for workspace layout):

```json
{
  "dev:server": "bun run --cwd server src/server.ts",
  "dev:client": "bun run --cwd client dev",
  "typecheck": "bun run --cwd server typecheck && bun run --cwd client typecheck",
  "lint": "bun run --cwd server lint && bun run --cwd client lint",
  "db:generate": "bun run --cwd server prisma generate",
  "db:migrate": "bun run --cwd server prisma migrate dev",
  "db:seed": "bun run --cwd server prisma/seed.ts"
}
```

Exact script names may live in `client/package.json` and
`server/package.json`; keep Bun as the runner.

---

# 4. Database Schema

## users

| Column | Type | Notes |
|--------|------|--------|
| id | UUID PK | `gen_random_uuid()` / Prisma `@default(uuid())` |
| name | String | required |
| email | String | unique, required |
| password_hash | String | bcrypt hash; never return in API |
| created_at | DateTime | |
| updated_at | DateTime | |

## readings

| Column | Type | Notes |
|--------|------|--------|
| id | UUID PK | |
| user_id | UUID FK → users | `ON DELETE CASCADE` |
| reading_date | Date | calendar date |
| time_slot | Enum | `MORNING`, `AFTER_BREAKFAST`, `AFTER_LUNCH`, `AFTER_DINNER` |
| value | Int | CHECK between 40 and 600 |
| created_at | DateTime | |
| updated_at | DateTime | |

Constraints:

- `UNIQUE (user_id, reading_date, time_slot)`
- Index `(user_id, reading_date)` for list/report queries

The unique constraint implies at most four readings per user per day
(one per slot). Still return the assignment’s “max 4” message when
applicable so UX matches the brief.

### Date handling

Store and compare `reading_date` as a date-only value (`YYYY-MM-DD`).
Do not parse date-only strings through timezone-shifting `Date`
conversions that move the calendar day.

---

# 5. Auth Architecture

1. `POST /api/auth/register` — hash password with bcrypt, create user,
   return user (no hash) + JWT (or require login after register —
   prefer returning token for smoother UX; document choice in README)
2. `POST /api/auth/login` — verify password, return JWT + public user
3. `GET /api/auth/me` — current user from token
4. Optional: `POST /api/auth/logout` — client discards token (stateless JWT)

Protected routes:

- Read `Authorization: Bearer <token>`
- Verify JWT; attach `req.user = { id, email, name }`
- **Never** trust `user_id` from the request body for ownership

All reading and report queries filter by `req.user.id`.

---

# 6. REST API Contract

Base path: `/api`

## Auth

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| POST | `/auth/register` | No | Register |
| POST | `/auth/login` | No | Login |
| GET | `/auth/me` | Yes | Current user |
| POST | `/auth/logout` | Yes | Client-side logout helper |

## Readings

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| POST | `/readings` | Yes | Create |
| GET | `/readings` | Yes | List (optional `?page=&limit=` bonus) |
| GET | `/readings/:id` | Yes | Get one (owner only) |
| PUT | `/readings/:id` | Yes | Update (owner only) |
| DELETE | `/readings/:id` | Yes | Delete (owner only) |

## Reports

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/reports/daily?date=YYYY-MM-DD` | Yes | Daily + slot list |
| GET | `/reports/month-to-date?date=YYYY-MM-DD` | Yes | MTD stats |
| GET | `/reports/monthly?date=YYYY-MM-DD` | Yes | Previous month stats |

### Report payload shape

```ts
{
  success: true,
  message: string,
  data: {
    range: { start: string; end: string },
    highest: number | null,
    lowest: number | null,
    average: number | null, // one decimal, or null if empty
    count: number,
    readings?: Array<{ id: string; timeSlot: string; value: number; readingDate: string }>
  }
}
```

`readings` required for daily; optional for others.

Empty range: `count: 0`, stats `null`, UI shows empty state.

---

# 7. Backend Utils Contracts (create at scaffold time)

Path: `server/src/utils/`

## `api-error.ts`

```ts
export class ApiError extends Error {
  statusCode: number
  success: false
  errors?: unknown

  constructor(statusCode: number, message: string, errors?: unknown) {
    super(message)
    this.statusCode = statusCode
    this.success = false
    this.errors = errors
  }
}
```

Services throw `new ApiError(400, 'Please enter a glucose value.')` etc.

## `api-response.ts`

```ts
export class ApiResponse<T> {
  statusCode: number
  data: T
  message: string
  success: true

  constructor(statusCode: number, data: T, message = 'Success') {
    this.statusCode = statusCode
    this.data = data
    this.message = message
    this.success = true
  }
}
```

Controllers: `res.status(code).json(new ApiResponse(code, data, message))`.

## `async-handler.ts`

Wrap async `(req, res, next) => ...` so rejected promises call `next(err)`.

## `error.middleware.ts` (middleware, not utils)

Map:

- `ApiError` → `{ success: false, message, errors? }` with statusCode
- Zod errors → 400 with field messages
- Prisma `P2002` unique violation → duplicate slot message using human
  slot label when possible
- Unknown → 500 with generic message (no stack in production)

Do **not** add Cloudinary / email / chat / notification util files.

---

# 8. Request Flow

```text
Route → asyncHandler(controller) → service → Prisma
                ↓
         ApiResponse | throw ApiError
                ↓
         error middleware
```

Validation middleware (Zod) runs before the controller on body, params,
and query.

---

# 9. Frontend Data Flow

```text
Page → feature component / hook → Axios api-client → Express API
```

- Attach JWT from auth store/localStorage on each request
- On 401, clear session and redirect to Login
- Surface `message` / `errors` from ApiError JSON on forms

---

# 10. Layer Boundaries

| Layer | May | Must not |
|-------|-----|----------|
| Pages | Compose components, call hooks | Contain business rules or multi-component definitions |
| Feature components | UI for one domain | Call Prisma or know SQL |
| Hooks | API calls, form state orchestration | Render large JSX trees |
| Controllers | Parse req, call service, return ApiResponse | Embed complex business rules |
| Services | Validation rules, ownership, Prisma | Touch `res` directly |
| Utils | ApiError, ApiResponse, asyncHandler | Feature-specific domain logic |

---

# 11. Environment Variables (document in `.env.example` later)

```text
DATABASE_URL=
JWT_SECRET=
JWT_EXPIRES_IN=7d
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
```

No real secrets in the repo.
