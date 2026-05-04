# PrepTracker — Project Reference Document

**Senior Developer Interview Preparation Platform**
**Version:** 1.1 — Aligned with Deep Dive client implementation
**Stack:** React 19 + TypeScript + Vite 7 + Tailwind CSS 4 + localStorage
**Hosting:** Vercel / GitHub Pages (free)
**Target User:** Full Stack Developer preparing for Senior interviews
**Document Purpose:** Primary reference for Codex build prompts and ongoing development

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [Application Structure](#3-application-structure)
4. [Data Model](#4-data-model)
5. [Pages and Features](#5-pages-and-features)
6. [Custom Hooks](#6-custom-hooks)
7. [UI Design Guidelines](#7-ui-design-guidelines)
8. [Build Phases](#8-build-phases)
9. [Syllabus Content Reference](#9-syllabus-content-reference)
10. [DSA Problem Seed List](#10-dsa-problem-seed-list)
11. [Codex Build Prompts](#11-codex-build-prompts)
12. [Future Enhancements](#12-future-enhancements-post-v1)

---

## 1. Project Overview

### 1.1 Purpose

PrepTracker is a self-contained, single-user study portal designed to serve as the final place to study for senior developer interviews. It contains the syllabus, study material, guided sessions, DSA practice, and completion flow in one place without requiring a backend server or database.

The application is built to solve a specific and personal problem: studying senior interview material without crawling tabs, repeatedly asking AI tools for explanations, or scattering preparation across documents. Tracking exists only to support the study flow.

### 1.2 Core Philosophy

- **Study everything in one place** — the portal contains the material, session flow, DSA links, and completion state
- **Session-first workflow** — the main action is starting a study session, not browsing dashboards
- **Visible progress as support** — the app makes it obvious what has been studied and what remains
- **Variety by design** — multiple modules prevent the monotony of single-topic study
- **Zero friction** — no login, no server, opens instantly in a browser
- **Shareable** — friends can use the same app with their own local data

### 1.3 Who It Is For

**Primary user:** A full stack developer with approximately 4 years of experience preparing for a Senior Full Stack Developer role. The syllabus covers 5 papers: DSA, Java/Spring Boot, React/Frontend, System Design, and DevOps/Cloud.

**Secondary users:** Friends and peers preparing for similar roles who can use the same deployed instance with their own browser-local data.

### 1.4 Non-Goals

- This is **NOT** a social or collaborative platform — no shared accounts or leaderboards
- This is **NOT** a note-taking app — notes are not required for the core experience
- This is **NOT** only a tracker — completion state supports studying, but the primary product is the study portal
- This is **NOT** a content authoring tool in v1 — study content is seeded and curated in the app
- This is **NOT** an AI tutoring app in v1 — no LLM integration in the initial build
- This is **NOT** a mobile-first app — optimised for desktop/laptop, responsive for tablet

---

## 2. Technology Stack

### 2.1 Frontend

| Technology | Version | Purpose |
|---|---|---|
| React | 19.x | Core UI framework |
| TypeScript | 5.x | Type-safe application code and data contracts |
| Vite | 7.x | Build tool and dev server |
| React Router | 7.x | Client-side routing between pages |
| Tailwind CSS | 4.x | Utility-first styling with the existing template theme tokens |
| Shadcn/Radix UI | current template versions | Accessible UI primitives and consistent controls |
| TanStack Query | 5.x | Kept from the template for future API-backed features, though v1 PrepTracker is local-first |
| Zustand | 5.x | Existing persisted theme store and available app state primitive |
| Recharts | Not currently installed | Charts are implemented with lightweight local UI for v1; add Recharts only when richer charting is needed |
| React Markdown | Not currently installed | Not needed in the current core flow because notes are not a primary feature |
| Lucide React | latest | Icon library |

### 2.1.1 Template Capabilities Kept

The project started from a stronger internal React template than the original reference assumed. Do not downgrade these unless there is a specific reason:

- React 19, TypeScript, Vite 7, and Tailwind CSS 4
- shadcn/Radix-style UI primitives under `src/components/ui`
- existing theme provider and persisted theme store
- reusable form components under `src/components/form`
- reusable data table components under `src/components/data-table`
- Axios and React Query infrastructure for possible future backend integrations

PrepTracker v1 itself remains no-backend and localStorage-first.

### 2.2 Storage

All user data is stored in the browser's `localStorage` under namespaced keys. No backend, no database, no authentication required. Data is local to each user's browser.

> **⚠️ Important: Data Portability**
> The app must include an Export / Import feature (Phase 5) so users can back up their progress as a JSON file and restore it on a different device or browser. Without this, all progress is lost if the browser data is cleared.

### 2.3 Deployment

- **Primary:** Vercel (zero-config deployment from GitHub repository, free tier)
- **Alternative:** GitHub Pages with Vite base path configuration
- **Local:** `npm run dev` for local development
- No environment variables required — entirely client-side

---

## 3. Application Structure

### 3.1 Folder Structure

Current implementation keeps PrepTracker in a feature module so the reusable template components remain available:

```
src/
├── main.tsx
├── app/
│   ├── App.tsx
│   ├── providers/
│   └── router/router.tsx
├── components/
│   ├── ui/               # shadcn/Radix-style primitives
│   ├── form/             # reusable React Hook Form controls
│   └── data-table/       # reusable TanStack table wrapper
├── features/preptracker/
│   ├── components/       # PrepTracker layout and shared UI helpers
│   ├── content/modules/  # editable markdown study guides, one file per syllabus module
│   ├── data/             # typed seed data for syllabus and problems
│   ├── hooks/            # localStorage and PrepTracker domain hooks
│   ├── pages/            # Dashboard, Study Session, Syllabus, Problems, Progress, Settings
│   ├── types/            # PrepTracker domain types
│   └── utils/            # storage keys, progress math, status styling
└── assets/styles/index.css
```

The original JSON-file requirement is represented as typed seed modules:

- `src/features/preptracker/data/syllabus.ts`
- `src/features/preptracker/data/problems.ts`

Study material lives in editable markdown files:

- `src/features/preptracker/content/modules/{moduleId}.md`

The markdown file name must match the syllabus module ID. Study Session loads these files and renders them as the in-app study guide for the selected modules.

This gives compile-time safety while preserving the same seeded-data behavior.

### 3.2 Routing

| Route | Page Component | Description |
|---|---|---|
| `/` | Dashboard | Home — daily summary, streak, quick stats |
| `/study` | StudySession | Start a timed study session, select up to 3 modules, read material, complete topics |
| `/syllabus` | Syllabus | All 5 papers, modules and topics with progress |
| `/syllabus/:paperId` | SyllabusDetail | Expanded view of a single paper |
| `/problems` | Problems | DSA practice workspace with filters and solve state |
| `/progress` | Progress | Charts, heatmap, weekly breakdown |
| `/settings` | Settings | User preferences, export/import data |

The active route constants are in `src/constants/routes.constant.ts`, and the route tree is in `src/app/router/router.tsx`.

---

## 4. Data Model

### 4.1 localStorage Keys

All keys are prefixed with `pt_` to avoid collisions with other apps running on the same domain.

| Key | Type | Description |
|---|---|---|
| `pt_topic_progress` | Object | Map of `topicId` → `{ status, lastUpdated, timeSpentMins }` |
| `pt_problem_status` | Object | Map of `problemId` → `{ status, solveCount, lastSolved, insight }` |
| `pt_daily_log` | Object | Map of `YYYY-MM-DD` → `{ dsaDone, theoryDone, revisionDone, minutesStudied, topicsStudied[] }` |
| `pt_settings` | Object | `{ userName, dailyGoalMins, theme, startDate, currentPaper }` |
| `pt_streaks` | Object | `{ currentStreak, longestStreak, lastActiveDate }` |

### 4.2 Syllabus JSON Schema

**Implemented file:** `src/features/preptracker/data/syllabus.ts`

This is a static read-only file. It is never written to at runtime. The user's progress state is stored separately in `pt_topic_progress`.

| Field | Type | Description |
|---|---|---|
| `id` | string | Unique paper ID e.g. `paper_1_dsa` |
| `title` | string | Display title e.g. `Data Structures & Algorithms` |
| `subtitle` | string | Short descriptor e.g. `The Logic Layer` |
| `priority` | number | Study priority 1–5 (1 = highest) |
| `color` | string | Tailwind color class for theming e.g. `purple` |
| `modules[]` | array | Array of module objects within this paper |
| `modules[].id` | string | Unique module ID e.g. `module_1_1_linear` |
| `modules[].title` | string | Module display title |
| `modules[].topics[]` | array | Array of topic objects |
| `topics[].id` | string | Unique topic ID e.g. `topic_arrays_kadane` |
| `topics[].title` | string | Topic display title |
| `topics[].priority` | string | `high` \| `medium` \| `low` |
| `topics[].estimatedHours` | number | Rough study time estimate |
| `topics[].tags[]` | array | Searchable tags e.g. `["sorting", "array", "medium"]` |

**Example entry:**

```json
{
  "id": "paper_1_dsa",
  "title": "Data Structures & Algorithms",
  "subtitle": "The Logic Layer",
  "priority": 1,
  "color": "purple",
  "modules": [
    {
      "id": "module_1_1_linear",
      "title": "Linear Data Structures",
      "topics": [
        {
          "id": "topic_arrays_kadane",
          "title": "Arrays — Kadane's Algorithm",
          "priority": "high",
          "estimatedHours": 2,
          "tags": ["arrays", "dp", "medium"]
        }
      ]
    }
  ]
}
```

### 4.3 Problems JSON Schema

**Implemented file:** `src/features/preptracker/data/problems.ts`

Seed data for all DSA problems. Pre-populated with the 4-week plan problems plus additional patterns.

| Field | Type | Description |
|---|---|---|
| `id` | string | Unique problem ID e.g. `prob_two_sum` |
| `title` | string | Problem title e.g. `Two Sum` |
| `difficulty` | string | `Easy` \| `Medium` \| `Hard` |
| `pattern` | string | Primary pattern e.g. `HashMap`, `Two Pointers`, `Sliding Window` |
| `week` | number | Which study week this belongs to (1–4 for month 1) |
| `leetcodeUrl` | string | Full URL to the LeetCode problem |
| `insight` | string | Short hint or key idea — shown while practicing |
| `relatedTopicId` | string | Links to a syllabus topic ID |

**Example entry:**

```json
{
  "id": "prob_two_sum",
  "title": "Two Sum",
  "difficulty": "Easy",
  "pattern": "HashMap",
  "week": 1,
  "leetcodeUrl": "https://leetcode.com/problems/two-sum/",
  "insight": "Check complement before storing. Order matters — check first, then put.",
  "relatedTopicId": "topic_arrays_hashmap"
}
```

### 4.4 Topic Status Values

| Status Value | Meaning |
|---|---|
| `not_started` | Default. Topic has not been opened or studied yet. |
| `in_progress` | Topic has been opened and study has begun but not completed. |
| `done` | Topic has been fully studied and understood. Counts toward paper completion %. |
| `needs_review` | Previously marked done but flagged for re-study. Does not count as complete. |

---

## 5. Pages and Features

### 5.1 Dashboard

The home page. The first thing the user sees every day. It must be immediately motivating and show the current state at a glance without requiring any navigation.

**Required Components:**
- **Greeting header** — personalised with user name and current date
- **Study streak counter** — current streak in days with a flame indicator, longest streak shown below
- **Today's progress ring** — circular progress indicator for today's daily goal (minutes studied vs target)
- **Paper progress bars** — horizontal progress bar for each of the 5 papers showing % topics done
- **Primary Start Session action** — starts the study workflow immediately
- **Quick stats row** — total topics done, problems solved, days studied, modules available
- **Today's session card** — links to Study Session and shows if today's study block has activity
- **Recent activity** — last 3 topics studied with timestamps

**Behaviour:**
- If it is the user's first visit, show an onboarding prompt to enter their name and set their daily goal
- Streak increments when at least one `daily_log` entry for today has any block marked done
- Paper progress % = `(topics with status "done" / total topics in paper) * 100`

---

### 5.2 Syllabus Explorer

The content backbone of the app. Shows all 5 papers and their complete topic hierarchy. The user spends most of their theory study time navigating from here.

**Required Components:**
- **Paper cards** — 5 cards in a grid, each showing paper title, completion %, and color coding
- **Paper detail view** — clicking a paper expands or navigates to show all its modules and topics
- **Module accordion** — each module is collapsible, showing its list of topics inside
- **Topic row** — each topic shows its title, priority badge (high/medium/low), estimated hours, and current status
- **Status toggle** — clicking a topic row cycles through: `not_started → in_progress → done → needs_review → not_started`
- **Start session link** — Syllabus provides a clear path into the guided study flow
- **Search bar** — filters topics across all papers by title or tag in real time
- **Filter by status** — dropdown to show only `not_started`, `in_progress`, `done`, or `needs_review` topics

**Behaviour:**
- Changing a topic status immediately updates `pt_topic_progress` in localStorage
- Paper completion % updates live as topics are marked done
- Topics with `priority: high` are visually highlighted (bold title, colored badge)

---

### 5.3 DSA Practice

The dedicated workspace for DSA practice. All problems are pre-loaded from the typed problem seed module. The user opens practice problems, studies pattern coverage, and marks solve state.

**Required Components:**
- **Filter bar** — filter by difficulty (Easy/Medium/Hard), pattern, week, and status
- **Problem table** — sortable columns: title, difficulty, pattern, week, status, last solved date
- **Status indicator** — each problem shows: unsolved (gray), attempted (yellow), solved (green), needs_retry (red)
- **LeetCode button** — opens the LeetCode URL in a new tab
- **Solve count** — how many times the problem has been marked solved (spaced repetition signal)
- **Pattern summary cards** — at the top, small cards per pattern showing X solved / Y total
- **Weekly breakdown** — tab or toggle to view problems grouped by study week

**Behaviour:**
- Clicking the status indicator cycles: `unsolved → attempted → solved → needs_retry → unsolved`
- Each time a problem is marked solved, `solveCount` increments and `lastSolved` updates
- Problems with `solveCount >= 2` show a faint checkmark to indicate spaced repetition complete

---

### 5.4 Study Session

The core product experience. The user visits the portal, starts a session, selects a maximum of 3 modules, studies the built-in material, and marks topics complete as they finish them.

**Session Structure:**

| Step | Content |
|---|---|
| Select Modules | Choose up to 3 modules from the full syllabus |
| Start Timer | A focused study timer starts for the session |
| Study Material | Each topic shows built-in explanations, essentials, checkpoints, and practice prompts |
| Complete Topics | Mark studied topics complete directly in the session |

**Required Components:**
- **Module picker** — all modules grouped by paper, with a hard maximum of 3 selections
- **Session timer** — visible countdown while studying
- **Study reader** — renders editable markdown content for every selected module
- **Topic completion action** — marks topic as `done` and writes activity to localStorage
- **Session progress summary** — selected modules, timer, and completed topics

**Behaviour:**
- Starting a session requires at least 1 selected module.
- Selecting more than 3 modules is blocked.
- Marking a topic complete updates `pt_topic_progress`.
- Completing at least 1 topic updates today's activity and keeps study streak logic meaningful.

---

### 5.5 Progress & Analytics

Visual overview of the user's preparation journey. Designed to be motivating and give honest feedback on where effort is being spent.

**Required Components:**
- **Activity heatmap** — GitHub-style calendar grid showing study activity for the last 90 days, colour intensity = minutes studied
- **Paper completion chart** — horizontal bar chart showing completion % for each of the 5 papers
- **Problems solved chart** — line chart of cumulative problems solved over time
- **Weekly breakdown table** — last 4 weeks showing blocks completed per day
- **Topic status pie chart** — overall breakdown of `not_started / in_progress / done / needs_review` across all topics
- **Pattern coverage** — for DSA problems, a bar chart showing solved / total per pattern

**Behaviour:**
- All data is derived from `pt_daily_log`, `pt_topic_progress`, and `pt_problem_status`
- Charts update in real time as the user navigates back from other pages
- Empty state with encouraging message if no data exists yet (first day of use)

---

### 5.6 Settings

**Required Fields:**
- **User name** — displayed in Dashboard greeting
- **Daily goal** — target minutes per day (default: 180)
- **Start date** — the date the user began preparation (used for total days count)
- **Current paper focus** — which paper is in the Theory block this week
- **Theme toggle** — light / dark mode

**Data Management:**
- **Export data** — downloads all `pt_` localStorage keys as a single JSON file (`preptracker_backup.json`)
- **Import data** — uploads a previously exported JSON file and restores all keys with confirmation dialog
- **Reset progress** — clears all `pt_` keys with a confirmation dialog (dangerous action, styled in red)

---

## 6. Custom Hooks

These hooks abstract localStorage access. **No feature component should read or write PrepTracker progress localStorage directly** — everything goes through these hooks/utilities.

| Hook | Responsibility |
|---|---|
| `useLocalStorage(key, default)` | Base hook — generic read/write to a single localStorage key with JSON parse/stringify |
| `useTopicProgress()` | Read and update topic status. Returns `{ progress, updateTopic, getTopicStatus, getPaperCompletion }` |
| `useProblemTracker()` | Read and update problem solve status. Returns `{ problems, updateProblem, getSolvedCount, getPatternStats }` |
| `useDailyLog()` | Read and write daily session log. Returns `{ todayLog, logBlock, getLogForDate, getStreak }` |
| `useSettings()` | Read and update user settings. Returns `{ settings, updateSetting }` |
| `useStreaks()` | Calculate and update streak. Returns `{ currentStreak, longestStreak, updateStreak }` |

Current implementation files:

- `src/features/preptracker/hooks/useLocalStorage.ts`
- `src/features/preptracker/hooks/usePrepTracker.ts`
- `src/features/preptracker/utils/storage.ts`
- `src/features/preptracker/utils/progress.ts`

**Example — `useLocalStorage` base hook:**

```javascript
import { useState } from 'react';

export function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  const setStoredValue = (newValue) => {
    const valueToStore = newValue instanceof Function ? newValue(value) : newValue;
    setValue(valueToStore);
    localStorage.setItem(key, JSON.stringify(valueToStore));
  };

  return [value, setStoredValue];
}
```

---

## 7. UI Design Guidelines

### 7.1 Design Principles

- **Clean and distraction-free** — the content is what matters, not the UI chrome
- **Data density with breathing room** — show enough information without feeling crowded
- **Colour is meaningful** — each paper has a consistent colour used for badges, progress bars, and accents
- **Dark mode first** — the default theme is dark as long study sessions are easier on the eyes
- **Fast interactions** — no loading spinners for local data, everything should feel instant

### 7.2 Paper Colour Mapping

| Paper | Title | Tailwind Color | Hex |
|---|---|---|---|
| 1 | DSA — The Logic Layer | `purple` | `#7C3AED` |
| 2 | Backend & Java — The Core Layer | `teal` | `#0D9488` |
| 3 | Frontend & React — The Interface Layer | `blue` | `#2563EB` |
| 4 | System Design — The Senior Layer | `amber` | `#D97706` |
| 5 | DevOps, Cloud & AI — The 2026 Edge | `gray` | `#6B7280` |

### 7.3 Layout

- **Sidebar navigation** — fixed left sidebar with icons and labels, collapsible on narrow screens
- **Main content area** — right of sidebar, scrollable, `max-width: 1200px` centred
- **Top bar** — contains page title, breadcrumb, and user avatar/name on the right
- **Responsive breakpoints** — sidebar collapses to bottom nav on screens under 768px

### 7.4 Status Colour Conventions

| Status | Color | Tailwind class |
|---|---|---|
| `not_started` | Gray | `text-gray-400 bg-gray-100` |
| `in_progress` | Amber | `text-amber-700 bg-amber-100` |
| `done` | Green | `text-green-700 bg-green-100` |
| `needs_review` | Red | `text-red-700 bg-red-100` |

---

## 8. Build Phases

The application is built in 5 sequential phases. Each phase produces a working and usable increment. Codex should be given **one phase or focused improvement area at a time** with this document as the project context.

---

### Phase 1 — Project Scaffold and Data Layer

> **Goal:** A working React app with routing, Tailwind, all localStorage hooks, and seed data files. No UI pages yet — just the foundation.

- [x] Use existing React 19 + TypeScript + Vite 7 template instead of creating a new React 18 app
- [x] Keep existing Tailwind 4, shadcn/Radix UI, Lucide, React Router, Zustand, and template utilities
- [x] Create PrepTracker feature folder structure
- [x] Implement `useLocalStorage` base hook
- [x] Implement domain hooks (`useTopicProgress`, `useProblemTracker`, `useDailyLog`, `useSettings`, `useStreaks`)
- [x] Create typed syllabus seed data with all 5 papers and topics from Section 9
- [x] Create typed DSA problem seed data with all Section 10 problems
- [x] Create PrepTracker sidebar layout and React Router routes
- [x] **Verify:** `npm run lint` and `npm run build` pass

---

### Phase 2 — Syllabus Explorer and DSA Practice

> **Goal:** The two most content-heavy pages are fully functional. The user can browse all topics and problems, update statuses, and see progress percentages.

- [x] Build Syllabus page: paper grid, paper detail view, module sections, topic rows
- [x] Implement topic status toggle with localStorage update
- [x] Build search and filter bar for topics
- [x] Build Problems page with filtering
- [x] Implement problem status cycling
- [x] Build pattern summary cards at top of Problems page
- [ ] Add sortable columns to the Problems table if needed after real usage
- [x] **Verify:** `npm run lint` and `npm run build` pass

---

### Phase 3 — Dashboard and Study Session

> **Goal:** The daily workflow is study-first. The user can start a timed session, select up to 3 modules, study in-app material, complete topics, and see useful progress.

- [x] Build Dashboard page with greeting, streak, daily goal, paper progress, stats, session card, and recent activity
- [x] Implement streak calculation logic
- [x] Build Study Session page with max 3 module selection
- [x] Add session timer
- [x] Add first-pass in-app study material from editable markdown files
- [x] Implement topic completion and activity logging to `pt_daily_log`
- [x] Implement lightweight onboarding prompt for first-time users
- [x] **Verify:** `npm run lint` and `npm run build` pass

---

### Phase 4 — Study Content Depth and Progress Analytics

> **Goal:** The app becomes useful as the single place to study. Study content is deep enough to reduce tab crawling, and the Progress page gives honest visual feedback.

- [x] Remove notes from the main route flow
- [x] Move study material into editable markdown files under `src/features/preptracker/content/modules`
- [ ] Deepen each topic into complete curated study content with examples, diagrams where useful, and interview answers
- [x] Build Progress page with activity heatmap, paper completion, topic status, and pattern coverage
- [x] Implement GitHub-style activity heatmap using a lightweight CSS grid
- [ ] Add richer charts for cumulative solved problems and weekly breakdown if the lightweight view is not enough
- [x] **Verify:** `npm run lint` and `npm run build` pass

---

### Phase 5 — Polish, Settings and Deployment

> **Goal:** App is production-ready, shareable, and deployable. Data can be exported and imported.

- [x] Build Settings page with all fields from Section 5.7
- [x] Implement JSON export: collects all `pt_` keys and triggers a file download
- [x] Implement JSON import: parses uploaded file and restores all keys
- [x] Implement reset with confirmation dialog
- [x] Implement dark / light / system mode preference using the existing persisted theme store
- [x] Use template theme tokens so pages work in light and dark modes
- [x] Add initial empty states where needed
- [ ] Deploy to Vercel: connect GitHub repo, zero config needed
- [ ] Test on a second browser with a fresh import of exported data

---

## 9. Syllabus Content Reference

This section is the authoritative source for the content that must appear in the syllabus seed data. Each topic listed here maps to one topic object in `src/features/preptracker/data/syllabus.ts`.

---

### Paper 1 — Data Structures & Algorithms

#### Module 1: Linear Data Structures

- **Arrays** — Static vs Dynamic, Kadane's Algorithm, Boyer-Moore Voting, Dutch National Flag
- **Strings** — KMP, Rabin-Karp, Z-Algorithm, Palindrome logic (Manacher's)
- **Linked Lists** — Singly, Doubly, Circular; Floyd's Cycle-Finding; LRU Cache with DLL
- **Stacks** — Expression Evaluation (Infix/Postfix), Monotonic Stack, Min-Stack
- **Queues** — Priority Queues, Deques, Sliding Window Maximum using Deque

#### Module 2: Non-Linear Data Structures

- **Trees** — BFS/DFS traversals, LCA, Diameter, BST Validation, AVL Rotations, Trie
- **Heaps** — Binary Heap, Heapify, Heap Sort, Median in a Stream
- **Graphs** — BFS, DFS, Cycle Detection, Dijkstra, Bellman-Ford, Prim's, Kruskal's, Topological Sort

#### Module 3: Algorithm Paradigms

- **Searching & Sorting** — Binary Search on answer space, Quick Sort, Merge Sort
- **Backtracking** — N-Queens, Sudoku Solver, Subset Sum, Rat in a Maze
- **Dynamic Programming** — 0/1 Knapsack, LCS, LIS, Edit Distance, Matrix Chain Multiplication

---

### Paper 2 — Backend & Java Mastery

#### Module 1: Advanced Java

- **JVM** — Class Loaders, Stack vs Heap, Metaspace, JIT Compilation, GC Algorithms (Serial, Parallel, G1, ZGC)
- **Multithreading** — JMM, Happens-before, `volatile`, `synchronized`, `ReentrantLock`, `Semaphore`, `CountDownLatch`, `CyclicBarrier`, `ThreadLocal`, `ForkJoinPool`, Virtual Threads
- **Collections** — `HashMap` internals (JDK 8+), `ConcurrentHashMap`, `CopyOnWriteArrayList`, `BlockingQueue`
- **Modern Java** — Lambdas, Streams API, `Optional`, Records, Sealed Classes, Pattern Matching for `instanceof`

#### Module 2: Spring Boot & Ecosystem

- **Core Spring** — DI (Constructor vs Setter), Bean Scopes, Bean Lifecycle, CGLIB vs JDK Proxying
- **Spring Security** — Filter Chain, `AuthenticationManager`, JWT, OAuth2, CSRF, CORS
- **Data & Transactions** — JPA/Hibernate, JPQL, Transaction Isolation, Transaction Propagation, N+1 Problem

#### Module 3: Databases & SQL

- **SQL Mastery** — Joins, Subqueries, CTEs, Window Functions (`RANK`, `LEAD`, `LAG`), Indexing (B-Tree, B+Tree), `EXPLAIN`
- **Scaling** — Partitioning, Sharding, Replication (Master-Slave, Multi-master)

---

### Paper 3 — Frontend & React Mastery

#### Module 1: React Internals

- **The Engine** — Virtual DOM, Reconciliation, React Fiber, Lane Priority, Concurrent Rendering, Hydration
- **Hooks** — `useEffect`, `useLayoutEffect`, `useRef`, `useReducer`, `useContext`, `useMemo`, `useCallback`
- **Patterns** — HOC, Render Props, Compound Components, Controlled vs Uncontrolled

#### Module 2: State & Performance

- **State Management** — TanStack Query, Redux Toolkit, Zustand, Context API
- **Optimisation** — `React.memo`, Windowing (`react-window`), Code Splitting (`React.lazy`/`Suspense`), Image Optimisation

#### Module 3: TypeScript & Tools

- **TypeScript** — Interfaces vs Types, Union/Intersection, Generics, Utility Types (`Partial`, `Required`, `Pick`, `Omit`)
- **Build Tools** — Vite, Webpack basics, ESLint, Prettier, Husky

---

### Paper 4 — System Design & Architecture

#### Module 1: Components of Scalable Systems

- **Networking** — DNS, Load Balancers (L4 vs L7), Round Robin, Consistent Hashing, Nginx
- **Caching** — Redis Data Types, Cache Invalidation (Write-through, Write-around, Write-back), LRU/LFU
- **Communication** — REST vs GraphQL, gRPC, WebSockets, Message Queues (Kafka, RabbitMQ)

#### Module 2: Design Patterns & Principles

- **SOLID** — SRP, OCP, LSP, ISP, DIP with Java examples
- **Design Patterns** — Singleton, Factory, Observer, Strategy, Decorator, Adapter, Facade, Proxy
- **Architecture** — Microservices vs Monolith, Service Discovery, API Gateway, Circuit Breaker, Saga Pattern

---

### Paper 5 — DevOps, Cloud & AI

#### Module 1: Infrastructure & Deployment

- **Docker** — Dockerfile, Layers, Multi-stage builds, Network types, Volumes
- **Kubernetes** — Pods, ReplicaSets, Deployments, Services, ConfigMaps, Ingress
- **CI/CD** — Pipeline stages, GitHub Actions, Blue-Green vs Canary Deployments

#### Module 2: AI & Emerging Tech

- **AI Engineering** — RAG, Embedding Models, Vector Databases (Pinecone/pgvector), LangChain basics
- **AWS** — EC2, S3, RDS, Lambda, IAM Policies, VPC

---

## 10. DSA Problem Seed List

These problems must be pre-loaded in the problem seed data. The current implementation stores them in `src/features/preptracker/data/problems.ts`. The first 28 are from the structured 4-week plan.

### Week 1 — Arrays & Hashing

| Problem | Difficulty | Pattern | LeetCode # |
|---|---|---|---|
| Two Sum | Easy | HashMap | #1 |
| Contains Duplicate | Easy | HashSet | #217 |
| Valid Anagram | Easy | Frequency Map | #242 |
| Group Anagrams | Medium | Frequency Map | #49 |
| Running Sum of 1D Array | Easy | Prefix Sum | #1480 |
| Subarray Sum Equals K | Medium | Prefix Sum + Map | #560 |

### Week 2 — Two Pointers & Strings

| Problem | Difficulty | Pattern | LeetCode # |
|---|---|---|---|
| Valid Palindrome | Easy | Two Pointers | #125 |
| Two Sum II | Medium | Two Pointers | #167 |
| 3Sum | Medium | Two Pointers | #15 |
| Remove Duplicates from Sorted Array | Easy | Fast & Slow | #26 |
| Reverse String | Easy | Two Pointers | #344 |
| Container With Most Water | Medium | Two Pointers | #11 |

### Week 3 — Sliding Window

| Problem | Difficulty | Pattern | LeetCode # |
|---|---|---|---|
| Maximum Average Subarray I | Easy | Fixed Window | #643 |
| Best Time to Buy and Sell Stock | Easy | Fixed Window | #121 |
| Longest Substring Without Repeating Characters | Medium | Variable Window | #3 |
| Permutation in String | Medium | Fixed Window | #567 |
| Minimum Size Subarray Sum | Medium | Variable Window | #209 |
| Longest Repeating Character Replacement | Medium | Variable Window | #424 |

### Week 4 — Binary Search

| Problem | Difficulty | Pattern | LeetCode # |
|---|---|---|---|
| Binary Search | Easy | Classic Binary Search | #704 |
| Search in Rotated Sorted Array | Medium | Binary Search Variant | #33 |
| Find Minimum in Rotated Sorted Array | Medium | Binary Search Variant | #153 |
| Koko Eating Bananas | Medium | Search on Answer | #875 |
| Capacity To Ship Packages Within D Days | Medium | Search on Answer | #1011 |
| Find Peak Element | Medium | Binary Search Variant | #162 |
| Time Based Key-Value Store | Medium | Binary Search + Map | #981 |

---

*End of PrepTracker Project Reference Document v1.0*
*Built for one developer. Shareable with many.*
