# Behavioral & Communication

Senior interviews are won and lost in non-coding rounds. The bar shifts from "can you do the work?" to "can you operate autonomously, scope the right work, raise the right concerns, and influence outcomes when you do not have authority?"

This module is for the rounds you cannot grind on LeetCode.

## STAR method: Situation, Task, Action, Result

STAR is the universal answer structure for behavioural questions. Each story takes 90 – 180 seconds when delivered well.

| Stage     | Question to answer                | Length                     |
| --------- | --------------------------------- | -------------------------- |
| Situation | What was the context?             | 1 – 2 sentences            |
| Task      | What was the problem you owned?   | 1 – 2 sentences            |
| Action    | **What did you do specifically?** | 60 – 120 seconds, the bulk |
| Result    | What was the measurable outcome?  | 2 – 3 sentences            |

**Build a story bank**

Maintain six to eight stories that together cover:

- A hard technical problem you solved.
- A time you disagreed with a teammate or manager.
- A failure that taught you something.
- A time you took initiative outside your job description.
- A time you mentored or unblocked someone.
- A time you delivered under tight constraints.
- A time you made the wrong call and corrected course.
- A complex system you helped design or significantly evolve.

Each story should map to multiple competencies (ownership, technical depth, communication, leadership). Practise them out loud.

**Common pitfall**: drowning in Situation. Interviewers want to hear what _you_ did. Compress the setup, expand the action.

**Rewriting weak STAR examples**

Weak: "We had performance issues so we improved the queries and it got better."

Strong: "Our checkout API's p99 latency had drifted from 250 ms to 1.4 s over six months and was causing 3 – 4% drop-off at payment. **(Situation)** I was asked to lead the investigation. **(Task)** I instrumented the request path with OpenTelemetry, identified that 80% of latency came from one N+1 query in our line-item loader, replaced it with a batch fetch, and added a regression test using a Testcontainers Postgres fixture. I also added a Grafana alert tied to the p99 SLO so we'd catch a similar regression earlier next time. **(Action)** p99 went from 1.4 s to 280 ms. Drop-off recovered within two days. The alert caught a related regression six weeks later, which we fixed before customers noticed. **(Result)**"

The strong version contains numbers, a specific technical action, and a longer-term improvement.

---

## Scoping & clarifying questions in interviews

Senior candidates do not start coding or designing immediately. The first 5 – 10 minutes are about scoping.

**Coding round scoping**

- "What are the input constraints?"
- "Are there duplicates?"
- "Empty input — return what?"
- "Should the result be sorted?"
- "Is mutation allowed in place?"
- "What is the expected complexity?"

Each answered question reduces the chance of solving the wrong problem.

**System design scoping**

- "Who are the users — how many, where, what devices?"
- "Read/write ratio?"
- "Latency target — milliseconds, seconds?"
- "Consistency — does a 5-second-stale read break the experience?"
- "Geographic scope — single region, multi-region?"
- "Compliance — PII, payment data, regional data residency?"
- "What is in scope for v1; what can we defer?"

State assumptions out loud and check them.

**Behavioural scoping**

When an interviewer says "tell me about a time", clarify what kind of story they want. "Are you looking for cross-team collaboration, technical depth, or something else?" Senior interviewers appreciate this; junior candidates rarely ask.

---

## Technical leadership: code reviews, mentoring, scope, on-call

**Code reviews**

A senior review balances speed with rigour:

- **Approve fast** for low-risk changes (small, well-tested, well-scoped). Aim for under one business day.
- **Block** for unsafe changes (security, data integrity, reversed null checks, missing tests on critical paths). State the blocker clearly and propose the fix.
- **Suggest** for stylistic improvements but mark them non-blocking.
- **Avoid** the temptation to rewrite the change in your image. Comment on what is broken, not what is different from your taste.

**Mentoring**

The senior question is "how do I make my colleagues more effective?" Concrete mechanisms:

- Pair on a hard problem 1 – 2 times before stepping back.
- Write up a pattern as a short doc; it scales beyond the conversation.
- Choose visibility carefully: praise in public, correct in private.

**Scope management**

Senior engineers say "no" or "not yet". Push-back examples:

- "This adds 4 weeks. Can we ship the smaller version first and gather data?"
- "We could build this generically, but only one team needs it. I'd build it for them and abstract later."
- "This is achievable but the failure modes will burn weeks of on-call. I'd prefer X which is simpler to operate."

**On-call ownership**

When you own a service, you own its pages. The question is not "did I write this code?" but "is this service healthy?" Postmortems should be blameless and produce concrete action items with owners.

---

## Disagreement, tradeoffs, influence without authority

**The disagree-and-commit framing**

State your case once, clearly, with evidence. If the decision goes against you, commit to executing it well. The exception is when the issue is correctness, safety, ethics, or reversibility — those warrant escalation.

**Influencing peers**

- Lead with the problem, not the solution. "I'm worried about X" invites collaboration; "we should do Y" invites debate.
- Show your work. A short doc with three options and tradeoffs converts more decisions than a heated thread.
- Concede small points to win on big ones.

**Tradeoff vocabulary**

| Pair                     | Senior framing                                                                             |
| ------------------------ | ------------------------------------------------------------------------------------------ |
| Speed vs quality         | "Lower-quality v1 ships in 2 weeks; higher-quality in 6. v1 buys us learning."             |
| Build vs buy             | "Buying costs $X/month. Building takes Y engineers Z months and adds maintenance forever." |
| Generality vs simplicity | "I'd add the abstraction the second time we need it, not the first."                       |
| Coupling vs autonomy     | "Microservices are autonomy at the cost of distributed-systems complexity."                |

---

## Failure, growth, post-mortems

Senior engineers can talk about a failure without sounding either defensive or self-flagellating.

**Structure for a failure story**

1. What you owned.
2. What went wrong (technical specifics).
3. What you noticed late that you should have noticed earlier.
4. What you changed in your behaviour or the system as a result.
5. Whether the change held up.

**Common pitfalls**

- Choosing a failure that isn't actually a failure ("I worked too hard"). Interviewers see through it.
- Blaming context or teammates. Even if context was the cause, you must own your part.
- Never circling back to growth. The point of the story is the lesson, not the wound.

---

## Closing the loop

Most candidates leave value on the table at the end of an interview by asking generic questions. Better:

- "What is the team's biggest unsolved problem right now?"
- "If I joined, what would success look like in the first 90 days?"
- "How do disagreements get resolved when they cross team boundaries?"
- "What is something this team does better than other teams you've been on?"

These questions surface useful signal for you and convey ownership.

---

## Interview answers

_Q: Tell me about a time you disagreed with your manager._
A: Use the disagree-and-commit framing above. Show that you stated your case with evidence, listened to theirs, and either changed your mind or committed to executing. Always end with what you learned about how to make the disagreement productive next time.

_Q: How do you handle being on-call?_
A: Ownership starts before the page. I instrument the service so I'm not flying blind. I keep a runbook current. When paged, I stabilise first, communicate to stakeholders second, and write the post-mortem third. The most senior thing I can do on-call is reduce the number of pages future-me has to take.

_Q: What is the hardest feedback you've received?_
A: Choose a real one — a generic answer signals you have not internalised it. Describe the feedback specifically, what surprised you about it, what you tried to change, and what is still hard about it. Honesty about ongoing growth lands better than a tidy resolution.
