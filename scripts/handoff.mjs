// Writes handoff/<id>.md for every prototype marked ready-for-dev (and src/generated/handoff.json
// so the site can show it). Everything is derived from the code, so the handoff can't drift:
// components used, their Figma nodes and audit status, tokens used, states, data shape.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname, resolve, relative } from 'node:path';

const root = resolve(new URL('..', import.meta.url).pathname);
const read = (p) => readFileSync(join(root, p), 'utf8');
const registry = JSON.parse(read('registry/components.json'));
const protos = JSON.parse(read('src/playground/registry.json')).prototypes;
const byTag = Object.fromEntries(registry.components.map((c) => [c.tag, c]));
const figma = (n) => (n ? `${registry.figmaFile}?node-id=${n.replace(':', '-')}` : '—');

// Follow local imports (.vue/.ts) from a screen to collect every file it renders.
function closure(file, seen = new Set()) {
  if (seen.has(file) || !existsSync(join(root, file))) return seen;
  seen.add(file);
  const src = read(file);
  for (const m of src.matchAll(/from ['"](\.{1,2}\/[^'"]+)['"]/g)) {
    let p = relative(root, resolve(join(root, dirname(file)), m[1]));
    if (p.startsWith('src/components')) continue;
    if (!/\.(vue|ts|json)$/.test(p)) p += existsSync(join(root, p + '.ts')) ? '.ts' : '.vue';
    closure(p, seen);
  }
  return seen;
}

const out = {};
mkdirSync(join(root, 'handoff'), { recursive: true });
for (const p of protos.filter((x) => x.status === 'ready-for-dev')) {
  const files = [...new Set([p.file, ...(p.files ?? [])].flatMap((f) => [...closure(f)]))];
  const src = files.map(read).join('\n');
  const used = [...new Set([...src.matchAll(/<(Hr[A-Z]\w+)/g)].map((m) => m[1]))].filter((t) => byTag[t]).sort();
  const tokens = [...new Set([...src.matchAll(/var\(--(hr-[\w-]+)\)/g)].map((m) => m[1]))].sort();
  const dataFile = files.find((f) => f.endsWith('data.ts'));
  const iface = dataFile ? (read(dataFile).match(/export interface Payment \{[\s\S]*?\n\}/) ?? [''])[0] : '';
  const questions = used.flatMap((t) => byTag[t].gaps.filter((g) => g.severity === 'needs-design-decision').map((g) => `- **${byTag[t].name}:** ${g.summary}`));

  const md = `# Handoff · ${p.title}

| | |
| --- | --- |
| Product | ${p.product} |
| PRD journeys | ${p.journey} |
| Status | ${p.status} |
| Owner | ${p.author} |
| Generated | ${new Date().toISOString().slice(0, 10)} |

${p.idea}

## Screens to build
${(p.screens ?? [p.route]).map((s) => `- \`#${s}\``).join('\n')}

Open the prototype and use the dark bar at the top to switch account state. Every state below is reachable from the URL.

## States
${p.states.map((s) => `- [ ] ${s}`).join('\n')}

## HighRise components (use these, don't rebuild them)
| Component | Code | Figma | Audit |
| --- | --- | --- | --- |
${used.map((t) => `| ${byTag[t].name} | \`${t}\` · \`${byTag[t].file}\` | ${byTag[t].figmaNode ? `[${byTag[t].figmaNode}](${figma(byTag[t].figmaNode)})` : 'not in Figma yet'} | ${byTag[t].status} |`).join('\n')}

## Tokens used directly by the screens
${tokens.length ? tokens.map((t) => `\`--${t}\``).join(' · ') : 'None. Screens style themselves only through components.'}

## Data each payment needs
\`\`\`ts
${iface.trim()}
\`\`\`
Money is USD. The fee shown to merchants is the sticker rate only; never show interchange, scheme fees or IC++ (PRD J8 rules).

## Behaviour to keep
- Mark an order paid from the AUTHORISATION webhook, not the browser redirect (PRD J6).
- Refund: show the refund fee and the total taken from the balance **before** the merchant confirms; take the fee only after REFUND succeeds, once per refund reference (PRD J8).
- Refund is disabled for disputed and failed payments and for people without the refund permission.
- Times in the sub-account's time zone.

## Open design questions on the components used
${questions.length ? questions.join('\n') : 'None.'}

## Source
${files.map((f) => `- \`${f}\``).join('\n')}
`;
  writeFileSync(join(root, 'handoff', `${p.id}.md`), md);
  out[p.id] = md;
  console.log(`handoff/${p.id}.md · ${used.length} components · ${p.states.length} states`);
}
mkdirSync(join(root, 'src/generated'), { recursive: true });
writeFileSync(join(root, 'src/generated/handoff.json'), JSON.stringify(out, null, 2) + '\n');
