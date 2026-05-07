# Testing Strategies — supplement

## Interview answers

_Q: How do you decide where to put a test?_
A: Start at the unit level for branching logic and edge cases. Add an integration test where wiring or persistence behaviour matters. Add an E2E test only for the few flows that must never break (login, checkout, the production landing path). Tests follow the testing-pyramid shape: many fast unit tests, fewer integration tests, very few E2E tests.

_Q: When do you use mocks vs fakes?_
A: Mocks for narrow collaborators with mostly verb-style methods (`payments.charge`). Fakes for stateful interfaces that get used many ways (`InMemoryOrderRepository`). Mocks make tests brittle to refactoring; fakes make setup heavier.

_Q: How do you handle a flaky test?_
A: First quarantine and reproduce. Almost always it is shared state, time, randomness, or async ordering. Fix the cause; do not mask with `@Retry`. A retried test silently hides regressions.

_Q: How would you verify a microservice contract without running both services?_
A: Consumer-driven contract tests. Pact or Spring Cloud Contract. Consumers publish expectations; providers verify against them in CI. The contract is a versioned artefact, not a wiki page.
