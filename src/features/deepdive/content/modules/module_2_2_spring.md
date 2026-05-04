# Spring Boot & Ecosystem

Spring interviews test whether you understand the container, web/security filters, transactions, and persistence behavior. The goal is to reason about what the framework does for you and where the boundaries are.

## Core Spring: DI, scopes, lifecycle, proxying

Dependency Injection means objects declare dependencies and the container wires them. Prefer constructor injection because required dependencies are explicit, immutable after construction, and test-friendly.

Bean scopes define lifecycle. Singleton is one bean per container and is the default. Prototype creates a new instance on request. Web scopes such as request and session are tied to HTTP contexts.

Bean lifecycle roughly follows: instantiate, populate dependencies, apply aware callbacks, run post-processors, initialize, then destroy on shutdown. Understanding lifecycle helps debug configuration and startup behavior.

Spring AOP often uses proxies. JDK dynamic proxies work for interfaces. CGLIB creates subclass proxies. Self-invocation bypasses proxies, so annotations such as `@Transactional` may not apply when one method calls another inside the same class.

## Spring Security: filter chain, AuthenticationManager, JWT, OAuth2, CSRF, CORS

Spring Security is a filter chain before your controllers. Filters extract credentials, authenticate, set the security context, authorize access, and handle failures.

`AuthenticationManager` verifies credentials and returns an authenticated principal. For JWT-based APIs, a filter validates the token and builds authentication from claims. For OAuth2, the app delegates identity to an authorization server and consumes tokens.

CSRF protects browser-based state-changing requests that rely on cookies. Token-based APIs used by non-browser clients often disable CSRF, but cookie-authenticated browser apps should treat it seriously.

CORS is a browser policy. The backend must explicitly allow origins, methods, headers, and credentials. CORS is not authentication; it only controls which browser origins may read responses.

## Data & Transactions: JPA, JPQL, isolation, propagation, N+1

JPA maps objects to relational tables. Hibernate is a common implementation. Entity state matters: transient, managed, detached, and removed. Managed entities are dirty-checked and flushed.

JPQL queries entities, not tables. Native SQL queries tables directly. Use JPQL for portability and domain-level queries; use native SQL when database-specific features matter.

Transaction isolation controls visibility between concurrent transactions. Read committed prevents dirty reads. Repeatable read prevents non-repeatable reads. Serializable is strongest but can reduce concurrency.

Propagation defines what happens when a transactional method calls another. `REQUIRED` joins an existing transaction or creates one. `REQUIRES_NEW` suspends the current transaction and starts another.

N+1 happens when loading a list and lazily fetching each child in separate queries. Fix with fetch joins, entity graphs, batch fetching, or query redesign.
