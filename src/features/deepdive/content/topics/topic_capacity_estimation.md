# Capacity estimation: back-of-envelope math, QPS, storage, bandwidth

This module is the rehearsal arena. Practising specific designs builds the muscle for novel problems on the day. The goal is not to memorise solutions; it is to internalise a repeatable scoping → estimation → component → tradeoff flow.

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
