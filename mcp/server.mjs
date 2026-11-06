#!/usr/bin/env node
// HighRise MCP server. Connect it to Claude (Claude Code, Claude desktop) and the real HighRise
// components, tokens, rules and prototypes come to whatever folder you're working in — no clone.
//
//   claude mcp add highrise -- npx -y github:kapil-b-ghl/kondo
//
// Tools: list_components · get_component · get_tokens · get_rules · list_prototypes · get_handoff
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const text = (t) => ({ content: [{ type: 'text', text: t }] });
const registry = () => json('registry/components.json');

function findComponent(q) {
  const s = q.toLowerCase().replace(/^hr/, '');
  return registry().components.find((c) => c.tag.toLowerCase().replace(/^hr/, '') === s || c.name.toLowerCase() === q.toLowerCase());
}
// A component plus the files it imports from src/components (e.g. HrInput → HrField),
// so the caller gets everything it needs to drop into another project.
function componentFiles(file, seen = new Set()) {
  if (seen.has(file)) return seen;
  seen.add(file);
  const src = read(file);
  for (const m of src.matchAll(/(?:from |import )['"](\.{1,2}\/[^'"]+)['"]/g)) {
    const p = relative(root, resolve(join(root, dirname(file)), m[1]));
    if (existsSync(join(root, p)) && p.startsWith('src/components')) componentFiles(p, seen);
  }
  return seen;
}

const server = new McpServer({ name: 'highrise', version: '0.1.0' }, {
  instructions: 'HighRise is HighLevel\'s design system. Before building UI, call get_rules, then list_components. Use only HighRise components and semantic tokens; if something is missing, say so instead of inventing it.',
});

server.tool('list_components', 'List every HighRise component with its tag, group, audit status against Figma and what it covers.', {}, async () => {
  const r = registry();
  return text(r.components.map((c) => `${c.tag} — ${c.name} [${c.group}] · ${c.status}${c.figmaNode ? ` · Figma ${c.figmaNode}` : ''}\n  ${c.coverage}`).join('\n'));
});

server.tool('list_figma_components', 'List every component in the HighRise 1.1 Figma file (grouped like the file) and whether it is built in code yet. Use it to tell what exists in Figma but is not available to prototypes.', {}, async () => {
  const f = JSON.parse(read('registry/figma-inventory.json'));
  const lines = [`${f.coverage.inCode} of ${f.coverage.figmaComponents} published Figma components are in code.`];
  for (const sec of f.sections) {
    const es = f.entries.filter((e) => e.section === sec);
    if (!es.length) continue;
    lines.push(`\n## ${sec}`);
    for (const e of es) lines.push(`- ${e.name}: ${e.built.length ? `in code as ${e.built.join(', ')}` : e.sets.length ? 'NOT BUILT' : 'nothing published in Figma'}${e.main ? ` · Figma ${e.main} · ${e.variants} variants` : ''}`);
  }
  return text(lines.join('\n'));
});

server.tool('get_component', 'Get a HighRise component\'s full source (and the files it depends on), its Figma node and the open audit gaps.', { name: z.string().describe('Tag or name, e.g. "HrButton" or "Select"') }, async ({ name }) => {
  const c = findComponent(name);
  if (!c) return text(`No component called "${name}". Call list_components to see what exists.`);
  const files = [...componentFiles(c.file)];
  if (c.tag === 'HrButton') files.push('src/components/button/button.generated.css');
  const gaps = c.tag === 'HrButton' ? json('registry/button.audit.json').gaps : c.gaps;
  const body = files.map((f) => `\n--- ${f} ---\n${read(f)}`).join('\n');
  return text(`# ${c.name} (${c.tag})\nStatus: ${c.status}\nFigma: ${c.figmaNode ? `${registry().figmaFile}?node-id=${c.figmaNode.replace(':', '-')}` : 'not in Figma yet'}\nCoverage: ${c.coverage}\n\nOpen gaps:\n${gaps.map((g) => `- [${g.severity}] ${g.summary}`).join('\n') || '- none'}\n\nNeeds the token files from get_tokens.\n${body}`);
});

server.tool('get_tokens', 'Get the HighRise token CSS: primitives (exact Figma values) and semantic roles. Prototypes must use semantic tokens only.', { layer: z.enum(['semantic', 'primitives', 'both']).default('both') }, async ({ layer }) => {
  const parts = [];
  if (layer !== 'primitives') parts.push('/* semantic.css */\n' + read('src/tokens/semantic.css'));
  if (layer !== 'semantic') parts.push('/* primitives.css (generated from Figma) */\n' + (existsSync(join(root, 'src/tokens/primitives.css')) ? read('src/tokens/primitives.css') : 'Run npm run tokens to generate.'));
  return text(parts.join('\n\n'));
});

server.tool('get_rules', 'Get the rules and process for building HighRise prototypes and components (the guardrail skills).', {}, async () =>
  text(['.claude/skills/highrise-prototype/SKILL.md', '.claude/skills/highrise-component/SKILL.md'].map((f) => `--- ${f} ---\n${read(f)}`).join('\n\n')));

server.tool('list_prototypes', 'List playground prototypes with status (draft / in-review / ready-for-dev), journey, idea and states.', {}, async () =>
  text(json('src/playground/registry.json').prototypes.map((p) => `${p.id} · ${p.status}\n  ${p.title} (${p.journey})\n  ${p.idea}\n  route #${p.route} · states: ${p.states.join(', ')}`).join('\n\n')));

server.tool('get_handoff', 'Get the engineering handoff markdown for a ready-for-dev prototype.', { id: z.string() }, async ({ id }) => {
  const f = `handoff/${id}.md`;
  if (existsSync(join(root, f))) return text(read(f));
  const ready = existsSync(join(root, 'handoff')) ? readdirSync(join(root, 'handoff')).map((x) => x.replace(/\.md$/, '')) : [];
  return text(`No handoff for "${id}". Ready: ${ready.join(', ') || 'none'}.`);
});

await server.connect(new StdioServerTransport());
