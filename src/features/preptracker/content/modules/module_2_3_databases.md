# Databases & SQL

Backend senior interviews expect you to write correct SQL, understand indexes, and reason about scaling. Always connect query shape to data volume and access pattern.

## SQL: joins, subqueries, CTEs, window functions, indexing, EXPLAIN

Joins combine rows. Inner join keeps matches only. Left join keeps all left rows and fills missing right rows with nulls. Many bugs come from applying filters on the right table in `WHERE`, accidentally turning a left join into an inner join.

Subqueries can express nested logic, but CTEs often make multi-step transformations clearer. Some databases materialize CTEs; others inline them, so know your database behavior when optimizing.

Window functions compute values across related rows without collapsing them. `RANK`, `DENSE_RANK`, `LEAD`, `LAG`, and running totals are common interview topics. They are ideal for "top N per group", "previous event", and analytics queries.

Indexes speed reads by maintaining ordered lookup structures, usually B-tree variants. They cost write overhead and storage. Composite index order matters: `(tenant_id, created_at)` helps queries by tenant and date, but not necessarily queries by date alone.

`EXPLAIN` shows how the database plans to execute a query. Look for sequential scans on large tables, bad row estimates, missing indexes, expensive sorts, and nested loops over large result sets.

## Scaling: partitioning, sharding, replication

Partitioning splits one logical table into smaller physical pieces. It can improve maintenance and query pruning when filters match the partition key.

Sharding splits data across different database nodes. The hard part is choosing a shard key that balances load and supports common queries. Cross-shard joins and transactions become expensive.

Replication copies data. Primary-replica replication helps read scaling and failover, but replicas may lag. Multi-primary replication improves write availability but introduces conflict resolution complexity.

Senior-level tradeoff: do not shard before you need to. First optimize schema, queries, indexes, caching, and vertical resources. Sharding adds operational complexity that must be justified.
