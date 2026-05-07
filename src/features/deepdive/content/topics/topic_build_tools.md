# Build tools: Vite, Webpack basics, ESLint, Prettier, Husky

Vite uses native ES modules during development and Rollup for production builds. It is fast because it avoids bundling the whole app on every dev change.

Webpack builds a dependency graph and applies loaders/plugins. It is more configurable but often more complex.

ESLint catches code quality and correctness issues. Prettier formats code consistently. Husky runs Git hooks, often to enforce linting or formatting before commits.

Senior-level tooling judgment means knowing when automation helps and when it becomes friction.
