# Trees: BFS/DFS, LCA, diameter, BST validation, AVL rotations, Trie

Non-linear structures model hierarchy, priority, or relationships. The senior-level skill is choosing a traversal and maintaining enough state to avoid repeated work.

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
