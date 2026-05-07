# Unit, integration, and contract testing: scope, isolation, fakes vs mocks

Senior engineers are expected to know what to test, where, and why — and to recognise when a test is not protecting anything. The honest answer to "should we add a test?" depends on cost, blast radius, and what kind of regression you fear.

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
