# Consensus, leader election, Raft / Paxos intuition, idempotency, exactly-once

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
