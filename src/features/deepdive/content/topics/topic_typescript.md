# TypeScript: types vs interfaces, unions, generics, utility types

TypeScript and tooling questions test whether you can make large frontend codebases safer without slowing delivery.

Interfaces are extendable object contracts. Type aliases can represent unions, intersections, primitives, tuples, and mapped types. In practice, use the style your codebase standardizes on.

Union types model alternatives. Discriminated unions are powerful for state machines:

```ts
type State =
  | { status: 'loading' }
  | { status: 'success'; data: User[] }
  | { status: 'error'; message: string }
```

Generics let functions and components preserve type information. Use them when the caller should decide the concrete type.

Utility types reduce duplication. `Pick`, `Omit`, `Partial`, `Required`, and `Record` are common. Do not overuse utility types when explicit domain types would be clearer.
