<script setup lang="ts">
// The Figma side of a component: preview of the main component set, and every set on that Figma
// page with its variant axes and a link to the node.
import { HrButton } from '../components';
import { figmaLink, previewUrl, type FigmaEntry } from './lib';

const props = defineProps<{ entry: FigmaEntry }>();
const img = previewUrl(props.entry.preview);
</script>

<template>
  <div class="fr">
    <figure v-if="img" class="fr__img">
      <a :href="figmaLink(entry.main)!" class="fr__open" :aria-label="`Open ${entry.sets[0]?.name} in Figma`"><img :src="img" :alt="`${entry.sets[0]?.name} component set in the HighRise 1.1 Figma file`" loading="lazy" /></a>
      <figcaption>Figma · {{ entry.sets[0]?.name }} · {{ entry.sets[0]?.variants }} variants</figcaption>
    </figure>
    <p v-else-if="!entry.sets.length" class="fr__none">This Figma page has no published component yet.</p>
    <table v-if="entry.sets.length" class="fr__sets">
      <thead><tr><th>Component set</th><th>Variants</th><th>Properties</th><th><span class="hr-sr-only">Figma link</span></th></tr></thead>
      <tbody>
        <tr v-for="s in entry.sets" :key="s.node">
          <td class="fr__name">{{ s.name }}</td>
          <td class="fr__num">{{ s.variants }}</td>
          <td><span v-for="a in s.axes" :key="a.name" class="fr__ax">{{ a.name }} <b>{{ a.values }}</b></span><span v-if="!s.axes.length" class="fr__muted">None</span></td>
          <td><HrButton variant="link" theme="neutral" size="xs" :href="figmaLink(s.node)!">{{ s.node }}</HrButton></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.fr { display: flex; flex-direction: column; gap: 16px; }
.fr__img { margin: 0; padding: 20px; border: 1px solid var(--hr-border-neutral-subtle-1); border-radius: 12px; background: var(--hr-surface-base); display: flex; flex-direction: column; align-items: center; gap: 12px; }
.fr__img img { display: block; max-width: 100%; max-height: 420px; object-fit: contain; border-radius: 6px; }
.fr__open { display: block; border-radius: 6px; }
.fr__open:focus-visible { outline: none; box-shadow: var(--hr-focus-ring-primary); }
.fr__img figcaption { align-self: flex-start; font: var(--hr-text-sm); color: var(--hr-text-neutral-base); }
.fr__none { margin: 0; padding: 20px; border: 1px dashed var(--hr-border-neutral-base); border-radius: 12px; font: var(--hr-text-lg); color: var(--hr-text-neutral-base); }
.fr__sets { width: 100%; border-collapse: collapse; font: var(--hr-text-md); }
.fr__sets th { text-align: left; padding: 8px 12px 8px 0; font: var(--hr-text-xs); font-weight: var(--hr-font-weight-semibold); letter-spacing: 0.06em; text-transform: uppercase; color: var(--hr-text-neutral-base); border-bottom: 1px solid var(--hr-border-neutral-subtle-1); }
.fr__sets td { padding: 10px 12px 10px 0; border-bottom: 1px solid var(--hr-border-neutral-subtle-1); vertical-align: top; color: var(--hr-text-neutral-body-1); }
.fr__name { font-weight: var(--hr-font-weight-medium); color: var(--hr-text-neutral-title-1) !important; }
.fr__num { font-variant-numeric: tabular-nums; }
.fr__ax { display: inline-flex; gap: 4px; margin: 0 6px 4px 0; padding: 1px 8px; border-radius: 4px; background: var(--hr-surface-sunken); font: var(--hr-text-sm); white-space: nowrap; }
.fr__ax b { font-weight: var(--hr-font-weight-semibold); }
.fr__muted { color: var(--hr-text-neutral-base); }
@media (max-width: 760px) { .fr__sets th:nth-child(3), .fr__sets td:nth-child(3) { display: none; } }
</style>
