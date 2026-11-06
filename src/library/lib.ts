// Library data: the registry, the button audit and the token files, joined for the site.
import registry from '../../registry/components.json';
import buttonAudit from '../../registry/button.audit.json';
import primitives from '../../tokens/primitives.json';
import semanticCss from '../tokens/semantic.css?raw';
import prototypes from '../playground/registry.json';

export interface Gap { severity: string; summary: string }
export interface Comp { name: string; tag: string; file: string; group: string; figmaNode: string | null; status: string; coverage: string; gaps: Gap[]; audit?: string }

export const FIGMA = registry.figmaFile;
export const components: Comp[] = (registry.components as Comp[]).map((c) =>
  c.tag === 'HrButton' ? { ...c, gaps: (buttonAudit.gaps as (Gap & { summary: string })[]).map((g) => ({ severity: g.severity, summary: g.summary })) } : c,
);
export const GROUPS = ['Elements', 'Components', 'Groups', 'Super Groups'];
export const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
export const figmaLink = (node: string | null) => (node ? `${FIGMA}?node-id=${node.replace(':', '-')}` : null);

export const STATUS: Record<string, { label: string; color: 'success' | 'primary' | 'warning' | 'gray' | 'purple' }> = {
  matches: { label: 'Matches Figma', color: 'success' },
  'matches-with-open-questions': { label: 'Matches · open questions', color: 'primary' },
  partial: { label: 'Partial', color: 'warning' },
  'from-prototype': { label: 'Not in Figma yet', color: 'purple' },
  'not-started': { label: 'Not started', color: 'gray' },
};
export const SEVERITY: Record<string, { label: string; color: 'error' | 'warning' | 'gray' }> = {
  'likely-figma-error': { label: 'Likely Figma error · fixed in code', color: 'error' },
  'needs-design-decision': { label: 'Needs a design decision', color: 'warning' },
  info: { label: 'Note', color: 'gray' },
};

export const palette = primitives.color as Record<string, string[]>;
export const steps = primitives.colorSteps;
export const prim = primitives;
export const semantic = [...semanticCss.matchAll(/--(hr-[\w-]+):[ \t]*([^;]+);[ \t]*(\/\*[ \t]*(.*?)[ \t]*\*\/)?/g)].map((m) => ({
  name: m[1], value: m[2].trim(), note: m[4] ?? '',
}));
export const semanticColors = semantic.filter((t) => !t.value.includes('font-size'));
export const protos = prototypes.prototypes;

export const totals = {
  components: components.length,
  gaps: components.reduce((n, c) => n + c.gaps.filter((g) => g.severity !== 'info').length, 0),
  screens: protos.length,
  tokens: Object.values(palette).reduce((n, a) => n + a.length, 2) + Object.keys(prim.spacing).length + Object.keys(prim.radius).length + Object.keys(prim.fontSize).length,
};
