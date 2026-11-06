# HighRise Lab (kondo)

HighRise components in real Vue 3 code, generated from the **HighRise 1.1** Figma file, plus a
playground where we prototype by building with those same components.

| Folder | What's in it |
| --- | --- |
| `tokens/primitives.json` | Every primitive token, extracted from Figma (colour, spacing, radius, type). |
| `src/tokens/` | Generated `primitives.css` + `semantic.css` (semantic roles derived from how 1.1 components use primitives). |
| `specs/` | Raw component specs pulled from Figma. Generators read these. |
| `src/components/` | One folder per HighRise component (`HrButton`, `HrInput`, ...). |
| `registry/` | The audit: status of each component against Figma, gaps in plain language, Figma node links. |
| `src/library/` | The component library site. |
| `src/playground/` | Prototypes built only from registry components. |

```bash
npm install
npm run dev      # regenerates tokens + button styles, then starts Vite
npm run build
```

## Rules
- Components only use semantic tokens (`--hr-surface-*`, `--hr-text-*`, ...) or primitives through their own spec. Prototypes never hard-code colours or sizes.
- When Figma and code disagree, the gap goes in `registry/` with a plain-language note. Code is never silently "fixed".
