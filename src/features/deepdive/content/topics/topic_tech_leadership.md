# Technical leadership: code reviews, mentoring, scope management, on-call ownership

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
