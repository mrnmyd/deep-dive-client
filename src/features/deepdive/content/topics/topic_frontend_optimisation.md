# Optimisation: memo, windowing, code splitting, image optimisation

Performance starts with measuring. Use the React Profiler and browser performance tools before adding abstractions.

`React.memo` skips child renders when props are equal. It helps when children are expensive and props are stable. It does not help if parents pass new objects/functions every render.

Windowing renders only visible list items. Use it for large lists and tables where DOM size becomes the bottleneck.

Code splitting reduces initial bundle size by loading routes or heavy features on demand. `React.lazy` and dynamic imports are common approaches.

Image optimisation includes correct dimensions, modern formats, lazy loading, responsive sources, and avoiding layout shift.
