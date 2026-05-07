# Graphs: BFS, DFS, cycles, shortest paths, MST, topological sort

Graphs model arbitrary relationships. First clarify whether the graph is directed, weighted, cyclic, connected, and dense.

BFS gives shortest path in an unweighted graph because it explores by distance. DFS is good for connected components, cycle detection, and exhaustive search.

Cycle detection depends on graph type:

- Undirected: a visited neighbor that is not the parent indicates a cycle.
- Directed: track recursion stack or color states: unvisited, visiting, visited.

Dijkstra solves shortest path with non-negative weights using a priority queue. Bellman-Ford handles negative edges and can detect negative cycles, but costs `O(VE)`.

Minimum spanning tree connects all vertices with minimum total edge weight. Prim grows from a starting node using a priority queue. Kruskal sorts edges and uses union-find to avoid cycles.

Topological sort works only for DAGs. Use DFS postorder or Kahn's algorithm with indegrees. If Kahn cannot process all nodes, the graph has a cycle.
