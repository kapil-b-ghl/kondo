<script setup lang="ts">
/**
 * HrTabs — HighRise 1.1 Tab Item (Figma 26957:20865). Types: line (underline) and segment (pill group).
 * Line active: 2px blue/700 underline, blue/700 Semi Bold. Hover: blue/50 (primary) / gray/50 (secondary).
 * Segment active: white tile, blue/700 (primary) / gray/900 (secondary).
 */
export interface Tab { key: string; label: string; count?: number; disabled?: boolean }
const model = defineModel<string>();
withDefaults(defineProps<{ tabs: Tab[]; type?: 'line' | 'segment'; theme?: 'primary' | 'secondary'; size?: 'sm' | 'md' | 'lg'; label?: string }>(), { type: 'line', theme: 'primary', size: 'md' });

function onKey(e: KeyboardEvent, tabs: Tab[]) {
  const enabled = tabs.filter((t) => !t.disabled);
  const i = enabled.findIndex((t) => t.key === model.value);
  if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
    e.preventDefault();
    const next = enabled[(i + (e.key === 'ArrowRight' ? 1 : -1) + enabled.length) % enabled.length];
    model.value = next.key;
    (e.currentTarget as HTMLElement).querySelector<HTMLElement>(`[data-key="${next.key}"]`)?.focus();
  }
}
</script>

<template>
  <div class="hr-tabs" :class="[`hr-tabs--${type}`, `hr-tabs--${theme}`, `hr-tabs--${size}`]" role="tablist" :aria-label="label" @keydown="onKey($event, tabs)">
    <button
      v-for="t in tabs" :key="t.key" type="button" role="tab" class="hr-tabs__tab" :data-key="t.key"
      :aria-selected="model === t.key" :tabindex="model === t.key ? 0 : -1" :disabled="t.disabled" @click="model = t.key"
    >
      {{ t.label }}<span v-if="t.count !== undefined" class="hr-tabs__count">{{ t.count }}</span>
    </button>
  </div>
</template>

<style>
.hr-tabs { display: flex; gap: 4px; font-family: var(--hr-font-family); }
.hr-tabs__tab {
  display: inline-flex; align-items: center; gap: 6px; height: var(--_h); padding: 0 8px; border: 0; background: none; cursor: pointer;
  font: var(--_font); font-weight: var(--hr-font-weight-medium); color: var(--hr-color-neutral-gray-600); white-space: nowrap;
}
.hr-tabs__tab:disabled { color: var(--hr-color-neutral-gray-300); cursor: not-allowed; }
.hr-tabs__tab:focus-visible { outline: none; box-shadow: var(--hr-focus-ring-primary); }
.hr-tabs__count { min-width: 18px; padding: 0 6px; border-radius: 10px; background: var(--hr-color-neutral-gray-100); font: var(--hr-text-xs); font-weight: var(--hr-font-weight-semibold); color: var(--hr-color-neutral-gray-600); }

.hr-tabs--line { border-bottom: 1px solid var(--hr-border-neutral-subtle-1); gap: 8px; }
.hr-tabs--line .hr-tabs__tab { margin-bottom: -1px; border-bottom: 2px solid transparent; border-radius: 4px 4px 0 0; }
.hr-tabs--line.hr-tabs--primary .hr-tabs__tab:not([aria-selected='true']):not(:disabled):hover { background: var(--hr-color-primary-blue-50); color: var(--hr-color-neutral-gray-800); }
.hr-tabs--line.hr-tabs--secondary .hr-tabs__tab:not([aria-selected='true']):not(:disabled):hover { background: var(--hr-color-neutral-gray-50); color: var(--hr-color-neutral-gray-800); }
.hr-tabs--line.hr-tabs--primary .hr-tabs__tab[aria-selected='true'] { border-bottom-color: var(--hr-color-primary-blue-700); color: var(--hr-color-primary-blue-700); font-weight: var(--hr-font-weight-semibold); }
.hr-tabs--line.hr-tabs--secondary .hr-tabs__tab[aria-selected='true'] { border-bottom-color: var(--hr-color-neutral-gray-900); color: var(--hr-color-neutral-gray-700); font-weight: var(--hr-font-weight-semibold); }
.hr-tabs--line.hr-tabs--primary .hr-tabs__tab[aria-selected='true'] .hr-tabs__count { background: var(--hr-color-primary-blue-50); color: var(--hr-color-primary-blue-700); }

.hr-tabs--segment { display: inline-flex; padding: 2px; gap: 2px; border-radius: 6px; background: var(--hr-color-neutral-gray-100); }
.hr-tabs--segment .hr-tabs__tab { border-radius: 4px; padding: 0 12px; }
.hr-tabs--segment.hr-tabs--primary .hr-tabs__tab:not([aria-selected='true']):hover { background: var(--hr-color-primary-blue-50); color: var(--hr-color-neutral-gray-800); }
.hr-tabs--segment.hr-tabs--secondary .hr-tabs__tab:not([aria-selected='true']):hover { background: var(--hr-color-neutral-gray-50); color: var(--hr-color-neutral-gray-800); }
.hr-tabs--segment .hr-tabs__tab[aria-selected='true'] { background: var(--hr-color-neutral-white-base); box-shadow: var(--hr-shadow-xs); font-weight: var(--hr-font-weight-semibold); }
.hr-tabs--segment.hr-tabs--primary .hr-tabs__tab[aria-selected='true'] { color: var(--hr-color-primary-blue-700); }
.hr-tabs--segment.hr-tabs--secondary .hr-tabs__tab[aria-selected='true'] { color: var(--hr-color-neutral-gray-900); }

.hr-tabs--sm { --_h: 24px; --_font: var(--hr-text-md); }
.hr-tabs--md { --_h: 32px; --_font: var(--hr-text-lg); }
.hr-tabs--lg { --_h: 40px; --_font: var(--hr-text-lg); }
</style>
