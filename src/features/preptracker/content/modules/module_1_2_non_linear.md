# Non-Linear Data Structures

Non-linear structures model hierarchy, priority, or relationships. The senior-level skill is choosing a traversal and maintaining enough state to avoid repeated work.

## Trees: BFS/DFS, LCA, diameter, BST validation, AVL rotations, Trie

A tree is a connected acyclic graph. DFS is natural for recursive structure; BFS is natural for levels and shortest unweighted paths.

DFS has three common orders:

- Preorder: process node before children. Useful for serialization and copying.
- Inorder: left, node, right. In a BST this yields sorted values.
- Postorder: process children before node. Useful for deletion, height, diameter, and bottom-up DP.

Lowest Common Ancestor can be solved recursively: if the current node is null or one of the targets, return it. Recurse left and right. If both sides return non-null, current node is the LCA. If one side returns non-null, bubble that result up.

Tree diameter is the longest path between any two nodes. At each node, compute left height and right height; candidate diameter is `left + right`. Return height upward and update global diameter.

BST validation needs bounds, not only parent comparison. Each node must be within `(min, max)` inherited from ancestors.

AVL trees maintain height balance by rotations. Know why rotations work: they locally restructure nodes while preserving inorder ordering.

Trie stores strings by prefix. It is strong for autocomplete, prefix checks, and dictionary matching. Each node maps character to child and may mark `isWord`.

## Heaps: binary heap, heapify, heap sort, median in a stream

A heap is a complete binary tree usually stored in an array. For a zero-indexed array, children are `2i + 1` and `2i + 2`; parent is `(i - 1) / 2`.

Min-heaps expose the smallest element; max-heaps expose the largest. Push bubbles up. Pop replaces root with the last element and bubbles down.

Heapify builds a heap in `O(n)` by sinking nodes from the last parent backward. This is faster than inserting each element separately, which is `O(n log n)`.

Heap sort repeatedly extracts the heap root. It is `O(n log n)` and in-place, but not stable.

Median in a stream uses two heaps:

- Max-heap for lower half.
- Min-heap for upper half.
- Keep sizes balanced so the median is either one root or the average of both roots.

## Graphs: BFS, DFS, cycles, shortest paths, MST, topological sort

Graphs model arbitrary relationships. First clarify whether the graph is directed, weighted, cyclic, connected, and dense.

BFS gives shortest path in an unweighted graph because it explores by distance. DFS is good for connected components, cycle detection, and exhaustive search.

Cycle detection depends on graph type:

- Undirected: a visited neighbor that is not the parent indicates a cycle.
- Directed: track recursion stack or color states: unvisited, visiting, visited.

Dijkstra solves shortest path with non-negative weights using a priority queue. Bellman-Ford handles negative edges and can detect negative cycles, but costs `O(VE)`.

Minimum spanning tree connects all vertices with minimum total edge weight. Prim grows from a starting node using a priority queue. Kruskal sorts edges and uses union-find to avoid cycles.

Topological sort works only for DAGs. Use DFS postorder or Kahn's algorithm with indegrees. If Kahn cannot process all nodes, the graph has a cycle.
