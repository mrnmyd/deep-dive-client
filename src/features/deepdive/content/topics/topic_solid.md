# SOLID principles with Java examples

Senior engineering is often about making change cheaper. Principles and patterns help only when they reduce coupling, clarify intent, or contain complexity.

Single Responsibility means a class has one reason to change. A service that validates input, talks to the database, sends email, and formats reports has too many reasons to change.

Open/Closed means behavior should be extendable without editing stable code. Strategy pattern is a common implementation: add a new strategy instead of adding another `if`.

Liskov Substitution means subclasses must be usable wherever the parent is expected. Violations often appear when subclass methods throw unsupported-operation exceptions.

Interface Segregation means clients should not depend on methods they do not use. Prefer smaller role-specific interfaces.

Dependency Inversion means high-level modules should depend on abstractions, not concrete low-level details. This improves testing and replacement.
