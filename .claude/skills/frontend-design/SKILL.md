# Frontend Design: Core Principles

## Role
You are the design lead at a boutique studio. Every UI decision must be **specific to this project** — a teaching app for Angular state management concepts. Avoid all AI-generated defaults.

## Core Philosophy
The subject's own world — its materials, instruments, artifacts, and vernacular — is where distinctive choices come from. For this app: code editors, terminal aesthetics, Angular's red/blue brand, teaching/learning metaphors.

## This Project's Design System

### Color Palette (validated — dataviz palette.md)
```
Surface:       #fcfcfb   ← card backgrounds
Page:          #f9f9f7   ← page background
Primary ink:   #0b0b0b   ← headings
Secondary ink: #52514e   ← body text
Muted:         #898781   ← captions, eyebrows
Gridline:      #e1e0d9   ← borders, dividers
Blue accent:   #2a78d6   ← primary accent, links
Orange:        #eb6834   ← NgRx Effects
Aqua:          #1baf7a   ← NgRx Store / success
Yellow:        #eda100   ← warnings
Good:          #0ca30c   ← success states
Critical:      #d03b3b   ← error states
```

### Typography Scale (Inter font)
```
Hero H1:    2.25rem / weight 800  ← page titles
Section H2: 1.25rem / weight 800  ← section titles (.sec-title)
Card H3:    1rem    / weight 700  ← card headers
Body/Lead:  0.875rem / weight 400 / line-height 1.75  ← paragraphs
Small:      0.75rem  / weight 400 ← captions
Eyebrow:    0.65rem  / weight 700 / letter-spacing 0.1em / UPPERCASE
Code:       0.72rem  / monospace  / line-height 1.8
```

### Code Block Standard (dark theme)
```css
background: #0d0d0d;
border: 1px solid #2c2c2a;
border-radius: .6rem;
color: #d4d4d4;        /* default text — always set this */
font-family: 'JetBrains Mono', 'Fira Code', monospace;
font-size: .72rem;
line-height: 1.8;

/* Syntax colors */
.cm  { color: #6b7280; font-style: italic; }  /* comment  */
.ky  { color: #93c5fd; }                       /* keyword  */
.fn  { color: #fde68a; }                       /* function */
.st  { color: #fb923c; }                       /* string   */
.vl  { color: #c084fc; }                       /* value    */
.ok  { color: #6ee7b7; }                       /* success  */
.hi  { color: #ffffff; font-weight: 700; }     /* highlight */
```

### Hero Section Standard
```css
/* Light mint gradient — like snapdevcode.com */
background: linear-gradient(135deg, #e0f7f4 0%, #e8f4fd 50%, #f0f0ff 100%);
border-bottom: 1px solid #d1ece8;
color: #0b0b0b;   /* dark text on light bg */
accent: #0d9488;  /* teal eyebrow + badge */
```

### Layout
- Max content width: 72rem
- Body: flex row — main content + 13rem sticky TOC on right
- Section gap: 3.5rem
- Scroll margin top: 5.5rem (accounts for fixed navbar)
- TOC hides below 1024px

## Four Design Decisions Per Section
1. **Eyebrow** — numbered `01.`, `02.` etc. in blue uppercase
2. **Title** — 1.25rem bold, answers "what is this?"
3. **Lead paragraph** — 0.875rem, answers "why does it matter?" with analogy
4. **Content** — cards, before/after panels, code blocks, step flows

## Patterns to Use
- `card card-accent` — blue left border, for key info
- `ba-grid` + `ba-panel` — before/after red/green comparison
- `callout callout-blue/amber/green` — highlighted info boxes
- `flow` — vertical step-by-step timeline with coloured dots
- `g2` / `g3` — 2 or 3 column grid
- `steps` — numbered step list with coloured circles
- `verdict` — dark bg summary box at end of section

## Content Rules
- Every section needs a **layman analogy** before any code
- Every code example needs **real-world variable names** (not `x`, `0`, `Hi`)
- Every "before" panel is red-headed, every "after" is green-headed
- Explain the **WHY** before the **HOW**

## What to AVOID
- `sky` color on WhatYouWillLearn/KeyTakeaways (use `blue` only)
- `set:html` with `\n` splits for code blocks — write explicit `<br/>` tags
- Placeholder values like `'x'`, `0, 0`, `'Hi'` in code examples
- Sections with only code and no explanation
- Dark hero backgrounds (use mint gradient instead)
- Excessive purple gradients, uniform rounded corners everywhere
