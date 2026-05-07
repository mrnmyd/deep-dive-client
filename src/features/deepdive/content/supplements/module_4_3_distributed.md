# Distributed Systems & Observability — supplement

## Interview answers

_Q: How would you keep two services consistent when one is read-heavy?_
A: Outbox pattern. The write service inserts a domain event into an outbox table inside the same transaction, then a relay publishes it to a queue. Consumers update their own data store. This trades latency for consistency and avoids dual writes.

_Q: How does Raft handle a network partition?_
A: A minority partition cannot elect a leader (no majority votes), so it cannot accept writes. The majority partition continues serving. When the partition heals, the minority's stale log entries are overwritten by the leader's log via append-entries.

_Q: What is exactly-once processing in Kafka?_
A: It combines idempotent producers (each producer instance has a producer ID and sequence number, broker rejects duplicates) and transactions (commit a batch of messages plus consumer offsets atomically). End-to-end exactly-once requires consumers to also be transactional and read in `read_committed` isolation.

_Q: How do you size an SLO?_
A: Start from user expectations and historical performance. Set the SLO slightly below current performance so you have an error budget to spend on releases. SLOs that are too tight prevent shipping; too loose are meaningless.

_Q: How would you debug a sudden p99 latency spike?_
A: Check three things in order: a recent deploy (rollback first if correlated), upstream dependency latency (database CPU, queue depth), and saturation (CPU, threads, connection pool). Use traces to confirm where in the request path the time is spent before changing anything.
