<script setup lang="ts">
/**
 * HrInput — HighRise 1.1 Input Field (Figma 26683:37578, 924 variants).
 * Implemented types: default, icon leading, prefix (e.g. "$"), suffix, password, trailing button slot.
 * Sizes: 3xs 24 · 2xs 28 · xs 32 · sm 36 · md 40 · lg 44.
 */
import { ref } from 'vue';
import HrField from '../field/HrField.vue';

export type InputSize = '3xs' | '2xs' | 'xs' | 'sm' | 'md' | 'lg';
const model = defineModel<string | number>();
const props = withDefaults(
  defineProps<{
    label?: string; hint?: string; error?: string; placeholder?: string; size?: InputSize; type?: string;
    disabled?: boolean; readonly?: boolean; required?: boolean; optional?: boolean; prefix?: string; suffix?: string;
    inputmode?: 'text' | 'numeric' | 'decimal' | 'email' | 'tel' | 'url' | 'search'; autocomplete?: string; maxlength?: number; id?: string;
  }>(),
  { size: 'md', type: 'text' },
);
const uid = props.id ?? `hr-in-${Math.random().toString(36).slice(2, 8)}`;
const reveal = ref(false);
</script>

<template>
  <HrField :label="label" :hint="hint" :error="error" :required="required" :optional="optional" :for-id="uid">
    <div class="hr-input" :class="[`hr-input--${size}`, { 'is-error': error, 'is-disabled': disabled }]">
      <span v-if="$slots.leading" class="hr-input__icon"><slot name="leading" /></span>
      <span v-if="prefix" class="hr-input__affix">{{ prefix }}</span>
      <input
        :id="uid" v-model="model" class="hr-input__control" :type="type === 'password' && reveal ? 'text' : type"
        :placeholder="placeholder" :disabled="disabled" :readonly="readonly" :required="required"
        :inputmode="inputmode" :autocomplete="autocomplete" :maxlength="maxlength"
        :aria-invalid="!!error || undefined" :aria-describedby="error || hint ? uid + '-msg' : undefined"
      />
      <span v-if="suffix" class="hr-input__affix">{{ suffix }}</span>
      <button v-if="type === 'password'" type="button" class="hr-input__reveal" :aria-label="reveal ? 'Hide' : 'Show'" @click="reveal = !reveal">{{ reveal ? 'Hide' : 'Show' }}</button>
      <span v-if="$slots.trailing" class="hr-input__icon"><slot name="trailing" /></span>
    </div>
  </HrField>
</template>

<style>
.hr-input {
  box-sizing: border-box; display: flex; align-items: center; gap: 8px;
  height: var(--_h); padding: 0 var(--_px); border-radius: var(--_r);
  background: var(--hr-color-neutral-white-base);
  border: 1px solid var(--hr-color-neutral-gray-300);
  box-shadow: var(--hr-shadow-xs);
  transition: border-color 120ms, box-shadow 120ms;
}
.hr-input:hover { border-color: var(--hr-color-primary-blue-600); box-shadow: none; }
.hr-input:focus-within { border-color: var(--hr-color-primary-blue-300); box-shadow: var(--hr-shadow-xs), var(--hr-focus-ring-primary); }
.hr-input.is-error { border-color: var(--hr-color-secondary-error-300); }
.hr-input.is-error:hover { border-color: var(--hr-color-secondary-error-600); }
.hr-input.is-error:focus-within { border-color: var(--hr-color-secondary-error-600); box-shadow: var(--hr-shadow-xs), var(--hr-focus-ring-error); }
.hr-input.is-disabled { background: var(--hr-color-neutral-gray-50); border-color: var(--hr-color-neutral-gray-300); box-shadow: var(--hr-shadow-xs); }
.hr-input__control {
  flex: 1; min-width: 0; border: 0; outline: none; background: transparent; padding: 0;
  font: var(--_font); font-family: var(--hr-font-family); color: var(--hr-color-neutral-gray-900);
}
.hr-input__control::placeholder { color: var(--hr-color-neutral-gray-500); }
.hr-input__control:disabled { color: var(--hr-color-neutral-gray-400); cursor: not-allowed; }
.hr-input__affix { font: var(--_font); color: var(--hr-color-neutral-gray-500); flex: none; }
.hr-input__icon { display: inline-flex; width: var(--_icon); height: var(--_icon); color: var(--hr-color-neutral-gray-400); flex: none; }
.hr-input__icon > svg { width: 100%; height: 100%; }
.hr-input__reveal { border: 0; background: none; padding: 0; font: var(--hr-text-md); font-weight: var(--hr-font-weight-semibold); color: var(--hr-color-primary-blue-700); cursor: pointer; }

.hr-input--3xs { --_h: 24px; --_px: 6px;  --_r: 4px; --_font: var(--hr-text-lg); --_icon: 12px; }
.hr-input--2xs { --_h: 28px; --_px: 6px;  --_r: 4px; --_font: var(--hr-text-lg); --_icon: 14px; }
.hr-input--xs  { --_h: 32px; --_px: 8px;  --_r: 4px; --_font: var(--hr-text-lg); --_icon: 14px; }
.hr-input--sm  { --_h: 36px; --_px: 8px;  --_r: 6px; --_font: var(--hr-text-lg); --_icon: 16px; }
.hr-input--md  { --_h: 40px; --_px: 12px; --_r: 8px; --_font: var(--hr-text-2xl); --_icon: 16px; }
.hr-input--lg  { --_h: 44px; --_px: 14px; --_r: 8px; --_font: var(--hr-text-2xl); --_icon: 16px; }
</style>
