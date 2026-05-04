# React Internals

React senior interviews focus on rendering mental models: when components render, when effects run, how reconciliation works, and how concurrent rendering changes assumptions.

## React engine: Virtual DOM, reconciliation, Fiber, lanes, concurrency, hydration

The Virtual DOM is a description of UI. React compares new element trees with previous ones and computes changes. Reconciliation uses type and key to decide whether to preserve or replace component instances.

Keys are identity, not display order. Bad keys cause state to move to the wrong item when lists reorder.

Fiber is React's internal unit of work. It allows rendering work to be paused, resumed, and prioritized. Lanes represent priority categories so urgent updates can be handled before less urgent ones.

Concurrent rendering means React may start rendering, pause, discard, and retry work. Components must be pure during render because render can happen more than once.

Hydration attaches React behavior to server-rendered HTML. Mismatches happen when server and client render different output, often due to dates, random values, or browser-only APIs during render.

## Hooks: effects, refs, reducer, context, memoization

`useEffect` synchronizes with external systems after paint. `useLayoutEffect` runs before paint and is for layout measurement or DOM mutations that must happen before the user sees the frame.

`useRef` stores mutable values that do not trigger renders. Use it for DOM nodes, timers, and instance-like values.

`useReducer` centralizes complex state transitions. It is useful when state changes are event-driven and multiple fields change together.

Context passes values through the tree, but every consumer can re-render when the value changes. Split contexts or memoize values when needed.

`useMemo` and `useCallback` are performance tools, not default requirements. Use them when preventing expensive recalculation or stabilizing references for memoized children.

## Patterns: HOC, render props, compound components, controlled vs uncontrolled

Higher-order components wrap components to add behavior. Render props pass a function to customize rendering. Both are still useful concepts, but hooks often replace them for local logic reuse.

Compound components let multiple components coordinate through context while presenting a clean API, such as Tabs, Select, or Accordion.

Controlled inputs store value in React state. Uncontrolled inputs store value in the DOM and are read through refs or form submission. Controlled is predictable; uncontrolled can be cheaper and simpler for large forms.
