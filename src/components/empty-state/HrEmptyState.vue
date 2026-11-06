<script setup lang="ts">
/**
 * HrEmptyState — HighRise 1.1 Empty State (Figma 27168:7769). Title + supporting text + actions.
 * Sizes: 2xs (11/16 · 10/15) … md (16/24 · 14/20). Optional featured icon via #icon slot.
 */
withDefaults(defineProps<{ title: string; text?: string; size?: '2xs' | 'xs' | 'sm' | 'md'; align?: 'center' | 'left' }>(), { size: 'md', align: 'center' });
</script>

<template>
  <div class="hr-empty" :class="[`hr-empty--${size}`, `hr-empty--${align}`]">
    <div v-if="$slots.icon" class="hr-empty__icon"><slot name="icon" /></div>
    <div class="hr-empty__text">
      <p class="hr-empty__title">{{ title }}</p>
      <p v-if="text" class="hr-empty__sub">{{ text }}</p>
    </div>
    <div v-if="$slots.actions" class="hr-empty__actions"><slot name="actions" /></div>
  </div>
</template>

<style>
.hr-empty { display: flex; flex-direction: column; gap: 12px; padding: 24px; font-family: var(--hr-font-family); }
.hr-empty--center { align-items: center; text-align: center; }
.hr-empty__icon { display: inline-flex; width: 40px; height: 40px; padding: 10px; box-sizing: border-box; border-radius: 50%; background: var(--hr-color-neutral-gray-100); color: var(--hr-color-neutral-gray-600); }
.hr-empty__icon > svg { width: 100%; height: 100%; }
.hr-empty__text { display: flex; flex-direction: column; gap: 4px; max-width: 360px; }
.hr-empty__title { margin: 0; font: var(--_t); font-weight: var(--hr-font-weight-semibold); color: var(--hr-color-neutral-gray-900); }
.hr-empty__sub { margin: 0; font: var(--_s); color: var(--hr-color-neutral-gray-600); }
.hr-empty__actions { display: flex; gap: 8px; }
.hr-empty--2xs { --_t: var(--hr-font-size-xs)/var(--hr-font-line-height-xs) var(--hr-font-family); --_s: var(--hr-font-size-2xs)/var(--hr-font-line-height-2xs) var(--hr-font-family); gap: 8px; padding: 12px; }
.hr-empty--xs  { --_t: var(--hr-text-md); --_s: var(--hr-text-sm); }
.hr-empty--sm  { --_t: var(--hr-text-lg); --_s: var(--hr-text-md); }
.hr-empty--md  { --_t: var(--hr-text-2xl); --_s: var(--hr-text-lg); }
</style>
