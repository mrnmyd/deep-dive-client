# Distributed Systems & Observability

Senior interviews probe whether you understand the price of distribution: partial failures, message loss, ordering, time skew, and the operational cost of running services in production.

## CAP, PACELC, consistency models

CAP says that under a network partition you must choose between consistency and availability. **It does not say you must choose two of three; partitions are inevitable.** PACELC adds the no-partition case: even when there is no partition, you trade latency for consistency.

| Model            | Guarantee                                                            | Real-world example                                    |
| ---------------- | -------------------------------------------------------------------- | ----------------------------------------------------- |
| Linearizable     | All operations appear atomic and ordered consistently with real time | Single-leader replicated databases under quorum reads |
| Sequential       | Total order exists but may not match wall-clock time                 | Some Raft-based systems                               |
| Causal           | Causally related operations seen in order                            | Collaboration tools, Cosmos DB session level          |
| Read-your-writes | A client always sees its own writes                                  | Session-stickied apps                                 |
| Eventual         | Replicas converge given no new writes                                | DNS, Cassandra default                                |

**Pick-your-tradeoff phrasing for interviews**

- A banking transfer needs linearizability. Latency cost is acceptable.
- A like counter needs eventual consistency. Reads from any replica are fine.
- A shopping cart needs read-your-writes. Sticky sessions or write-then-read-from-leader.

---

## Consensus, leader election, idempotency

Consensus algorithms agree on a value across nodes that may fail or be partitioned. Raft and Paxos are the canonical algorithms. For interviews, focus on Raft because its model is simpler.

**Raft, in one paragraph**: every node is in one of three states: follower, candidate, leader. Followers convert to candidates on election timeout, request votes from peers, and become leader if they receive a majority. The leader replicates log entries to followers; an entry is considered committed once a majority have acknowledged it. Term numbers monotonically increase and are used to reject stale leaders.

**Why a majority quorum matters**

| Cluster size | Majority | Tolerated failures |
| ------------ | -------- | ------------------ |
| 3            | 2        | 1                  |
| 5            | 3        | 2                  |
| 7            | 4        | 3                  |

Even-sized clusters do not improve availability and increase cost; they are usually avoided.

**Idempotency keys**

Distributed systems retry. Without idempotency, retried requests produce duplicate effects (double charges, duplicate orders). Pattern:

```java
@PostMapping("/payments")
ResponseEntity<Payment> charge(
        @RequestHeader("Idempotency-Key") String key,
        @RequestBody ChargeRequest request) {
    Optional<Payment> existing = repo.findByIdempotencyKey(key);
    if (existing.isPresent()) return ResponseEntity.ok(existing.get());
    Payment created = service.charge(key, request);
    return ResponseEntity.status(HttpStatus.CREATED).body(created);
}
```

Idempotency keys live in the database with a unique index. Retries see the existing record and return the prior result.

**Exactly-once is a lie at the wire level.** What systems actually offer is **effectively once**: at-least-once delivery plus idempotent processing.

---

## Observability: logs, metrics, traces, RED + USE, SLI/SLO/SLA

**The three pillars**

| Pillar  | What it tells you                       | When to use                         |
| ------- | --------------------------------------- | ----------------------------------- |
| Logs    | What happened in this request           | Debugging individual incidents      |
| Metrics | Aggregated counts / gauges over time    | Dashboards, alerts, SLOs            |
| Traces  | The path a request took across services | Latency hot spots, fan-out problems |

Modern stacks unify these via OpenTelemetry: one SDK emits all three.

**Service-level signals**

- **RED method (services with requests):** Rate, Errors, Duration.
- **USE method (resources):** Utilisation, Saturation, Errors.

For HTTP services, alert on rate of 5xx, p99 latency, and request rate dropping below baseline (often the earliest signal of an outage).

**SLI, SLO, SLA**

- **SLI** (indicator): a measured number, e.g. proportion of HTTP requests under 300 ms.
- **SLO** (objective): the target, e.g. 99.9% of requests under 300 ms over 30 days.
- **SLA** (agreement): contractual commitment, usually weaker than SLO with financial penalties.

**Error budget** = `1 - SLO`. With a 99.9% SLO over 30 days, you can spend 43 minutes of unavailability per month before tripping the contract.

**Common pitfalls**

- Logging every successful request floods the cluster. Sample success; log every error.
- Cardinality explosion: putting `userId` in metric labels balloons memory in Prometheus. Use logs or traces for high-cardinality values.
- Trace IDs not propagated across asynchronous boundaries break causality. Instrument message queues and worker pools.

---

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
