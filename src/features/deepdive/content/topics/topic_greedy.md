# Greedy: interval scheduling, Huffman, Jump Game, when greedy is provably correct

Greedy picks the locally best option at each step. It works only when the **exchange argument** holds: any optimal solution can be transformed into the greedy one without losing optimality.

**Classic greedy problems**

- Activity selection: sort by end time, take earliest-ending compatible.
- Huffman coding: build a min-heap of frequencies, repeatedly merge the two smallest.
- Jump Game II: track `farthest` reachable in current jump and `currentEnd`; jump when index passes `currentEnd`.
- Gas station circuit: if total gas ≥ total cost, the answer is the index after the position where cumulative deficit was lowest.

**When greedy fails**

- 0/1 knapsack: greedy by value-density does not work; need DP.
- Coin change with arbitrary denominations: greedy fails for `{1, 3, 4}` and target 6.

**Interview answers**

_Q: How do you justify a greedy choice in an interview?_
A: State the invariant the choice preserves, then sketch the exchange argument: assume an optimal solution differs at the first greedy choice; swap in the greedy pick without loss. If you cannot articulate the invariant, fall back to DP.

_Q: How is Huffman optimal?_
A: It is optimal for prefix codes given symbol frequencies. The proof uses the lemma that the two least-frequent symbols are siblings at maximum depth in some optimal tree.
