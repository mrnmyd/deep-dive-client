# DeepDive — Project Specification (v2)

**Senior Developer Interview Preparation Portal**
**Stack:** React 19 + TypeScript + Vite 7 + Tailwind CSS 4 + Zustand + localStorage
**Hosting:** Vercel (zero-config from GitHub)
**Audience:** A working full stack developer with limited time, preparing for a Senior role
**Document Purpose:** The single source of truth for what DeepDive is, how it behaves, what it stores, and how it is built.

This specification supersedes any prior project document. The syllabus content lives separately in [`Syllabus.md`](./Syllabus.md). This document does not duplicate that content; it references it.

---

## Table of Contents

1. [Vision and Philosophy](#1-vision-and-philosophy)
2. [Non-Goals](#2-non-goals)
3. [Technology Stack](#3-technology-stack)
4. [Architecture](#4-architecture)
5. [Data Model](#5-data-model)
6. [Routes](#6-routes)
7. [The Reader (Primary Surface)](#7-the-reader-primary-surface)
8. [Session Timer](#8-session-timer)
9. [Topic Completion Model](#9-topic-completion-model)
10. [Inline Problem Practice](#10-inline-problem-practice)
11. [Per-Topic Notes](#11-per-topic-notes)
12. [Global Search](#12-global-search)
13. [Command Palette](#13-command-palette)
14. [Keyboard Shortcuts](#14-keyboard-shortcuts)
15. [Markdown Rendering](#15-markdown-rendering)
16. [Dashboard](#16-dashboard)
17. [Problems Page](#17-problems-page)
18. [Progress and Analytics](#18-progress-and-analytics)
19. [Settings and Data Management](#19-settings-and-data-management)
20. [Theming and Paper Colour Mapping](#20-theming-and-paper-colour-mapping)
21. [Responsive and Mobile Behaviour](#21-responsive-and-mobile-behaviour)
22. [Onboarding](#22-onboarding)
23. [Performance](#23-performance)
24. [Accessibility](#24-accessibility)
25. [Error Handling and Resilience](#25-error-handling-and-resilience)
26. [Deployment](#26-deployment)
27. [Definition of Done — What "Production Grade" Means Here](#27-definition-of-done)
28. [Build Phases](#28-build-phases)

---

## 1. Vision and Philosophy

DeepDive is a single-screen, reader-first study portal. The user opens it and is studying. Tracking, analytics, problem practice, and session bookkeeping all exist in support of the reading experience, not in front of it.

The product is for someone who has very little time outside of work and needs every interaction to push them toward the content rather than around it. The previous version of DeepDive treated the application as a multi-page progress tracker that contained study material. The v2 specification inverts this: the application is a study reader that contains tracking. The reader is the home page, the default route, and the surface the user spends 95% of their time on.

The principles that govern every decision:

- **Content is primary, controls are secondary.** The markdown topic is the largest, most prominent element on every screen.
- **Manual completion is preserved.** The user explicitly marks topics done. The application does not silently auto-complete on the user's behalf, although it can suggest.
- **Real time spent is tracked.** The session timer is explicit, persistent across reloads, and idle-aware so logged minutes are honest.
- **Zero distraction.** No notifications, no animations beyond fades, no streak guilt-trips, no popups during reading.
- **One screen, ambient tracking.** Streak, daily minutes, paper progress, and problems are visible but never compete with the topic body for attention.
- **Production complete.** Every page, every empty state, every error path, every export-import round trip works. There are no "coming soon" or stubbed features in shipped phases.

---

## 2. Non-Goals

- Not a social, multi-user, or collaborative platform. No accounts, leaderboards, or shared progress.
- Not a note-taking app. Per-topic notes exist as an optional ambient scratchpad, not a full editor.
- Not a content authoring tool. Study content is curated, version-controlled markdown that ships with the application.
- Not an AI tutor. No LLM integration in v2.
- Not mobile-first. The reader is optimised for desktop and large tablets; phones get a usable but secondary layout.
- Not an offline-only PWA in v2. The application is local-first by virtue of localStorage but does not advertise installable PWA behaviour.

---

## 3. Technology Stack

The current template is the project's foundation and is not to be downgraded.

| Technology                                                   | Version           | Purpose                                                             |
| ------------------------------------------------------------ | ----------------- | ------------------------------------------------------------------- |
| React                                                        | 19.x              | UI framework                                                        |
| TypeScript                                                   | 5.x               | Type safety, contracts                                              |
| Vite                                                         | 7.x               | Build tool, dev server                                              |
| React Router                                                 | 7.x               | Routing                                                             |
| Tailwind CSS                                                 | 4.x               | Utility styling, theme tokens                                       |
| shadcn / Radix UI                                            | template versions | Accessible primitives                                               |
| Zustand                                                      | 5.x               | Theme store and other small client state                            |
| TanStack Query                                               | 5.x               | Retained from template (unused by v2 core but available for future) |
| Lucide React                                                 | latest            | Icons                                                               |
| react-markdown + remark-gfm + rehype-highlight + rehype-slug | latest            | Markdown rendering with GFM, syntax highlight, heading anchors      |
| Fuse.js                                                      | latest            | Fuzzy search across topics                                          |
| Recharts                                                     | latest            | Charts on the Progress page                                         |
| date-fns                                                     | latest            | Date math for streaks and heatmap                                   |

No backend, no database, no auth. Everything client-side.

---

## 4. Architecture

```
src/
├── main.tsx
├── app/
│   ├── App.tsx
│   ├── providers/         # theme, query, toast
│   └── router/router.tsx
├── components/
│   ├── ui/                # shadcn/Radix primitives
│   ├── form/              # reusable form controls
│   └── data-table/        # reusable table wrapper
├── features/preptracker/
│   ├── components/
│   │   ├── reader/        # ReaderLayout, SyllabusTree, TopicView, RightRail
│   │   ├── session/       # SessionTimer, IdleDetector
│   │   ├── search/        # GlobalSearch, CommandPalette
│   │   ├── markdown/      # MarkdownRenderer, CodeBlock, CopyButton
│   │   └── shared/        # status badges, paper colour helpers
│   ├── content/modules/   # one markdown file per syllabus moduleId
│   ├── data/              # typed seed data: syllabus.ts, problems.ts
│   ├── hooks/             # useLocalStorage and domain hooks
│   ├── pages/             # Reader, Dashboard, Problems, Progress, Settings
│   ├── types/
│   └── utils/             # storage keys, progress math, status styling, schema migration
└── assets/styles/index.css
```

**Architectural rules**

- No component reads or writes localStorage directly. All persistence flows through the hooks layer.
- All localStorage keys are namespaced with `pt_` and centralised in `utils/storage.ts`.
- Markdown modules are imported with Vite's `?raw` suffix and lazy-loaded by moduleId so the initial bundle stays small.
- Every page is wrapped in an error boundary that renders a recoverable empty state on failure.

---

## 5. Data Model

All keys are namespaced with `pt_`.

| Key                 | Type           | Description                                                                                |
| ------------------- | -------------- | ------------------------------------------------------------------------------------------ |
| `pt_topic_progress` | Object         | `topicId` → `{ status, lastUpdated, timeSpentMins }`                                       |
| `pt_problem_status` | Object         | `problemId` → `{ status, solveCount, lastSolved, insight }`                                |
| `pt_daily_log`      | Object         | `YYYY-MM-DD` → `{ dsaDone, theoryDone, revisionDone, minutesStudied, topicsStudied[] }`    |
| `pt_settings`       | Object         | `{ userName, dailyGoalMins, theme, startDate, currentPaper, lastReadTopicId }`             |
| `pt_streaks`        | Object         | `{ currentStreak, longestStreak, lastActiveDate }`                                         |
| `pt_active_session` | Object \| null | `{ startedAt, accumulatedMs, isPaused, pausedAt, moduleIds[], paperId }` — survives reload |
| `pt_topic_notes`    | Object         | `topicId` → string (plain text)                                                            |
| `pt_schema_version` | number         | Integer; bumped on breaking schema changes; used to validate imports                       |

### 5.1 Topic Status Values

| Status         | Meaning                                                                       |
| -------------- | ----------------------------------------------------------------------------- |
| `not_started`  | Default. Topic has not been opened.                                           |
| `in_progress`  | Topic has been opened. Auto-applied on first scroll.                          |
| `done`         | Topic explicitly marked complete by the user. Counts toward paper completion. |
| `needs_review` | Previously done, flagged for re-study. Does not count as complete.            |

The status cycle on click is: `not_started → in_progress → done → needs_review → not_started`.

### 5.2 Problem Status Values

| Status        | Meaning                                                                |
| ------------- | ---------------------------------------------------------------------- |
| `unsolved`    | Default.                                                               |
| `attempted`   | Started but not solved.                                                |
| `solved`      | Successfully solved. Increments `solveCount` and updates `lastSolved`. |
| `needs_retry` | Solved before but flagged for re-attempt.                              |

Cycle on click: `unsolved → attempted → solved → needs_retry → unsolved`.

### 5.3 Schema Versioning

Every export embeds the current `pt_schema_version`. On import, the value is read and a migration function is run if the imported version is older than the current one. Imports newer than the current schema are rejected with a clear error.

---

## 6. Routes

| Route        | Component | Description                                                                                          |
| ------------ | --------- | ---------------------------------------------------------------------------------------------------- |
| `/`          | Reader    | The default surface. Resumes `lastReadTopicId` or selects the highest-priority unstarted topic.      |
| `/dashboard` | Dashboard | Greeting, streak, daily ring, paper progress, recent activity. Reachable from the top bar and `g d`. |
| `/problems`  | Problems  | Filterable problem table, pattern summary cards, weekly view.                                        |
| `/progress`  | Progress  | Heatmap, completion charts, status donut, pattern coverage.                                          |
| `/settings`  | Settings  | Preferences, export / import / reset, theme.                                                         |

The legacy `/study` and `/syllabus` routes are removed. The Reader contains both flows.

Active route constants live in `src/constants/routes.constant.ts`.

---

## 7. The Reader (Primary Surface)

The Reader is a three-pane layout designed to be the only screen the user needs while studying.

### 7.1 Layout

- **Left pane — Syllabus Tree.** Collapsible papers and modules. Each topic row shows a status badge and the paper colour as a left accent stripe. Clicking a topic loads it into the centre. Collapsible to a narrow rail (icons only) and to a sheet on mobile.
- **Centre pane — Topic View.** The markdown topic. A sticky header shows breadcrumb (Paper › Module › Topic), priority badge, and status badge. The body renders the markdown with the typography rules in section 15. A footer contains a large "Mark Done" button, a "Mark for Review" button, and prev / next topic navigation.
- **Right pane — Context Rail.** Three stacked cards: Session Timer, Related Problems for the current topic, and Notes. Each card is collapsible. The rail collapses to a sheet on narrow screens.

A top bar above all three panes contains: global search input, command palette button, today's minutes, current streak (small flame), theme toggle, and a settings link. The top bar uses minimal contrast so it never competes with the topic body.

### 7.2 Behaviour

- The Reader is the route at `/`. On load, it resolves `lastReadTopicId` from settings; if missing or invalid, it picks the first `not_started` topic in `priority` order.
- Selecting a topic updates `lastReadTopicId` and scrolls the centre pane to the top.
- First scroll on a `not_started` topic auto-marks it `in_progress`.
- On scrolling past 90% of the topic body, a non-blocking suggestion appears at the bottom: "Mark this topic done?" with a single primary button. Dismissing the suggestion does not change status.
- Prev / next navigates within the current module first, then across modules in syllabus order.
- The right rail does not autoplay or animate; cards expand on click.

### 7.3 What the Reader replaces

The Reader is the canonical replacement for the previous Study Session and Syllabus pages. Both legacy routes redirect to the Reader.

---

## 8. Session Timer

The session timer is the source of truth for the "minutes studied" stat.

### 8.1 States

`idle → running → paused → running → stopped`. Stopped is terminal; a new session starts in `idle`.

### 8.2 Persistence

The full timer state lives in `pt_active_session`. A timer running across a page reload, browser tab close, or laptop sleep is reconstructed from `startedAt`, `accumulatedMs`, `isPaused`, and `pausedAt`. There is no UI requirement to "resume" after reload; the timer simply continues.

### 8.3 Idle detection

If no input event (keyboard, mouse, scroll, focus) occurs for 5 minutes while the timer is running, it auto-pauses and a small toast asks whether to resume. The 5 minutes of suspected idle time are not added to `accumulatedMs`.

### 8.4 Stopping a session

When the user clicks Stop, the elapsed minutes are written to today's `pt_daily_log` entry. The block (dsa / theory / revision) is determined by the paper of the topic in focus when Stop is pressed:

- Paper 1 → `dsa`
- Paper 2, 3, 4, 5 → `theory`
- A topic with status `needs_review` at start of session → `revision`

If the user studied across multiple papers, the session attributes time to the paper of the topic that was active longest. (Implementation detail: track per-paper accumulated milliseconds during the session.)

### 8.5 Streak

A day counts toward the streak when at least one of `dsaDone`, `theoryDone`, or `revisionDone` is true for that date, OR when at least one topic was marked done that day.

---

## 9. Topic Completion Model

Manual completion remains a first-class action. The user is in control.

- The Mark Done button is permanently visible in the topic footer.
- The keyboard shortcut `m` toggles the current topic's completion state.
- Clicking the status badge in the syllabus tree cycles the status.
- Auto behaviours: on first scroll, status moves from `not_started` to `in_progress`. On reaching 90% scroll, a suggestion to mark done appears, but does not auto-mark.
- Completion writes to `pt_topic_progress`, updates `lastUpdated`, and appends the topic to today's `topicsStudied[]`.

`done` topics count toward paper completion. `needs_review` topics do not.

---

## 10. Inline Problem Practice

At the bottom of every topic, below the markdown body and above the prev / next navigation, a "Related Problems" block lists every problem whose `relatedTopicId` matches the current topic.

Each row shows:

- Problem title
- Difficulty badge (Easy / Medium / Hard)
- Pattern label
- Status badge (clickable to cycle through the problem status states)
- Solve count
- LeetCode link button (opens in a new tab)

The status cycle and `solveCount` increment behave identically to the dedicated `/problems` page. There is no duplicate state; both surfaces share `pt_problem_status`.

---

## 11. Per-Topic Notes

A small plain-text scratchpad is available per topic via the right rail's Notes card or the keyboard `n` toggle. The content is stored in `pt_topic_notes` keyed by `topicId`. There is no markdown rendering, no formatting toolbar, no autosave indicator beyond a subtle "saved" pulse. Saves are debounced at 500ms.

Empty by default. Hidden when empty.

---

## 12. Global Search

The top bar's search input is bound to `/`. Pressing `/` from anywhere focuses it. The search uses Fuse.js to fuzzy-match across topic titles, module titles, paper titles, and topic tags. Results are grouped by paper, show the breadcrumb, and pressing Enter (or clicking) jumps the Reader to that topic.

Search results are computed in-memory; the entire syllabus is small enough to index on every keystroke without measurable cost.

---

## 13. Command Palette

`Cmd+K` (or `Ctrl+K`) opens a Radix-based command palette. Commands include:

- Jump to topic (fuzzy by title)
- Toggle theme (light / dark / system)
- Export data
- Import data
- Reset progress (with confirmation)
- Toggle notes
- Start / stop session
- Navigate to Dashboard / Problems / Progress / Settings / Reader

The palette is the canonical "do anything" affordance. Every destructive action shown in the palette is also gated by a confirmation dialog.

---

## 14. Keyboard Shortcuts

| Key                | Action                               |
| ------------------ | ------------------------------------ |
| `j`                | Next topic                           |
| `k`                | Previous topic                       |
| `m`                | Mark current topic done (toggle)     |
| `r`                | Mark current topic as `needs_review` |
| `n`                | Toggle notes panel                   |
| `t`                | Start / pause session timer          |
| `s`                | Stop session timer                   |
| `/`                | Focus global search                  |
| `Cmd+K` / `Ctrl+K` | Open command palette                 |
| `g d`              | Go to Dashboard                      |
| `g h`              | Go to Reader (home)                  |
| `g p`              | Go to Problems                       |
| `g r`              | Go to Progress                       |
| `g s`              | Go to Settings                       |
| `?`                | Show keyboard shortcut overlay       |
| `Esc`              | Close any open overlay               |

Shortcuts are disabled when an input or textarea has focus, except for `Esc`.

---

## 15. Markdown Rendering

The Reader's centre pane uses `react-markdown` with the following plugins:

- `remark-gfm` — tables, task lists, strikethrough
- `rehype-highlight` — syntax highlighting via highlight.js (a single CSS theme bundled per app theme)
- `rehype-slug` — heading anchors

Custom renderers add:

- A copy button in the top-right of every code block
- Heading link icons that appear on hover
- Smart wrapping of long inline code

Typography rules:

- Body text uses a serif at 17px / 1.7 line-height
- Maximum content width 72ch
- Headings use the application's sans font with tight tracking
- Code uses a monospace at 0.95em
- Block elements have generous vertical rhythm; the body breathes

Both light and dark themes have first-class typography variants. Dark is the default.

---

## 16. Dashboard

The Dashboard is reached via the top bar or `g d`. It is not the landing page in v2.

Components:

- Greeting header with the user's name and current date
- Current streak (flame icon) and longest streak below
- Today's progress ring: minutes studied vs `dailyGoalMins`
- Five horizontal paper-progress bars in their respective paper colours
- Quick stats: total topics done, problems solved, days studied, modules available
- Last 3 topics studied with timestamps and click-to-resume
- A primary "Resume Reading" button that jumps to `lastReadTopicId`

If there is no progress yet, the Dashboard shows an empty state with a large "Start Studying" button that goes to the Reader.

---

## 17. Problems Page

A dedicated table view of all DSA problems for users who want to plan a problem-solving session away from the topic context.

Components:

- Filter bar: difficulty, pattern, week, status
- Pattern summary cards along the top: solved / total per pattern
- Sortable columns: title, difficulty, pattern, week, status, last solved
- Status badge per row, cycling on click
- Solve count column
- LeetCode link button per row
- Weekly tab toggle to view Week 1–4 grouped

The page reads and writes the same `pt_problem_status` map as the Reader's inline problems block.

---

## 18. Progress and Analytics

The Progress page is built with Recharts. It is purely a read of derived data; there are no writes from this page.

Components:

- **Activity heatmap** — A real GitHub-style weekly grid over the last 90 days. X axis is weeks; Y axis is days of week (Sun – Sat). Cell colour intensity scales with `minutesStudied`.
- **Paper completion** — Horizontal bar chart, one bar per paper, in paper colour.
- **Cumulative problems solved** — Line chart over time, daily aggregation.
- **Topic status donut** — Donut chart showing `not_started / in_progress / done / needs_review` distribution across all topics.
- **Pattern coverage** — Bar chart of solved / total per pattern.
- **Last 4 weeks blocks table** — Day-by-day grid showing `dsa / theory / revision` block completion.

Empty states are explicit and encouraging when no data exists yet.

---

## 19. Settings and Data Management

A single settings page with grouped sections.

**Profile**

- User name (text input, controlled)
- Daily goal in minutes (number input, default 180)
- Start date of preparation (date input)
- Currently focused paper (select, drives Theory block focus copy on Dashboard)

**Appearance**

- Theme: light / dark / system

**Data**

- Export — downloads `preptracker_backup_{ISO date}.json` containing every `pt_` key plus `pt_schema_version`.
- Import — accepts a JSON file, validates the schema version, runs migrations if needed, restores all keys, and shows a confirmation dialog summarising what will be replaced.
- Reset progress — clears all `pt_` keys, gated behind a destructive-style confirmation dialog with a typed "RESET" check.

Every destructive action emits a toast on success or a clear error toast on failure.

---

## 20. Theming and Paper Colour Mapping

| Paper | Title                                  | Colour | Hex       |
| ----- | -------------------------------------- | ------ | --------- |
| 1     | DSA — The Logic Layer                  | purple | `#7C3AED` |
| 2     | Backend & Java — The Core Layer        | teal   | `#0D9488` |
| 3     | Frontend & React — The Interface Layer | blue   | `#2563EB` |
| 4     | System Design — The Senior Layer       | amber  | `#D97706` |
| 5     | DevOps, Cloud & AI — The 2026 Edge     | gray   | `#6B7280` |

These colours are exposed as CSS variables in both themes and consumed wherever a paper is referenced visually:

- Syllabus tree topic accent stripe
- Paper progress bars
- Paper cards on the Dashboard
- Heatmap legend grouping
- Problem pattern cards (when a pattern is paper-aligned)

Status badge colours follow Tailwind tokens:

| Status         | Class                            |
| -------------- | -------------------------------- |
| `not_started`  | `text-muted-foreground bg-muted` |
| `in_progress`  | `text-amber-700 bg-amber-100`    |
| `done`         | `text-green-700 bg-green-100`    |
| `needs_review` | `text-red-700 bg-red-100`        |

Dark variants invert lightness while preserving hue.

---

## 21. Responsive and Mobile Behaviour

Breakpoints align with Tailwind defaults.

- **`>= 1024px`** — full three-pane Reader, sidebar full width, right rail visible.
- **`768px – 1023px`** — left pane collapses to icon rail; right rail collapses to a sheet button in the top bar.
- **`< 768px`** — Reader becomes single-column markdown. Syllabus tree opens as a bottom drawer. Right rail opens as a bottom sheet. Session timer pinned to the top bar as a compact pill.

The Dashboard, Problems, and Progress pages reflow to a single column at `< 768px` with horizontally scrollable charts.

---

## 22. Onboarding

On first visit (when `pt_settings` is absent), a three-step modal walks through:

1. Name (text input)
2. Daily goal in minutes (with sensible default)
3. Currently focused paper (select)

After completion, the modal dismisses and the Reader opens to the highest-priority unstarted topic.

The onboarding state is detected by the absence of `pt_settings.userName`; restoring an import that contains a `userName` skips onboarding entirely.

---

## 23. Performance

- Routes are lazy-loaded with `React.lazy`. The initial bundle contains only the Reader and its dependencies.
- Markdown content is loaded per moduleId on demand using Vite's `import.meta.glob({ as: 'raw' })` with lazy mode.
- The syllabus tree is memoised. Paper cards memoise their completion percentages.
- The Problems table virtualises with `react-window` if the seed grows beyond 100 problems (currently it does not).
- Search runs against an in-memory Fuse index built once on app load.

Target: First contentful paint under 1 second on a fast laptop with cache warm; under 2 seconds cold.

---

## 24. Accessibility

- Every interactive element is reachable via keyboard.
- Focus rings are preserved and visible.
- ARIA labels are applied to icon-only buttons, status badges, and the timer.
- Live regions announce timer state changes and toast messages.
- Reduced-motion preference is respected; non-essential animations are disabled.
- Colour is not the sole signal — every status badge includes a textual label or icon.
- The markdown reader supports browser zoom up to 200% without horizontal overflow.

---

## 25. Error Handling and Resilience

- A top-level error boundary wraps each route. On error it shows a recoverable card with a "Reload" button.
- A localStorage write failure (private mode, full disk) falls back to in-memory state and surfaces a single non-dismissable warning toast explaining that progress will not persist.
- Import validates JSON shape and schema version before mutating any state. A failed import never partially restores.
- The Reader handles missing `moduleId.md` markdown files gracefully with an inline "Content coming soon" card and a working Mark Done button.

---

## 26. Deployment

- **Vercel** is the production target. A `vercel.json` at the repo root configures the SPA rewrite (`/* → /index.html`) and sets long cache headers for built assets.
- **Build:** `npm run build` produces a static bundle under `dist/`. Vercel auto-detects Vite.
- **Preview deployments** are created for every pull request.
- **Local:** `npm run dev`.
- **Lint and build gates:** every shipped phase ends with `npm run lint` and `npm run build` passing.
- **Pre-deploy checklist:** favicon, og-image, document title, and the meta description are set.

---

## 27. Definition of Done

A phase is complete only when every item below is true. Anything less is not "done"; it is "in progress".

- All listed checklist items in the phase are implemented.
- Lint passes with zero errors and zero warnings.
- Type check passes (`tsc --noEmit`) with zero errors.
- Build succeeds.
- Every page reachable in the phase has a non-empty empty state.
- Every destructive action has a confirmation dialog.
- Every async or persistence action has a success or failure toast.
- Keyboard shortcuts that the phase introduces are listed in the `?` overlay.
- The phase introduces no half-finished UI, no `// TODO` markers in shipped code, no commented-out blocks.

The application has no "beta" mode. If a feature is in `main`, it works.

---

## 28. Build Phases

Each phase produces a working, shippable application. Phases are sequential.

### Phase A — Foundations and Correctness

> Goal: the existing app is correct, the data model is extended, and the team can build new UI on top without rewriting core hooks.

- [ ] Fix block attribution in session logging — block is determined by the paper of the topic (Paper 1 → `dsa`; Papers 2–5 → `theory`; `needs_review` topics → `revision`).
- [ ] Resolve duplicate localStorage subscriptions in `useStreaks` (consume an injected daily log or move to a selector).
- [ ] Wire `paper.color` into the existing UI as a stop-gap until the Reader lands (paper progress bars, badges).
- [ ] Add `pt_active_session`, `pt_topic_notes`, `pt_schema_version` keys with hooks and storage helpers.
- [ ] Add `lastReadTopicId` to `pt_settings` with a typed migration from the v1 shape.
- [ ] Implement schema migration scaffolding for imports.
- [ ] Add toast provider and wire it to all existing destructive and async actions.
- [ ] Verify lint, typecheck, and build pass.

### Phase B — The Reader

> Goal: the Reader replaces Study Session and Syllabus as the primary surface.

- [ ] Build the three-pane Reader layout (`features/preptracker/components/reader/`).
- [ ] Implement the syllabus tree with collapse, status badges, paper-colour accents, and click-to-load.
- [ ] Implement the topic view with breadcrumb, status badge, markdown rendering, and footer actions (Mark Done, Mark for Review, prev / next).
- [ ] Implement the right rail with collapsible Session, Related Problems, and Notes cards.
- [ ] Make `/` route the Reader. Redirect `/study` and `/syllabus` to `/`.
- [ ] Resume `lastReadTopicId` on load; fall back to highest-priority unstarted topic.
- [ ] First-scroll → `in_progress` auto-transition.
- [ ] 90%-scroll → non-blocking "Mark done?" suggestion.
- [ ] Verify lint, typecheck, and build pass.

### Phase C — Interaction Layer

> Goal: the Reader is fluent, keyboard-first, and discoverable.

- [ ] Implement keyboard shortcut system (focused-input safe).
- [ ] Implement the `?` shortcut overlay that lists every active binding.
- [ ] Implement global search with Fuse.js, bound to `/`.
- [ ] Implement the command palette (`Cmd+K`) with all commands listed in section 13.
- [ ] Implement Mark Done / Mark Review buttons + `m` and `r` shortcuts.
- [ ] Implement prev / next navigation with `j` / `k`.
- [ ] Verify lint, typecheck, and build pass.

### Phase D — Session Timer and Inline Practice

> Goal: time tracking and problem practice are honest and integrated.

- [ ] Implement persistent session timer in `components/session/`.
- [ ] Implement idle detection with auto-pause at 5 minutes.
- [ ] Wire stop-session to write minutes and block to `pt_daily_log` with paper-aware attribution.
- [ ] Implement inline Related Problems block at the bottom of the Topic View; reuse `pt_problem_status`.
- [ ] Implement per-topic notes scratchpad with debounced save.
- [ ] Verify lint, typecheck, and build pass.

### Phase E — Analytics

> Goal: the Progress page gives honest visual feedback at production quality.

- [ ] Add Recharts dependency.
- [ ] Replace the existing flat heatmap with a real weekly-grid heatmap.
- [ ] Implement paper completion bar chart in paper colours.
- [ ] Implement cumulative problems-solved line chart.
- [ ] Implement topic status donut.
- [ ] Implement pattern coverage bar chart.
- [ ] Implement last-4-weeks blocks table.
- [ ] Empty states for every chart.
- [ ] Verify lint, typecheck, and build pass.

### Phase F — Polish and Production

> Goal: every surface feels finished.

- [ ] Markdown plugins (gfm, highlight, slug, copy-code, heading anchors).
- [ ] Typography pass: serif body, line-height, max-width, dark-light variants.
- [ ] Empty states across Dashboard, Problems, Progress, Reader, Notes.
- [ ] Skeletons for markdown lazy-load.
- [ ] Onboarding modal (3 steps) on first visit.
- [ ] Mobile responsive layouts (Reader drawer + sheet, top-bar timer pill).
- [ ] Accessibility pass (focus, ARIA, reduced motion, zoom).
- [ ] Error boundaries on every route.
- [ ] Schema migration validated against a v1 export fixture.
- [ ] Lazy-loaded routes; bundle size audit.
- [ ] Verify lint, typecheck, and build pass.

### Phase G — Deploy

> Goal: the application is live, shareable, and survives a fresh install.

- [ ] `vercel.json` with SPA rewrite and asset cache headers.
- [ ] Favicon, og-image, meta title, meta description.
- [ ] Vercel project connected to GitHub `main` branch.
- [ ] Production deploy verified at the assigned URL.
- [ ] Cross-browser export → import round trip on Chrome and Firefox.
- [ ] One-week dogfood window before declaring v2.0 stable.

---

## Appendix — Relationship to v1

The v1 specification (formerly `Project_Reference.md`) has been replaced by this document. The syllabus content from v1 has been extracted to `Syllabus.md`. The application's seed data, hooks, and storage layer are largely retained from v1; the changes specified here are concentrated in the UI layer (the Reader replaces the legacy Study Session and Syllabus pages), the data model extensions for active sessions and notes, and a polished production pass on every surface.

_End of DeepDive Project Specification v2._
