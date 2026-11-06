# HighRise Lab — instructions for Claude

This repo is HighLevel's HighRise design system in Vue 3 code plus a prototyping playground.
Source of truth for visuals is the HighRise 1.1 Figma file
(https://www.figma.com/design/emjjdhZIMlqbszmzP9PdS6/HighRise-1.1).

- Building or changing a prototype → follow `.claude/skills/highrise-prototype/SKILL.md`.
- Adding or changing a component → follow `.claude/skills/highrise-component/SKILL.md`.
- Before finishing any change: `npm run check && npm run build`.
- Never "fix" a Figma mismatch silently. Record it in `registry/components.json` as a gap with a
  plain-language summary and the Figma node.
- Name it HighRise. Do not call this system Meridian.
