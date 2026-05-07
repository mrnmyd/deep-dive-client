# Modern Java: lambdas, streams, Optional, records, sealed classes, pattern matching

**Streams**

```java
Map<Department, List<Employee>> byDept = employees.stream()
    .filter(e -> e.salary() > 50_000)
    .collect(groupingBy(Employee::department));

double averageBySeniority = employees.stream()
    .collect(averagingDouble(e -> e.tenureYears()));
```

Streams are best for clear pipelines. Imperative code is sometimes clearer; do not force a stream.

**Optional**

```java
return repo.findById(id)
    .filter(Order::isActive)
    .map(this::toDto)
    .orElseThrow(() -> new NotFoundException(id));
```

Use `Optional` as a return type to communicate possible absence. Avoid as a field, parameter, or in collections — `null` plus a `@Nullable` annotation reads better.

**Records, sealed classes, pattern matching**

```java
sealed interface Result<T> permits Ok, Err {}
record Ok<T>(T value) implements Result<T> {}
record Err<T>(String message) implements Result<T> {}

String describe(Result<Integer> r) {
    return switch (r) {
        case Ok<Integer> ok    -> "ok: " + ok.value();
        case Err<Integer> err  -> "err: " + err.message();
    };
}
```

Sealed types make exhaustiveness real. The compiler enforces that every subtype is handled in a switch.

---
