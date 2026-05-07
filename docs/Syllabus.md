# DeepDive — Syllabus

This document is the authoritative source for study content scope. It defines all papers, their modules, and topics, plus the seeded DSA problem list. The application's syllabus seed data (`src/features/deepdive/data/syllabus.ts`) and the per-topic markdown files (`src/features/deepdive/content/topics/{topicId}.md`) must align with this document.

The syllabus is locked. Topic IDs, module IDs, and paper IDs are stable identifiers used by the application and the user's local progress data. Renaming any ID is a breaking change because it invalidates stored progress for that topic.

---

## Paper 1 — Data Structures & Algorithms

**Subtitle:** The Logic Layer
**Priority:** 1 (highest)
**Colour:** Purple

### Module 1.1 — Linear Data Structures

- **Arrays** — Static vs Dynamic, Kadane's, Boyer-Moore, Dutch National Flag
- **Strings** — KMP, Rabin-Karp, Z-Algorithm, Manacher's
- **Linked Lists** — Singly, Doubly, Circular; Floyd's cycle detection; LRU Cache
- **Stacks** — Expression evaluation, Monotonic Stack, Min-Stack
- **Queues** — Priority Queues, Deques, Sliding Window Maximum

### Module 1.2 — Non-Linear Data Structures

- **Trees** — BFS/DFS, LCA, Diameter, BST validation, AVL rotations, Trie
- **Heaps** — Binary Heap, Heapify, Heap Sort, Median in a Stream
- **Graphs** — BFS, DFS, Cycles, Dijkstra, Bellman-Ford, MST (Prim/Kruskal), Topological Sort

### Module 1.3 — Algorithm Paradigms

- **Searching & Sorting** — Binary search on answer, Quick Sort, Merge Sort
- **Backtracking** — N-Queens, Sudoku, Subset Sum, Rat in a Maze
- **Dynamic Programming** — 0/1 Knapsack, LCS, LIS, Edit Distance, MCM
- **Greedy** — Interval scheduling, Huffman, Jump Game, exchange argument

### Module 1.4 — Advanced DSA

- **Union-Find / DSU** — Path compression, union by rank, Kruskal, connectivity
- **Segment Trees & Fenwick (BIT)** — Range queries, lazy propagation
- **Bit Manipulation** — Tricks, XOR patterns, bitmask DP
- **Probabilistic data structures** — Bloom filter, Count-Min sketch, HyperLogLog, MinHash, LSH

---

## Paper 2 — Backend & Java Mastery

**Subtitle:** The Core Layer
**Priority:** 2
**Colour:** Teal

### Module 2.1 — Advanced Java

- **JVM** — Class loaders, memory areas, JIT, GC algorithms
- **Multithreading** — JMM, locks, synchronizers, ThreadLocal, ForkJoinPool, virtual threads
- **Collections** — HashMap internals, ConcurrentHashMap, CopyOnWriteArrayList, BlockingQueue
- **Modern Java** — Lambdas, streams, Optional, records, sealed classes, pattern matching

### Module 2.2 — Spring Boot & Ecosystem

- **Core Spring** — DI, scopes, lifecycle, CGLIB vs JDK proxying
- **Spring Security** — Filter chain, AuthenticationManager, JWT, OAuth2, CSRF, CORS
- **Data & Transactions** — JPA, JPQL, isolation, propagation, N+1 problem

### Module 2.3 — Databases & SQL

- **SQL Mastery** — Joins, CTEs, window functions, indexing, EXPLAIN
- **Scaling** — Partitioning, sharding, replication patterns

### Module 2.4 — Testing Strategies

- **Unit, integration, contract testing** — Scope, isolation, fakes vs mocks
- **Test doubles** — Property-based testing, mutation testing
- **E2E and load testing** — Playwright, k6, JMeter

### Module 2.5 — Security

- **OWASP Top 10** — XSS, CSRF, SQLi, IDOR, SSRF, broken auth, security misconfiguration
- **Cryptography basics** — Hashing, signing, TLS handshake, symmetric vs asymmetric, encryption at rest
- **Secure coding** — Input validation, output encoding, secret management, dependency scanning

---

## Paper 3 — Frontend & React Mastery

**Subtitle:** The Interface Layer
**Priority:** 3
**Colour:** Blue

### Module 3.1 — React Internals

- **The Engine** — Virtual DOM, Reconciliation, Fiber, Lanes, Concurrent rendering, Hydration
- **Hooks** — useEffect, useLayoutEffect, useRef, useReducer, useContext, useMemo, useCallback
- **Patterns** — HOC, Render Props, Compound Components, Controlled vs Uncontrolled

### Module 3.2 — State & Performance

- **State Management** — TanStack Query, Redux Toolkit, Zustand, Context API
- **Optimisation** — React.memo, Windowing, Code Splitting, Image Optimisation

### Module 3.3 — TypeScript & Tools

- **TypeScript** — Types vs interfaces, unions, generics, utility types
- **Build Tools** — Vite, Webpack basics, ESLint, Prettier, Husky

### Module 3.4 — Quality & Browser Internals

- **Accessibility** — WCAG, ARIA, semantic HTML, keyboard navigation, screen readers
- **Browser internals** — Rendering pipeline, event loop, V8, web APIs, paint and layout

---

## Paper 4 — System Design & Architecture

**Subtitle:** The Senior Layer
**Priority:** 4
**Colour:** Amber

### Module 4.1 — Components of Scalable Systems

- **Networking** — DNS, Load Balancers, Round Robin, Consistent Hashing, Nginx
- **Caching** — Redis Data Types, Invalidation strategies, LRU/LFU
- **Communication** — REST vs GraphQL, gRPC, WebSockets, Message Queues
- **Networking deep dive** — TLS handshake, HTTP/3 + QUIC, TCP slow-start, BGP routing

### Module 4.2 — Design Patterns & Principles

- **SOLID** — SRP, OCP, LSP, ISP, DIP with Java examples
- **Design Patterns** — Singleton, Factory, Observer, Strategy, Decorator, Adapter, Facade, Proxy
- **Architecture** — Microservices, API Gateway, Circuit Breaker, Saga Pattern

### Module 4.3 — Distributed Systems & Observability

- **CAP, PACELC** — Consistency models: linearizable, sequential, eventual
- **Consensus, leader election** — Raft / Paxos intuition, idempotency, exactly-once
- **Observability** — Logs, metrics, traces, RED + USE methods, SLI/SLO/SLA

### Module 4.4 — System Design Practice

- **Capacity estimation** — Back-of-envelope math, QPS, storage, bandwidth
- **Walkthrough: URL shortener (TinyURL)**
- **Walkthrough: chat / messaging system (WhatsApp-lite)**
- **Walkthrough: social news feed (fan-out on read vs write)**
- **Walkthrough: distributed rate limiter (token bucket)**
- **Walkthrough: payments system** — idempotency, double-charge, saga, refund, reconciliation

---

## Paper 5 — DevOps, Cloud & AI

**Subtitle:** The 2026 Edge
**Priority:** 5
**Colour:** Gray

### Module 5.1 — Infrastructure & Deployment

- **Docker** — Dockerfile, Layers, Multi-stage builds, Networks, Volumes
- **Kubernetes** — Pods, ReplicaSets, Deployments, Services, ConfigMaps, Ingress
- **CI/CD** — Pipeline stages, GitHub Actions, Blue-Green and Canary

### Module 5.2 — AI & Emerging Tech

- **AI Engineering** — RAG, Embeddings, Vector Databases, LangChain basics
- **AWS** — EC2, S3, RDS, Lambda, IAM, VPC

---

## Paper 6 — Senior Skills & Behavioral

**Subtitle:** The Communication Layer
**Priority:** 3
**Colour:** Blue

### Module 6.1 — Behavioral & Communication

- **STAR method** — Situation, Task, Action, Result; story bank construction
- **Scoping & clarifying questions** — Requirements, constraints, assumptions in interviews
- **Technical leadership** — Code reviews, mentoring, scope management, on-call ownership
- **Disagreement, tradeoffs, influence without authority**
- **Discussing failure and growth** — Post-mortems, blameless retrospectives

---

## Paper 7 — Systems Fundamentals

**Subtitle:** The Foundations Layer
**Priority:** 4
**Colour:** Gray

### Module 7.1 — Operating Systems

- **OS fundamentals** — Processes vs threads, virtual memory, paging, scheduling, context switches, IPC

---

## DSA Problem Seed List

These problems must be pre-loaded in the problem seed data (`src/features/deepdive/data/problems.ts`). The first 25 are organised across a structured 4-week plan.

### Week 1 — Arrays & Hashing

| Problem                 | Difficulty | Pattern          | LeetCode # |
| ----------------------- | ---------- | ---------------- | ---------- |
| Two Sum                 | Easy       | HashMap          | #1         |
| Contains Duplicate      | Easy       | HashSet          | #217       |
| Valid Anagram           | Easy       | Frequency Map    | #242       |
| Group Anagrams          | Medium     | Frequency Map    | #49        |
| Running Sum of 1D Array | Easy       | Prefix Sum       | #1480      |
| Subarray Sum Equals K   | Medium     | Prefix Sum + Map | #560       |

### Week 2 — Two Pointers & Strings

| Problem                             | Difficulty | Pattern      | LeetCode # |
| ----------------------------------- | ---------- | ------------ | ---------- |
| Valid Palindrome                    | Easy       | Two Pointers | #125       |
| Two Sum II                          | Medium     | Two Pointers | #167       |
| 3Sum                                | Medium     | Two Pointers | #15        |
| Remove Duplicates from Sorted Array | Easy       | Fast & Slow  | #26        |
| Reverse String                      | Easy       | Two Pointers | #344       |
| Container With Most Water           | Medium     | Two Pointers | #11        |

### Week 3 — Sliding Window

| Problem                                        | Difficulty | Pattern         | LeetCode # |
| ---------------------------------------------- | ---------- | --------------- | ---------- |
| Maximum Average Subarray I                     | Easy       | Fixed Window    | #643       |
| Best Time to Buy and Sell Stock                | Easy       | Fixed Window    | #121       |
| Longest Substring Without Repeating Characters | Medium     | Variable Window | #3         |
| Permutation in String                          | Medium     | Fixed Window    | #567       |
| Minimum Size Subarray Sum                      | Medium     | Variable Window | #209       |
| Longest Repeating Character Replacement        | Medium     | Variable Window | #424       |

### Week 4 — Binary Search

| Problem                                 | Difficulty | Pattern               | LeetCode # |
| --------------------------------------- | ---------- | --------------------- | ---------- |
| Binary Search                           | Easy       | Classic Binary Search | #704       |
| Search in Rotated Sorted Array          | Medium     | Binary Search Variant | #33        |
| Find Minimum in Rotated Sorted Array    | Medium     | Binary Search Variant | #153       |
| Koko Eating Bananas                     | Medium     | Search on Answer      | #875       |
| Capacity To Ship Packages Within D Days | Medium     | Search on Answer      | #1011      |
| Find Peak Element                       | Medium     | Binary Search Variant | #162       |
| Time Based Key-Value Store              | Medium     | Binary Search + Map   | #981       |

---

## Topic ID Conventions

- Paper IDs follow `paper_{n}_{slug}` (e.g. `paper_1_dsa`, `paper_7_systems_fundamentals`).
- Module IDs follow `module_{paper}_{n}_{slug}` (e.g. `module_1_1_linear`, `module_3_4_quality`).
- Topic IDs follow `topic_{slug}` and are stable forever once seeded.
- Topic markdown lives at `src/features/deepdive/content/topics/{topicId}.md`.
- Per-module supplements (shared sections like "Common pitfalls" / "Interview answers" that span multiple topics) live at `src/features/deepdive/content/supplements/{moduleId}.md`.
- Problem IDs follow `prob_{slug}` and are stable forever once seeded.

If a topic or problem is removed from the syllabus, mark it deprecated in the seed data rather than deleting it, so existing user progress remains addressable.

---

_End of Syllabus document._
