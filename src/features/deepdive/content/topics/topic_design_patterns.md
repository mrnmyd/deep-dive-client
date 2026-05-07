# Design patterns: singleton, factory, observer, strategy, decorator, adapter, facade, proxy

Singleton ensures one instance, but can become global mutable state. In Spring, singleton bean scope is usually enough; avoid hand-rolled singletons unless necessary.

Factory centralizes object creation. It is useful when construction depends on configuration or input type.

Observer publishes events to subscribers. It decouples producers from consumers but can make flow harder to trace.

Strategy selects behavior at runtime. Use it to replace condition-heavy algorithms.

Decorator wraps behavior without changing the original object. Java IO streams are a classic example.

Adapter converts one interface into another. Facade provides a simpler interface over a complex subsystem. Proxy controls access, lazily loads, logs, caches, or applies transactions.
