<script setup lang="ts">
/**
 * HrStat — a KPI tile: label, value, note. Figma "Statistic" (30512:10237) is in the Super Groups
 * backlog, so values follow the FastPay prototype: label 13/18 gray-500, value 24/32 Semi Bold.
 * Use `tone` for the note only (never colour the value except `negative`).
 */
export type StatTone = 'neutral' | 'success' | 'warning' | 'error' | 'primary';
withDefaults(defineProps<{ label: string; value: string; note?: string; tone?: StatTone; negative?: boolean; href?: string }>(), { tone: 'neutral' });
defineEmits<{ click: [MouseEvent] }>();
</script>

<template>
  <component :is="href ? 'a' : 'div'" :href="href" class="hr-stat" :class="{ 'hr-stat--link': href }">
    <span class="hr-stat__label">{{ label }}</span>
    <span class="hr-stat__value" :class="{ 'is-negative': negative }">{{ value }}</span>
    <span v-if="note || $slots.note" class="hr-stat__note" :class="`is-${tone}`"><slot name="note">{{ note }}</slot></span>
  </component>
</template>

<style>
.hr-stat {
  display: flex; flex-direction: column; gap: 4px; padding: 16px 20px; min-width: 0;
  background: var(--hr-surface-raised); border: 1px solid var(--hr-border-neutral-subtle-1); border-radius: 12px;
  font-family: var(--hr-font-family); color: inherit; text-decoration: none;
}
.hr-stat--link { transition: border-color 120ms, box-shadow 120ms; }
.hr-stat--link:hover { border-color: var(--hr-border-neutral-base); box-shadow: var(--hr-shadow-xs); }
.hr-stat--link:focus-visible { outline: none; box-shadow: var(--hr-focus-ring-primary); }
.hr-stat__label { font: var(--hr-text-md); color: var(--hr-text-neutral-base); }
.hr-stat__value { font: var(--hr-text-5xl); font-weight: var(--hr-font-weight-semibold); color: var(--hr-text-neutral-title-1); font-variant-numeric: tabular-nums; }
.hr-stat__value.is-negative { color: var(--hr-text-error-body-1); }
.hr-stat__note { font: var(--hr-text-md); color: var(--hr-text-neutral-base); }
.hr-stat__note.is-success { color: var(--hr-text-success-body-1); }
.hr-stat__note.is-warning { color: var(--hr-text-warning-body-1); }
.hr-stat__note.is-error { color: var(--hr-text-error-body-1); }
.hr-stat__note.is-primary { color: var(--hr-text-primary-body-1); }
</style>
