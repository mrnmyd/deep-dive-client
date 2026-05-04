# Deep Dive Client Documentation

This directory contains the working documentation for PrepTracker, the product being built on top of the ForgeStack React Template.

## Current Template Context

The project is now a React 19, TypeScript, and Vite frontend application using the template's routing, theme, shadcn/Radix UI primitives, reusable form controls, and reusable data table primitives. PrepTracker itself is a localStorage-first study portal: the main workflow is starting a study session, selecting up to 3 modules, studying built-in material, and marking topics complete.

Key areas:

- App composition: `src/app/App.tsx`
- Router: `src/app/router/router.tsx`
- Route constants: `src/constants/routes.constant.ts`
- PrepTracker feature module: `src/features/preptracker`
- Public layout: `src/components/layouts/public`
- Admin layout and menu: `src/components/layouts/admin`
- Auth feature: `src/features/auth`
- Auth store: `src/stores/auth.store.ts`
- API clients: `src/lib/axios.ts`
- Form components: `src/components/form`
- Data table components: `src/components/data-table`
- Demo form page: `src/features/form-demo`
- Demo data table page: `src/features/data-table-demo`

The public/admin/auth/demo template areas remain in the repository as reusable reference material, but the active product route tree now renders PrepTracker pages.

## Documentation Plan

As product requirements are provided, keep project documentation here and update it alongside implementation work.

Suggested documents:

- `Project_Reference.md`: product goals, users, workflows, data model, feature requirements, seed content, and implementation status.
- `product-requirements.md`: future product requirement refinements that should not clutter the main reference.
- `technical-architecture.md`: app structure, module boundaries, routing, state, API contracts, and integration notes.
- `implementation-log.md`: decisions made during development and notable changes over time.
- `api-contracts.md`: backend endpoints, request/response shapes, auth behavior, and error handling.
- `ui-guidelines.md`: navigation, page structure, reusable UI patterns, and design decisions.

## Working Rules

- Update documentation when requirements change or implementation decisions become durable.
- Prefer concise decisions and concrete file references over broad documentation entries.
- Keep demo/template behavior separate from product requirements until it is intentionally adopted.
