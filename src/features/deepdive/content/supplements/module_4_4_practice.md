# System Design Practice — supplement

## A senior playbook for any system design question

1. **Clarify scope.** Functional + non-functional. Read/write ratio, latency targets, consistency, durability, geographic scope, regulatory constraints.
2. **Estimate.** QPS, storage, bandwidth at peak. Apply a 2 – 3 × peak multiplier.
3. **Sketch the data model.** What entity, what access pattern, what the partition key should be. Pick the storage class from access pattern, not from preference.
4. **Walk a request.** Trace `client → API → service → store → response` end-to-end. Annotate latency expectations.
5. **Identify hot spots.** Caches, queues, fanout decisions. Mention specific failure modes and mitigations.
6. **Cover the failure cases.** What if a node dies, region fails, message is lost, retry produces duplicates, traffic spikes 10×?
7. **Acknowledge what you would skip in v1.** Saying "I would not build geo-replication on day one" is a senior signal.
