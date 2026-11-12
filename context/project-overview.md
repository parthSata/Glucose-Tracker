# Sweety — Project Overview

Owns: product scope, approved features, validation messages, reports,
screens, sprints, and exclusions. Architecture lives in
`architecture-context.md`. UI details live in `ui-context.md`.

---

# 1. Product Identity

### Product Name

Sweety

### Product Type

Personal blood glucose tracker (web app)

### Product Vision

Sweety helps a diabetes patient record up to four blood glucose readings
per day and view daily and monthly reports. The product prioritizes
working features, clean readable code, and correct validation. A simple
UI is fine.

---

# 2. Problem Statement

Patients need a private place to:

- Log glucose values at fixed times of day
- Avoid duplicate slot entries for the same date
- See highest, lowest, and average readings over useful date ranges

Sweety solves this with authenticated personal readings and three report
types. It does **not** provide medical diagnosis or treatment advice.

---

# 3. Target Users

## Primary User

### Patient

- Registers with name, email, and password
- Logs in and manages only their own readings
- Views daily, month-to-date, and previous-month reports

No other roles are in scope for the required assignment (no doctor role
unless explicitly approved later as a bonus).

---

# 4. Required Modules

## 4.1 Authentication

- Register: name, email, password
- Log in: email, password
- Passwords hashed with bcrypt; never store plain text
- After login, the user only sees their own readings
- Protect all reading and report APIs with JWT (Bearer)

## 4.2 Readings CRUD

Each reading has:

| Field | Notes |
|-------|--------|
| Date | Calendar date; not in the future |
| Time slot | One of four fixed slots |
| Value | Integer mg/dl |

### Time slots (exact set)

1. Morning (fasting) — API enum: `MORNING`
2. After breakfast — API enum: `AFTER_BREAKFAST`
3. After lunch — API enum: `AFTER_LUNCH`
4. After dinner — API enum: `AFTER_DINNER`

Operations: create, list/view, edit, delete.

## 4.3 Reports

Every report shows:

- Highest reading
- Lowest reading
- Average reading (rounded to **1 decimal**)
- Number of readings

If there are no readings in the range, show a friendly empty state (see
`ui-context.md`).

| Report | Date range | Example (selected date 15 Oct 2026) |
|--------|------------|-------------------------------------|
| Daily | The selected date only | 15 Oct 2026 |
| Month-to-date | 1st of that month → selected date | 1 Oct – 15 Oct 2026 |
| Monthly | Entire **previous** calendar month | 1 Sep – 30 Sep 2026 |

Daily report also lists each reading with its slot.

**Do not** compute “Monthly” as the current month. For selected
2026-10-15, monthly = September 2026.

---

# 5. Validation Rules (binding)

Validate on **frontend and backend** with Zod. Backend is the source of
truth. Show these exact messages in the UI when a rule fails.

| Rule | Example error message |
|------|------------------------|
| Value is required | `Please enter a glucose value.` |
| Value must be a whole number between 40 and 600 | `Value must be between 40 and 600 mg/dl.` |
| Only one reading per slot per day | `You already have an After lunch reading for this date.` |
| Maximum 4 readings per day | `You can add only 4 readings per day.` |
| Date cannot be in the future | `Date cannot be in the future.` |

Notes:

- Duplicate-slot message uses the **human slot label** for that request
  (e.g. “After lunch”, “Morning (fasting)”).
- Decimal values are invalid (whole numbers only).
- Enforce unique `(user_id, reading_date, time_slot)` in PostgreSQL as
  well as in the API.

Auth validation (minimum):

- Name, email, password required on register
- Valid email format
- Duplicate email rejected with a clear message
- Invalid login credentials rejected without leaking which field failed

---

# 6. Approved Screens

Only these screens exist until the overview is updated:

1. Login
2. Register
3. Dashboard (today’s readings + quick stats + link to add)
4. Readings (list + add/edit/delete)
5. Reports (daily / month-to-date / monthly picker)

Do not invent admin panels, settings hubs, or medical advice screens.

---

# 7. Dual Validation & API Errors

- Frontend: instant field errors for better UX
- Backend: always re-validate; never trust the client
- Responses use the ApiError / ApiResponse shape documented in
  `architecture-context.md`
- Map API `message` / `errors` into the form UI so server messages match
  the assignment strings

---

# 8. Explicit Exclusions

Do **not** add unless the user explicitly reopens scope:

- MongoDB (PostgreSQL only)
- Automated test suites (Jest, Vitest, RTL, Supertest, etc.)
- Medical diagnosis, ranges labeled “safe/dangerous”, treatment advice
- Redis caching, BullMQ jobs, doctor role (optional bonuses — skip unless asked)
- Cloudinary, email sending, chat, push notifications
- npm / yarn / pnpm workflows (Bun only)

Allowed optional bonuses **after** required features work (pick any):

- Pagination on `GET /readings`
- Recharts line chart for the month
- Docker Compose
- (Others from the assignment brief only if requested)

---

# 9. Sprint Roadmap (~10–15 hours)

### Sprint 0 — Context & rules (current)

- Context pack, AGENTS.md, editor adapters, `.gitignore`
- **Wait for user command** before folder structure / scaffolding

### Sprint 1 — Infrastructure & Auth (MVP skeleton)

- `client/` + `server/` scaffold with Bun
- PostgreSQL + Prisma schema
- Register / login / JWT middleware
- ApiError, ApiResponse, asyncHandler, error middleware

### Sprint 2 — Readings & core UI (MVP muscle)

- Readings CRUD APIs with full validation
- Dashboard + Readings pages
- Feature components + hooks

### Sprint 3 — Reports & polish

- Daily, month-to-date, previous-month reports
- Empty states, responsive pass
- Optional: pagination and/or chart

### Sprint 4 — Submission armor

- Seed script (demo user + sample readings)
- `.env.example`, README (install, DB, run, Notes)
- Screenshots or short recording
- **No automated tests required**

---

# 10. Submission Checklist (no tests)

- [ ] Public GitHub repo with regular commits (only when user asks to push)
- [ ] Working register / login with bcrypt
- [ ] Readings CRUD + all five validation rules
- [ ] Daily, month-to-date, previous-month reports
- [ ] User-specific data isolation
- [ ] README: install, DB setup, run server/client
- [ ] `.env.example` (no secrets)
- [ ] Seed script with demo user + readings
- [ ] Screenshots or 2–3 minute recording
- [ ] README Notes: assumptions + future improvements

---

# 11. Assumptions (document in README later)

- Unit is mg/dl only (no mmol/L conversion)
- “Monthly” report means the previous calendar month relative to the
  selected date
- JWT stored client-side (e.g. memory + localStorage) and sent as
  `Authorization: Bearer <token>` unless changed later
- Timezone: reading dates are calendar dates (`YYYY-MM-DD`), not shifted
  by UTC conversion
- No medical interpretation of values

---

# 12. Ownership Notes

- Scope changes → edit this file
- Stack / folders / API shapes → `architecture-context.md`
- Per-library idioms → `stack-standards.md`
- Coding style / components → `code-standards.md`
- Visual / responsive → `ui-context.md`
- Current task → `progress-tracker.md` (gitignored)
