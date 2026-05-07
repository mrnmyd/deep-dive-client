# Linked Lists: singly, doubly, circular, Floyd cycle, LRU cache

Linked lists trade indexed access for cheap pointer updates. Singly linked lists move forward only. Doubly linked lists allow removal when you already have the node. Circular lists connect tail back to head and need careful termination conditions.

Floyd's cycle-finding algorithm uses slow and fast pointers. If a cycle exists, the fast pointer eventually catches the slow pointer. To find the cycle start, reset one pointer to head and move both one step at a time; their meeting point is the entry.

LRU cache is the canonical linked-list design problem. Use:

- A hash map from key to node for `O(1)` lookup.
- A doubly linked list for recency ordering.
- Dummy head and tail nodes to simplify insert/remove.

Every `get` and `put` should move the accessed node to the most-recent side. On capacity overflow, remove the least-recent node from the other side and delete its key from the map.
