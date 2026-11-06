---
name: highrise-component
description: Add or update a HighRise component in src/components from the HighRise 1.1 Figma file, exactly to spec, with an audit entry. Use when a prototype needs a component that isn't in the registry, or when Figma changed.
---

# Adding a HighRise component

1. **Find it in Figma.** Use the Figma MCP on file `emjjdhZIMlqbszmzP9PdS6`. Locate the
   component set (page list → component set id). Record the node id.
2. **Extract, don't eyeball.** Read the variant axes and, for each variant that matters,
   the fills, strokes, padding, radius, effects and text styles with the variable names they
   are bound to (read-only `use_figma` script, see `scripts/` and `specs/` for examples). Save
   large matrices to `specs/<component>.figma.json` so the styles can be regenerated.
3. **Build in `src/components/<name>/Hr<Name>.vue`.**
   - Colours map Figma variables to `--hr-color-*` primitives inside the component only.
   - Every Figma state is reachable: hover, active, focus-visible, disabled, error, loading.
   - Accessible by default: labels, `aria-*`, keyboard, focus ring from the Figma focus style.
   - Header comment: Figma node id, sizes, and anything a user of the component must know.
4. **Export it** from `src/components/index.ts`.
5. **Audit it** in `registry/components.json`: `status` (`matches`,
   `matches-with-open-questions`, `partial`, `from-prototype`), `coverage`, and `gaps`. Each
   gap is one plain sentence a designer can act on, with `severity`
   (`likely-figma-error`, `needs-design-decision`, `info`).
6. **Show it** on the library page and run `npm run check && npm run build`.

If something is not in Figma at all, build it from semantic tokens, set `status:
from-prototype` and add a gap saying it should be added to Figma.
