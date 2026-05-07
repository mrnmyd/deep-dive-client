# Data & Transactions: JPA, JPQL, isolation, propagation, N+1 problem

JPA maps objects to relational tables. Hibernate is a common implementation. Entity state matters: transient, managed, detached, and removed. Managed entities are dirty-checked and flushed.

JPQL queries entities, not tables. Native SQL queries tables directly. Use JPQL for portability and domain-level queries; use native SQL when database-specific features matter.

Transaction isolation controls visibility between concurrent transactions. Read committed prevents dirty reads. Repeatable read prevents non-repeatable reads. Serializable is strongest but can reduce concurrency.

Propagation defines what happens when a transactional method calls another. `REQUIRED` joins an existing transaction or creates one. `REQUIRES_NEW` suspends the current transaction and starts another.

N+1 happens when loading a list and lazily fetching each child in separate queries. Fix with fetch joins, entity graphs, batch fetching, or query redesign.
