<script setup lang="ts">
/**
 * HrCheckbox — HighRise 1.1 Checkbox (Figma 26949:6776) + labelled group row (29443:66230).
 * Box sizes: 3xs 10 · 2xs 12 · xs 14 · sm 16 · md 18 · lg 20.
 */
import { computed } from 'vue';

export type CheckSize = '3xs' | '2xs' | 'xs' | 'sm' | 'md' | 'lg';
const model = defineModel<boolean>({ default: false });
const props = withDefaults(
  defineProps<{ size?: CheckSize; indeterminate?: boolean; disabled?: boolean; error?: boolean; label?: string; hint?: string; name?: string; value?: string }>(),
  { size: 'md' },
);
const id = `hr-cb-${Math.random().toString(36).slice(2, 8)}`;
const state = computed(() => (props.indeterminate ? 'mixed' : model.value ? 'on' : 'off'));
</script>

<template>
  <label class="hr-check" :class="[`hr-check--${size}`, { 'is-disabled': disabled }]" :for="id">
    <span class="hr-check__control">
      <input
        :id="id" v-model="model" type="checkbox" class="hr-check__input" :name="name" :value="value"
        :disabled="disabled" :aria-invalid="error || undefined" :indeterminate.prop="indeterminate"
        :aria-describedby="hint ? id + '-hint' : undefined"
      />
      <span class="hr-check__box" :class="[`is-${state}`, { 'is-error': error }]" aria-hidden="true">
        <svg v-if="state === 'on'" viewBox="0 0 12 9" fill="none"><path d="M1 4.5 4.3 8 11 1" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg>
        <svg v-else-if="state === 'mixed'" viewBox="0 0 12 2" fill="none"><path d="M1 1h10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" /></svg>
      </span>
    </span>
    <span v-if="label || $slots.default || hint" class="hr-check__text">
      <span class="hr-check__label"><slot>{{ label }}</slot></span>
      <span v-if="hint" :id="id + '-hint'" class="hr-check__hint">{{ hint }}</span>
    </span>
  </label>
</template>

<style>
.hr-check { display: inline-flex; gap: 8px; align-items: flex-start; cursor: pointer; font-family: var(--hr-font-family); }
.hr-check.is-disabled { cursor: not-allowed; }
.hr-check__control { position: relative; display: inline-flex; align-items: center; height: var(--_row); flex: none; }
.hr-check__input { position: absolute; inset: 0; opacity: 0; margin: 0; cursor: inherit; }
.hr-check__box {
  display: inline-flex; align-items: center; justify-content: center;
  width: var(--_box); height: var(--_box); border-radius: var(--_r);
  background: var(--hr-color-neutral-white-base);
  border: 1px solid var(--hr-color-neutral-gray-400);
  color: var(--hr-color-neutral-white-base);
  transition: background-color 120ms, border-color 120ms, box-shadow 120ms;
}
.hr-check__box svg { width: 60%; height: auto; }
.hr-check__box.is-on, .hr-check__box.is-mixed { background: var(--hr-color-primary-blue-600); border-color: var(--hr-color-primary-blue-600); }
.hr-check:hover .hr-check__box.is-off { background: var(--hr-color-primary-blue-100); border-color: var(--hr-color-primary-blue-600); }
.hr-check:hover .hr-check__box.is-on, .hr-check:hover .hr-check__box.is-mixed { background: var(--hr-color-primary-blue-500); border-color: var(--hr-color-primary-blue-500); }
.hr-check__input:focus-visible + .hr-check__box { box-shadow: var(--hr-focus-ring-primary); }
.hr-check__input:focus-visible + .hr-check__box.is-off { border-color: var(--hr-color-primary-blue-300); }
.hr-check__box.is-error { border-color: var(--hr-color-secondary-error-500); }
.hr-check.is-disabled .hr-check__box { background: var(--hr-color-neutral-gray-100); border-color: var(--hr-color-neutral-gray-300); }
.hr-check.is-disabled .hr-check__box.is-on, .hr-check.is-disabled .hr-check__box.is-mixed { background: var(--hr-color-neutral-gray-300); }
.hr-check__text { display: flex; flex-direction: column; }
.hr-check__label { font: var(--_label); font-weight: var(--hr-font-weight-medium); color: var(--hr-text-neutral-body-1); }
.hr-check__hint { font: var(--hr-text-md); color: var(--hr-text-neutral-base); }
.hr-check.is-disabled .hr-check__label { color: var(--hr-text-neutral-inactive); }

.hr-check--3xs { --_box: 10px; --_r: 2px; --_row: 16px; --_label: var(--hr-text-xs); }
.hr-check--2xs { --_box: 12px; --_r: 2px; --_row: 17px; --_label: var(--hr-text-sm); }
.hr-check--xs  { --_box: 14px; --_r: 2px; --_row: 18px; --_label: var(--hr-text-md); }
.hr-check--sm  { --_box: 16px; --_r: 4px; --_row: 20px; --_label: var(--hr-text-lg); }
.hr-check--md  { --_box: 18px; --_r: 4px; --_row: 24px; --_label: var(--hr-text-2xl); }
.hr-check--lg  { --_box: 20px; --_r: 6px; --_row: 24px; --_label: var(--hr-text-2xl); }
</style>
