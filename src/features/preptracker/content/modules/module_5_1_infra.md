# Infrastructure & Deployment

DevOps questions test whether you understand how code reaches users reliably. Focus on packaging, orchestration, release safety, and failure recovery.

## Docker: Dockerfile, layers, multi-stage builds, networks, volumes

Docker packages an application with its runtime dependencies. Images are immutable templates; containers are running instances.

Dockerfiles are layer-based. Put rarely changing steps before frequently changing steps to improve build cache. Avoid copying secrets into images.

Multi-stage builds keep final images small by using one stage for building and another for runtime. For example, build a Java app with Maven in one stage and copy only the jar into a JRE image.

Docker networks let containers communicate. Volumes persist data outside container lifecycle. In production, avoid storing critical database state only inside ephemeral containers without proper volumes and backups.

## Kubernetes: pods, ReplicaSets, deployments, services, ConfigMaps, ingress

A pod is the smallest deployable unit. It can contain one or more tightly coupled containers.

ReplicaSets maintain a desired number of pod replicas. Deployments manage ReplicaSets and support rolling updates and rollbacks.

Services provide stable networking for pods whose IPs change. ClusterIP is internal, NodePort exposes on nodes, and LoadBalancer integrates with cloud load balancers.

ConfigMaps store non-secret configuration. Secrets store sensitive values, though they still require careful encryption and access control.

Ingress routes external HTTP traffic into services and often handles TLS termination.

## CI/CD: pipeline stages, GitHub Actions, blue-green and canary

CI validates every change with linting, tests, builds, and security checks. CD automates deployment after validation.

A typical pipeline has install, lint, test, build, package, deploy, and verify stages. Cache dependencies carefully without hiding broken builds.

Blue-green deployment runs two environments and switches traffic from old to new. It enables quick rollback but needs duplicate capacity.

Canary deployment sends a small percentage of traffic to the new version first. It reduces blast radius but requires metrics and automated rollback criteria.
