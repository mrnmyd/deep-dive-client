# Caching: Redis data types, invalidation strategies, LRU/LFU

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
