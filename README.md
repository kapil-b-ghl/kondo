# HighRise Lab (kondo)

HighRise components in real Vue 3 code, generated from the **HighRise 1.1** Figma file, a
library that audits itself against Figma, and a playground where we prototype by building
with those same components.

## Run it

```bash
npm install
npm run dev          # http://localhost:5173
```

| Page | URL |
| --- | --- |
| Library home | `#/` |
| A component (live examples + Figma audit) | `#/c/button`, `#/c/select`, … |
| Tokens | `#/tokens` |
| Every open question for Figma | `#/audit` |
| Playground | `#/playground` |
| FastPay dashboard, 3 variants | `#/p/fastpay/dashboard`, `#/p/fastpay/b/dashboard`, `#/p/fastpay/c/dashboard` |
| Any account state | add `?state=action` · `paused` · `negative` · `fresh` · `closing` |
| Payments, detail, refund | `#/p/fastpay/payments`, `#/p/fastpay/payments/pay_7Q2KX9?refund=1` |
| Engineering handoff | `#/handoff/fastpay-j8-payments` |

## Scripts

| Command | What it does |
| --- | --- |
| `npm run gen` | Regenerates token CSS, Button styles and handoff files from their sources. |
| `npm run check` | Guardrails: prototypes use only registry components and semantic tokens. |
| `npm run build` | `gen` + `check` + production build. |
| `npm run handoff` | Writes `handoff/<id>.md` for every prototype marked `ready-for-dev`. |
| `npm run build:artifact` | One self-contained HTML file for sharing (`dist-artifact/`). |
| `npm run mcp` | Starts the HighRise MCP server (see below). |

## Use HighRise from any project (MCP)

Nobody needs to clone this repo to use the components. Connect the MCP server and Claude can
pull real components, tokens and rules into whatever folder you're working in:

```bash
claude mcp add highrise -- npx -y github:kapil-b-ghl/kondo
```

Tools: `list_components`, `get_component` (source + dependencies + Figma node + audit gaps),
`get_tokens`, `get_rules`, `list_prototypes`, `get_handoff`.

## How it fits together

| Folder | What's in it |
| --- | --- |
| `tokens/primitives.json` | Every primitive token, extracted from Figma. |
| `src/tokens/` | Generated `primitives.css` + `semantic.css` (semantic roles derived from how 1.1 components use primitives). |
| `specs/` | Raw component specs pulled from Figma. Generators read these. |
| `src/components/` | One folder per HighRise component; `index.ts` is the only import path for prototypes. |
| `registry/` | The audit: status of each component against Figma, gaps in plain language, Figma node links. |
| `src/library/` | The library site. |
| `src/playground/` | Prototypes, plus `registry.json` (status, idea, states, author). |
| `.claude/skills/` | `highrise-prototype` and `highrise-component`: the process Claude follows here. |
| `mcp/server.mjs` | The MCP server. |
| `handoff/` | Generated handoff markdown per ready-for-dev prototype. |

## Rules
- Prototypes use only components from `src/components/index.ts` and semantic tokens. `npm run check` enforces it.
- When Figma and code disagree, the gap goes in `registry/` with a plain-language note. Code is never silently "fixed".
