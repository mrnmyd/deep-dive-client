# Observability: logs, metrics, traces, RED + USE methods, SLI/SLO/SLA

**The three pillars**

| Pillar  | What it tells you                       | When to use                         |
| ------- | --------------------------------------- | ----------------------------------- |
| Logs    | What happened in this request           | Debugging individual incidents      |
| Metrics | Aggregated counts / gauges over time    | Dashboards, alerts, SLOs            |
| Traces  | The path a request took across services | Latency hot spots, fan-out problems |

Modern stacks unify these via OpenTelemetry: one SDK emits all three.

**Service-level signals**

- **RED method (services with requests):** Rate, Errors, Duration.
- **USE method (resources):** Utilisation, Saturation, Errors.

For HTTP services, alert on rate of 5xx, p99 latency, and request rate dropping below baseline (often the earliest signal of an outage).

**SLI, SLO, SLA**

- **SLI** (indicator): a measured number, e.g. proportion of HTTP requests under 300 ms.
- **SLO** (objective): the target, e.g. 99.9% of requests under 300 ms over 30 days.
- **SLA** (agreement): contractual commitment, usually weaker than SLO with financial penalties.

**Error budget** = `1 - SLO`. With a 99.9% SLO over 30 days, you can spend 43 minutes of unavailability per month before tripping the contract.

**Common pitfalls**

- Logging every successful request floods the cluster. Sample success; log every error.
- Cardinality explosion: putting `userId` in metric labels balloons memory in Prometheus. Use logs or traces for high-cardinality values.
- Trace IDs not propagated across asynchronous boundaries break causality. Instrument message queues and worker pools.

---
