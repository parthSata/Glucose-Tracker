# Sweety — UI Context

Owns: visual direction, approved screens, component composition,
responsive behavior, and UI states. Code structure lives in
`code-standards.md`. Product scope lives in `project-overview.md`.

---

# 1. UI Vision

Sweety should feel:

- Calm
- Clear
- Trustworthy
- Simple
- Health-oriented (not clinical / scary)

A simple UI is explicitly fine for this assignment. Prefer clarity over
visual spectacle.

---

# 2. Design Philosophy

Prioritize:

1. Clarity
2. Usability
3. Information hierarchy
4. Consistency
5. Speed
6. Accessibility basics
7. Readable typography

Effects should support the task, not distract from logging a reading.

---

# 3. Visual Direction

- Light, clean surfaces with soft depth (subtle background wash or soft
  gradient — not flat gray alone, not neon)
- Accent: soft teal / mint / leaf green (health cue) — **not** purple-on-white
  AI cliché, not terracotta-on-cream cliché
- Clear primary CTA for “Add reading”
- Rounded corners moderately; avoid heavy multi-layer shadows and glow
- Stats as simple StatCard primitives — not a dense dashboard wall on
  first paint if it hurts focus

Do **not**:

- Classify readings as medically “safe” / “dangerous” with alarm colors
  unless the user later asks
- Use emoji-heavy UI
- Use dark mode as the default
- Cover the hero/dashboard with floating badges and promo chips

---

# 4. Approved Screens

| Screen | Purpose |
|--------|---------|
| Login | Email + password |
| Register | Name + email + password |
| Dashboard | Today’s readings, quick stats, CTA to add |
| Readings | History + add/edit/delete |
| Reports | Date picker + daily / MTD / monthly views |

Do not invent extra marketing pages or admin consoles.

---

# 5. Forms & Validation UI

- Show errors under the relevant field
- Use exact assignment strings from `project-overview.md` §5
- Disable or debounce submit while saving; show loading on the button
- On API failure, display server `message` (especially duplicate slot /
  max 4)
- Required fields marked clearly

---

# 6. Reports UI

Always show:

- Date range label
- Highest / lowest / average / count

Daily: also list readings with human slot labels.

Empty state copy (friendly):

> No glucose readings found for this period. Start recording your
> readings to see your report.

Reuse `EmptyState` from `components/ui`.

---

# 7. Component Composition

## Shared primitives (`components/ui/`)

One file each: Button, Input, Select, Label, ErrorText, Modal,
EmptyState, Spinner, StatCard.

## Feature components (`components/features/...`)

Examples:

- `auth/login-form.tsx`
- `auth/register-form.tsx`
- `readings/reading-form.tsx`
- `readings/reading-list-item.tsx`
- `reports/report-summary.tsx`
- `reports/daily-reading-list.tsx`

## Pages

Pages only compose. **Never** declare multiple components inside a
page file.

Before adding UI, search existing components and reuse.

---

# 8. States (required)

Every data view must support:

- Loading (spinner or skeleton)
- Empty (EmptyState)
- Error (readable message + retry if useful)
- Success feedback on create/update/delete (toast or inline)

Never leave a blank white failure.

---

# 9. Responsive Rules (binding)

Mobile-first with Tailwind.

Verify layouts at:

| Width | Expectation |
|-------|-------------|
| 375px | Phone: single column, full-width inputs, tap targets ≥ 44px |
| 768px | Tablet: comfortable two-column where it helps (e.g. stats) |
| 1024px+ | Desktop: readable max width, not stretched edge-to-edge chaos |

Rules:

- No horizontal scroll on primary flows
- Forms stack on small screens
- Tables/lists become stacked cards on narrow viewports if needed
- Nav accessible on mobile (simple top nav or clear links)
- Touch-friendly spacing

---

# 10. Motion

Optional and minimal: one soft fade/slide on page content, button
active states. Do not add animation libraries unless needed.

---

# 11. Accessibility Basics

- Labels associated with inputs
- Buttons are real `<button>` elements
- Sufficient contrast for text
- Errors announced via text near fields (not color alone)

---

# 12. Copy Tone

- Direct and calm
- No medical advice
- Slot labels match product language: Morning (fasting), After breakfast,
  After lunch, After dinner
