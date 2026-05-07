# Docker: Dockerfile, layers, multi-stage builds, networks, volumes

DevOps questions test whether you understand how code reaches users reliably. Focus on packaging, orchestration, release safety, and failure recovery.

Docker packages an application with its runtime dependencies. Images are immutable templates; containers are running instances.

Dockerfiles are layer-based. Put rarely changing steps before frequently changing steps to improve build cache. Avoid copying secrets into images.

Multi-stage builds keep final images small by using one stage for building and another for runtime. For example, build a Java app with Maven in one stage and copy only the jar into a JRE image.

Docker networks let containers communicate. Volumes persist data outside container lifecycle. In production, avoid storing critical database state only inside ephemeral containers without proper volumes and backups.
