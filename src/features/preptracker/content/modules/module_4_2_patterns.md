# Design Patterns & Principles

Senior engineering is often about making change cheaper. Principles and patterns help only when they reduce coupling, clarify intent, or contain complexity.

## SOLID principles with Java examples

Single Responsibility means a class has one reason to change. A service that validates input, talks to the database, sends email, and formats reports has too many reasons to change.

Open/Closed means behavior should be extendable without editing stable code. Strategy pattern is a common implementation: add a new strategy instead of adding another `if`.

Liskov Substitution means subclasses must be usable wherever the parent is expected. Violations often appear when subclass methods throw unsupported-operation exceptions.

Interface Segregation means clients should not depend on methods they do not use. Prefer smaller role-specific interfaces.

Dependency Inversion means high-level modules should depend on abstractions, not concrete low-level details. This improves testing and replacement.

## Design patterns: singleton, factory, observer, strategy, decorator, adapter, facade, proxy

Singleton ensures one instance, but can become global mutable state. In Spring, singleton bean scope is usually enough; avoid hand-rolled singletons unless necessary.

Factory centralizes object creation. It is useful when construction depends on configuration or input type.

Observer publishes events to subscribers. It decouples producers from consumers but can make flow harder to trace.

Strategy selects behavior at runtime. Use it to replace condition-heavy algorithms.

Decorator wraps behavior without changing the original object. Java IO streams are a classic example.

Adapter converts one interface into another. Facade provides a simpler interface over a complex subsystem. Proxy controls access, lazily loads, logs, caches, or applies transactions.

## Architecture: microservices, API gateway, circuit breaker, saga

Microservices split systems by business capability and deploy independently. They add network calls, distributed tracing, data ownership problems, and operational overhead. A modular monolith can be the better starting point.

API Gateway centralizes cross-cutting edge concerns such as routing, authentication, rate limiting, and aggregation.

Circuit breakers stop repeated calls to a failing dependency. States are closed, open, and half-open. They protect resources and allow recovery.

Saga coordinates distributed workflows without a single global transaction. Choreography uses events. Orchestration uses a central coordinator. Both require compensation logic for failures.
