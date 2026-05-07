# Walkthrough: URL shortener (TinyURL)

**Functional**: shorten URL, redirect short → long, optional custom alias, expiry, basic analytics.
**Non-functional**: 100M URLs/day, redirect must be < 100 ms p95, 100:1 read-to-write ratio, links live forever by default.

**Estimate**

```
write QPS = 100M / 86,400 ≈ 1,200 (peak ~3,500)
read QPS = 120,000 (peak ~360,000)
storage/year = 100M × 365 × ~500 B = ~18 TB
```

**Components**

- **API gateway** terminates TLS, applies auth and rate limiting.
- **Write service** generates a short key. Two options: counter + base62 encoding (deterministic, cheap); or pre-allocated key ranges per worker (avoids contention). Avoid hash-based keys — collisions force retries.
- **Primary store** is a key-value DB (DynamoDB, Cassandra) keyed on short key. The schema is `short_key, long_url, owner_id, created_at, expires_at`.
- **Cache** in front of reads (Redis), TTL'd. With 100:1 read ratio and a hot tail, cache hit rate is high.
- **Async pipeline** for analytics: Kafka topic of redirect events, consumed into a warehouse for aggregation.

**Key generation tradeoffs**

| Approach         | Pro                        | Con                       |
| ---------------- | -------------------------- | ------------------------- |
| Counter + base62 | No collisions, predictable | Sequential keys leak rate |
| Hash + truncate  | Stateless                  | Collisions, longer length |
| Range allocation | Scalable, no collisions    | Operational complexity    |

**Failure cases to talk about**

- Cache miss storm on a hot key: use request coalescing.
- Burst of writes from a popular campaign: per-tenant rate limiting.
- Rogue alias collisions: unique constraint on the short key, retry with new key.

---
