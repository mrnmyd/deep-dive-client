# PrepTracker — Syllabus

This document is the authoritative source for study content scope. It defines all five papers, their modules, and topics, plus the seeded DSA problem list. The application's syllabus seed data (`src/features/preptracker/data/syllabus.ts`) and the per-module markdown files (`src/features/preptracker/content/modules/{moduleId}.md`) must align with this document.

The syllabus is locked. Topic IDs and module IDs are stable identifiers used by the application and the user's local progress data. Renaming any ID is a breaking change because it invalidates stored progress for that topic.

---

## Paper 1 — Data Structures & Algorithms

**Subtitle:** The Logic Layer
**Priority:** 1 (highest)
**Colour:** Purple (`#7C3AED`)

### Module 1.1 — Linear Data Structures

- **Arrays** — Static vs Dynamic, Kadane's Algorithm, Boyer-Moore Voting, Dutch National Flag
- **Strings** — KMP, Rabin-Karp, Z-Algorithm, Palindrome logic (Manacher's)
- **Linked Lists** — Singly, Doubly, Circular; Floyd's Cycle-Finding; LRU Cache with DLL
- **Stacks** — Expression Evaluation (Infix/Postfix), Monotonic Stack, Min-Stack
- **Queues** — Priority Queues, Deques, Sliding Window Maximum using Deque

### Module 1.2 — Non-Linear Data Structures

- **Trees** — BFS/DFS traversals, LCA, Diameter, BST Validation, AVL Rotations, Trie
- **Heaps** — Binary Heap, Heapify, Heap Sort, Median in a Stream
- **Graphs** — BFS, DFS, Cycle Detection, Dijkstra, Bellman-Ford, Prim's, Kruskal's, Topological Sort

### Module 1.3 — Algorithm Paradigms

- **Searching & Sorting** — Binary Search on answer space, Quick Sort, Merge Sort
- **Backtracking** — N-Queens, Sudoku Solver, Subset Sum, Rat in a Maze
- **Dynamic Programming** — 0/1 Knapsack, LCS, LIS, Edit Distance, Matrix Chain Multiplication

---

## Paper 2 — Backend & Java Mastery

**Subtitle:** The Core Layer
**Priority:** 2
**Colour:** Teal (`#0D9488`)

### Module 2.1 — Advanced Java

- **JVM** — Class Loaders, Stack vs Heap, Metaspace, JIT Compilation, GC Algorithms (Serial, Parallel, G1, ZGC)
- **Multithreading** — JMM, Happens-before, `volatile`, `synchronized`, `ReentrantLock`, `Semaphore`, `CountDownLatch`, `CyclicBarrier`, `ThreadLocal`, `ForkJoinPool`, Virtual Threads
- **Collections** — `HashMap` internals (JDK 8+), `ConcurrentHashMap`, `CopyOnWriteArrayList`, `BlockingQueue`
- **Modern Java** — Lambdas, Streams API, `Optional`, Records, Sealed Classes, Pattern Matching for `instanceof`

### Module 2.2 — Spring Boot & Ecosystem

- **Core Spring** — DI (Constructor vs Setter), Bean Scopes, Bean Lifecycle, CGLIB vs JDK Proxying
- **Spring Security** — Filter Chain, `AuthenticationManager`, JWT, OAuth2, CSRF, CORS
- **Data & Transactions** — JPA/Hibernate, JPQL, Transaction Isolation, Transaction Propagation, N+1 Problem

### Module 2.3 — Databases & SQL

- **SQL Mastery** — Joins, Subqueries, CTEs, Window Functions (`RANK`, `LEAD`, `LAG`), Indexing (B-Tree, B+Tree), `EXPLAIN`
- **Scaling** — Partitioning, Sharding, Replication (Master-Slave, Multi-master)

---

## Paper 3 — Frontend & React Mastery

**Subtitle:** The Interface Layer
**Priority:** 3
**Colour:** Blue (`#2563EB`)

### Module 3.1 — React Internals

- **The Engine** — Virtual DOM, Reconciliation, React Fiber, Lane Priority, Concurrent Rendering, Hydration
- **Hooks** — `useEffect`, `useLayoutEffect`, `useRef`, `useReducer`, `useContext`, `useMemo`, `useCallback`
- **Patterns** — HOC, Render Props, Compound Components, Controlled vs Uncontrolled

### Module 3.2 — State & Performance

- **State Management** — TanStack Query, Redux Toolkit, Zustand, Context API
- **Optimisation** — `React.memo`, Windowing (`react-window`), Code Splitting (`React.lazy`/`Suspense`), Image Optimisation

### Module 3.3 — TypeScript & Tools

- **TypeScript** — Interfaces vs Types, Union/Intersection, Generics, Utility Types (`Partial`, `Required`, `Pick`, `Omit`)
- **Build Tools** — Vite, Webpack basics, ESLint, Prettier, Husky

---

## Paper 4 — System Design & Architecture

**Subtitle:** The Senior Layer
**Priority:** 4
**Colour:** Amber (`#D97706`)

### Module 4.1 — Components of Scalable Systems

- **Networking** — DNS, Load Balancers (L4 vs L7), Round Robin, Consistent Hashing, Nginx
- **Caching** — Redis Data Types, Cache Invalidation (Write-through, Write-around, Write-back), LRU/LFU
- **Communication** — REST vs GraphQL, gRPC, WebSockets, Message Queues (Kafka, RabbitMQ)

### Module 4.2 — Design Patterns & Principles

- **SOLID** — SRP, OCP, LSP, ISP, DIP with Java examples
- **Design Patterns** — Singleton, Factory, Observer, Strategy, Decorator, Adapter, Facade, Proxy
- **Architecture** — Microservices vs Monolith, Service Discovery, API Gateway, Circuit Breaker, Saga Pattern

---

## Paper 5 — DevOps, Cloud & AI

**Subtitle:** The 2026 Edge
**Priority:** 5
**Colour:** Gray (`#6B7280`)

### Module 5.1 — Infrastructure & Deployment

- **Docker** — Dockerfile, Layers, Multi-stage builds, Network types, Volumes
- **Kubernetes** — Pods, ReplicaSets, Deployments, Services, ConfigMaps, Ingress
- **CI/CD** — Pipeline stages, GitHub Actions, Blue-Green vs Canary Deployments

### Module 5.2 — AI & Cloud

- **AI Engineering** — RAG, Embedding Models, Vector Databases (Pinecone/pgvector), LangChain basics
- **AWS** — EC2, S3, RDS, Lambda, IAM Policies, VPC

---

## DSA Problem Seed List

These problems must be pre-loaded in the problem seed data (`src/features/preptracker/data/problems.ts`). The first 25 are organised across a structured 4-week plan.

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

- Paper IDs follow `paper_{n}_{slug}` (e.g. `paper_1_dsa`, `paper_3_frontend`).
- Module IDs follow `module_{paper}_{n}_{slug}` (e.g. `module_1_1_linear`, `module_3_2_state_perf`). Markdown filenames must match the module ID exactly.
- Topic IDs follow `topic_{slug}_{detail}` and are stable forever once seeded.
- Problem IDs follow `prob_{slug}` and are stable forever once seeded.

If a topic or problem is removed from the syllabus, mark it deprecated in the seed data rather than deleting it, so existing user progress remains addressable.

---

_End of Syllabus document._
