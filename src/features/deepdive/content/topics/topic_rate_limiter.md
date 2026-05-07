# Walkthrough: distributed rate limiter (token bucket)

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
