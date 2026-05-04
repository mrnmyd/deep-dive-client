# TypeScript & Tools

TypeScript and tooling questions test whether you can make large frontend codebases safer without slowing delivery.

## TypeScript: types vs interfaces, unions, generics, utility types

Interfaces are extendable object contracts. Type aliases can represent unions, intersections, primitives, tuples, and mapped types. In practice, use the style your codebase standardizes on.

Union types model alternatives. Discriminated unions are powerful for state machines:

```ts
type State =
  | { status: "loading" }
  | { status: "success"; data: User[] }
  | { status: "error"; message: string }
```

Generics let functions and components preserve type information. Use them when the caller should decide the concrete type.

Utility types reduce duplication. `Pick`, `Omit`, `Partial`, `Required`, and `Record` are common. Do not overuse utility types when explicit domain types would be clearer.

## Build tools: Vite, Webpack basics, ESLint, Prettier, Husky

Vite uses native ES modules during development and Rollup for production builds. It is fast because it avoids bundling the whole app on every dev change.

Webpack builds a dependency graph and applies loaders/plugins. It is more configurable but often more complex.

ESLint catches code quality and correctness issues. Prettier formats code consistently. Husky runs Git hooks, often to enforce linting or formatting before commits.

Senior-level tooling judgment means knowing when automation helps and when it becomes friction.
