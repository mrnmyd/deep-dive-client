# Walkthrough: social news feed (fan-out on read vs write)

**Functional**: post, follow, see a chronological/ranked feed.
**Non-functional**: feed open should be < 300 ms p95, follow lists vary from 0 to 100M (celebrities).

**Two strategies**

| Strategy        | Description                                                   | Strength     | Weakness                                                        |
| --------------- | ------------------------------------------------------------- | ------------ | --------------------------------------------------------------- |
| Fanout on write | When user posts, push to every follower's inbox               | Cheap reads  | Expensive for celebrity posts (write amplification of millions) |
| Fanout on read  | At feed open, pull recent posts from followed users and merge | Cheap writes | Expensive reads, harder to rank                                 |

**Hybrid in practice**

- Fanout on write for normal users.
- Fanout on read for users with > N followers (the "Justin Bieber problem").
- Mix on consumer side: precomputed inbox + a few celebrity-author pulls merged in.

**Components**

- **Post service** writes to an append-only post store partitioned by `author_id`.
- **Follow graph** stored in a graph DB or sharded MySQL with `(follower, followee)` rows.
- **Fanout workers** consume post events from Kafka, write into per-follower inbox tables in Cassandra.
- **Feed service** queries the user's inbox table by user_id, merges celebrity pulls, ranks, returns.
- **Cache** of the top N feed entries per active user in Redis.

---
