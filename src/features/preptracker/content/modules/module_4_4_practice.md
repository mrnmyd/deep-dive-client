# System Design Practice

This module is the rehearsal arena. Practising specific designs builds the muscle for novel problems on the day. The goal is not to memorise solutions; it is to internalise a repeatable scoping → estimation → component → tradeoff flow.

## Capacity estimation: back-of-envelope math

Senior interviewers expect rough numbers, not precision. The point is to show that you choose components based on traffic, storage, and bandwidth, not because they are popular.

**Useful numbers to memorise**

| Quantity                                       | Approx. value                 |
| ---------------------------------------------- | ----------------------------- |
| Seconds per day                                | 86,400 ≈ 10⁵                  |
| Seconds per month                              | 2.6 × 10⁶                     |
| Reads per second from a single typical SQL row | 5,000 – 10,000                |
| Single hot Redis instance throughput           | ~100,000 ops/s                |
| Inter-region round trip                        | ~70 – 150 ms                  |
| Same-region RTT                                | ~1 ms                         |
| Sequential disk read                           | ~100 MB/s SSD, ~1 GB/s NVMe   |
| Random disk read                               | small reads ≈ 10,000 IOPS SSD |

**Pattern: convert daily users → QPS**

```
DAU = 100M
average requests/user/day = 50
total = 5 × 10⁹ requests/day
QPS = 5 × 10⁹ / 86,400 ≈ 58,000
peak QPS ≈ 3 × average ≈ 174,000
```

**Pattern: storage growth**

```
records/day = 10M
bytes/record = 500
daily storage = 5 GB
yearly storage = 1.8 TB
5-year storage = 9 TB
```

State your assumptions early and always include the multiplier (peak vs average, replication factor, retention).

---

## Walkthrough: URL shortener (TinyURL)

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

## Walkthrough: Chat / messaging (WhatsApp-lite)

**Functional**: 1:1 chat, group chat, delivery receipts, read receipts, online presence, message history.
**Non-functional**: < 200 ms send-to-receive, ordered messages within a chat, durability.

**Estimate**

```
DAU = 50M
messages/user/day = 40
total = 2B messages/day ≈ 23,000 msgs/sec average, ~70,000 peak
```

**Components**

- **Connection layer** uses persistent WebSockets terminated at edge servers. Each user maps to a connection ID; a registry (Redis hash) tracks `user_id → connection_id, gateway_node`.
- **Message service** writes to a sharded message store keyed by `(chat_id, timestamp)`. Cassandra or DynamoDB suit the append-heavy access pattern.
- **Fanout** when sending: write to store first, then publish to a Kafka topic per chat. Recipients' gateway nodes subscribe and push to live WebSockets.
- **Offline delivery**: messages are durable, so a recipient who reconnects fetches missed messages by chat + last-read offset.

**Ordering**

Chat order is per-chat, not global. Use a single shard per chat (or `chat_id` as partition key) so messages keep order. Cross-chat ordering does not matter to the user.

**Read receipts**

Track per-user state: `chat_id, user_id, last_read_message_id`. Updates are high-frequency; use a separate fast store (Redis) and periodically snapshot to durable storage.

**Group fanout**

For groups < 1,000 members, fanout-on-write is fine. For very large groups (broadcast lists, channels), switch to fanout-on-read: receivers pull from a shared inbox rather than each receiver getting an individual copy.

---

## Walkthrough: Social news feed (fan-out on read vs write)

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

## Walkthrough: Distributed rate limiter (token bucket)

**Functional**: limit per-user (or per-API-key) request rate, return `429` when exceeded.
**Non-functional**: low overhead per request, fair across distributed gateway nodes, < 1 ms decision latency.

**Algorithm: token bucket**

Each key has a bucket of size `capacity` that refills at `rate` tokens / second. A request consumes 1 token; if zero tokens, reject.

**Implementation in Redis**

A single atomic Lua script per request avoids race conditions:

```lua
-- KEYS[1] = bucket key, ARGV = { capacity, rate, now, requested }
local capacity = tonumber(ARGV[1])
local rate = tonumber(ARGV[2])
local now = tonumber(ARGV[3])
local requested = tonumber(ARGV[4])

local data = redis.call('HMGET', KEYS[1], 'tokens', 'ts')
local tokens = tonumber(data[1]) or capacity
local ts = tonumber(data[2]) or now

local delta = math.max(0, now - ts) * rate / 1000
tokens = math.min(capacity, tokens + delta)

if tokens >= requested then
    tokens = tokens - requested
    redis.call('HMSET', KEYS[1], 'tokens', tokens, 'ts', now)
    redis.call('PEXPIRE', KEYS[1], math.ceil(capacity * 1000 / rate))
    return 1
else
    redis.call('HMSET', KEYS[1], 'tokens', tokens, 'ts', now)
    return 0
end
```

**Other algorithms**

- **Leaky bucket** smooths traffic by serving at a constant rate; queues excess.
- **Fixed window** counts in time buckets — simple but suffers boundary bursts.
- **Sliding window log** stores timestamps; precise but expensive at scale.
- **Sliding window counter** approximates by weighting two adjacent windows.

**Failure cases**

- Redis unavailable: fail open (allow traffic) or fail closed (reject all). Choose per business risk; document the fallback behaviour.
- Clock skew across gateway nodes: use server-side `redis.call('TIME')` instead of trusting client clocks.

---

## A senior playbook for any system design question

1. **Clarify scope.** Functional + non-functional. Read/write ratio, latency targets, consistency, durability, geographic scope, regulatory constraints.
2. **Estimate.** QPS, storage, bandwidth at peak. Apply a 2 – 3 × peak multiplier.
3. **Sketch the data model.** What entity, what access pattern, what the partition key should be. Pick the storage class from access pattern, not from preference.
4. **Walk a request.** Trace `client → API → service → store → response` end-to-end. Annotate latency expectations.
5. **Identify hot spots.** Caches, queues, fanout decisions. Mention specific failure modes and mitigations.
6. **Cover the failure cases.** What if a node dies, region fails, message is lost, retry produces duplicates, traffic spikes 10×?
7. **Acknowledge what you would skip in v1.** Saying "I would not build geo-replication on day one" is a senior signal.
