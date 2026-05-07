# React engine: Virtual DOM, reconciliation, Fiber, lanes, concurrency, hydration

React senior interviews focus on rendering mental models: when components render, when effects run, how reconciliation works, and how concurrent rendering changes assumptions.

The Virtual DOM is a description of UI. React compares new element trees with previous ones and computes changes. Reconciliation uses type and key to decide whether to preserve or replace component instances.

Keys are identity, not display order. Bad keys cause state to move to the wrong item when lists reorder.

Fiber is React's internal unit of work. It allows rendering work to be paused, resumed, and prioritized. Lanes represent priority categories so urgent updates can be handled before less urgent ones.

Concurrent rendering means React may start rendering, pause, discard, and retry work. Components must be pure during render because render can happen more than once.

Hydration attaches React behavior to server-rendered HTML. Mismatches happen when server and client render different output, often due to dates, random values, or browser-only APIs during render.
