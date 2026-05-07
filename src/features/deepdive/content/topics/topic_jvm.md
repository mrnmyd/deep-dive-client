# JVM: class loaders, memory, JIT, GC algorithms

Senior Java interviews test runtime behaviour: memory model, concurrency, collection internals, and modern language features. Syntax recall is not enough.

The JVM loads bytecode, verifies it, executes it, and optimises hot paths.

**Class loaders** form a delegation hierarchy: bootstrap → platform → application → custom. Delegation prevents duplicate loading of core classes and supports isolation in containers, app servers, or plugin systems.

**Memory areas**

| Area               | Holds                             | Lifetime            |
| ------------------ | --------------------------------- | ------------------- |
| Stack (per thread) | Method frames, locals, references | Lives with the call |
| Heap               | All objects                       | GC-managed          |
| Metaspace          | Class metadata, method bytecode   | Until class unload  |
| Code cache         | JIT-compiled native code          | JIT-managed         |
| Native memory      | Direct buffers, JNI allocations   | Outside Java heap   |

OutOfMemoryError can come from any of these. `Metaspace` errors usually indicate classloader leaks (often from frameworks or hot-redeploys).

**JIT compilation** identifies hot methods (counter-based) and compiles bytecode to optimised machine code. Tiered compilation (C1 then C2) balances startup with peak. Escape analysis can stack-allocate or scalarise objects.

**GC algorithms**

| Collector        | Goal                    | When to choose             |
| ---------------- | ----------------------- | -------------------------- |
| Serial           | Simple, single-threaded | Tiny services, single-core |
| Parallel         | Throughput              | Batch jobs, no latency SLO |
| G1               | Predictable pauses      | Default modern choice      |
| ZGC / Shenandoah | Sub-millisecond pauses  | Latency-sensitive APIs     |

**Tuning intuition**

- Long pauses with G1: increase heap or reduce live set; check humongous allocations.
- Frequent young-gen collections: enlarge young gen.
- Always enable GC logging (`-Xlog:gc*`) before tuning. Do not change collectors without baseline numbers.

---
