// Guardrail check for playground prototypes. Run: npm run check
// Fails (exit 1) when a prototype breaks a HighRise rule, with a plain-language message
// and the line, so a designer (or Claude) can fix it without guessing.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const pg = join(root, 'src/playground');
const registry = JSON.parse(readFileSync(join(pg, 'registry.json'), 'utf8'));

const walk = (d) => readdirSync(d).flatMap((f) => {
  const p = join(d, f);
  return statSync(p).isDirectory() ? (f === '_kit' ? [] : walk(p)) : [p];
});
const files = walk(pg).filter((f) => /\.(vue|ts)$/.test(f));

const RULES = [
  { id: 'no-raw-colour', re: /#[0-9a-fA-F]{3,8}\b(?![\w-]*\})|rgba?\(|hsla?\(/, msg: 'Hard-coded colour. Use a semantic token such as var(--hr-text-neutral-base) or var(--hr-border-neutral-subtle-1).' },
  { id: 'no-primitive-token', re: /--hr-color-/, msg: 'Primitive colour token in a prototype. Use the semantic token for the role (surface, text, background, border, icon).' },
  { id: 'no-raw-font-size', re: /font(-size)?\s*:\s*[^;]*\d+px/, msg: 'Hard-coded font size. Use a type token such as var(--hr-text-lg) or var(--hr-text-2xl).' },
  { id: 'no-raw-controls', re: /<(button|input|select|textarea|table)[\s>]/, msg: 'Raw HTML control. Use HrButton, HrInput, HrSelect, HrTable so states and accessibility come for free.' },
  { id: 'import-from-registry', re: /from ['"][./]+components\/(?!index)[^'"]+\.vue['"]/, msg: 'Deep import of a component file. Import from the components index so only registered components are used.', skip: (line) => /^\s*import type /.test(line) },
];

const problems = [];
for (const f of files) {
  const lines = readFileSync(f, 'utf8').split('\n');
  lines.forEach((line, i) => {
    if (/^\s*(\/\/|\*|\/\*)/.test(line)) return; // comments explain intent; they don't ship
    for (const r of RULES) if (r.re.test(line) && !(r.skip && r.skip(line))) problems.push({ file: relative(root, f), line: i + 1, rule: r.id, msg: r.msg, code: line.trim().slice(0, 120) });
  });
}
// Every screen file (src/playground/<product>/<Screen>.vue) must be registered so it shows up
// in the playground and in the history.
const registered = new Set(registry.prototypes.flatMap((p) => [p.file, ...(p.files ?? [])]));
for (const f of files.filter((f) => /src\/playground\/[\w-]+\/[A-Z]\w*\.vue$/.test(f))) {
  const rel = relative(root, f);
  if (!registered.has(rel)) problems.push({ file: rel, line: 1, rule: 'registered', msg: 'Prototype screen is not in src/playground/registry.json. Add it with an id, idea, author and status.', code: '' });
}

if (problems.length) {
  console.log(`\n✗ ${problems.length} HighRise rule${problems.length > 1 ? 's' : ''} broken in the playground:\n`);
  for (const p of problems) console.log(`  ${p.file}:${p.line}  [${p.rule}]\n    ${p.msg}\n    ${p.code}\n`);
  process.exit(1);
}
console.log(`✓ Playground follows the HighRise rules (${files.length} files checked).`);
