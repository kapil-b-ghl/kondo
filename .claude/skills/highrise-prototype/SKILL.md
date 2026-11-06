---
name: highrise-prototype
description: Build or change a prototype in the HighRise playground (src/playground) using only HighRise components and semantic tokens, register it, and check it. Use for any "prototype", "mock up", "build a screen", "try three versions", or "make it clickable" request in this repo.
---

# Building a HighRise prototype

Prototypes are real, clickable Vue screens built **only** from the HighRise components in
`src/components`. The goal is to test ideas, not to draw them: every button works, every
state the PRD names can be reached, and nothing is faked with "pretend this loads".

## Before you build

1. Read `registry/components.json`. It lists every component, what it covers, and its known
   gaps. If the screen needs something that is not there, **stop and say so**. Do not invent
   a one-off component inside the prototype. Offer to add it to `src/components` (with a
   registry entry and its Figma node) instead.
2. Read the PRD section for the journey. List every state it names (statuses, empty, error,
   no permission, loading) before writing code. These become the prototype's `states`.
3. Look at an existing prototype (`src/playground/fastpay/`) and copy its structure:
   data in `data.ts`, screen files named `<Screen>.vue`, shared pieces in `parts/`.

## Rules (enforced by `npm run check`)

- Import components only from `src/components/index.ts`:
  `import { HrButton, HrCard } from '../../components';`
- No raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<table>`. Use `HrButton`,
  `HrInput`, `HrSelect`, `HrTable`. Links styled as buttons are `HrButton href=…`.
- No hex, `rgb()` or `hsl()` colours, no `--hr-color-*` primitives, no pixel font sizes.
  Use semantic tokens: `--hr-surface-*`, `--hr-text-*`, `--hr-background-*`,
  `--hr-border-*`, `--hr-icon-*`, and type tokens `--hr-text-xs … --hr-text-5xl`.
  Layout values (gap, padding, widths) may be pixels.
- Status colours mean the same thing everywhere: success = done/paid, warning = needs
  attention soon, error = blocked or failed, primary = in progress, gray = neutral/closed.
- Write copy the way the PRD does: plain words, the merchant's point of view, numbers with
  what they're compared to. Never mention vendors the merchant doesn't see (for FastPay:
  never say "Adyen", never show IC++ or interchange).
- Every screen is reachable by URL (`#/p/<product>/…`) and every state by query
  (`?state=…`), so a researcher can open a state directly in a test.

## Variants

When asked for several ideas, build each as its own screen file (`DashboardA.vue`,
`DashboardB.vue`, …) that shares the same data and parts. Add a `variants.ts` entry so the
prototype bar can switch between them while keeping the current state. Each variant gets a
one-sentence **idea** in the registry that says what it tries that the others don't.

## Register and check

1. Add or update the entry in `src/playground/registry.json`: `id`, `title`, `product`,
   `journey`, `route`, `file` (+ `files` for extra screens), `author`, `created`, `status`
   (`draft` → `in-review` → `ready-for-dev`), `idea`, `states`.
2. Add the route in `src/App.vue`.
3. Run `npm run check` (rules) and `npm run build`. Both must pass.
4. If you set `status: ready-for-dev`, run `npm run handoff` to write `handoff/<id>.md`.

## When Figma and the prototype disagree

Never patch a component's look from inside a prototype. Add a gap to the component's entry in
`registry/components.json` in plain language ("X is Y in Figma but the prototype needs Z because…")
and tell the person.
