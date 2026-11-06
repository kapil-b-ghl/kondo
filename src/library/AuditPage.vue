<script setup lang="ts">
// Every open question for the HighRise Figma file in one list, worst first — the "drift as a list" view.
import { computed, ref } from 'vue';
import LibraryLayout from './LibraryLayout.vue';
import { HrTag, HrTabs, HrButton } from '../components';
import { components, slug, SEVERITY, figmaLink, coverage, figma } from './lib';

const filter = ref('decide');
const all = computed(() => components.flatMap((c) => c.gaps.map((g) => ({ ...g, comp: c }))));
const list = computed(() => all.value.filter((g) => (filter.value === 'decide' ? g.severity === 'needs-design-decision' : filter.value === 'fixed' ? g.severity === 'likely-figma-error' : filter.value === 'info' ? g.severity === 'info' : true)));
const missing = figma.entries.filter((e) => e.section !== 'Tokens' && e.sets.length && !e.built.length);
const count = (s: string) => all.value.filter((g) => g.severity === s).length;
</script>

<template>
  <LibraryLayout>
    <article class="au">
      <h1>Figma audit</h1>
      <p class="lede">Where code and the HighRise 1.1 Figma file disagree, written so a designer can act on each line. Code never hides a difference: it either matches Figma or says why not.</p>
      <div class="au__cov">
        <div class="au__covhead"><b>{{ coverage.inCode }} of {{ coverage.figmaComponents }}</b> published Figma components are in code<span>{{ Math.round((coverage.inCode / coverage.figmaComponents) * 100) }}%</span></div>
        <div class="au__bar" role="progressbar" :aria-valuenow="coverage.inCode" aria-valuemin="0" :aria-valuemax="coverage.figmaComponents" aria-label="Figma components in code"><span :style="{ width: (coverage.inCode / coverage.figmaComponents) * 100 + '%' }" /></div>
        <details><summary>{{ missing.length }} not built yet</summary><div class="au__missing"><a v-for="e in missing" :key="e.page" :href="`#/f/${e.slug}`">{{ e.name }}</a></div></details>
      </div>
      <HrTabs v-model="filter" :tabs="[
        { key: 'decide', label: 'Needs a design decision', count: count('needs-design-decision') },
        { key: 'fixed', label: 'Likely Figma errors', count: count('likely-figma-error') },
        { key: 'info', label: 'Notes', count: count('info') },
        { key: 'all', label: 'All', count: all.length },
      ]" />
      <ul class="au__list">
        <li v-for="(g, i) in list" :key="i">
          <div class="au__comp">
            <a :href="`#/c/${slug(g.comp.name)}`">{{ g.comp.name }}</a>
            <HrButton v-if="figmaLink(g.comp.figmaNode)" variant="link" theme="neutral" size="xs" :href="figmaLink(g.comp.figmaNode)!">Figma</HrButton>
          </div>
          <div class="au__text"><HrTag :color="SEVERITY[g.severity]?.color ?? 'gray'" size="xs">{{ SEVERITY[g.severity]?.label }}</HrTag><span>{{ g.summary }}</span></div>
        </li>
      </ul>
    </article>
  </LibraryLayout>
</template>

<style scoped>
.au { max-width: 1040px; display: flex; flex-direction: column; gap: 20px; }
h1 { margin: 0; font: var(--hr-font-size-6xl)/var(--hr-font-line-height-6xl) var(--hr-font-family); font-weight: var(--hr-font-weight-bold); letter-spacing: -0.02em; }
.lede { margin: 0; max-width: 640px; font: var(--hr-text-2xl); color: var(--hr-text-neutral-body-2); }
.au__cov { display: flex; flex-direction: column; gap: 8px; padding: 16px; border: 1px solid var(--hr-border-neutral-subtle-1); border-radius: 12px; }
.au__covhead { display: flex; gap: 6px; font: var(--hr-text-lg); color: var(--hr-text-neutral-body-1); }
.au__covhead span { margin-left: auto; font-weight: var(--hr-font-weight-semibold); color: var(--hr-text-neutral-title-1); }
.au__bar { height: 8px; border-radius: 4px; background: var(--hr-background-neutral-subtle-2); overflow: hidden; }
.au__bar span { display: block; height: 100%; background: var(--hr-background-primary-default); }
.au__cov summary { cursor: pointer; font: var(--hr-text-md); color: var(--hr-text-neutral-body-2); }
.au__missing { display: flex; flex-wrap: wrap; gap: 6px 14px; padding-top: 8px; }
.au__missing a { font: var(--hr-text-md); color: var(--hr-text-primary-body-1); text-decoration: none; }
.au__list { list-style: none; margin: 0; padding: 0; }
.au__list li { display: grid; grid-template-columns: 200px minmax(0, 1fr); gap: 16px; padding: 14px 0; border-bottom: 1px solid var(--hr-border-neutral-subtle-1); }
.au__comp { display: flex; flex-direction: column; gap: 2px; align-items: flex-start; }
.au__comp a { font: var(--hr-text-lg); font-weight: var(--hr-font-weight-semibold); color: var(--hr-text-primary-body-1); text-decoration: none; }
.au__text { display: flex; flex-direction: column; gap: 6px; align-items: flex-start; font: var(--hr-text-lg); color: var(--hr-text-neutral-body-1); }
@media (max-width: 760px) { .au__list li { grid-template-columns: 1fr; } }
.gaps li > :first-child, .au__text > :first-child { justify-self: start; align-self: start; }
</style>
