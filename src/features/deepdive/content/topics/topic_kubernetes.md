# Kubernetes: pods, ReplicaSets, deployments, services, ConfigMaps, ingress

A pod is the smallest deployable unit. It can contain one or more tightly coupled containers.

ReplicaSets maintain a desired number of pod replicas. Deployments manage ReplicaSets and support rolling updates and rollbacks.

Services provide stable networking for pods whose IPs change. ClusterIP is internal, NodePort exposes on nodes, and LoadBalancer integrates with cloud load balancers.

ConfigMaps store non-secret configuration. Secrets store sensitive values, though they still require careful encryption and access control.

Ingress routes external HTTP traffic into services and often handles TLS termination.
