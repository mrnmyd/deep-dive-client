# CAP, PACELC, consistency models: linearizable, sequential, eventual

Senior interviews probe whether you understand the price of distribution: partial failures, message loss, ordering, time skew, and the operational cost of running services in production.

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
