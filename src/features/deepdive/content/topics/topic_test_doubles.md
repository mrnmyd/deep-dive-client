# Test doubles, property-based testing, mutation testing

**Five kinds of test doubles** (Meszaros)

| Double | Behaviour                          | Use when                   |
| ------ | ---------------------------------- | -------------------------- |
| Dummy  | Passed but never used              | Filler argument            |
| Stub   | Returns canned values              | You need a known answer    |
| Spy    | Records calls; behaves normally    | You assert on side effects |
| Mock   | Pre-programmed expectations        | You assert on interactions |
| Fake   | Working implementation, simplified | In-memory repository       |

Prefer fakes over mocks when the interface is small. Mocks couple tests to call sequences and are brittle when refactoring.

**Property-based testing** generates many inputs and asserts a property holds. It catches edge cases you would not write by hand.

```java
// jqwik
@Property
void reverseTwiceIsIdentity(@ForAll List<Integer> xs) {
    assertThat(reverse(reverse(xs))).isEqualTo(xs);
}

@Property
void sortIsIdempotent(@ForAll List<Integer> xs) {
    List<Integer> sorted = sort(xs);
    assertThat(sort(sorted)).isEqualTo(sorted);
}
```

**Mutation testing** (PIT for Java, Stryker for JS) flips operators in your production code and runs your tests. Surviving mutants reveal weak assertions.

---
