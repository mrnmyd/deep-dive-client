# Communication: REST vs GraphQL, gRPC, WebSockets, message queues

**REST**

- Resource-oriented, HTTP-verb semantics, status codes communicate outcome.
- Caching plays nicely (HTTP semantics).
- Best for public APIs and CRUD-shaped systems.

**GraphQL**

- Single endpoint, client-driven shape.
- Eliminates over-fetching and under-fetching when client and server iterate together.
- Requires careful auth (per-field), caching (no built-in HTTP cache), and query-cost limits to prevent abuse.

**gRPC**

- Protocol Buffers, HTTP/2, strongly typed contracts.
- Best for internal service-to-service. Streaming variants for fan-out and bidirectional flows.
- Browsers cannot speak it directly; use grpc-web with an envoy/grpc proxy if needed.

**WebSockets**

- Persistent bidirectional connection.
- Use for live collaboration, dashboards, chat presence.
- Operationally heavier: connection state, sticky routing, auth refresh, reconnection logic.

**Message queues**

| Broker        | Strengths                                                | Weaknesses                                      |
| ------------- | -------------------------------------------------------- | ----------------------------------------------- |
| Kafka         | Durable log, replay, high throughput, ordered partitions | Heavy ops, no per-message ack                   |
| RabbitMQ      | Routing patterns, per-message ack, easy fanout           | Throughput ceiling, less durable replay         |
| SQS           | Managed, simple, cheap                                   | No ordering across messages, FIFO has limits    |
| Pub/Sub (GCP) | Managed, global                                          | Eventual delivery, ordering needs ordering keys |

**Pick by access pattern**

- "Many consumers replay history" → Kafka.
- "Fan-out by routing keys, ack per message" → RabbitMQ.
- "Don't run brokers" → SQS or managed pub/sub.

---
