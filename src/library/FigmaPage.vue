<script setup lang="ts">
// A Figma component that isn't built in code yet: what Figma has, and how to get it built.
import { computed } from 'vue';
import LibraryLayout from './LibraryLayout.vue';
import FigmaReference from './FigmaReference.vue';
import { HrTag, HrButton, HrEmptyState } from '../components';
import { figma, figmaLink } from './lib';

const props = defineProps<{ id: string }>();
const e = computed(() => figma.entries.find((x) => x.slug === props.id));
const ask = computed(() => (e.value ? `Build the HighRise ${e.value.name} component from Figma node ${e.value.main ?? e.value.page}.` : ''));
</script>

<template>
  <LibraryLayout>
    <HrEmptyState v-if="!e" title="Not in the Figma inventory" text="Pick a component from the list." />
    <article v-else class="fp">
      <header>
        <div class="fp__kicker">{{ e.section }}</div>
        <h1>{{ e.name }}</h1>
        <div class="fp__meta">
          <HrTag :color="e.section === 'Tokens' ? 'primary' : 'gray'" dot>{{ e.section === 'Tokens' ? 'Foundation' : e.sets.length ? 'Not built yet' : 'Nothing published in Figma yet' }}</HrTag>
          <span v-if="e.sets.length" class="fp__count">{{ e.sets.length }} component {{ e.sets.length === 1 ? 'set' : 'sets' }} · {{ e.variants.toLocaleString() }} variants</span>
          <HrButton variant="link" size="sm" :href="figmaLink(e.page)!">Open Figma page</HrButton>
        </div>
        <p v-if="e.section === 'Tokens'" class="fp__lede">Part of the foundations. Type and colour are in <a href="#/tokens">Tokens</a>; icons use a stand-in set until the HighRise icon library is exported.</p>
        <p v-else-if="e.sets.length" class="fp__lede">This is in Figma but not in code yet, so prototypes can't use it. To build it, ask Claude in this repo:</p>
        <p v-else class="fp__lede">The Figma page exists but has no published component set, so there is nothing to build from yet.</p>
        <pre v-if="e.sets.length && e.section !== 'Tokens'" class="fp__ask"><code>{{ ask }}</code></pre>
      </header>
      <FigmaReference :entry="e" />
    </article>
  </LibraryLayout>
</template>

<style scoped>
.fp { max-width: 980px; display: flex; flex-direction: column; gap: 28px; }
.fp__kicker { font: var(--hr-text-xs); font-weight: var(--hr-font-weight-semibold); letter-spacing: 0.06em; text-transform: uppercase; color: var(--hr-text-neutral-base); }
h1 { margin: 4px 0 12px; font: var(--hr-font-size-6xl)/var(--hr-font-line-height-6xl) var(--hr-font-family); font-weight: var(--hr-font-weight-bold); letter-spacing: -0.02em; }
.fp__meta { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; }
.fp__count { font: var(--hr-text-md); color: var(--hr-text-neutral-base); }
.fp__lede { margin: 14px 0 0; max-width: 680px; font: var(--hr-text-2xl); color: var(--hr-text-neutral-body-2); }
.fp__lede a { color: var(--hr-text-primary-body-1); }
.fp__ask { margin: 10px 0 0; padding: 12px 14px; border-radius: 8px; background: var(--hr-surface-sunken); white-space: pre-wrap; }
.fp__ask code { font: var(--hr-font-size-md)/1.5 ui-monospace, SFMono-Regular, Menlo, monospace; color: var(--hr-text-neutral-body-1); }
</style>
