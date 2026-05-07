# Components of Scalable Systems — supplement

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
