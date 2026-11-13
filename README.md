# 🩸 Sweety — Blood Glucose Tracker

Sweety is a clean, responsive, and secure personal blood glucose tracking web application. Designed specifically for diabetic patients, Sweety enables users to log up to four blood glucose readings per day across fixed time slots, enforce strict clinical validation rules, and review comprehensive daily, month-to-date, and previous-month summary reports.

---

## 📱 Module Walkthrough & Screenshots

### 1. Authentication Module (Register & Login)

<p align="center">
  <img src="docs/screenshots/register.png" alt="Register Page" width="49%" />
  <img src="docs/screenshots/login.png" alt="Login Page" width="49%" />
</p>

The Authentication module provides secure onboarding, session management, and strict user data isolation.

- **User Registration**:
  - Collects `Name`, `Email`, `Password`, and `Confirm password`.
  - Client-side and server-side Zod validation with real-time field error messaging.
  - Enforces duplicate email prevention with HTTP `409 Conflict` (`"An account with this email already exists."`).
- **User Login**:
  - Validates credentials against hashed passwords using `bcrypt.compare`.
  - Rejects invalid logins with a generic `401 Unauthorized` (`"Invalid email or password."`) to protect against user enumeration.
  - Returns stateless JSON Web Tokens (JWT) signed with `JWT_SECRET`.
- **Security & Data Isolation**:
  - `passwordHash` is stripped from all user objects and never exposed over the API.
  - Every reading and report query filters by `req.user.id` from the decoded token.
  - Stateless client-side logout cleanly clears local session state and cached credentials.

---

### 2. Dashboard Module (Overview & Quick Stats)

![Dashboard Overview](docs/screenshots/dashboard.png)

The Dashboard serves as the central health command center, giving patients an immediate summary of today's progress and historical trends.

- **Personalized Patient Greeting**: Displays the patient's name, formatted current calendar date, and a prominent `+ Add reading` action button.
- **Quick Stats Grid** (Responsive 5-column layout):
  1. **Today’s Completion**: Real-time ratio of logged slots (e.g. `4 of 4 logged`).
  2. **Highest Today**: Peak blood glucose value recorded today in mg/dl.
  3. **Lowest Today**: Lowest blood glucose value recorded today in mg/dl.
  4. **Average Today**: Mean glucose level calculated and rounded to 1 decimal place.
  5. **Total Readings**: Cumulative lifetime readings count across all recorded dates.
- **Today's Readings Schedule**: Dedicated card showcasing the four slots (`Morning (fasting)`, `After breakfast`, `After lunch`, `After dinner`) with values and timestamps.
- **Zero-State Fallback**: Displays a welcoming `EmptyState` component when no readings have been recorded for the day with a direct CTA to log the first reading.

---

### 3. Readings Module (CRUD & Validation)

![Readings Management](docs/screenshots/readings.png)

The Readings module owns complete lifecycle management for blood glucose entries, enforcing strict medical logging constraints.

- **Two-Column Desktop / Single-Column Mobile Layout**:
  - Left panel: **Add Reading Form** (sticky on desktop for fast logging).
  - Right panel: **Your Readings List** (chronologically sorted by date descending).
- **Add & Edit Readings**:
  - **Date Picker**: Calendar date input with `max` bound to today's local date (future dates blocked).
  - **Time Slot Dropdown**: Custom accessible select component featuring the four clinical slots:
    1. `MORNING` — Morning (fasting)
    2. `AFTER_BREAKFAST` — After breakfast
    3. `AFTER_LUNCH` — After lunch
    4. `AFTER_DINNER` — After dinner
  - **Glucose Value Input**: Numeric input constrained to whole numbers with unit indicator (`mg/dl`).
- **Five Mandatory Clinical Validation Rules**:
  1. **Value Required**: `"Please enter a glucose value."`
  2. **Whole Number Range (40–600)**: `"Value must be between 40 and 600 mg/dl."` (decimals rejected).
  3. **One Slot Per Day**: `"You already have an <Slot Label> reading for this date."`
  4. **Maximum 4 Readings Per Day**: `"You can add only 4 readings per day."`
  5. **No Future Dates**: `"Date cannot be in the future."`
- **Actions & Modals**:
  - **Detail Modal**: Inspect reading metadata, slot badges, values, and audit timestamps (`createdAt`, `updatedAt`).
  - **Edit Modal**: In-place modification with conflict checking.
  - **Delete Dialog**: Accessible confirmation dialog explicitly stating the date, slot, and value before permanent removal (*"This action cannot be undone."*).
- **Pagination**: 5 readings per page with responsive `Previous` / `Next` buttons to keep long histories lightweight.
- **Notifications**: Instant feedback via colored toasts on create, update, and delete.

---

### 4. Reports & Analytics Module (Daily, MTD & Monthly)

![Reports and Analytics](docs/screenshots/reports.png)

The Reports module aggregates historical glucose data across three clinical reporting horizons.

- **Interactive Report Type Switcher**: Seamless pill navigation between **Daily**, **Month-to-date**, and **Monthly** reports.
- **Dynamic Date Picker**: Select reference dates with automatic range calculations and boundary validation.
- **Comprehensive Statistics Summary**:
  - **Highest reading** in range (mg/dl)
  - **Lowest reading** in range (mg/dl)
  - **Average reading** in range (rounded to 1 decimal place)
  - **Total readings count** in range
- **Three Supported Reporting Horizons**:
  1. **Daily Report**: Analyzes the selected date and renders an accessible reading details table listing each entry in chronological slot order with badges and values.
  2. **Month-to-date Report**: Aggregates all readings from the 1st of that month through the selected date (inclusive).
  3. **Monthly Report**: Calculates statistics over the **entire previous calendar month** relative to the selected reference date (e.g. for any date in November 2026, computes October 1st–31st).
- **Friendly Empty State**: When a selected period has no readings, renders a calm message (*"No glucose readings found for this period. Start recording your readings to see your report."*) without calculation errors or blank screens.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Runtime & Package Manager** | [Bun](https://bun.sh/) (v1.1+) |
| **Frontend Framework** | [React 19](https://react.dev/), [Vite](https://vitejs.dev/), [TypeScript](https://www.typescriptlang.org/) |
| **Styling & Icons** | [Tailwind CSS 4](https://tailwindcss.com/), Custom SVG Icons |
| **State & Networking** | [Zustand](https://github.com/pmndrs/zustand), [Axios](https://axios-http.com/), [React Router 7](https://reactrouter.com/) |
| **Backend Framework** | [Express 5](https://expressjs.com/), [TypeScript](https://www.typescriptlang.org/) |
| **Database & ORM** | [PostgreSQL](https://www.postgresql.org/) ([Neon Cloud](https://neon.tech/)), [Prisma ORM 6](https://www.prisma.io/) |
| **Validation & Security** | [Zod 4](https://zod.dev/), [bcrypt](https://github.com/kelektiv/node.bcrypt.js), [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) |
| **Testing** | Bun Test runner (`bun:test`) |

---

## 📁 Project Folder Structure

```text
Glucose-Tracker/
├── client/                           # Frontend React + Vite application
│   ├── src/
│   │   ├── components/
│   │   │   ├── features/             # Feature-specific components
│   │   │   │   ├── auth/             # Login, Register, Protected routes
│   │   │   │   ├── dashboard/        # Welcome banner, quick stats, today's list
│   │   │   │   ├── readings/         # Reading form, list item, modals, dialogs
│   │   │   │   └── reports/          # Date picker, type switcher, summary cards, tables
│   │   │   ├── layout/               # AppShell navigation header & container
│   │   │   └── ui/                   # Shared UI primitives (Button, Input, Dropdown, Modal, etc.)
│   │   ├── hooks/                    # Reusable React hooks for domain logic & API calls
│   │   ├── lib/                      # Axios client, Zod schemas, date & stats helpers, toast
│   │   ├── pages/                    # Thin compose pages (Dashboard, Readings, Reports, Login, Register)
│   │   ├── store/                    # Zustand authentication store
│   │   ├── types/                    # Frontend TypeScript interfaces
│   │   ├── App.tsx                   # Route definitions & ToastContainer
│   │   └── main.tsx                  # React DOM entry point
│   ├── .env.example                  # Client environment template
│   └── package.json
│
├── server/                           # Backend Express REST API
│   ├── prisma/
│   │   ├── migrations/               # PostgreSQL schema migrations
│   │   ├── schema.prisma             # Prisma database schema & constraints
│   │   └── seed.ts                   # Database seed script
│   ├── src/
│   │   ├── __tests__/                # Bun test suite (21 comprehensive scenarios)
│   │   ├── config/                   # Zod environment variable parsing
│   │   ├── constants/                # Time slots & daily limit constants
│   │   ├── controllers/              # Thin Express controllers (Auth, Readings, Reports, Health)
│   │   ├── lib/                      # Date parsing, Prisma client, stats calculators
│   │   ├── middleware/               # Auth (JWT), validation (Zod), centralized error handler
│   │   ├── routes/                   # Domain route definitions (/api/auth, /api/readings, /api/reports)
│   │   ├── services/                 # Core business logic & database queries
│   │   ├── utils/                    # ApiError, ApiResponse, asyncHandler, jwt helpers
│   │   ├── validators/               # Server-side Zod request body schemas
│   │   ├── app.ts                    # Express app configuration & middleware pipeline
│   │   └── server.ts                 # HTTP server bootstrap
│   ├── .env.example                  # Server environment template
│   └── package.json
│
├── context/                          # Project specifications & rules of engagement
├── docs/screenshots/                 # Application module screenshots
├── scripts/                          # Automated capture scripts
├── .env.example                      # Root environment template
├── AGENTS.md                         # Project workflow instructions
└── package.json                      # Monorepo root scripts
```

---

## 🚀 Quick Start & Installation

### 1. Prerequisites
Ensure you have **Bun** installed on your machine:
```bash
# Check Bun version (requires Bun 1.1+)
bun --version
```
*(If you need Bun, install it via `curl -fsSL https://bun.sh/install | bash` or on Windows `powershell -c "irm bun.sh/install.ps1 | iex"`).*

### 2. Clone Repository & Install Dependencies
```bash
git clone https://github.com/parthsata/sweety.git
cd sweety

# Install dependencies across all workspaces
bun install
```

---

## 🗄️ PostgreSQL Setup & Migrations

### 1. Configure Environment Variables
Copy `.env.example` to `server/.env` and `client/.env`:
```bash
# In the project root:
cp .env.example server/.env
cp client/.env.example client/.env
```

Ensure `server/.env` points to your PostgreSQL database:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/sweety?schema=public"
JWT_SECRET="dev-secret-key-sweety-change-in-production-min-32-chars"
JWT_EXPIRES_IN="7d"
BCRYPT_SALT_ROUNDS=10
PORT=5000
CLIENT_ORIGIN="http://localhost:5173"
NODE_ENV="development"
```

### 2. Run Database Migrations
Apply database migrations to set up the `users` and `readings` tables, indexes, and check constraints:
```bash
# Run migrations from root
bun run db:migrate

# Generate Prisma client
bun run db:generate
```

### 3. Seed Database with Sample Data
Populate demo users and historical sample readings across different dates and slots:
```bash
bun run db:seed
```

---

## 🔑 Demo Account Credentials

The seed script creates two pre-configured accounts:

| User | Email | Password | Role |
| :--- | :--- | :--- | :--- |
| **Demo Patient** | `demo@sweety.app` | `DemoPassword123@` | Primary demo user with full historical records |

---

## 💻 Running the Application

You can start the backend and frontend in separate terminals:

### Terminal 1: Backend Server
```bash
bun run dev:server
# Server will run on: http://localhost:5000
# Health check: http://localhost:5000/api/health
```

### Terminal 2: Frontend Client
```bash
bun run dev:client
# Client will run on: http://localhost:5173
```

Open your browser to [http://localhost:5173](http://localhost:5173) and log in with the demo credentials above.

---

## 🧪 Test Execution

Sweety includes a complete backend automated test suite built natively with `bun:test` covering all 21 requirements:

```bash
# Run backend test suite from root
bun run test:server

# Or directly from the server directory
bun run --cwd server test
```

### Type Checking & Build Verification
```bash
# Run strict TypeScript check on both client and server
bun run typecheck

# Build frontend production bundle
bun run --cwd client build
```

---

## ⚙️ Environment Variables Reference

| Variable | Description | Required | Default |
| :--- | :--- | :---: | :--- |
| `DATABASE_URL` | PostgreSQL connection string for Prisma ORM | Yes | — |
| `JWT_SECRET` | Secret key used to sign and verify access tokens | Yes | — |
| `JWT_EXPIRES_IN` | Token validity duration | No | `7d` |
| `BCRYPT_SALT_ROUNDS` | Salt rounds for bcrypt password hashing | No | `10` |
| `PORT` | Port number for Express API server | No | `5000` |
| `CLIENT_ORIGIN` | Allowed origin for Express CORS middleware | No | `http://localhost:5173` |
| `NODE_ENV` | Application environment (`development` / `production`) | No | `development` |
| `VITE_API_URL` | Base API URL used by the Axios client in React | No | `http://localhost:5000/api` |

> [!NOTE]
> **Cookie Configuration**: Not applicable. Sweety implements stateless Bearer token authorization via `Authorization: Bearer <token>` headers.
>
> **Third-Party Services**: Not applicable. No external services (Redis, Cloudinary, AWS S3, or email sending) are required.

---

## 📌 Assumptions & Decisions

1. **Measurement Units**: Blood glucose values are recorded strictly in **mg/dl** (integers between 40 and 600). No conversion to mmol/L is performed.
2. **Monthly Report Definition**: The "Monthly" report displays the entire **previous calendar month** relative to the selected reference date (e.g. selecting November 13th evaluates October 1st–31st).
3. **Calendar Date Preservation**: Reading dates are stored as UTC midnight (`@db.Date`), ensuring calendar days (`YYYY-MM-DD`) are never shifted by client timezone offsets.
4. **Stateless JWT Auth**: Tokens are stored client-side in memory and `localStorage`. Logout is handled by client-side token discard.
5. **No Medical Diagnosis**: The app provides clean statistics and record management; it explicitly does not provide clinical diagnoses or label values as "safe" or "dangerous".

---

## 🔮 Future Improvements

1. **Interactive Glucose Trend Charts**: Add visual Recharts / Chart.js trendline visualizations to the Reports page.
2. **PDF / CSV Report Export**: Allow patients to export their monthly reports as doctor-ready PDF or CSV summaries.
3. **Estimated A1C Metric**: Calculate approximate 90-day estimated average glucose (eAG) and projected HbA1c.
4. **Token Refresh Rotation**: Introduce refresh tokens in HTTP-only cookies with token revocation for enhanced enterprise session security.
5. **Internationalization (i18n)**: Support multi-language localized interfaces and alternative regional units (mmol/L).
