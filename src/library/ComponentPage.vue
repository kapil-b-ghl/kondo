<script setup lang="ts">
import { computed } from 'vue';
import LibraryLayout from './LibraryLayout.vue';
import Demo from './Demo.vue';
import FigmaReference from './FigmaReference.vue';
import { HrTag, HrButton, HrEmptyState } from '../components';
import { components, slug, STATUS, SEVERITY, figmaLink, entryFor } from './lib';

const props = defineProps<{ id: string }>();
const c = computed(() => components.find((x) => slug(x.name) === props.id));
const order = ['likely-figma-error', 'needs-design-decision', 'info'];
const gaps = computed(() => (c.value ? [...c.value.gaps].sort((a, b) => order.indexOf(a.severity) - order.indexOf(b.severity)) : []));
const fig = computed(() => (c.value ? entryFor(c.value) : undefined));
const usage = computed(() => (c.value ? `import { ${c.value.tag} } from '@/components';` : ''));
</script>

<template>
  <LibraryLayout>
    <HrEmptyState v-if="!c" title="Component not found" text="Pick one from the list." />
    <article v-else class="cp">
      <header class="cp__head">
        <div class="cp__kicker">{{ c.group }}</div>
        <h1>{{ c.name }}</h1>
        <div class="cp__meta">
          <HrTag :color="STATUS[c.status]?.color ?? 'gray'" dot>{{ STATUS[c.status]?.label ?? c.status }}</HrTag>
          <code>{{ c.tag }}</code>
          <code>{{ c.file }}</code>
          <HrButton v-if="figmaLink(c.figmaNode)" variant="link" size="sm" :href="figmaLink(c.figmaNode)!">Open Figma node {{ c.figmaNode }}</HrButton>
        </div>
        <p class="cp__cov">{{ c.coverage }}</p>
      </header>

      <section class="cp__demo" aria-label="Live example"><Demo :tag="c.tag" /></section>

      <section>
        <h2>Use it</h2>
        <pre class="cp__code"><code>{{ usage }}</code></pre>
      </section>

      <section v-if="fig">
        <h2>In Figma</h2>
        <FigmaReference :entry="fig" />
      </section>

      <section>
        <h2>Audit against Figma <span class="cp__count">{{ gaps.length }}</span></h2>
        <p v-if="!gaps.length" class="muted">No differences found.</p>
        <ul v-else class="gaps">
          <li v-for="(g, i) in gaps" :key="i" :class="`is-${g.severity}`">
            <HrTag :color="SEVERITY[g.severity]?.color ?? 'gray'" size="xs">{{ SEVERITY[g.severity]?.label ?? g.severity }}</HrTag>
            <span>{{ g.summary }}</span>
          </li>
        </ul>
      </section>
    </article>
  </LibraryLayout>
</template>

<style scoped>
.cp { max-width: 980px; display: flex; flex-direction: column; gap: 32px; }
.cp__kicker { font: var(--hr-text-xs); font-weight: var(--hr-font-weight-semibold); letter-spacing: 0.06em; text-transform: uppercase; color: var(--hr-text-neutral-base); }
h1 { margin: 4px 0 12px; font: var(--hr-font-size-6xl)/var(--hr-font-line-height-6xl) var(--hr-font-family); font-weight: var(--hr-font-weight-bold); letter-spacing: -0.02em; }
.cp__meta { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; }
code { font: var(--hr-font-size-sm)/1.4 ui-monospace, SFMono-Regular, Menlo, monospace; padding: 2px 6px; border-radius: 4px; background: var(--hr-surface-sunken); color: var(--hr-text-neutral-body-1); }
.cp__cov { margin: 12px 0 0; max-width: 680px; font: var(--hr-text-2xl); color: var(--hr-text-neutral-body-2); }
.cp__demo { padding: 28px; border: 1px solid var(--hr-border-neutral-subtle-1); border-radius: 12px; background: var(--hr-surface-base); background-image: radial-gradient(var(--hr-border-neutral-subtle-1) 1px, transparent 1px); background-size: 16px 16px; }
h2 { display: flex; align-items: center; gap: 8px; margin: 0 0 12px; font: var(--hr-text-3xl); font-weight: var(--hr-font-weight-semibold); }
.cp__count { min-width: 24px; padding: 0 8px; border-radius: 12px; background: var(--hr-surface-sunken); font: var(--hr-text-sm); font-weight: var(--hr-font-weight-semibold); text-align: center; }
.cp__code { margin: 0; padding: 14px 16px; border-radius: 8px; background: var(--hr-surface-sunken); overflow-x: auto; }
.cp__code code { padding: 0; background: none; font-size: var(--hr-font-size-md); }
.gaps { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; }
.gaps li { display: grid; grid-template-columns: 240px minmax(0, 1fr); gap: 16px; align-items: start; padding: 12px 0; border-bottom: 1px solid var(--hr-border-neutral-subtle-1); font: var(--hr-text-lg); color: var(--hr-text-neutral-body-1); }
.muted { font: var(--hr-text-lg); color: var(--hr-text-neutral-base); }
@media (max-width: 760px) { .gaps li { grid-template-columns: 1fr; gap: 6px; } .cp__demo { padding: 16px; } }
.gaps li > :first-child, .au__text > :first-child { justify-self: start; align-self: start; }
</style>
