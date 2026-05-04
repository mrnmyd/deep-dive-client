# Components of Scalable Systems

System design interviews evaluate whether you can decompose a product, reason about traffic and failure, and choose infrastructure based on requirements instead of buzzwords.

## Networking: DNS, load balancers, round robin, consistent hashing, Nginx

DNS maps names to IP addresses. It is cached at many layers, so DNS changes are not instant. TTL controls how long records may be cached.

Load balancers distribute traffic across servers. Layer 4 load balancing works at transport level and routes TCP/UDP connections. Layer 7 understands HTTP and can route by path, host, headers, or cookies.

Round robin is simple but does not account for server load. Least connections considers active connections. Weighted strategies support different server capacities.

Consistent hashing maps keys to nodes with minimal movement when nodes join or leave. It is useful for distributed caches and sharded systems because it avoids remapping everything.

Nginx can act as reverse proxy, static file server, TLS terminator, load balancer, and rate limiter. In interviews, explain where it sits and which responsibility it owns.

## Caching: Redis data types, invalidation, LRU/LFU

Caching stores data closer to the requester or in a faster system. It reduces latency and backend load, but introduces freshness problems.

Redis supports strings, hashes, lists, sets, sorted sets, streams, and pub/sub. Choose data types based on access pattern. Sorted sets are useful for leaderboards and time-ordered scoring; hashes are useful for object-like fields.

Invalidation strategies:

- Write-through: write cache and database together.
- Write-around: write database only; cache fills on read.
- Write-back: write cache first and persist later, improving speed but increasing data-loss risk.

Eviction policies such as LRU and LFU decide what leaves cache under memory pressure. LRU removes least recently used keys; LFU removes least frequently used keys.

## Communication: REST, GraphQL, gRPC, WebSockets, message queues

REST is resource-oriented and works well for public APIs and CRUD-heavy systems. GraphQL lets clients request exactly the shape they need but shifts complexity to schema design, authorization, caching, and query cost controls.

gRPC uses strongly typed contracts and efficient binary serialization. It is common for internal service-to-service calls where low latency and strict contracts matter.

WebSockets keep bidirectional connections open. Use them for live collaboration, notifications, and realtime dashboards.

Message queues decouple producers from consumers. Kafka is strong for durable event streams and replay. RabbitMQ is strong for routing and task distribution. Queues improve resilience but introduce eventual consistency.
