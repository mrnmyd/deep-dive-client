# Core Spring: DI, scopes, lifecycle, CGLIB vs JDK proxying

Spring interviews test whether you understand the container, web/security filters, transactions, and persistence behavior. The goal is to reason about what the framework does for you and where the boundaries are.

Dependency Injection means objects declare dependencies and the container wires them. Prefer constructor injection because required dependencies are explicit, immutable after construction, and test-friendly.

Bean scopes define lifecycle. Singleton is one bean per container and is the default. Prototype creates a new instance on request. Web scopes such as request and session are tied to HTTP contexts.

Bean lifecycle roughly follows: instantiate, populate dependencies, apply aware callbacks, run post-processors, initialize, then destroy on shutdown. Understanding lifecycle helps debug configuration and startup behavior.

Spring AOP often uses proxies. JDK dynamic proxies work for interfaces. CGLIB creates subclass proxies. Self-invocation bypasses proxies, so annotations such as `@Transactional` may not apply when one method calls another inside the same class.
