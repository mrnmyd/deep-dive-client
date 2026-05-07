# Stacks: expression evaluation, monotonic stack, min-stack

A stack models last-in-first-out work. In interviews, stacks often encode "the last unresolved thing".

Expression evaluation uses stacks for operators and operands. Infix expressions require precedence handling; postfix expressions are simpler because operators appear after operands. Parentheses push context and force evaluation boundaries.

Monotonic stacks keep values increasing or decreasing. They solve "next greater", "previous smaller", stock span, histogram area, and similar problems. The invariant is the sorted order of the stack. When the invariant breaks, pop and resolve answers for popped elements.

Min-stack supports `push`, `pop`, `top`, and `getMin` in `O(1)`. Either store pairs `(value, currentMin)` or keep a second stack of minimum values.
