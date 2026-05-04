# Components of Scalable Systems

System design interviews evaluate whether you can decompose a product, reason about traffic and failure, and choose infrastructure based on requirements rather than buzzwords. The components below are the vocabulary; system design practice (module 4.4) puts them together.

## Networking: DNS, load balancers, consistent hashing, Nginx

**DNS** maps names to IPs. Records propagate through caches at OS, ISP, and resolver levels. TTL controls cache duration. DNS changes are not instant — design failover with health-checked anycast IPs or multi-A records, not DNS surgery during an outage.

**Load balancers**

| Layer | Operates on | Use                                                      |
| ----- | ----------- | -------------------------------------------------------- |
| L4    | TCP / UDP   | Generic TCP balancing, low overhead                      |
| L7    | HTTP, gRPC  | Routing by host, path, headers; TLS termination; retries |

| Strategy          | Behaviour               | When                               |
| ----------------- | ----------------------- | ---------------------------------- |
| Round robin       | Even rotation           | Stateless, equal-capacity backends |
| Least connections | Pick the least busy     | Long-lived requests                |
| Weighted          | Capacity-aware          | Mixed instance types               |
| Hash on key       | Same key → same backend | Sticky sessions, cache locality    |

**Consistent hashing** maps keys onto a ring (typically 2³² positions). Each node owns the keys between itself and the previous node clockwise. Adding or removing a node moves only `1/N` of keys instead of the entire keyspace.

```text
ring = hash positions [0, 2^32)
node A → 0x10000000   (owns keys hashing into (E..A])
node B → 0x40000000   (owns keys hashing into (A..B])
node C → 0x90000000   (owns keys hashing into (B..C])
node D → 0xC0000000   ...
node E → 0xF0000000

removing C reassigns only the (B..C] arc to D.
```

Use **virtual nodes** (each physical node maps to many ring positions) for better load balance.

**Nginx** is the Swiss Army knife: reverse proxy, TLS terminator, static file server, rate limiter, header rewriter, simple load balancer. In an interview, name the responsibility and which other component does the rest.

---

## Caching: Redis data types, invalidation, eviction

Caches reduce latency and offload backends. They also create a freshness problem.

**Redis data types and use**

| Type        | Operations                   | Use                            |
| ----------- | ---------------------------- | ------------------------------ |
| String      | GET, SET, INCR               | Counters, simple values        |
| Hash        | HGET, HSET, HMSET            | Object-like fields             |
| List        | LPUSH, RPOP, LRANGE          | Queues, recent activity        |
| Set         | SADD, SISMEMBER, SDIFF       | Tags, deduplication            |
| Sorted set  | ZADD, ZRANGEBYSCORE          | Leaderboards, time-ordered     |
| Stream      | XADD, XREAD, consumer groups | Event log, pub/sub with replay |
| Pub/Sub     | PUBLISH, SUBSCRIBE           | Fanout notifications           |
| Hyperloglog | PFADD, PFCOUNT               | Approximate cardinality        |

**Invalidation strategies**

| Strategy      | Write path                      | Read path                           | Risk                 |
| ------------- | ------------------------------- | ----------------------------------- | -------------------- |
| Write-through | Write cache + DB synchronously  | Read cache                          | Slow writes          |
| Write-around  | Write DB only                   | Read cache; on miss load + populate | Stale until refilled |
| Write-back    | Write cache, persist later      | Read cache                          | Data loss on crash   |
| Refresh-ahead | Refresh popular keys before TTL | Read cache                          | Wasted refreshes     |

**Eviction policies**

- **LRU** (least recently used): the default. Good for general-purpose hot-set tracking.
- **LFU** (least frequently used): better when access patterns are stable; recovers slower from new hot keys.
- **TTL-based**: simplest; pair with one of the above.
- **Random**: surprisingly close to LRU under high randomness; cheap to implement.

**The cache stampede problem**

When a hot key expires, every concurrent request misses and hits the backend simultaneously. Mitigations:

- **Request coalescing**: deduplicate in-flight loads using a per-key promise/flag.
- **Probabilistic early refresh**: refresh keys early with probability proportional to remaining TTL.
- **Stale-while-revalidate**: serve the stale value while one worker refreshes.

---

## Communication: REST, GraphQL, gRPC, WebSockets, message queues

**REST**

- Resource-oriented, HTTP-verb semantics, status codes communicate outcome.
- Caching plays nicely (HTTP semantics).
- Best for public APIs and CRUD-shaped systems.

**GraphQL**

- Single endpoint, client-driven shape.
- Eliminates over-fetching and under-fetching when client and server iterate together.
- Requires careful auth (per-field), caching (no built-in HTTP cache), and query-cost limits to prevent abuse.

**gRPC**

- Protocol Buffers, HTTP/2, strongly typed contracts.
- Best for internal service-to-service. Streaming variants for fan-out and bidirectional flows.
- Browsers cannot speak it directly; use grpc-web with an envoy/grpc proxy if needed.

**WebSockets**

- Persistent bidirectional connection.
- Use for live collaboration, dashboards, chat presence.
- Operationally heavier: connection state, sticky routing, auth refresh, reconnection logic.

**Message queues**

| Broker        | Strengths                                                | Weaknesses                                      |
| ------------- | -------------------------------------------------------- | ----------------------------------------------- |
| Kafka         | Durable log, replay, high throughput, ordered partitions | Heavy ops, no per-message ack                   |
| RabbitMQ      | Routing patterns, per-message ack, easy fanout           | Throughput ceiling, less durable replay         |
| SQS           | Managed, simple, cheap                                   | No ordering across messages, FIFO has limits    |
| Pub/Sub (GCP) | Managed, global                                          | Eventual delivery, ordering needs ordering keys |

**Pick by access pattern**

- "Many consumers replay history" → Kafka.
- "Fan-out by routing keys, ack per message" → RabbitMQ.
- "Don't run brokers" → SQS or managed pub/sub.

---

## Common pitfalls

- Caching writes without considering staleness. The bug surfaces months later when someone updates a non-cached path.
- Treating consistent hashing as a free lunch. It only minimises movement on node changes; it does nothing about hot keys.
- Using GraphQL because the client team likes it, then exposing internal IDs and N+1 queries to the public.
- Choosing Kafka because "scalable" without needing replay — RabbitMQ is simpler for routing-heavy workloads.

---

## Interview answers

_Q: How does consistent hashing handle uneven load?_
A: Vanilla consistent hashing can place few large arcs and many small arcs unfairly. **Virtual nodes** — each physical node mapped to many ring positions — smooth the distribution. For very hot keys, layer in **request-level caching** at the gateway or **shard splitting** for the affected key range.

_Q: When would you put Redis between your service and your database?_
A: When read latency matters, the read-to-write ratio is high, and tolerable staleness is measurable. The classic mistake is caching everything; cache only what is read often, and pick an invalidation strategy that matches the cost of staleness.

_Q: How do you choose between REST and gRPC for a new internal API?_
A: gRPC for service-to-service where contracts and latency matter; REST when consumers include browsers, CLI tools, and partners who need broad tooling support. A hybrid is common: gRPC inside the cluster, a REST/GraphQL gateway at the edge.

_Q: How would you protect a Redis-backed cache from a cache stampede?_
A: Three layers. (1) Stale-while-revalidate: serve the stale value while one worker refreshes. (2) Request coalescing in the service layer so concurrent misses share a single backend call. (3) Probabilistic early expiry so refreshes are spread out instead of all converging on the TTL boundary.

_Q: What guarantees does Kafka give you?_
A: Within a partition, messages are strictly ordered and durable up to the configured replication factor. Across partitions, no ordering. Producers can opt into idempotent and transactional sends; consumers track offsets explicitly. End-to-end exactly-once requires both producer and consumer to be transactional, plus reading in `read_committed`.
