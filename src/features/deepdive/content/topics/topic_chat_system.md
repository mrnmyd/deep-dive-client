# Walkthrough: chat / messaging system (WhatsApp-lite)

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
