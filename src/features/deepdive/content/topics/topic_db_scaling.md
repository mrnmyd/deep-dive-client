# Scaling: partitioning, sharding, replication patterns

Partitioning splits one logical table into smaller physical pieces. It can improve maintenance and query pruning when filters match the partition key.

Sharding splits data across different database nodes. The hard part is choosing a shard key that balances load and supports common queries. Cross-shard joins and transactions become expensive.

Replication copies data. Primary-replica replication helps read scaling and failover, but replicas may lag. Multi-primary replication improves write availability but introduces conflict resolution complexity.

Senior-level tradeoff: do not shard before you need to. First optimize schema, queries, indexes, caching, and vertical resources. Sharding adds operational complexity that must be justified.
