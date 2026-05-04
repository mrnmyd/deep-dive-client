# Testing Strategies

Senior engineers are expected to know what to test, where, and why — and to recognise when a test is not protecting anything. The honest answer to "should we add a test?" depends on cost, blast radius, and what kind of regression you fear.

## Unit, integration, and contract testing

| Type        | Scope                                      | Speed        | What it catches                               | What it misses            |
| ----------- | ------------------------------------------ | ------------ | --------------------------------------------- | ------------------------- |
| Unit        | One function / class, dependencies stubbed | < 50 ms      | Logic errors, branches, edge cases            | Wiring, integration drift |
| Integration | Multiple components or a real database     | 100 ms – 5 s | Wiring, ORM behaviour, schema mismatches      | Cross-service contracts   |
| Contract    | Producer ↔ consumer schema agreement       | < 1 s        | API drift between services                    | Internal logic            |
| End-to-end  | Full stack, real browser / device          | 2 s – 60 s   | User-visible regressions, deployment glitches | Specific data conditions  |

**Unit tests in Spring (JUnit 5 + Mockito)**

```java
@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock OrderRepository repo;
    @Mock PaymentClient payments;
    @InjectMocks OrderService service;

    @Test
    void placesOrderWhenStockAvailable() {
        when(repo.reserve("sku-42", 1)).thenReturn(true);
        when(payments.charge(any(), eq(BigDecimal.valueOf(99)))).thenReturn(PaymentResult.ok("tx-1"));

        Order order = service.place(new PlaceOrder("u-1", "sku-42", 1, BigDecimal.valueOf(99)));

        assertThat(order.status()).isEqualTo(OrderStatus.CONFIRMED);
        verify(repo).save(any());
    }
}
```

**Integration tests with Testcontainers**

```java
@SpringBootTest
@Testcontainers
class OrderRepositoryIT {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16");

    @DynamicPropertySource
    static void props(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }

    @Autowired OrderRepository repo;

    @Test
    void persistsAndQueries() {
        repo.save(new Order("u-1", "sku-42", 1));
        assertThat(repo.findByUser("u-1")).hasSize(1);
    }
}
```

Use a real database in integration tests when you rely on JPA, indexes, transactions, or vendor-specific SQL. In-memory H2 hides too many bugs to be trusted for critical paths.

---

## Test doubles, property-based testing, mutation testing

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

## E2E and load testing: Playwright, k6, JMeter

**Playwright (frontend E2E)**

```ts
import { test, expect } from '@playwright/test'

test('user can mark a topic done', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: /onboarding-name/i }).fill('Test')
  await page.getByRole('link', { name: /Arrays/i }).click()
  await page.getByRole('button', { name: /Mark done/i }).click()
  await expect(page.getByText('done')).toBeVisible()
})
```

E2E suites should stay small. Aim for the 5 – 15 happy paths that prove the application boots and the critical flows work; rely on integration and unit tests for the rest.

**Load testing with k6**

```js
import http from 'k6/http'
import { check, sleep } from 'k6'

export const options = {
  stages: [
    { duration: '30s', target: 50 }, // ramp up
    { duration: '2m', target: 50 }, // steady
    { duration: '30s', target: 0 }, // ramp down
  ],
  thresholds: { http_req_duration: ['p(95)<500'] },
}

export default function () {
  const res = http.get('https://api.example.com/orders')
  check(res, { 'status 200': (r) => r.status === 200 })
  sleep(1)
}
```

**Test types by intent**

| Type   | Purpose                        | Duration      |
| ------ | ------------------------------ | ------------- |
| Smoke  | Sanity check production path   | 1 – 5 min     |
| Load   | Verify SLO at expected traffic | 10 – 30 min   |
| Stress | Find the breaking point        | until failure |
| Soak   | Catch leaks and degradation    | 4 – 24 hours  |
| Spike  | Sudden surge then drop         | 5 – 15 min    |

**Common pitfalls**

- Treating CI minutes as free. A 90-minute test suite slows everyone; budget time per layer.
- E2E flakiness from animations, timing, and shared state. Use deterministic fixtures and reset state between tests.
- Mocking the system under test. If the only "logic" left after mocking is the test setup, the test is not protecting anything.

---

## Interview answers

_Q: How do you decide where to put a test?_
A: Start at the unit level for branching logic and edge cases. Add an integration test where wiring or persistence behaviour matters. Add an E2E test only for the few flows that must never break (login, checkout, the production landing path). Tests follow the testing-pyramid shape: many fast unit tests, fewer integration tests, very few E2E tests.

_Q: When do you use mocks vs fakes?_
A: Mocks for narrow collaborators with mostly verb-style methods (`payments.charge`). Fakes for stateful interfaces that get used many ways (`InMemoryOrderRepository`). Mocks make tests brittle to refactoring; fakes make setup heavier.

_Q: How do you handle a flaky test?_
A: First quarantine and reproduce. Almost always it is shared state, time, randomness, or async ordering. Fix the cause; do not mask with `@Retry`. A retried test silently hides regressions.

_Q: How would you verify a microservice contract without running both services?_
A: Consumer-driven contract tests. Pact or Spring Cloud Contract. Consumers publish expectations; providers verify against them in CI. The contract is a versioned artefact, not a wiki page.
