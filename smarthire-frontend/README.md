# SmartHire Frontend

React 18 + Vite 5 + Tailwind CSS 3, implementing the SmartHire Frontend Design System
(three role-differentiated portals sharing one component system).

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:5173 — you'll land on `/login`. There are demo shortcut links
on the login page to jump straight into the Recruiter or Admin portal (no real auth
wired up yet, since this is a frontend-only design-system implementation).

## How theming works

`src/App.jsx` sets `data-theme="student" | "recruiter" | "admin"` on `<html>` based on
the current route prefix (`/student/*`, `/recruiter/*`, `/admin/*`). `src/index.css`
defines the three token blocks (`:root[data-theme='...']`) from the design system —
primary, accent, background, surface, text, muted, border. Every shared component
reads `var(--primary)` etc., so switching theme is purely a CSS variable swap; no
component logic changes between portals.

`tailwind.config.js` also carries the flat `st-*` / `rc-*` / `ad-*` color tokens from
the spec's Tailwind reference, for anywhere you want to reach for a Tailwind class
directly instead of a CSS variable.

## Structure

```
src/
  components/   Shared components: Navbar, PageHeader, Card, Button, ScoreBadge,
                StatusPill, DataTable, EmptyState, Toast, Modal, LoadingSpinner,
                AvatarInitials
  layouts/      The 4 page layout patterns from the spec: CenteredFormLayout,
                FullWidthListLayout, DashboardLayout, DetailLayout
  pages/
    student/    Login, Dashboard, BrowseJobs, JobDetail, MyApplications
    recruiter/  Dashboard, MyDrives, Applicants (ranked list + actions), PostDrive
    admin/      Dashboard, Students, Recruiters (approval queue)
  context/      ToastContext — call useToast().showToast(message, type) anywhere
  lib/          mockData.js — placeholder data standing in for the Spring Boot API
```

## Wiring to your Spring Boot + MySQL backend

Every page currently reads from `src/lib/mockData.js`. To connect the real API:

1. Add an API client (e.g. `src/lib/api.js` with `fetch`/`axios`, base URL from
   `import.meta.env.VITE_API_URL`).
2. Replace the imports from `mockData.js` in each page with data fetched via
   `useEffect` + `useState` (or a data-fetching library like TanStack Query).
3. Wire `Login.jsx`, the "Apply Now" modal in `JobDetail.jsx`, the Shortlist/Reject
   buttons in `Applicants.jsx`, and the Approve/Block buttons in `Recruiters.jsx`
   to real POST/PATCH endpoints — they're already isolated as single handler
   functions, so this is a drop-in change per file.
4. Add real auth/session handling and route guards per role (currently any route
   is reachable — the demo shortcuts on the login page are there specifically
   because there's no auth gate yet).

## Notes on the design system implementation

- Every card uses the signature 3.5px coloured left border (`.card` in `index.css`).
- Cards use `shadow-none`; shadows are reserved for Modal and Toast (floating elements).
- `ScoreBadge` and `StatusPill` colors follow the spec's tables exactly (0–40/41–70/71–100
  for scores; the 6-state pipeline for application status).
- Radius scale (`rounded-card` 8px, `rounded-btn` 6px, `rounded-input` 4px, `rounded-modal`
  12px) is wired into `tailwind.config.js` as named tokens, not raw Tailwind defaults.
