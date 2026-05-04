import type { Paper } from '@/features/deepdive/types/deepdive.types'

const topic = (
  id: string,
  title: string,
  tags: string[],
  priority: 'high' | 'medium' | 'low' = 'medium',
  estimatedHours = 2
) => ({
  id,
  title,
  priority,
  estimatedHours,
  tags,
})

export const syllabus: Paper[] = [
  {
    id: 'paper_1_dsa',
    title: 'Data Structures & Algorithms',
    subtitle: 'The Logic Layer',
    priority: 1,
    color: 'purple',
    modules: [
      {
        id: 'module_1_1_linear',
        title: 'Linear Data Structures',
        topics: [
          topic(
            'topic_arrays_kadane',
            'Arrays: static vs dynamic, Kadane, Boyer-Moore, Dutch National Flag',
            ['arrays', 'kadane', 'sorting'],
            'high',
            4
          ),
          topic(
            'topic_strings_algorithms',
            'Strings: KMP, Rabin-Karp, Z-Algorithm, Manacher',
            ['strings', 'pattern-matching'],
            'high',
            4
          ),
          topic(
            'topic_linked_lists',
            'Linked Lists: singly, doubly, circular, Floyd cycle, LRU cache',
            ['linked-list', 'lru'],
            'medium',
            3
          ),
          topic(
            'topic_stacks',
            'Stacks: expression evaluation, monotonic stack, min-stack',
            ['stack', 'monotonic'],
            'high',
            3
          ),
          topic(
            'topic_queues',
            'Queues: priority queues, deques, sliding window maximum',
            ['queue', 'deque', 'sliding-window'],
            'high',
            3
          ),
        ],
      },
      {
        id: 'module_1_2_non_linear',
        title: 'Non-Linear Data Structures',
        topics: [
          topic(
            'topic_trees',
            'Trees: BFS/DFS, LCA, diameter, BST validation, AVL rotations, Trie',
            ['trees', 'trie', 'bst'],
            'high',
            5
          ),
          topic(
            'topic_heaps',
            'Heaps: binary heap, heapify, heap sort, median in a stream',
            ['heap', 'priority-queue'],
            'medium',
            3
          ),
          topic(
            'topic_graphs',
            'Graphs: BFS, DFS, cycles, shortest paths, MST, topological sort',
            ['graphs', 'dijkstra', 'mst'],
            'high',
            6
          ),
        ],
      },
      {
        id: 'module_1_3_paradigms',
        title: 'Algorithm Paradigms',
        topics: [
          topic(
            'topic_search_sort',
            'Searching & Sorting: binary search on answer, quick sort, merge sort',
            ['binary-search', 'sorting'],
            'high',
            4
          ),
          topic(
            'topic_backtracking',
            'Backtracking: N-Queens, Sudoku, subset sum, rat in a maze',
            ['backtracking'],
            'medium',
            4
          ),
          topic(
            'topic_dynamic_programming',
            'Dynamic Programming: knapsack, LCS, LIS, edit distance, MCM',
            ['dp'],
            'high',
            6
          ),
          topic(
            'topic_greedy',
            'Greedy: interval scheduling, Huffman, Jump Game, when greedy is provably correct',
            ['greedy'],
            'high',
            3
          ),
        ],
      },
      {
        id: 'module_1_4_advanced',
        title: 'Advanced DSA',
        topics: [
          topic(
            'topic_union_find',
            'Union-Find / DSU: path compression, union by rank, Kruskal, connectivity',
            ['union-find', 'dsu'],
            'high',
            3
          ),
          topic(
            'topic_segment_trees',
            'Segment Trees & Fenwick (BIT): range queries, lazy propagation',
            ['segment-tree', 'fenwick'],
            'medium',
            4
          ),
          topic(
            'topic_bit_manipulation',
            'Bit Manipulation: tricks, XOR patterns, bitmask DP, set operations',
            ['bit-manipulation'],
            'high',
            3
          ),
        ],
      },
    ],
  },
  {
    id: 'paper_2_backend_java',
    title: 'Backend & Java Mastery',
    subtitle: 'The Core Layer',
    priority: 2,
    color: 'teal',
    modules: [
      {
        id: 'module_2_1_java',
        title: 'Advanced Java',
        topics: [
          topic(
            'topic_jvm',
            'JVM: class loaders, memory, JIT, GC algorithms',
            ['java', 'jvm', 'gc'],
            'high',
            5
          ),
          topic(
            'topic_multithreading',
            'Multithreading: JMM, locks, synchronizers, ThreadLocal, ForkJoinPool, virtual threads',
            ['java', 'concurrency'],
            'high',
            6
          ),
          topic(
            'topic_collections',
            'Collections: HashMap internals, ConcurrentHashMap, CopyOnWriteArrayList, BlockingQueue',
            ['java', 'collections'],
            'high',
            4
          ),
          topic(
            'topic_modern_java',
            'Modern Java: lambdas, streams, Optional, records, sealed classes, pattern matching',
            ['java', 'streams'],
            'medium',
            4
          ),
        ],
      },
      {
        id: 'module_2_2_spring',
        title: 'Spring Boot & Ecosystem',
        topics: [
          topic(
            'topic_core_spring',
            'Core Spring: DI, scopes, lifecycle, CGLIB vs JDK proxying',
            ['spring', 'di'],
            'high',
            4
          ),
          topic(
            'topic_spring_security',
            'Spring Security: filter chain, AuthenticationManager, JWT, OAuth2, CSRF, CORS',
            ['spring-security', 'auth'],
            'high',
            5
          ),
          topic(
            'topic_jpa_transactions',
            'Data & Transactions: JPA, JPQL, isolation, propagation, N+1 problem',
            ['jpa', 'transactions'],
            'high',
            5
          ),
        ],
      },
      {
        id: 'module_2_3_databases',
        title: 'Databases & SQL',
        topics: [
          topic(
            'topic_sql_mastery',
            'SQL: joins, subqueries, CTEs, window functions, indexing, EXPLAIN',
            ['sql', 'indexes'],
            'high',
            5
          ),
          topic(
            'topic_db_scaling',
            'Scaling: partitioning, sharding, replication patterns',
            ['database', 'scaling'],
            'medium',
            4
          ),
        ],
      },
      {
        id: 'module_2_4_testing',
        title: 'Testing Strategies',
        topics: [
          topic(
            'topic_unit_integration',
            'Unit, integration, and contract testing: scope, isolation, fakes vs mocks',
            ['testing', 'junit'],
            'high',
            4
          ),
          topic(
            'topic_test_doubles',
            'Test doubles, property-based testing, mutation testing',
            ['testing', 'property-based'],
            'medium',
            3
          ),
          topic(
            'topic_e2e_load',
            'E2E and load testing: Playwright, k6, JMeter, smoke vs soak vs stress',
            ['testing', 'load-testing'],
            'medium',
            3
          ),
        ],
      },
    ],
  },
  {
    id: 'paper_3_frontend_react',
    title: 'Frontend & React Mastery',
    subtitle: 'The Interface Layer',
    priority: 3,
    color: 'blue',
    modules: [
      {
        id: 'module_3_1_react_internals',
        title: 'React Internals',
        topics: [
          topic(
            'topic_react_engine',
            'React engine: Virtual DOM, reconciliation, Fiber, lanes, concurrency, hydration',
            ['react', 'fiber'],
            'high',
            5
          ),
          topic(
            'topic_react_hooks',
            'Hooks: effects, refs, reducer, context, memoization',
            ['react', 'hooks'],
            'high',
            4
          ),
          topic(
            'topic_react_patterns',
            'Patterns: HOC, render props, compound components, controlled vs uncontrolled',
            ['react', 'patterns'],
            'medium',
            4
          ),
        ],
      },
      {
        id: 'module_3_2_state_perf',
        title: 'State & Performance',
        topics: [
          topic(
            'topic_state_management',
            'State management: TanStack Query, Redux Toolkit, Zustand, Context API',
            ['state', 'query'],
            'high',
            4
          ),
          topic(
            'topic_frontend_optimisation',
            'Optimisation: memo, windowing, code splitting, image optimisation',
            ['performance'],
            'high',
            4
          ),
        ],
      },
      {
        id: 'module_3_3_ts_tools',
        title: 'TypeScript & Tools',
        topics: [
          topic(
            'topic_typescript',
            'TypeScript: types vs interfaces, unions, generics, utility types',
            ['typescript'],
            'high',
            4
          ),
          topic(
            'topic_build_tools',
            'Build tools: Vite, Webpack basics, ESLint, Prettier, Husky',
            ['vite', 'tooling'],
            'medium',
            3
          ),
        ],
      },
    ],
  },
  {
    id: 'paper_4_system_design',
    title: 'System Design & Architecture',
    subtitle: 'The Senior Layer',
    priority: 4,
    color: 'amber',
    modules: [
      {
        id: 'module_4_1_scalable_systems',
        title: 'Components of Scalable Systems',
        topics: [
          topic(
            'topic_networking',
            'Networking: DNS, load balancers, round robin, consistent hashing, Nginx',
            ['networking', 'load-balancing'],
            'high',
            4
          ),
          topic(
            'topic_caching',
            'Caching: Redis data types, invalidation strategies, LRU/LFU',
            ['cache', 'redis'],
            'high',
            4
          ),
          topic(
            'topic_communication',
            'Communication: REST vs GraphQL, gRPC, WebSockets, message queues',
            ['api', 'kafka'],
            'high',
            4
          ),
        ],
      },
      {
        id: 'module_4_2_patterns',
        title: 'Design Patterns & Principles',
        topics: [
          topic('topic_solid', 'SOLID principles with Java examples', ['solid', 'java'], 'high', 3),
          topic(
            'topic_design_patterns',
            'Design patterns: singleton, factory, observer, strategy, decorator, adapter, facade, proxy',
            ['patterns'],
            'high',
            5
          ),
          topic(
            'topic_architecture',
            'Architecture: microservices, API gateway, circuit breaker, saga pattern',
            ['architecture', 'microservices'],
            'high',
            5
          ),
        ],
      },
      {
        id: 'module_4_3_distributed',
        title: 'Distributed Systems & Observability',
        topics: [
          topic(
            'topic_cap_consistency',
            'CAP, PACELC, consistency models: linearizable, sequential, eventual',
            ['cap', 'consistency'],
            'high',
            4
          ),
          topic(
            'topic_consensus_leader',
            'Consensus, leader election, Raft / Paxos intuition, idempotency, exactly-once',
            ['consensus', 'raft'],
            'high',
            4
          ),
          topic(
            'topic_observability',
            'Observability: logs, metrics, traces, RED + USE methods, SLI/SLO/SLA',
            ['observability', 'monitoring'],
            'high',
            3
          ),
        ],
      },
      {
        id: 'module_4_4_practice',
        title: 'System Design Practice',
        topics: [
          topic(
            'topic_capacity_estimation',
            'Capacity estimation: back-of-envelope math, QPS, storage, bandwidth',
            ['estimation', 'system-design'],
            'high',
            3
          ),
          topic(
            'topic_url_shortener',
            'Walkthrough: URL shortener (TinyURL)',
            ['system-design', 'walkthrough'],
            'high',
            3
          ),
          topic(
            'topic_chat_system',
            'Walkthrough: chat / messaging system (WhatsApp-lite)',
            ['system-design', 'walkthrough'],
            'high',
            4
          ),
          topic(
            'topic_news_feed',
            'Walkthrough: social news feed (fan-out on read vs write)',
            ['system-design', 'walkthrough'],
            'high',
            4
          ),
          topic(
            'topic_rate_limiter',
            'Walkthrough: distributed rate limiter (token bucket)',
            ['system-design', 'walkthrough'],
            'medium',
            3
          ),
        ],
      },
    ],
  },
  {
    id: 'paper_5_devops_cloud_ai',
    title: 'DevOps, Cloud & AI',
    subtitle: 'The 2026 Edge',
    priority: 5,
    color: 'gray',
    modules: [
      {
        id: 'module_5_1_infra',
        title: 'Infrastructure & Deployment',
        topics: [
          topic(
            'topic_docker',
            'Docker: Dockerfile, layers, multi-stage builds, networks, volumes',
            ['docker'],
            'high',
            4
          ),
          topic(
            'topic_kubernetes',
            'Kubernetes: pods, ReplicaSets, deployments, services, ConfigMaps, ingress',
            ['kubernetes'],
            'medium',
            5
          ),
          topic(
            'topic_cicd',
            'CI/CD: pipeline stages, GitHub Actions, blue-green and canary deployments',
            ['ci-cd', 'github-actions'],
            'medium',
            3
          ),
        ],
      },
      {
        id: 'module_5_2_ai_cloud',
        title: 'AI & Emerging Tech',
        topics: [
          topic(
            'topic_ai_engineering',
            'AI engineering: RAG, embeddings, vector databases, LangChain basics',
            ['ai', 'rag'],
            'medium',
            4
          ),
          topic('topic_aws', 'AWS: EC2, S3, RDS, Lambda, IAM, VPC', ['aws', 'cloud'], 'medium', 5),
        ],
      },
    ],
  },
  {
    id: 'paper_6_senior_skills',
    title: 'Senior Skills & Behavioral',
    subtitle: 'The Communication Layer',
    priority: 3,
    color: 'blue',
    modules: [
      {
        id: 'module_6_1_behavioral',
        title: 'Behavioral & Communication',
        topics: [
          topic(
            'topic_star_method',
            'STAR method: Situation, Task, Action, Result; story bank construction',
            ['behavioral', 'star'],
            'high',
            3
          ),
          topic(
            'topic_scoping_clarifying',
            'Scoping & clarifying questions: requirements, constraints, assumptions in interviews',
            ['behavioral', 'scoping'],
            'high',
            2
          ),
          topic(
            'topic_tech_leadership',
            'Technical leadership: code reviews, mentoring, scope management, on-call ownership',
            ['leadership', 'behavioral'],
            'high',
            4
          ),
          topic(
            'topic_disagreement_tradeoffs',
            'Disagreement, tradeoffs, and influence without authority',
            ['behavioral', 'communication'],
            'medium',
            3
          ),
          topic(
            'topic_failure_growth',
            'Discussing failure and growth: post-mortems, blameless retrospectives',
            ['behavioral', 'growth'],
            'medium',
            2
          ),
        ],
      },
    ],
  },
]
