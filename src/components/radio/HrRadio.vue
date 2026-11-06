<script setup lang="ts">
/**
 * HrRadio — HighRise 1.1 Radio (Figma 28425:178392). Same colour logic as Checkbox.
 * Use several HrRadio with the same v-model; `value` is what gets selected.
 */
import { computed } from 'vue';

export type RadioSize = '3xs' | '2xs' | 'xs' | 'sm' | 'md' | 'lg';
const model = defineModel<string | number | undefined>();
const props = withDefaults(
  defineProps<{ value: string | number; size?: RadioSize; disabled?: boolean; error?: boolean; label?: string; hint?: string; name?: string }>(),
  { size: 'md' },
);
const id = `hr-rd-${Math.random().toString(36).slice(2, 8)}`;
const checked = computed(() => model.value === props.value);
</script>

<template>
  <label class="hr-radio" :class="[`hr-radio--${size}`, { 'is-disabled': disabled }]" :for="id">
    <span class="hr-radio__control">
      <input :id="id" v-model="model" type="radio" class="hr-radio__input" :name="name" :value="value" :disabled="disabled" :aria-invalid="error || undefined" />
      <span class="hr-radio__dot" :class="{ 'is-on': checked, 'is-error': error }" aria-hidden="true" />
    </span>
    <span v-if="label || $slots.default || hint" class="hr-radio__text">
      <span class="hr-radio__label"><slot>{{ label }}</slot></span>
      <span v-if="hint" class="hr-radio__hint">{{ hint }}</span>
    </span>
  </label>
</template>

<style>
.hr-radio { display: inline-flex; gap: 8px; align-items: flex-start; cursor: pointer; font-family: var(--hr-font-family); }
.hr-radio.is-disabled { cursor: not-allowed; }
.hr-radio__control { position: relative; display: inline-flex; align-items: center; height: var(--_row); flex: none; }
.hr-radio__input { position: absolute; inset: 0; opacity: 0; margin: 0; cursor: inherit; }
.hr-radio__dot {
  position: relative; width: var(--_box); height: var(--_box); border-radius: 50%;
  background: var(--hr-color-neutral-white-base); border: 1px solid var(--hr-color-neutral-gray-400);
  transition: background-color 120ms, border-color 120ms, box-shadow 120ms;
}
.hr-radio__dot.is-on { background: var(--hr-color-primary-blue-600); border-color: var(--hr-color-primary-blue-600); }
.hr-radio__dot.is-on::after {
  content: ''; position: absolute; inset: 0; margin: auto; width: var(--_dot); height: var(--_dot);
  border-radius: 50%; background: var(--hr-color-neutral-white-base);
}
.hr-radio:hover .hr-radio__dot:not(.is-on) { background: var(--hr-color-primary-blue-100); border-color: var(--hr-color-primary-blue-600); }
.hr-radio:hover .hr-radio__dot.is-on { background: var(--hr-color-primary-blue-500); border-color: var(--hr-color-primary-blue-500); }
.hr-radio__input:focus-visible + .hr-radio__dot { box-shadow: var(--hr-focus-ring-primary); }
.hr-radio__input:focus-visible + .hr-radio__dot:not(.is-on) { border-color: var(--hr-color-primary-blue-300); }
.hr-radio__dot.is-error { border-color: var(--hr-color-secondary-error-500); }
.hr-radio.is-disabled .hr-radio__dot { background: var(--hr-color-neutral-gray-100); border-color: var(--hr-color-neutral-gray-300); }
.hr-radio.is-disabled .hr-radio__dot.is-on { background: var(--hr-color-neutral-gray-300); }
.hr-radio__text { display: flex; flex-direction: column; }
.hr-radio__label { font: var(--_label); font-weight: var(--hr-font-weight-medium); color: var(--hr-text-neutral-body-1); }
.hr-radio__hint { font: var(--hr-text-md); color: var(--hr-text-neutral-base); }
.hr-radio.is-disabled .hr-radio__label { color: var(--hr-text-neutral-inactive); }

.hr-radio--3xs { --_box: 10px; --_dot: 4px; --_row: 16px; --_label: var(--hr-text-xs); }
.hr-radio--2xs { --_box: 12px; --_dot: 5px; --_row: 17px; --_label: var(--hr-text-sm); }
.hr-radio--xs  { --_box: 14px; --_dot: 5px; --_row: 18px; --_label: var(--hr-text-md); }
.hr-radio--sm  { --_box: 16px; --_dot: 6px; --_row: 20px; --_label: var(--hr-text-lg); }
.hr-radio--md  { --_box: 18px; --_dot: 7px; --_row: 24px; --_label: var(--hr-text-2xl); }
.hr-radio--lg  { --_box: 20px; --_dot: 8px; --_row: 24px; --_label: var(--hr-text-2xl); }
</style>
