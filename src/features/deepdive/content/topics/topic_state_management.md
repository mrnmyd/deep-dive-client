# State management: TanStack Query, Redux Toolkit, Zustand, Context API

Frontend senior work is often about choosing the right state boundary. Not all state belongs in React component state, and not all performance issues need memoization.

Server state is data fetched from an API. It has caching, refetching, loading, error, and invalidation concerns. TanStack Query is built for this.

Client state is UI state owned by the browser session: selected tabs, modal state, filters, theme, and local drafts. Zustand works well for lightweight shared client state.

Redux Toolkit is useful when state transitions are complex, global, audited, or shared across large teams. It adds structure and devtools at the cost of ceremony.

Context is best for dependency injection and low-frequency values such as theme, auth user, or configuration. It is not automatically a full state management solution.
