---
name: deep-tech-explainer
description: "Turns any confusing technical concept into a step-by-step visual explanation page. Follows the exact methodology used to explain Angular SSR + HTTP Transfer Cache + Server Routing + Server-Safe Code. Use this when building or updating a section/page that explains a complex concept. Triggers automatically when a user repeatedly asks 'but why?' about a topic — that conversation IS the content."
---

# Deep Tech Explainer — Content Methodology

This skill encodes the exact thinking process and page structure used to explain
Angular SSR concepts in `src/pages/ssr.astro`.
Apply it whenever you need to explain a complex technical concept so deeply
that a developer never has to ask "but WHY?" again.

---

## The Core Philosophy

**Never explain WHAT before the reader understands WHY it exists.**

Most docs say: "Use `withHttpTransferCache()` to prevent duplicate API calls."
That tells you nothing. A reader who doesn't understand the double-fetch problem
will copy the code and have no idea what they just did.

The methodology: **build understanding bottom-up, layer by layer.**
Each layer must be clear before the next is introduced.

**The section title must be the user's confusion — not the concept name.**
- ❌ "HTTP Transfer Cache"
- ✅ "Why Does My API Get Called Twice?"
- ❌ "Server-Safe Code"
- ✅ "Why Does My Code Crash When SSR Is On?"

---

## Before You Write Anything — Run This Pre-Flight

Run these questions BEFORE writing any HTML:

1. **What is the single root confusion?** Write it as a question. That becomes the `<h2>`.
2. **Are there multiple layers beginners conflate?** → Apply "3 Things" pattern (Step 2).
3. **Does it involve a sequence across two environments?** → Apply Phase cards (Step 3).
4. **What is the one "but why can't you just..." objection?** → Answer it explicitly (Step 4).
5. **What real-life analogy maps ALL parts of the constraint?** → Apply analogy rule (Step 5).
6. **What is the actual code artefact produced by the solution?** Show that, not just the API call.

If you can't answer all 6 without writing prose, you don't understand the concept yet.
Read more, then come back.

---

## Conversation → Content Bridge

**When a user asks "but why?" in conversation, that exchange IS the content.**

If a user sends you 3 messages clarifying something before they understand it,
those 3 messages are the outline for your next section. Do not paraphrase their confusion
into a single paragraph — extract each sub-question as a separate step card.

Pattern:
- User asks: "bro I still don't get it — what does the server actually do?"
  → Add: Part B step card: "What the server actually does at request time"
- User asks: "so you're saying it happens twice?"
  → Add: Before/After panel that makes the "twice" visible
- User asks: "but why can't Angular just skip it?"
  → Add: Callout block: "The question you're probably asking..."

**Rule:** After any back-and-forth conversation that clarifies a technical concept,
update the relevant section of the page to answer those exact questions inline.
Future readers will have the same questions.

---

## Step 1 — Identify the Root Confusion

Before writing anything, ask:
> "What is the single thing that makes this concept feel magical or broken to someone new?"

For HTTP Transfer Cache: the confusion was `ngOnInit` running twice.
For hydration: the confusion was "Angular reuses the DOM but re-creates component objects — why?"
For Server Routing: the confusion was "what's the difference between these two routing files?"
For Server-Safe Code: the confusion was "why does my code crash now that SSR is on?"

Write this confusion down as a question. That question becomes your section title or opening line.
Examples:
- "Why does my API get called twice?"
- "What is the difference between a component object and a DOM node?"
- "Why can't the server just send the component to the browser?"
- "Why does my code crash when SSR is on?"

---

## Step 2 — Separate the Layers (The "3 Things" Pattern)

If the concept involves multiple layers that beginners conflate, **always start by separating them explicitly.**

Pattern: show 3 side-by-side cards, one per concept, each answering:
- What is it?
- Where does it live?
- What can it NOT do? (the constraint that causes the confusion)

Example from SSR:
| HTML String | DOM Nodes | Component Objects |
|---|---|---|
| Plain text characters | Live browser rendering objects | Live JS class instances in RAM |
| Can travel over HTTP | Only exist in browser | Exist in both, but never cross |
| No logic | No Angular logic until wired | Hold all Angular logic |

**Two-Environment Pattern (Server vs Browser):**
When the concept splits between Node.js and the browser, use a 2-column card:
- Left card (green border): browser globals — `window`, `document`, `localStorage`
- Right card (red border): Node.js globals — `process`, `fs`, `http` — no browser globals
- Show each API explicitly with its description
- Red ❌ rows for things that don't exist on that side

**Rule:** if a reader conflates two of these things, they will never understand the concept.
Separate them first, always.

---

## Step 3 — Show Phases (Numbered Timeline)

If the concept involves something happening in sequence across different environments
(server → browser, request → response, before → after), show it as **numbered step cards**.

Each step card:
```
[coloured number circle] Step title — plain English verb phrase
                         2-3 lines explaining exactly what happens.
                         No jargon. Reference earlier concepts by name.
```

Circle colours signal meaning:
- 🔵 Blue (`#eff6ff` / `#bfdbfe` / `#1d4ed8`) — neutral information
- 🟠 Orange (`#fff7ed` / `#fed7aa` / var(--orange)) — transition / warning
- 🔴 Red (`#fef2f2` / `#fecaca` / var(--red)) — error / crash / bad outcome
- 🟢 Green (`#f0fdf4` / `#bbf7d0` / `#166534`) — solution / success

Each phase answers:
1. Where are we? (server / browser / network)
2. What happens in this phase?
3. What is created or destroyed?
4. What is the **critical moment** the reader must notice?

**Critical moment pattern:** for crash sequences, steps 3–4 should use the red background
to make the error visually obvious before the reader hits the solution section.

---

## Step 4 — Answer the "But Why Can't You Just..." Question

After the phases, readers always have one specific "but why can't you just..." objection.
Anticipate it and answer it directly as its own `.callout` block with a bold question as the header.

Structure inside the callout:
1. Restate the objection as a bold question ("The question you're probably asking: ...")
2. Explain WHY in plain language — avoid words like "serialize", "instantiate", "marshal"
3. Follow with an analogy (see Step 5)

**Banned jargon and replacements:**
| Banned | Use instead |
|---|---|
| serialize | write out as plain text |
| instantiate | create / boot / new X() |
| marshal | package up and send |
| hydrate | wire Angular logic to the existing DOM |
| deserialization | read back from text |
| runtime | while the program is running |
| stub | a safe dummy version (a placeholder that silently does nothing instead of crashing) |
| injection token | "ask Angular for it using inject(X)" — describe what you get, not the pattern name |
| SEO meta tags | page title and description tags that search engines read |
| DI / dependency injection | "ask Angular to give you X" — describe the result, not the mechanism |

**The "instead of / ask Angular for" pattern:**
When explaining Angular DI or tokens, use this sentence structure:
> "Instead of calling X directly (which [problem]), ask Angular for it using inject(Y). In the browser Angular gives you [real thing]. On the server it gives you [safe alternative that does nothing instead of crashing]."

This pattern works for any Angular token. It explains the WHY (direct call crashes), the HOW (inject it), and the WHAT (different result per environment) in one sentence each. Never just say "inject the token" — always say what you get back and why it's safer.

---

## Step 5 — The Analogy Rule

Every hard concept needs one analogy from real life. Rules:

1. The analogy must map **every part** of the technical concept to a real-world equivalent
2. It must explain the CONSTRAINT, not just the happy path
3. It must be something everyone has experienced (food, travel, building, hiring)

**Tested analogies:**

**The Chef Analogy** (for "why component objects can't travel over HTTP"):
- Server = chef | HTML string = finished dish (can be handed over) | Component object = chef's hands and muscle memory (cannot be sent — no text form)

**The Restaurant Ordering Analogy** (for Server Routing render modes):
- Static menu (Prerender) = printed menu, same for everyone, printed once at deployment
- Daily specials board (Server + Cache) = fresh each day, CDN caches for the day, refreshed at midnight

**The Hotel Analogy** (for two routing files):
- `app.routes.ts` = hotel room directory (which room is which) — used by guests (browser)
- `app.routes.server.ts` = housekeeping schedule (how each room is serviced) — used by staff (server)

**The Recipe Analogy** (for Server-Safe Code):
- Recipe says "microwave for 2 minutes" — works at home (browser has `window`)
- No microwave in the catering kitchen (Node.js has no `window`) → recipe fails
- Fix: "skip this step if no microwave available" = `afterNextRender()`

Test your analogy: can you explain the constraint using only the analogy, without switching back to tech words?

---

## Step 6 — The Solution: WHY Before HOW

Show the solution only after the problem is fully understood.
Structure:

1. One line stating what the solution CAN'T do (reference the earlier explanation)
2. One line stating what it CAN do instead (and why that works)
3. Numbered step cards (not a paragraph) — one step per card, max 3 lines each
4. A real code block showing the actual output (not just the API call)

**For multi-solution situations (e.g. 3 ways to fix server-safe code):**
Use a numbered step strip where each step is one solution:
- Number 1 = simplest/most recommended
- Number 2 = for specific use cases
- Number 3 = advanced/specific case
Each solution card contains: title, 2-line explanation, inline code block.

**For the code block: show the actual artefact produced**, not just the function call.
Example: show the `<script type="application/json">` tag with real data inside it,
not just `provideHttpClient(withHttpTransferCache())`.

**Code block within a step card:** nest the `.code-block` div directly inside the step card's body div.
This embeds the real evidence inside the explanation — the reader doesn't have to scroll to find it.

---

## Step 7 — Before / After Panels

Always include a before/after comparison showing the exact sequence of events
with and without the solution. Rules:

- Use the same list of steps in both panels — same events, different outcomes
- Bad outcomes in the "without" panel are red and bold
- Good outcomes in the "with" panel are green and bold
- Every step that is identical in both panels uses neutral colour (not red/green)
- The divergence point must be visually obvious

---

## Step 8 — Side-by-Side Comparisons (Two Similar Things)

When explaining two concepts that are often confused or used together,
always show them side-by-side in a `.g2` grid rather than in sequence.

**Pattern:** `app.routes.ts` vs `app.routes.server.ts`:
- Two code blocks side-by-side in `.g2`
- Brief label above each explaining its purpose in one sentence
- A callout below explaining how they relate: "one answers which component, the other answers how to serve it"

**When to use side-by-side vs Before/After:**
- Side-by-side: two things that coexist and complement each other
- Before/After: the same situation with and without the solution

**Comparison table pattern** (for Prerender vs Server+Cache):
Use a 2-column card grid rather than an HTML table.
Each card shows: name, one-sentence purpose, when to use, cache behaviour.
Avoid `<table>` — it doesn't flex well on mobile and is harder to style.

---

## Page Structure Template

```
[EYEBROW — 09 · Concept Name]
[SECTION TITLE — The question that drives the confusion — NOT the concept name]
[LEAD — 2 sentences: what causes the confusion, what this section resolves]

[Part A label — red uppercase eyebrow]
[PART A — "First: Separate These N Things in Your Head"]
  → N side-by-side cards or two-environment grid

[Part B label — red uppercase eyebrow]
[PART B — "What Actually Happens — Step by Step"]
  → Numbered step strip (blue → orange → red for crash sequence)
  → Red-background cards for error/crash steps

[PART C — "The Question You're Probably Asking: Why Can't You Just..."]
  → .callout block
  → Plain language explanation
  → Analogy (last line of callout)

[Part C label — red uppercase eyebrow]
[PART D — "How to Fix It / N Ways to Fix It"]
  → Numbered solution cards with inline code blocks
  → Simplest solution first

[BEFORE / AFTER panels]
  → ba-grid / ba-panel / ba-head-red + ba-head-grn
```

---

## Content Review Checklist

Run this BEFORE writing (pre-flight) AND after writing (verification):

**Structure:**
- [ ] Section title is the user's confusion phrased as a question — NOT the concept name
- [ ] The "3 things" or "2 environments" are separated before any phase explanation begins
- [ ] Each phase step answers: where, what happens, what is critical
- [ ] The "but why can't you just..." objection has its own callout block
- [ ] Solutions are shown in order: simplest first

**Content:**
- [ ] Every piece of jargon has been replaced or explained on first use
- [ ] The analogy maps ALL parts of the constraint, not just the happy path
- [ ] The solution section shows a real code artefact (output), not just the API call
- [ ] Code blocks are embedded inside step cards where possible

**Visual:**
- [ ] The before/after panels share the same step list — divergence is visually clear
- [ ] Step circle colours signal meaning (blue=neutral, orange=transition, red=error, green=solution)
- [ ] No step card is more than 3 lines — if it is, split into two steps
- [ ] Headers use `color:var(--ink-1)` or a dark enough specific hex — never light colours on light cards
- [ ] No long paragraphs — if text runs more than 4 lines, convert to step cards or a list

**Conversation:**
- [ ] Any "but why?" questions asked in the chat session have been answered inline in the page
- [ ] Wherever the user asked "is my understanding correct?" — that understanding has been
      confirmed or corrected as a callout or comparison block on the page

---

## When to Use This Skill

Use `/deep-tech-explainer` when:
- Adding a new section explaining a framework concept (lifecycle hooks, change detection, zones, DI, etc.)
- **A user keeps asking "but why?" about a topic** — that is the strongest signal the concept needs this treatment
- Explaining something that involves two different environments (server/browser, build/runtime, etc.)
- The concept has an invisible behaviour (something that happens automatically without the developer writing it)
- A section exists but only has a before/after code panel — it needs the WHY filled in above it
- **A user's question in chat reveals a gap in the current page** — bridge the gap by expanding the section

Skip this skill for:
- API reference docs (just show the code and types)
- Simple how-to guides with no underlying "why" question
- Concepts the reader already understands (don't over-explain)
