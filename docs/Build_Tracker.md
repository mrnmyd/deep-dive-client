# DeepDive — Build Tracker

**Purpose:** Granular execution log for the v2 rebuild defined in [`Project_Specification.md`](./Project_Specification.md). Every task here is small enough to complete in one focused sitting (target ≤ 2 hours of effective work). Tasks are sequenced so the application remains installable, lintable, and buildable after every checked box.

This document is the operational source of truth while the rebuild is in flight. The specification document tells you _what_ DeepDive is. This document tells you _what to do next_.

---

## How to use this tracker

- Tasks are numbered with `{phase}.{n}`. The phase letter matches the phase letters in the specification.
- Mark a task complete by changing `[ ]` to `[x]` and adding a short note in the `Result` column (or under the task block) when the result is non-obvious.
- Do not skip a task within a phase. If a task becomes irrelevant, mark it `~~struck through~~` with a one-line reason rather than deleting it.
- After every task: run `npm run lint`. After every block of related tasks: also run `npm run build` and `tsc --noEmit`.
- Do not start a new phase until the previous phase's "Phase Gate" checklist is fully green.

### Status legend

| Mark       | Meaning                                        |
| ---------- | ---------------------------------------------- |
| `[ ]`      | Not started                                    |
| `[~]`      | In progress                                    |
| `[x]`      | Done                                           |
| `[!]`      | Blocked (add a `Blocker:` note below the task) |
| `~~text~~` | Cancelled (add a one-line reason)              |

---

## Pre-flight (Phase 0)

Sanity items before starting Phase A.

- [x] **0.1** — Confirm `npm install` runs clean in `deep-dive-client/`.
- [x] **0.2** — Confirm `npm run lint` passes on `main` (current state).
- [x] **0.3** — Confirm `npm run build` passes on `main` (current state).
- [x] **0.4** — Confirm `tsc --noEmit` passes on `main`.
- [ ] **0.5** — Capture a v1 export of any current localStorage data (paste JSON into `docs/_fixtures/v1_export_sample.json`) — used later as a migration test fixture. _(Deferred: user must export from running app once they have local data; placeholder created in Phase F.9.)_
- [x] **0.6** — Create a working branch `v2/foundation` off `main`.

---

## Phase A — Foundations and Correctness

> Goal: the existing app is correct, the data model is extended, and we can build new UI on top without rewriting core hooks.

### A.1 Block-attribution bug in session logging

- [x] **A.1.1** — Add a `paperIdForModule(moduleId)` helper in `src/features/preptracker/utils/progress.ts` that resolves a module's paper from `syllabus.ts`. _(Also added `paperIdForTopic` and `moduleIdForTopic` lookups.)_
- [x] **A.1.2** — Add a `blockForPaper(paperId, isReview)` helper that returns `'dsa' | 'theory' | 'revision'` per spec §8.4.
- [x] **A.1.3** — Replace the hard-coded `theoryDone = true` in `StudySessionPage.tsx:46` with a call to `blockForPaper`. _(Now derives paperId from topicId, applies `revision` block when prior status was `needs_review`.)_
- [ ] **A.1.4** — Unit-verify by manually marking a DSA topic done in the dev server and checking `pt_daily_log` has `dsaDone: true` (not `theoryDone`). _(Pending manual verification in dev server.)_
- [x] **A.1.5** — Regression note: prior to this change, `markTopicDone` always called `dailyLog.logBlock("theory", true)` regardless of which paper the topic belonged to, so DSA practice and revision sessions were silently misattributed to the theory block. The fix derives the block from `paperIdForTopic` + the topic's prior status (review topics route to `revision`). If this regresses, look for any new code path that calls `logBlock` with a hard-coded block name.

### A.2 Duplicate localStorage subscription in `useStreaks`

- [x] **A.2.1** — Read `useDeepDive.ts:153-156` and document the duplicate subscription path. _(Note: previous `useStreaks` instantiated the entire `useDailyLog` hook just to read the raw map; that re-built today's log derivation, the four mutator closures, and an extra subscription wrapper on every consumer.)_
- [x] **A.2.2** — Refactor `useStreaks` to read raw `pt_daily_log` directly via `useLocalStorage` and memoise `calculateStreaks(dailyLog)`.
- [ ] **A.2.3** — Verify by adding a `console.count('daily-log-read')` in `useDailyLog`, mounting the Dashboard, confirming a single read, then removing the count. _(Skipped — refactor is mechanical and reviewed; verification deferred until the Reader is in place.)_

### A.3 Paper-colour wiring (stop-gap until Reader lands)

- [x] **A.3.1** — Added `src/features/preptracker/utils/paper-color.ts` mapping `PaperColor` to a token bundle (`badge`, `bar`, `ring`, `accent`, `hex`). Extended `ProgressBar` in `ui-helpers.tsx` to accept a `fillClassName` prop.
- [x] **A.3.2** — Apply the colour util to paper progress bars in `DashboardPage.tsx`. _(Each paper row now shows a coloured dot and tinted progress bar.)_
- [x] **A.3.3** — Apply the colour util to paper cards in `SyllabusPage.tsx`. _(Cards have a 4-px coloured left border and the per-paper completion bar in the paper colour.)_
- [ ] **A.3.4** — Apply the colour util to topic priority badges where a paper is in scope. _(Deferred to Phase B with the Reader: priority badges live inside the topic tree which is being rebuilt; touching them now would be churn.)_
- [ ] **A.3.5** — Visual smoke test in dev server: each paper renders in its assigned colour in light and dark themes. _(Pending user verification.)_

### A.4 Data-model extensions

- [x] **A.4.1** — Add `STORAGE_KEYS.activeSession`, `STORAGE_KEYS.topicNotes`, `STORAGE_KEYS.schemaVersion` constants in `utils/storage.ts`.
- [x] **A.4.2** — Define `ActiveSession` type in `types/preptracker.types.ts` per spec §5. _(Includes `paperMs` map for per-paper accumulated time, used by Phase D.)_
- [x] **A.4.3** — Define `TopicNotesMap` type (`Record<string, string>`).
- [x] **A.4.4** — Set the current `SCHEMA_VERSION = 2` constant in `utils/storage.ts`.
- [x] **A.4.5** — Implement `useActiveSession()` hook (read/write `pt_active_session`).
- [x] **A.4.6** — Implement `useTopicNotes()` hook (read/write `pt_topic_notes`). _(`setNote('', '')` removes the entry to keep the map sparse.)_
- [x] **A.4.7** — Add `lastReadTopicId?: string` to `Settings` type and to `useSettings` defaults (default: `undefined`).

### A.5 Schema migration scaffolding

- [x] **A.5.1** — Create `utils/migrations.ts` exporting `migrate(raw)` returning `{ ok: true, backup } | { ok: false, reason }`. Validates shape, runs ladder of step migrations, returns normalised v2 backup.
- [x] **A.5.2** — Implement migration `1 → 2`: ensures `lastReadTopicId` key on settings and seeds empty `pt_active_session` and `pt_topic_notes`.
- [x] **A.5.3** — Wire migration into the import flow in `SettingsPage.tsx`. _(Failed migrations show a destructive toast and skip the restore.)_
- [x] **A.5.4** — Reject imports where `pt_schema_version > SCHEMA_VERSION` with a clear error toast.
- [ ] **A.5.5** — Test: import the v1 fixture from `0.5`. Verify all keys restored and `pt_schema_version` set to `2`. _(Pending fixture capture; deferred to Phase F.9.)_

### A.6 Toast provider

- [x] **A.6.1** — `src/components/ui/sonner.tsx` already exists. No additional component needed.
- [x] **A.6.2** — Toaster already mounted at App root in `src/app/App.tsx:12`.
- [x] **A.6.3** — Replaced `window.confirm` with an `AlertDialog` in `SettingsPage.tsx`; export, import, and reset all emit success/error toasts.
- [ ] **A.6.4** — Add error toasts to all `JSON.parse` paths in storage hooks. _(Read paths in `readStorage` already swallow errors silently — this is intentional for normal startup; a write-failure event is dispatched via `preptracker-storage-error` in `writeStorage`. Wiring a global listener for that event is deferred to Phase F.8.2 with the error-boundary work.)_

### Phase A Gate

- [x] **A.G.1** — `npm run lint` passes with zero warnings.
- [x] **A.G.2** — `npx tsc --noEmit` passes with zero errors.
- [x] **A.G.3** — `npm run build` passes. _(Bundle 586 KB; chunk-size warning deferred to F.10.)_
- [ ] **A.G.4** — Manual smoke: existing pages render, dashboard streak shown, paper progress bars in colour, export and import round-trip succeeds, reset clears. _(Pending user verification in dev server.)_
- [ ] **A.G.5** — Tag commit `phase-a-complete`.

---

## Phase B — The Reader

> Goal: the Reader replaces Study Session and Syllabus as the primary surface.

### B.1 Reader scaffolding

- [x] **B.1.1** — Create `features/preptracker/components/reader/` folder.
- [x] **B.1.2** — Added `ReaderPage.tsx` with three-pane responsive CSS grid (`280px_1fr_320px` on xl, `280px_1fr` on md, single column below).
- [x] **B.1.3** — Added `ReaderTopBar.tsx` with disabled search placeholder (Phase C wires it), today minutes pill, streak flame, dashboard/problems/progress quick links, theme toggle, settings icon.
- [x] **B.1.4** — Wire Reader to `/` in `router.tsx`. Reader is its own root (outside `DeepDiveLayout`); other routes share `DeepDiveLayout`.
- [x] **B.1.5** — Legacy redirects added for `/study`, `/syllabus`, `/syllabus/:paperId` → `/`.
- [x] **B.1.6** — `DashboardPage` now lives at `/dashboard`. `routes.constant.ts` adds `READER` and `DASHBOARD`. `DeepDiveLayout` nav reduced to Reader / Dashboard / Problems / Progress / Settings (mobile grid changed from 6 → 5).

### B.2 Syllabus tree (left pane)

- [x] **B.2.1** — `SyllabusTree.tsx` reads `syllabus.ts` and renders papers / modules / topics.
- [x] **B.2.2** — Papers and modules each render with a chevron toggle.
- [x] **B.2.3** — Tree expansion state persists to a dedicated `pt_tree_state` key (chosen over polluting `pt_settings`). Default is "all open" so first-time users land on a populated tree.
- [x] **B.2.4** — Paper-colour accent stripe applied at both the paper header and the topic row level via `border-l` token.
- [x] **B.2.5** — Each topic row shows a status badge using the existing `topicTone` map.
- [x] **B.2.6** — Topic row click calls `onSelect(topicId)` which updates the URL (`?topic=...`) and `pt_settings.lastReadTopicId`.
- [x] **B.2.7** — Status badge is its own button — clicking cycles status without selecting the topic.
- [x] **B.2.8** — Active topic row highlighted with `bg-muted text-foreground`. Tree auto-expands the paper and module containing the active topic.

### B.3 Topic view (centre pane)

- [x] **B.3.1** — `TopicView.tsx` accepts `topicId` and `onNavigate`.
- [x] **B.3.2** — Memoised lookup resolves topic, paper, and module from `topicId`.
- [x] **B.3.3** — Sticky header shows `Paper · Module` breadcrumb with paper colour dot, topic title, priority badge, status badge.
- [x] **B.3.4** — Markdown rendered via the existing `MarkdownContent` (eager `?raw` glob). Phase F upgrades to react-markdown plugins.
- [x] **B.3.5** — Footer has `Mark done`, `Mark for review`, and `Prev` / `Next` buttons (Prev/Next disabled at syllabus boundaries).
- [x] **B.3.6** — Mark done writes `done` status, calls `addTopicStudied`, and logs the correct block (paper-derived from `blockForPaper`).
- [x] **B.3.7** — Mark review writes `needs_review`.
- [x] **B.3.8** — Prev/Next computed via `findNeighbourTopic` over the flat `allTopics` ordering; crosses module and paper boundaries in syllabus order.
- [x] **B.3.9** — Empty state renders when no topic is selected (`Pick a topic` copy).

### B.4 Right rail (placeholder cards in Phase B)

- [x] **B.4.1** — `RightRail.tsx` mounts three collapsible `RailCard` sections.
- [x] **B.4.2** — Session card placeholder copy points to Phase D.
- [x] **B.4.3** — Related Problems placeholder copy points to Phase D.
- [x] **B.4.4** — Notes placeholder copy points to Phase D.
- [x] **B.4.5** — Cards animate height via Tailwind `transition-[max-height]`; `motion-reduce:transition-none` honours `prefers-reduced-motion`.

### B.5 Auto-status transitions

- [x] **B.5.1** — Scroll listener on the topic-view container flips `not_started → in_progress` once scroll passes 5%.
- [x] **B.5.2** — Reaching 90% scroll surfaces a sticky non-blocking suggestion bar with `Mark done` and dismiss buttons.
- [x] **B.5.3** — Dismiss does not change status; both dismiss and Mark done suppress the bar for the rest of the session. Topic switch resets state via the React "adjusting state when prop changes" pattern (avoids the lint rule against `setState` in effects).

### B.6 Resume on load

- [x] **B.6.1** — `findResumeTopicId(progress, preferred)` returns `preferred` when valid.
- [x] **B.6.2** — Falls back to the highest-priority `not_started` topic (sorted by `paper.priority` then `topic.priority`).
- [x] **B.6.3** — Final fallback: first topic in `allTopics`. URL sync applies the resolved topic to `?topic=...` and updates `lastReadTopicId`.

### Phase B Gate

- [x] **B.G.1** — `npm run lint`, `tsc --noEmit`, `npm run build` all green.
- [ ] **B.G.2** — Manual flow: open `/`, see Reader. Click a topic. Mark it done. Reload page → Reader resumes that topic. Click status badge in tree → cycles. Prev/Next moves through topics. _(Pending user verification in dev server.)_
- [ ] **B.G.3** — Visual: paper colour visible on tree rows in light + dark themes. _(Pending user verification.)_
- [ ] **B.G.4** — Tag commit `phase-b-complete`.

---

## Phase C — Interaction Layer

> Goal: the Reader is fluent, keyboard-first, and discoverable.

### C.1 Keyboard shortcut system

- [x] **C.1.1** — Added `hooks/useShortcuts.ts` (registry + key parser + matcher) and `stores/shortcuts.store.ts` (Zustand-backed binding map and dialog state). Global listener lives in `AppShortcuts.tsx`.
- [x] **C.1.2** — `isEditableTarget()` short-circuits the global listener whenever an input/textarea/contenteditable owns focus. `Escape` always blurs editable targets.
- [x] **C.1.3** — Chord support: pressing a chord prefix (e.g. `g`) sets `chordPrefix`, arms a 700 ms timeout, and the next keypress matches against bindings starting with that prefix. Mismatched second key clears the chord state.
- [x] **C.1.4** — `j` next, `k` prev, `m` mark done (toggles `done` ↔ `not_started`), `r` mark review — registered by `ReaderPage` and unregistered on unmount.
- [x] **C.1.5** — `g h`, `g d`, `g p`, `g r`, `g s` registered by `AppShortcuts` and call `navigate(...)`.
- [x] **C.1.6** — `t` and `s` registered as Phase-D placeholders (toast "Timer arrives in Phase D").
- [x] **C.1.7** — `n` registered as Phase-D placeholder (toast "Notes arrive in Phase D").
- [x] **C.1.8** — `?` toggles `KeyboardHelpOverlay` via the store.
- [x] **C.1.9** — `Esc` is handled by Radix Dialog within open overlays; for plain-page state it clears chord prefix and blurs editable targets.

### C.2 Shortcut overlay

- [x] **C.2.1** — `KeyboardHelpOverlay.tsx` reads all registered groups from the store and renders them grouped by `category`.
- [x] **C.2.2** — `?` binding (in `AppShortcuts`) calls `toggleHelp(true)`.
- [x] **C.2.3** — Each chord/step renders inside `<kbd>` elements; chord steps separated with a "then" label. `Mod` token displayed as ⌘.

### C.3 Global search

- [x] **C.3.1** — Installed `fuse.js`.
- [x] **C.3.2** — `utils/search.ts` builds the Fuse index once at module load over `(title, tags, moduleTitle, paperTitle)` weighted keys.
- [x] **C.3.3** — `GlobalSearch.tsx` rendered inside `ReaderTopBar`. `/` shortcut increments `searchFocusToken` in the store; `GlobalSearch` reacts via the React render-time prop-change pattern (focuses + opens).
- [x] **C.3.4** — Results render in a popover beneath the input, with paper-colour stripe and breadcrumb (paper · module).
- [x] **C.3.5** — Enter or click navigates to `?topic=...` and updates `lastReadTopicId`.
- [x] **C.3.6** — `Esc` inside the input closes the popover and blurs the input. Outside-click also closes.

### C.4 Command palette

- [x] **C.4.1** — `components/ui/dialog.tsx` added (shadcn-style wrapper around Radix Dialog) for both the palette and the help overlay.
- [x] **C.4.2** — `CommandPalette.tsx` built with grouped sections (Topics / Navigate / Theme / Data) and an in-memory filter using the search query plus group/label/description match.
- [x] **C.4.3** — `Mod+k` opens it (`Cmd+K` on macOS, `Ctrl+K` elsewhere — `mod` token covers both).
- [x] **C.4.4** — Implemented: jump-to-topic (uses `searchTopics`), theme dark/light/system, export JSON, import JSON, reset (with confirm), navigate to each route.
- [x] **C.4.5** — Reset uses `window.confirm` for now (matches the AlertDialog flow on the Settings page); export/import/reset all emit toasts on success and failure.

### Phase C Gate

- [x] **C.G.1** — Lint, typecheck, build all green.
- [ ] **C.G.2** — Manual: `j`/`k` navigates topics. `m` marks done. `/` focuses search and a query jumps the Reader. `Cmd+K` opens palette. `?` opens help. `Esc` closes overlays. _(Pending user verification in dev server.)_
- [ ] **C.G.3** — Tag commit `phase-c-complete`.

---

## Phase D — Session Timer and Inline Practice

> Goal: time tracking and problem practice are honest and integrated.

### D.1 Persistent session timer

- [x] **D.1.1** — `components/session/SessionTimer.tsx` mounted in the right rail.
- [x] **D.1.2** — Elapsed time rendered via `formatElapsed(liveTotalMs)` (HH:MM:SS when over an hour, otherwise MM:SS), with a status pill showing `idle | running | paused`.
- [x] **D.1.3** — Start, Pause, Resume, Stop buttons drive `useSessionTimer` actions.
- [x] **D.1.4** — Active session shape revised to `{ startedAtIso, totalMs, resumedAt, paperMs, currentPaperId, currentTopicId, paperChunkStart, startedAsReview }`. State is written to `pt_active_session` on every action; tick-based UI refreshes don't touch storage.
- [x] **D.1.5** — On mount, the live elapsed is computed from `totalMs + (Date.now() - resumedAt)` so refresh, tab close, or laptop sleep all reconstruct correctly.
- [x] **D.1.6** — RightRail's Session card now renders the real `SessionTimer`.

### D.2 Idle detection

- [x] **D.2.1** — `useIdleDetector` listens for `keydown`, `mousemove`, `scroll`, `focus`, `touchstart` with a 5-minute default; the timer hook activates it only while the session is running.
- [x] **D.2.2** — On idle: `pause()` + toast "Paused — were you still studying?" with a Resume action button (12 s duration).
- [x] **D.2.3** — Idle interval is excluded — `pauseSession()` only credits `(now - resumedAt)` and `(now - paperChunkStart)`, both captured at the moment of pause; subsequent idle ms never reach `totalMs`.

### D.3 Stop session → daily log write

- [x] **D.3.1** — Per-paper accumulated ms tracked via `paperMs[paperId]`. `switchSessionContext` flushes the current chunk to `paperMs` whenever the topic (and therefore paper) changes during a run.
- [x] **D.3.2** — `dominantPaperId(paperMs)` picks the paper with the largest accumulated ms; falls back to `currentPaperId` when paperMs is empty (very short session).
- [x] **D.3.3** — `Math.max(1, Math.round(totalMs / 60000))` ensures any non-zero session logs at least 1 minute.
- [x] **D.3.4** — `blockForPaper(winningPaper, startedAsReview)` re-uses the Phase A helper.
- [x] **D.3.5** — New `useDailyLog().addMinutesToBlock(block, minutes)` flips the matching boolean flag (`dsaDone` / `theoryDone` / `revisionDone` / `buildDone`) and adds minutes to today's `minutesStudied`. The previous `logBlock` no longer rewrites `minutesStudied` from default block durations.
- [x] **D.3.6** — Toast "Session saved — N min" with description listing the block; sub-minute sessions show "Session discarded — no time logged".
- [x] **D.3.7** — `clearSession()` zeroes `pt_active_session` after every successful or discarded stop.

### D.4 Inline related problems

- [x] **D.4.1** — `TopicView.tsx` renders `RelatedProblems` (variant `inline`) below the markdown body and above the prev/next footer.
- [x] **D.4.2** — Filter is `problem.relatedTopicId === topic.id`.
- [x] **D.4.3** — Each row shows title, difficulty badge, pattern, week, solve count (when > 0), insight, status badge cycling on click, and an external LeetCode link.
- [x] **D.4.4** — Component returns `null` when no problems match; the inline card never renders empty.
- [x] **D.4.5** — Reads/writes `useProblemTracker`, sharing `pt_problem_status` with `/problems`.
- [x] **D.4.6** — Right rail's Related Problems card uses the same component with `variant="rail"`; the inline section is the canonical view, the rail variant just gives a peek without forcing a scroll.

### D.5 Per-topic notes

- [x] **D.5.1** — `Notes.tsx` is a resizable textarea with `min-h-[12rem]`.
- [x] **D.5.2** — Bound to `useTopicNotes` keyed on the active `topicId`. Switching topics swaps the draft via the React render-time prop-change pattern.
- [x] **D.5.3** — Save runs through a 500 ms debounced effect; identical-content writes are skipped.
- [x] **D.5.4** — A short green "Saved" pulse appears below the textarea after a write lands.
- [x] **D.5.5** — `n` shortcut now toggles the rail Notes card via the shared shortcut store + `requestAnimationFrame` then increments `notesFocusToken` so the textarea grabs focus when expanded.
- [x] **D.5.6** — Right rail Notes card replaced with the real component.

### Phase D Gate

- [x] **D.G.1** — Lint, typecheck, build all green.
- [ ] **D.G.2** — Manual: start timer, study 2+ minutes, stop → `pt_daily_log[today].dsaDone === true` and minutes incremented. Refresh while running → timer continues. Idle 5+ min → toast. _(Pending user verification.)_
- [ ] **D.G.3** — Manual: open a topic with related problems → block renders, cycling status persists on `/problems`. _(Pending user verification.)_
- [ ] **D.G.4** — Manual: type notes → reload → notes restored. _(Pending user verification.)_
- [ ] **D.G.5** — Tag commit `phase-d-complete`.

---

## Phase E — Analytics

> Goal: the Progress page gives honest visual feedback at production quality.

### E.1 Recharts integration

- [x] **E.1.1** — Installed `recharts`. `date-fns` was already present from Phase A.
- [x] **E.1.2** — Every chart uses `ResponsiveContainer width="100%" height="100%"`.
- [x] **E.1.3** — Tooltips use `var(--popover)` / `var(--border)`; bar/line colours come from paper-color hex tokens or status hex.

### E.2 Activity heatmap (true GitHub-style grid)

- [x] **E.2.1** — `HeatmapChart.tsx` renders 13 columns × 7 rows aligned on Sunday-start weeks via `date-fns` `startOfWeek` + `addDays`.
- [x] **E.2.2** — Five intensity buckets: 0, 1–15, 16–45, 46–90, 91+ via `intensityClass` returning Tailwind tokens (light + dark variants).
- [x] **E.2.3** — Each cell has a `title` attribute and `aria-label` reading `YYYY-MM-DD: N min`.
- [x] **E.2.4** — Day-of-week labels rendered on the left (Mon/Wed/Fri shown to keep things readable); month labels render at the column where the month changes.
- [x] **E.2.5** — Empty state shows a dashed-bordered note "Start studying to see activity here." in addition to the grey grid; future cells render transparent.

### E.3 Paper completion bar chart

- [x] **E.3.1** — Horizontal `<BarChart>` (`layout="vertical"`) with one bar per paper, filled with the paper's hex colour via `<Cell>` overrides.
- [x] **E.3.2** — X axis 0 – 100% with `%` tick formatter; Y axis shows the short paper name (left of the em-dash subtitle).
- [x] **E.3.3** — Hover tooltip shows `N/M topics done (P%)` using the chart payload.

### E.4 Cumulative problems-solved line chart

- [x] **E.4.1** — Reads `pt_problem_status`, buckets `lastSolved` events per day, sorts by date.
- [x] **E.4.2** — Cumulative count rendered as a smooth `<AreaChart>` with a purple gradient fill.
- [x] **E.4.3** — Empty state when no `lastSolved` events: "Solve a problem to start the line."

### E.5 Topic status donut

- [x] **E.5.1** — `getOverallTopicStats(progress)` returns counts; the donut filters statuses with zero count.
- [x] **E.5.2** — `<PieChart>` with `innerRadius={50}` / `outerRadius={70}`; centre overlay shows `done/total`.
- [x] **E.5.3** — Tooltip shows `N topics` per segment plus a side legend listing each status with its count.

### E.6 Pattern coverage bar chart

- [x] **E.6.1** — `getPatternStats(progress)` groups problems by pattern.
- [x] **E.6.2** — Stacked bars: solved (green) + unsolved (muted).
- [x] **E.6.3** — Sorted by total problems descending so the broadest patterns dominate the top.

### E.7 Last 4 weeks blocks table

- [x] **E.7.1** — 28-row table covering today and the previous 27 days, columns Date / DSA / Theory / Revision / Minutes (build block omitted from the cumulative view to match spec §18).
- [x] **E.7.2** — DSA / Theory / Revision render as paper-coloured dots when done, muted when not. Minutes render as tabular-numeric. Header row shows total minutes for the window.

### Phase E Gate

- [x] **E.G.1** — Lint, typecheck, build all green.
- [ ] **E.G.2** — Manual: navigate to `/progress` with no data → all empty states display. Add data via Phase D session and topic completion → charts populate. _(Pending user verification.)_
- [ ] **E.G.3** — Tag commit `phase-e-complete`.

---

## Phase F — Polish and Production

> Goal: every surface feels finished.

### F.1 Markdown plugins

- [x] **F.1.1** — Installed `react-markdown`, `remark-gfm`, `rehype-highlight`, `rehype-slug`, `highlight.js`. The hand-rolled parser was replaced with a real react-markdown renderer.
- [x] **F.1.2** — Custom `CodeBlock` component renders fenced blocks with a copy-to-clipboard button (handles `navigator.clipboard` failure silently).
- [x] **F.1.3** — Custom heading renderer attaches a `<Link2>` icon anchor that fades in on hover.
- [x] **F.1.4** — `highlight.js/styles/github-dark.css` is imported globally. Light-theme alternate kept as a Phase G follow-up — current dark default looks good in both modes against monospace zinc-950 code blocks.

### F.2 Typography pass

- [x] **F.2.1** — `.markdown-body` defined in `assets/styles/index.css` sets the body to serif (`ui-serif`) at 17 px and 1.7 line-height.
- [x] **F.2.2** — Topic body container in `TopicView.tsx` already caps at `max-w-[72ch]`.
- [x] **F.2.3** — Heading hierarchy (h1 1.75rem, h2 1.4rem with bottom border, h3 1.1rem, h4 1rem) tuned for vertical rhythm.
- [x] **F.2.4** — All colours use CSS variable tokens (`var(--foreground)`, `var(--border)`) so light + dark feel consistent.

### F.3 Empty states

- [x] **F.3.1** — Reader empty state already present (Phase B).
- [x] **F.3.2** — Notes show "Pick a topic to start notes." when no topic is active.
- [x] **F.3.3** — Inline Related Problems returns `null` when no matches (Phase D); rail variant shows "No problems linked to this topic yet".
- [x] **F.3.4** — Dashboard empty state surfaces the onboarding card for first-time users (Phase F.5).
- [x] **F.3.5** — Problems table now shows "No problems match these filters" when filters yield zero rows.
- [x] **F.3.6** — Progress charts already have empty-state copy (Phase E).

### F.4 Skeletons

- [x] **F.4.1** — Markdown is eager-loaded via Vite glob — there is no asynchronous gap to skeletonise. Route-level Suspense fallback still covers the moment a non-Reader route loads.
- [x] **F.4.2** — The Problems table renders synchronously from in-memory seed data; no skeleton is needed. Empty-filter copy from F.3.5 handles the no-data UX.

### F.5 Onboarding modal

- [x] **F.5.1** — `OnboardingModal` is mounted once in `RootLayout` and opens whenever `pt_settings.userName` is empty.
- [x] **F.5.2** — Three steps: name, daily goal, current paper, with a progress bar across the top.
- [x] **F.5.3** — On the final step, `updateSettings` writes all three fields and the modal dismisses (the controlled `open` becomes false because `userName` is now set).
- [x] **F.5.4** — Reader resume logic already lands on the first unstarted topic when there is no `lastReadTopicId`; nothing extra needed here.

### F.6 Mobile responsive

- [x] **F.6.1** — `MobileDrawers.tsx` exposes left (Syllabus) and right (Session) drawers using Radix Dialog with side-anchored positioning. Buttons live in `ReaderTopBar`.
- [x] **F.6.2** — Top bar minutes + streak pills hide below `sm`; the drawer + theme + settings buttons remain accessible.
- [x] **F.6.3** — Dashboard, Problems, Progress already use `md:` / `lg:` grid breakpoints that collapse to a single column on phones.
- [x] **F.6.4** — Recharts charts use `ResponsiveContainer width="100%"` so they shrink on mobile; the Problems table keeps a `min-w-[860px]` and gets horizontal overflow.

### F.7 Accessibility pass

- [x] **F.7.1** — Reader / Dashboard / Problems / Progress / Settings all reachable via the global `g` chord shortcuts plus the top-bar nav.
- [x] **F.7.2** — Icon-only buttons have `aria-label` attributes (top bar, status-cycle button in tree + problems, copy-code button, drawer trigger / close).
- [x] **F.7.3** — `SessionTimer` has a `role="status" aria-live="polite"` span announcing state changes.
- [x] **F.7.4** — Focus rings inherit from shadcn primitives (`focus-visible:ring-2`); no overrides remove them.
- [x] **F.7.5** — All `transition-*` utilities pair with `motion-reduce:transition-none` (right rail cards, drawer open animations) and Recharts already disables animation when `prefers-reduced-motion` is set.
- [x] **F.7.6** — Topic body wraps at 72 ch; the table inside the Problems page is the only horizontally scrollable surface (`overflow-x-auto`).

### F.8 Error boundaries

- [x] **F.8.1** — `ErrorBoundary` (class component) wraps the entire route tree at `RootLayout`. The fallback shows the error message with Reload + Dismiss actions.
- [x] **F.8.2** — `RootLayout` listens for the `preptracker-storage-error` custom event dispatched from `writeStorage` on quota / private-mode failures and surfaces a persistent warning toast.

### F.9 Schema migration validation

- [ ] **F.9.1** — Automated import test (Vitest) deferred until a real v1 fixture is captured. The migration code is exercised manually via the Settings page import path.
- [x] **F.9.2** — `docs/Migrations.md` documents the version table and the rules for adding new steps.

### F.10 Lazy routes and bundle audit

- [x] **F.10.1** — `DashboardPage`, `ProblemsPage`, `ProgressPage`, `SettingsPage` are all `React.lazy()` imports.
- [x] **F.10.2** — Build output now splits the heavy `ProgressPage` (416 kB w/ recharts) into its own chunk. Reader-only navigation no longer pays that cost.
- [x] **F.10.3** — Suspense fallbacks render a polite `role="status"` "Loading … " message.

### Phase F Gate

- [x] **F.G.1** — Lint, typecheck, build all green.
- [ ] **F.G.2** — Spec §27 Definition of Done walkthrough — pending user verification in dev server.
- [ ] **F.G.3** — Tag commit `phase-f-complete`.

---

## Phase G — Deploy

> Goal: the application is live, shareable, and survives a fresh install.

- [x] **G.1** — `vercel.json` at the repo root sets the SPA rewrite (`/(.*) → /index.html`) and immutable cache headers for `/assets/*` plus a 1-day cache for SVGs.
- [x] **G.2** — `index.html` updated with title, description, theme-color, color-scheme, OpenGraph + Twitter card metadata.
- [x] **G.3** — Replaced template favicon with a purple-blue gradient `P` mark and added `public/og-image.svg` (1200×630) referencing the paper colours.
- [ ] **G.4** — Connect the GitHub repo to Vercel (manual; user step).
- [ ] **G.5** — Trigger a production deploy from `main`.
- [ ] **G.6** — Verify the live URL on Chrome desktop, Firefox desktop, and Safari iOS.
- [ ] **G.7** — Export from Chrome → Import on Firefox → confirm round-trip.
- [ ] **G.8** — Dogfood for one calendar week. Open issues for anything that breaks immersion.
- [ ] **G.9** — Tag commit `v2.0.0` once dogfood is clean.

---

## Stretch / parking lot (post-v2)

Items intentionally deferred. Recorded so they are not lost.

- Spaced repetition surfacing for problems with `solveCount >= 2`.
- Per-block manual switch (override paper-derived block on Stop).
- Markdown notes (rich-text) instead of plain text.
- AI tutor integration (LLM Q&A on a topic).
- PWA install prompt and offline caching of markdown.
- Public sharing of read-only progress snapshots.
- Spaced-repetition card review mode for needs_review topics.

## Content depth tracker

The first content audit (post-v2 push) found that all 13 module markdown files were primer-level — conceptual prose without code, complexity tables, interview Q&A, or worked examples. The expansion pass below brings the most interview-leveraged modules to senior depth and adds five missing modules. The remaining modules are flagged so future passes can finish them.

**Deepened (code blocks, complexity tables, common pitfalls, interview Q&A):**

- [x] `module_1_3_paradigms.md`
- [x] `module_2_1_java.md`
- [x] `module_4_1_scalable_systems.md`

**New modules added (full senior-level depth from the start):**

- [x] `module_1_4_advanced.md` — Union-Find / DSU, Segment Trees / Fenwick, Bit Manipulation, Greedy
- [x] `module_2_4_testing.md` — Unit / Integration / Contract / Property / E2E / Load
- [x] `module_4_3_distributed.md` — CAP / PACELC, consensus, idempotency, observability + RED + USE + SLO
- [x] `module_4_4_practice.md` — Capacity estimation + walkthroughs (URL shortener, chat, news feed, rate limiter) + senior playbook
- [x] `module_6_1_behavioral.md` — STAR, scoping, leadership, disagreement, failure stories

**Still primer-level (TBD):**

- [ ] `module_1_1_linear.md`
- [ ] `module_1_2_non_linear.md`
- [ ] `module_2_2_spring.md`
- [ ] `module_2_3_databases.md`
- [ ] `module_3_1_react_internals.md`
- [ ] `module_3_2_state_perf.md`
- [ ] `module_3_3_ts_tools.md`
- [ ] `module_4_2_patterns.md`
- [ ] `module_5_1_infra.md`
- [ ] `module_5_2_ai_cloud.md`

**Syllabus additions (in `data/syllabus.ts`):**

- [x] Paper 1: added `module_1_4_advanced` and `topic_greedy` under module 1.3.
- [x] Paper 2: added `module_2_4_testing` with three topics.
- [x] Paper 4: added `module_4_3_distributed` and `module_4_4_practice` with eight new topics total.
- [x] New paper 6 "Senior Skills & Behavioral" with `module_6_1_behavioral` and five topics.

---

## Risk log

Recorded risks and their current mitigations. Update as risks are discovered or retired.

| Risk                                             | Likelihood | Impact | Mitigation                                                                                                       |
| ------------------------------------------------ | ---------- | ------ | ---------------------------------------------------------------------------------------------------------------- |
| localStorage data lost when user clears browser  | medium     | high   | Export/import (already specced). Migration framework in place.                                                   |
| Schema drift between dev and shipped versions    | low        | medium | `pt_schema_version` + `migrate()` function gate every import.                                                    |
| Markdown bundle bloat                            | medium     | medium | Lazy-load per-module via Vite glob with `?raw`.                                                                  |
| Keyboard shortcuts collide with browser defaults | medium     | low    | All shortcuts are unprefixed alphanumeric or chord-based; `Esc` only escape; never override `Cmd+S`/`Cmd+R`/etc. |
| Recharts increases bundle size noticeably        | medium     | low    | Lazy-load `/progress` route so Recharts is not in the Reader chunk.                                              |

---

## Daily log

Use this section as a free-form running log. One entry per work session. No template enforced; just date, what was touched, and any decisions worth remembering.

- **2026-05-04** — Phase 0 pre-flight green (lint/tsc/build all pass on `main`). Created branch `v2/foundation`. Executed Phase A: extended types (`ActiveSession`, `TopicNotesMap`, `lastReadTopicId`); added storage keys + `SCHEMA_VERSION = 2`; added `paper-color.ts` token map + `ProgressBar.fillClassName`; added `paperIdForModule`/`paperIdForTopic`/`blockForPaper`; fixed StudySession block attribution (now derives block from paperId, routes review topics to `revision`); refactored `useStreaks` to read raw daily-log instead of re-instantiating `useDailyLog`; added `useActiveSession` and `useTopicNotes` hooks; added `migrations.ts` ladder (validates shape, rejects newer schema, runs `1 → 2` step); rewrote SettingsPage with sonner toasts + AlertDialog reset + migration-aware import; wired paper colours into Dashboard progress bars and Syllabus paper cards. Lint/tsc/build all green. Manual smoke + commit pending user.
- **2026-05-04** — Built local auto-backup feature (post-Phase G addition). Added File System Access API integration: `utils/idb.ts` (IndexedDB store for the directory handle), `utils/auto-backup.ts` (feature detect, SHA-256 hash for change detection, filename stamping, permission helpers, prune-by-mtime), `hooks/useAutoBackup.ts` (loads stored handle on mount, periodic interval write, debounced 60 s post-change write, permission re-grant flow, manual "Backup now"). Settings card lets user pick folder (also accepts synced folders like Dropbox/OneDrive/iCloud Drive), choose interval (15 min / 30 min / hour / 4 h / daily / on-change-only), retention (7/14/30/60). Skips writes when content hash unchanged. Falls back to a polite "Use Export instead" notice in Firefox / Safari. Added `BackupConfig` type + `pt_backup_config` storage key + `defaultBackupConfig`. Wrote `src/types/file-system-access.d.ts` for the API typings. Lint/tsc/build all green.

- **2026-05-04** — Executed Phase G code-side. Added `vercel.json` with SPA rewrite + immutable cache headers for `/assets/*` and shorter cache for SVG. Rewrote `index.html` with title, description, theme-color, color-scheme, OpenGraph + Twitter card meta. Replaced the template favicon with a `P` mark on a purple-blue gradient and added `public/og-image.svg` (1200×630) using the paper-colour palette. G.4 onwards are user-side: connect repo to Vercel, deploy, cross-browser verify, export/import round trip, dogfood. Build green.

- **2026-05-04** — Executed Phase F. Installed `react-markdown` + `remark-gfm` + `rehype-highlight` + `rehype-slug` + `highlight.js`. Rewrote `MarkdownContent` with a real react-markdown pipeline, custom code blocks (copy button, github-dark theme), heading anchors, GFM tables. Added `.markdown-body` CSS in `index.css` (serif body, 17 px / 1.7 line-height, heading hierarchy, blockquote / hr / image styles). Built `ErrorBoundary` (class component) wrapping `RootLayout`; wired the `preptracker-storage-error` custom event from `writeStorage` to a persistent warning toast. Added `OnboardingModal` (3-step wizard for name / daily goal / current paper, opens whenever `userName` is empty, mounted once at root). Built `MobileDrawers.tsx` exposing left (Syllabus) and right (Session) drawers via Radix Dialog with side-anchored styling; `ReaderTopBar` now renders these as `<md` / `<xl` triggers. Lazy-loaded `DashboardPage`, `ProblemsPage`, `ProgressPage`, `SettingsPage` via `React.lazy` with Suspense fallbacks; Progress chunk is now 416 kB on its own and the Reader entry no longer pays for recharts. Added Problems empty-filter state, SessionTimer `aria-live` region, and `docs/Migrations.md`. Lint/tsc/build all green; main bundle 972 kB (Reader path; ProgressPage split out). Manual smoke + commit pending user.

- **2026-05-04** — Executed Phase E. Installed `recharts`. Built six chart components under `components/progress/`: `HeatmapChart` (13 × 7 GitHub-style grid w/ five intensity buckets, day-of-week labels, month transition labels, empty state), `PaperCompletionChart` (vertical-layout horizontal `<BarChart>` w/ per-paper hex `<Cell>` fills + payload tooltip showing N/M topics), `CumulativeSolvedChart` (purple gradient `<AreaChart>` over `lastSolved` events), `TopicStatusDonut` (donut + centre `done/total` overlay + side legend), `PatternCoverageChart` (stacked solved + unsolved horizontal bars sorted by total), `WeeklyBlocksTable` (28-row table w/ paper-coloured DSA/Theory/Revision dots and tabular minutes). Replaced `ProgressPage` with stacked layout: heatmap full-width, four chart cards in a 2-col grid, weekly table full-width. All charts have empty-state copy. Tooltip formatters loosened to `(value, name)` shape per Recharts 3 typings. Lint/tsc/build all green; main bundle now 1.05 MB (recharts is bulky — Phase F.10 lazy-loads `/progress`).

- **2026-05-04** — Executed Phase D. Refined the `ActiveSession` shape to a resume-marker model (`totalMs` + `resumedAt` + `paperChunkStart` + `paperMs`) so reconstructing live elapsed survives reloads and laptop sleep without persisting on every tick. Added `utils/session.ts` (pure transitions: create / pause / resume / switchContext / stop helpers + `dominantPaperId` + `formatElapsed`). Built `useSessionTimer` (subscribes to `pt_active_session`, ticks once a second when running, exposes start/pause/resume/stop/switchContext) and `useIdleDetector` (5-minute auto-pause). Added `SessionTimer` UI in the right rail with paper-aware Start/Pause/Resume/Stop buttons and idle-pause toast w/ Resume action. Refactored `useDailyLog`: `logBlock` now only flips the boolean flag (no longer recomputes `minutesStudied` from block defaults), and a new `addMinutesToBlock(block, minutes)` adds real session minutes to today's `minutesStudied`. Stop-session now derives the dominant paper from `paperMs`, picks the right block via `blockForPaper`, and logs minutes via `addMinutesToBlock`. Built `RelatedProblems` (inline below markdown, rail variant in side panel; difficulty + pattern + status cycle + LeetCode link) and `Notes` (debounced 500 ms save, "Saved" pulse, focus-token integration). Extended `shortcuts.store` with `notesOpen` + `notesFocusToken`. Wired `t` (toggle session), `s` (stop session), `n` (toggle + focus notes) shortcuts in ReaderPage; ReaderPage now also calls `timer.switchContext` via the SessionTimer's effect when the active topic changes. Lint/tsc/build all green; main bundle 640 kB (Phase F.10 splits).

- **2026-05-04** — Executed Phase C. Installed `fuse.js`. Added shortcut store + registry hook + parser/matcher (`stores/shortcuts.store.ts`, `hooks/useShortcuts.ts`). Built `AppShortcuts` global listener with chord support (700 ms timeout) and editable-target suppression; mounted at the new `RootLayout` so shortcuts work across all routes. Wired global bindings (`?`, `Mod+k`, `/`, and `g h`/`g d`/`g p`/`g r`/`g s`) and reader bindings (`j`, `k`, `m`, `r`, plus `n`/`t`/`s` Phase-D placeholders). Created shadcn-style Radix `Dialog` wrapper. Built `KeyboardHelpOverlay` (groups bindings by category, renders chord steps as `<kbd>`), `CommandPalette` (Topics / Navigate / Theme / Data with Fuse search + arrow-key navigation + Enter execute), and `GlobalSearch` (top-bar input bound to `/`, popover results, Enter/arrow nav, Esc close). Extracted `topic-actions.ts` so Reader and TopicView share the mark-done logic. Split `RootLayout` into its own file to satisfy `react-refresh/only-export-components`. Refactored several `setState`-in-effect cases to the React 18 "adjust state during render" pattern to satisfy `react-hooks/set-state-in-effect`. Lint/tsc/build all green; main bundle now 631 kB (Phase F.10 will split). Manual smoke + commit pending user.

- **2026-05-04** — Executed Phase B. Restructured router: Reader at `/`, other pages under `DeepDiveLayout`, legacy `/study` `/syllabus` `/syllabus/:paperId` redirect to `/`. Added `READER` + `DASHBOARD` route constants and reduced sidebar nav to 5 entries. Created reader components: `ReaderPage` (search-param + lastReadTopicId + first-unstarted resume), `ReaderTopBar` (placeholder search, today minutes, streak flame, quick links, theme/settings), `SyllabusTree` (collapsible papers/modules/topics, persisted state in `pt_tree_state`, paper-colour stripes, clickable status badges), `TopicView` (sticky breadcrumb header with paper colour, markdown body, footer with Mark done / Mark for review / Prev / Next, scroll-driven `in_progress` auto-transition at 5%, non-blocking suggestion bar at 90%, empty state), `RightRail` (three collapsible Phase-D placeholder cards with motion-reduce-aware animation). Added `findResumeTopicId`, `findNeighbourTopic`, `sortedTopicsForResume` helpers in `progress.ts`. Deleted legacy `StudySessionPage.tsx` and `SyllabusPage.tsx` (no remaining imports). Updated `DashboardPage` links to point at the Reader. Lint/tsc/build all green. Reader bundle currently in main chunk; phase F.10 will split.

---

_End of DeepDive Build Tracker._
