# STAR method: Situation, Task, Action, Result; story bank construction

Senior interviews are won and lost in non-coding rounds. The bar shifts from "can you do the work?" to "can you operate autonomously, scope the right work, raise the right concerns, and influence outcomes when you do not have authority?"

This module is for the rounds you cannot grind on LeetCode.

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
