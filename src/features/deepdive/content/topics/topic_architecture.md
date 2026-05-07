# Architecture: microservices, API gateway, circuit breaker, saga pattern

Microservices split systems by business capability and deploy independently. They add network calls, distributed tracing, data ownership problems, and operational overhead. A modular monolith can be the better starting point.

API Gateway centralizes cross-cutting edge concerns such as routing, authentication, rate limiting, and aggregation.

Circuit breakers stop repeated calls to a failing dependency. States are closed, open, and half-open. They protect resources and allow recovery.

Saga coordinates distributed workflows without a single global transaction. Choreography uses events. Orchestration uses a central coordinator. Both require compensation logic for failures.
