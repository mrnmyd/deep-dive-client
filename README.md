# ForgeStack React Template

ForgeStack React Template is a production-oriented React scaffold built for applications that need more than a blank Vite starter. It gives you an opinionated frontend foundation with routing, public and admin layouts, authentication flow wiring, API utilities, global state, form abstractions, data-table primitives, and demo pages that show how the pieces fit together.

This repository is intended to be cloned and adapted. It is not a component package. The included demo routes and placeholder pages exist on purpose so a new team can see how to structure an application before replacing scaffold content with domain-specific features.

## What This Project Provides

This scaffold already includes:

- React 19 + TypeScript + Vite application setup
- Tailwind CSS v4 styling foundation
- Shadcn/Radix-based UI primitives under `src/components/ui`
- React Router setup with public and admin shells
- Auth bootstrap and guarded route flow
- Zustand stores for auth, theme, and app-level state
- React Query provider and shared query client
- Axios clients for public/authenticated API access with refresh-token retry handling
- Shared error normalization and form error application utilities
- Reusable form components built on React Hook Form + Zod
- Reusable data table component supporting both client-side and backend-driven mode
- Public and admin layout demos so users can understand route organization quickly

## Stack

- `react`, `react-dom`
- `typescript`
- `vite`
- `react-router-dom`
- `@tanstack/react-query`
- `@tanstack/react-table`
- `zustand`
- `axios`
- `react-hook-form`
- `zod`
- `tailwindcss`
- `lucide-react`
- `sonner`

## Project Goals

The scaffold is designed to solve the repeated setup work that happens across business applications:

- building the same auth shell again and again
- wiring API clients and session handling repeatedly
- rebuilding common form controls for every project
- recreating table sorting, filtering, pagination, and column visibility
- having no consistent route/layout structure between projects

The intent is to provide a reusable base that is strict enough to be useful, but still easy to customize.

## Current Scaffold Status

At this point, the project is in a usable scaffold state.

What was validated:

- `npm run build` passes
- `npm run lint` passes
- the router now has a coherent demo structure
- login redirect behavior is consistent
- public demo links no longer point to dead routes by default

There are still normal extension tasks left for a real product, such as replacing demo pages, integrating a real backend, adding feature modules, and optionally splitting large bundles. That is expected for a scaffold.

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create your local `.env` from `.env.example`.

```env
VITE_API_BASE_URL="x"
```

Example:

```env
VITE_API_BASE_URL="http://localhost:8080/api"
```

### 3. Start the development server

```bash
npm run dev
```

### 4. Validate the scaffold

```bash
npm run lint
npm run build
```

## Available Scripts

- `npm run dev`: starts the Vite development server
- `npm run build`: runs TypeScript build and production bundling
- `npm run lint`: runs ESLint
- `npm run preview`: serves the production build locally

## Environment

The scaffold currently depends on:

- `VITE_API_BASE_URL`: base URL for backend API requests

The Axios layer throws early if this variable is missing, which is intentional. A scaffold should fail clearly when core infrastructure is not configured.

## High-Level Architecture

### Application Shell

The app entry is in `src/app/App.tsx`. It wires:

- React Query provider
- theme provider
- toaster notifications
- router provider
- auth session bootstrap

### Routing

The router is defined in `src/app/router/router.tsx`.

The route tree is organized around layouts:

- `PublicLayout` for marketing/auth/public-facing routes
- `AdminLayout` for authenticated application routes

The repository includes demo placeholder routes to show how these layouts are intended to be used. These are scaffold references, not product requirements.

### API Layer

The API utilities live in `src/lib/axios.ts`.

The scaffold provides two Axios clients:

- `publicApi` for unauthenticated or public calls
- `authApi` for authenticated calls

The authenticated client includes refresh-token retry handling. On auth failure, it clears auth state and redirects the user to the login route.

### Auth Flow

Auth flow is built from:

- `src/hooks/useAuthSession.ts`
- `src/stores/auth.store.ts`
- `src/components/shared/auth-guard.tsx`
- `src/features/auth/*`

On app load:

1. `useAuthSession` calls the current-user endpoint.
2. The auth store is updated to `authenticated` or `unauthenticated`.
3. `AuthGuard` blocks protected routes until the status is known.

### Theme

Theme state is persisted with Zustand in `src/stores/theme.store.ts`.

The public layout already includes a working theme toggle. The admin layout currently uses a placeholder icon in the top-right by design, so the project can integrate a later admin-specific theme action cleanly.

## Layouts

### Public Layout

Files:

- `src/components/layouts/public/public-layout.tsx`
- `src/components/layouts/public/public-header.tsx`
- `src/components/layouts/public/public-footer.tsx`

Use this for:

- landing pages
- pricing/features/about pages
- login/register/forgot-password flows
- legal pages

The public header and footer include demo navigation. Those routes are intentionally scaffolded so a user can see layout usage immediately and replace content later.

### Admin Layout

Files:

- `src/components/layouts/admin/admin-layout.tsx`
- `src/components/layouts/admin/admin-sidebar.tsx`
- `src/components/layouts/admin/admin-header.tsx`
- `src/components/layouts/admin/menu.config.ts`

Use this for:

- dashboards
- internal tools
- authenticated CRUD pages
- settings pages

The admin shell includes:

- collapsible desktop sidebar
- mobile sidebar
- fixed sidebar with scrollable content pane
- footer in the main content area
- bottom account section in the sidebar

### Example Layout Usage

The router includes working examples of how to mount routes under each layout.

Public branch example:

```tsx
{
  element: <PublicLayout />,
  children: [
    { path: ROUTES.ROOT, element: <HomePage /> },
    { path: ROUTES.AUTH.LOGIN, element: <LoginPage /> },
  ],
}
```

Admin branch example:

```tsx
{
  element: <AdminLayout menu={adminMenu} />,
  children: [
    {
      element: <AuthGuard allowedRoles={[RoleEnum.ADMIN, RoleEnum.USER]} />,
      children: [
        { path: "/admin/dashboard", element: <DashboardPage /> },
      ],
    },
  ],
}
```

This is one of the main reasons the demo routes remain in the scaffold. They act as executable reference code.

## Forms

The reusable form layer lives in `src/components/form`.

Included controls:

- text input
- textarea
- select
- multi-select
- radio group
- checkbox
- switch
- number input
- slider
- OTP input
- date picker
- file upload

These components are designed to work with:

- React Hook Form
- the shared `FormFieldWrapper`
- the local Zod resolver adapter in `src/lib/zod-resolver.ts`

The form demo page at `ROUTES.FORM_COMPONENTS_DEMO` exists to show how to compose them together and how validation errors render.

## Data Table

The data table lives in `src/components/data-table`.

Features included:

- sortable columns
- search
- per-column filters
- active filter display
- column visibility toggling
- pagination
- support for fully client-side mode
- support for backend-driven mode

Backend-driven mode is useful when:

- pagination happens on the server
- filters are translated into query params
- large datasets should not be loaded into the browser

Client-side mode is useful when:

- the dataset is already loaded
- quick internal tools need simple local filtering and sorting

The demo page shows both patterns in one place.

## Error Handling

The error helpers in `src/lib/error-handler.ts` provide:

- normalization of unknown API errors into a common `AppError` shape
- mapping backend field errors into React Hook Form
- toast-based fallbacks for non-field errors
- auth failure redirect handling

This keeps mutation code simpler and helps standardize backend error handling across forms.

## State Management

### Zustand

Used for lightweight client state:

- auth state
- theme preference
- app-level initialization flags

### React Query

Used for server state:

- fetching remote data
- caching responses
- retry behavior
- invalidation and refetching patterns

This split is intentional. Local UI/session state and remote server state should not be managed by the same abstraction unless there is a strong reason.

## Directory Overview

```text
src/
  app/
    App.tsx
    router/
    providers/
  components/
    data-table/
    form/
    layouts/
    shared/
    ui/
  features/
    auth/
    data-table-demo/
    form-demo/
  hooks/
  lib/
  pages/
  stores/
  constants/
  enums/
  utils/
```

## Demo Routes Included On Purpose

Several routes in the public shell are placeholders by design. They are included so a consumer can inspect a complete route tree and understand how the scaffold is meant to be extended.

Examples:

- `/`
- `/features`
- `/pricing`
- `/about`
- `/auth/login`
- `/auth/register`
- `/privacy`
- `/terms`
- `/admin/dashboard`
- `/admin/users`
- `/admin/settings`

If your application does not need them, remove them. If it does, replace the placeholder pages with real implementations.

## How To Customize This Scaffold

Typical next steps after cloning:

1. Replace placeholder branding in the public header/footer.
2. Replace demo routes with domain pages.
3. Connect auth endpoints to your real backend contract.
4. Expand route constants and menu config for your product.
5. Replace mock data-table demos with actual feature queries.
6. Add feature-level API modules and query hooks.
7. Add tests if your team requires them in the base scaffold.

## Notes

- The current build reports a large bundle-size warning from Vite. The build still succeeds. If the scaffold grows further, introduce route-level code splitting.
- The project currently documents one environment variable because that is the only required runtime config in this scaffold state.
- The included `README.ABOUT.md` and other supporting documents can be kept as internal reference, but `README.md` should be treated as the primary entry point for new users of the scaffold.

## Summary

This project is now in a reasonable state to use as a React scaffold. It already gives a team a working application shell, route organization, auth/session bootstrap, reusable forms, reusable tables, API utilities, state management conventions, and demo routes that demonstrate intended usage. The next stage is no longer scaffold construction. It is product customization.
