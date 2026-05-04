# Deep Dive Client Documentation

This directory contains the working documentation for the product being built on top of the ForgeStack React Template.

## Current Template Context

The project is a React 19, TypeScript, and Vite frontend scaffold with routing, auth flow wiring, admin/public layouts, reusable form controls, and reusable data table primitives already in place.

Key areas:

- App composition: `src/app/App.tsx`
- Router: `src/app/router/router.tsx`
- Route constants: `src/constants/routes.constant.ts`
- Public layout: `src/components/layouts/public`
- Admin layout and menu: `src/components/layouts/admin`
- Auth feature: `src/features/auth`
- Auth store: `src/stores/auth.store.ts`
- API clients: `src/lib/axios.ts`
- Form components: `src/components/form`
- Data table components: `src/components/data-table`
- Demo form page: `src/features/form-demo`
- Demo data table page: `src/features/data-table-demo`

## Documentation Plan

As product requirements are provided, keep project documentation here and update it alongside implementation work.

Suggested documents:

- `product-requirements.md`: product goals, users, roles, workflows, and feature requirements.
- `technical-architecture.md`: app structure, module boundaries, routing, state, API contracts, and integration notes.
- `implementation-log.md`: decisions made during development and notable changes over time.
- `api-contracts.md`: backend endpoints, request/response shapes, auth behavior, and error handling.
- `ui-guidelines.md`: navigation, page structure, reusable UI patterns, and design decisions.

## Working Rules

- Update documentation when requirements change or implementation decisions become durable.
- Prefer concise decisions and concrete file references over broad notes.
- Keep demo/template behavior separate from product requirements until it is intentionally adopted.
