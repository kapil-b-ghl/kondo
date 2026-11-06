<script setup lang="ts">
/**
 * HrDescriptionList — label/value rows for details and money breakdowns.
 * Label 14/20 gray-500, value 14/20 gray-900, 10px rows. `total` row gets a top border and Semi Bold.
 */
export interface DescItem { label: string; value: string; mono?: boolean; total?: boolean; tone?: 'neutral' | 'negative' }
defineProps<{ items: DescItem[]; align?: 'between' | 'grid' }>();
</script>

<template>
  <dl class="hr-dl" :class="`hr-dl--${align ?? 'between'}`">
    <div v-for="it in items" :key="it.label" class="hr-dl__row" :class="{ 'is-total': it.total }">
      <dt>{{ it.label }}</dt>
      <dd :class="{ 'is-mono': it.mono, 'is-negative': it.tone === 'negative' }"><slot :name="it.label" :item="it">{{ it.value }}</slot></dd>
    </div>
  </dl>
</template>

<style>
.hr-dl { margin: 0; display: flex; flex-direction: column; font-family: var(--hr-font-family); }
.hr-dl__row { display: flex; justify-content: space-between; gap: 16px; padding: 10px 0; border-bottom: 1px solid var(--hr-border-neutral-subtle-0); }
.hr-dl__row:last-child { border-bottom: 0; }
.hr-dl--grid .hr-dl__row { display: grid; grid-template-columns: 160px 1fr; }
.hr-dl dt { font: var(--hr-text-lg); color: var(--hr-text-neutral-base); }
.hr-dl dd { margin: 0; font: var(--hr-text-lg); color: var(--hr-text-neutral-title-1); text-align: right; font-variant-numeric: tabular-nums; min-width: 0; overflow-wrap: anywhere; }
.hr-dl--grid dd { text-align: left; }
.hr-dl dd.is-mono { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: var(--hr-font-size-md); }
.hr-dl__row.is-total { border-top: 1px solid var(--hr-border-neutral-subtle-1); border-bottom: 0; margin-top: 4px; }
.hr-dl__row.is-total dt, .hr-dl__row.is-total dd { color: var(--hr-text-neutral-title-1); font-weight: var(--hr-font-weight-semibold); }
</style>
