# State & Performance

Frontend senior work is often about choosing the right state boundary. Not all state belongs in React component state, and not all performance issues need memoization.

## State management: TanStack Query, Redux Toolkit, Zustand, Context API

Server state is data fetched from an API. It has caching, refetching, loading, error, and invalidation concerns. TanStack Query is built for this.

Client state is UI state owned by the browser session: selected tabs, modal state, filters, theme, and local drafts. Zustand works well for lightweight shared client state.

Redux Toolkit is useful when state transitions are complex, global, audited, or shared across large teams. It adds structure and devtools at the cost of ceremony.

Context is best for dependency injection and low-frequency values such as theme, auth user, or configuration. It is not automatically a full state management solution.

## Optimisation: memo, windowing, code splitting, image optimisation

Performance starts with measuring. Use the React Profiler and browser performance tools before adding abstractions.

`React.memo` skips child renders when props are equal. It helps when children are expensive and props are stable. It does not help if parents pass new objects/functions every render.

Windowing renders only visible list items. Use it for large lists and tables where DOM size becomes the bottleneck.

Code splitting reduces initial bundle size by loading routes or heavy features on demand. `React.lazy` and dynamic imports are common approaches.

Image optimisation includes correct dimensions, modern formats, lazy loading, responsive sources, and avoiding layout shift.
