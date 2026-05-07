# CI/CD: pipeline stages, GitHub Actions, blue-green and canary deployments

CI validates every change with linting, tests, builds, and security checks. CD automates deployment after validation.

A typical pipeline has install, lint, test, build, package, deploy, and verify stages. Cache dependencies carefully without hiding broken builds.

Blue-green deployment runs two environments and switches traffic from old to new. It enables quick rollback but needs duplicate capacity.

Canary deployment sends a small percentage of traffic to the new version first. It reduces blast radius but requires metrics and automated rollback criteria.
