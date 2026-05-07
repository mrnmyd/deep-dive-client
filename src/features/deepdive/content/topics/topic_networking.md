# Networking: DNS, load balancers, round robin, consistent hashing, Nginx

System design interviews evaluate whether you can decompose a product, reason about traffic and failure, and choose infrastructure based on requirements rather than buzzwords. The components below are the vocabulary; system design practice (module 4.4) puts them together.

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
