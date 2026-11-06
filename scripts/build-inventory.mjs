// Joins the full HighRise 1.1 Figma inventory (specs/figma-inventory.raw.json, pulled with the
// Figma MCP) with the code registry, so the library can list every Figma component — built or not.
// Output: registry/figma-inventory.json (read by the library and the MCP server).
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => JSON.parse(readFileSync(join(root, p), 'utf8'));
const raw = read('specs/figma-inventory.raw.json');
const registry = read('registry/components.json');
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const preview = (id) => (id && existsSync(join(root, 'src/assets/figma', `${id.replace(':', '-')}.webp`)) ? `${id.replace(':', '-')}.webp` : null);

const claimed = new Set();
const entries = raw.map((p) => {
  const ids = new Set([p.id, ...p.sets.map((s) => s.id)]);
  const built = registry.components.filter((c) => c.figmaNode && ids.has(c.figmaNode));
  built.forEach((c) => claimed.add(c.tag));
  const main = p.sets[0]?.id ?? null;
  return {
    slug: slug(p.p),
    name: p.p,
    section: p.sec,
    page: p.id,
    main,
    preview: preview(main),
    variants: p.sets.reduce((n, s) => n + s.v, 0),
    sets: p.sets.map((s) => ({ name: s.n, node: s.id, variants: s.v, axes: [...(s.ax ?? '').matchAll(/\s*(.+?):(\d+)/g)].map((m) => ({ name: m[1].replace(/_/g, ' '), values: Number(m[2]) })) })),
    built: built.map((c) => c.tag),
  };
});

const components = entries.filter((e) => e.section !== 'Tokens');
const published = components.filter((e) => e.sets.length);
const out = {
  figmaFile: registry.figmaFile,
  source: 'HighRise 1.1 · every page and published component set, pulled with the Figma MCP',
  sections: ['Elements', 'Components', 'Groups', 'Medium Groups', 'Large Groups', 'Super Groups', 'Backlog', 'Tokens'],
  coverage: { figmaComponents: published.length, inCode: published.filter((e) => e.built.length).length, pages: components.length },
  codeOnly: registry.components.filter((c) => !claimed.has(c.tag)).map((c) => c.tag),
  entries,
};
writeFileSync(join(root, 'registry/figma-inventory.json'), JSON.stringify(out, null, 2) + '\n');
console.log(`figma-inventory.json written · ${out.coverage.inCode} of ${out.coverage.figmaComponents} Figma components in code · code-only: ${out.codeOnly.join(', ') || 'none'}`);
