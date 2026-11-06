<script setup lang="ts">
/** HrTimeline — vertical event list (payment history, dispute history). Not in HighRise 1.1 Figma; built from tokens. */
export interface TimelineItem { text: string; when: string; tone?: 'neutral' | 'success' | 'warning' | 'error' | 'primary' }
defineProps<{ items: TimelineItem[] }>();
</script>

<template>
  <ol class="hr-tl">
    <li v-for="(t, i) in items" :key="i" class="hr-tl__item">
      <span class="hr-tl__dot" :class="`is-${t.tone ?? 'neutral'}`" aria-hidden="true" />
      <div><div class="hr-tl__text">{{ t.text }}</div><div class="hr-tl__when">{{ t.when }}</div></div>
    </li>
  </ol>
</template>

<style>
.hr-tl { margin: 0; padding: 0; list-style: none; font-family: var(--hr-font-family); }
.hr-tl__item { position: relative; display: flex; gap: 12px; padding-bottom: 16px; }
.hr-tl__item:not(:last-child)::before { content: ''; position: absolute; left: 4px; top: 14px; bottom: 0; width: 2px; background: var(--hr-color-neutral-gray-200); }
.hr-tl__dot { flex: none; width: 10px; height: 10px; margin-top: 5px; border-radius: 50%; background: var(--hr-color-neutral-gray-300); }
.hr-tl__dot.is-success { background: var(--hr-color-secondary-success-500); }
.hr-tl__dot.is-warning { background: var(--hr-color-secondary-warning-500); }
.hr-tl__dot.is-error { background: var(--hr-color-secondary-error-500); }
.hr-tl__dot.is-primary { background: var(--hr-color-primary-blue-500); }
.hr-tl__text { font: var(--hr-text-lg); color: var(--hr-text-neutral-title-1); }
.hr-tl__when { font: var(--hr-text-md); color: var(--hr-text-neutral-base); }
</style>
