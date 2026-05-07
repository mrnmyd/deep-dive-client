# Hooks: effects, refs, reducer, context, memoization

`useEffect` synchronizes with external systems after paint. `useLayoutEffect` runs before paint and is for layout measurement or DOM mutations that must happen before the user sees the frame.

`useRef` stores mutable values that do not trigger renders. Use it for DOM nodes, timers, and instance-like values.

`useReducer` centralizes complex state transitions. It is useful when state changes are event-driven and multiple fields change together.

Context passes values through the tree, but every consumer can re-render when the value changes. Split contexts or memoize values when needed.

`useMemo` and `useCallback` are performance tools, not default requirements. Use them when preventing expensive recalculation or stabilizing references for memoized children.
