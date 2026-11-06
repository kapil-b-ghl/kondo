<script setup lang="ts">
/**
 * HrTextarea — HighRise 1.1 "Textarea input field" (Figma 26683:52911).
 * Sizes lg · md · sm · xs · 2xs · 3xs (padding, radius and type per size from Figma). States:
 * placeholder, default, focused, disabled, destructive. Optional character counter (Figma
 * "Character Limit") and user resize (Figma "Resizable", off by default).
 * Not built: Type=Tags, Emoji and Media slots (see registry).
 */
import { computed } from 'vue';
import HrField from '../field/HrField.vue';

export type TextareaSize = 'lg' | 'md' | 'sm' | 'xs' | '2xs' | '3xs';
const model = defineModel<string>({ default: '' });
const props = withDefaults(
  defineProps<{ label?: string; hint?: string; error?: string; placeholder?: string; size?: TextareaSize; rows?: number; maxlength?: number; showCount?: boolean; resizable?: boolean; disabled?: boolean; required?: boolean; optional?: boolean }>(),
  { size: 'md', rows: 4 },
);
const uid = `hr-ta-${Math.random().toString(36).slice(2, 8)}`;
const count = computed(() => model.value?.length ?? 0);
const showCounter = computed(() => props.showCount || props.maxlength !== undefined);
</script>

<template>
  <HrField :label="label" :hint="hint" :error="error" :required="required" :optional="optional" :for-id="uid">
    <div class="hr-textarea" :class="[`hr-textarea--${size}`, { 'is-error': error, 'is-disabled': disabled }]">
      <textarea
        :id="uid" v-model="model" class="hr-textarea__control" :class="{ 'is-resizable': resizable }" :rows="rows" :placeholder="placeholder"
        :maxlength="maxlength" :disabled="disabled" :required="required" :aria-invalid="!!error || undefined"
        :aria-describedby="showCounter ? uid + '-count' : undefined"
      />
      <div v-if="showCounter" :id="uid + '-count'" class="hr-textarea__count" aria-live="polite">
        {{ count }}<template v-if="maxlength !== undefined"> / {{ maxlength }}</template>
      </div>
    </div>
  </HrField>
</template>

<style>
.hr-textarea {
  box-sizing: border-box; display: flex; flex-direction: column; gap: 4px;
  padding: var(--_py) var(--_px); border-radius: var(--_r);
  background: var(--hr-color-neutral-white-base);
  border: 1px solid var(--hr-color-neutral-gray-300);
  box-shadow: var(--hr-shadow-xs);
  transition: border-color 120ms, box-shadow 120ms;
}
.hr-textarea:focus-within { border-color: var(--hr-color-primary-blue-300); box-shadow: var(--hr-focus-ring-primary); }
.hr-textarea--lg:focus-within { box-shadow: var(--hr-shadow-xs), var(--hr-focus-ring-primary); }
.hr-textarea.is-error { border-color: var(--hr-color-secondary-error-300); }
.hr-textarea.is-error:focus-within { box-shadow: var(--hr-focus-ring-error); }
.hr-textarea--lg.is-error:focus-within { box-shadow: var(--hr-shadow-xs), var(--hr-focus-ring-error); }
.hr-textarea.is-disabled { background: var(--hr-color-neutral-gray-50); }
.hr-textarea__control {
  display: block; width: 100%; min-height: calc(var(--_lh) * 2); margin: 0; padding: 0; border: 0; outline: none; background: transparent; resize: none;
  font: var(--_font); font-family: var(--hr-font-family); color: var(--hr-color-neutral-gray-900);
}
.hr-textarea__control.is-resizable { resize: vertical; }
.hr-textarea__control::placeholder { color: var(--hr-color-neutral-gray-500); }
.hr-textarea__control:disabled { color: var(--hr-color-neutral-gray-400); cursor: not-allowed; }
.hr-textarea__count { align-self: flex-end; font: var(--_count); color: var(--hr-color-neutral-gray-600); font-variant-numeric: tabular-nums; }

.hr-textarea--lg  { --_py: 10px; --_px: 14px; --_r: 8px; --_font: var(--hr-text-2xl); --_lh: 24px; --_count: var(--hr-text-md); }
.hr-textarea--md  { --_py: 10px; --_px: 12px; --_r: 8px; --_font: var(--hr-text-2xl); --_lh: 24px; --_count: var(--hr-text-md); }
.hr-textarea--sm  { --_py: 8px;  --_px: 8px;  --_r: 6px; --_font: var(--hr-text-lg);  --_lh: 20px; --_count: var(--hr-text-sm); }
.hr-textarea--xs  { --_py: 6px;  --_px: 8px;  --_r: 4px; --_font: var(--hr-text-lg);  --_lh: 20px; --_count: var(--hr-text-xs); }
.hr-textarea--2xs { --_py: 6px;  --_px: 6px;  --_r: 4px; --_font: var(--hr-text-lg);  --_lh: 20px; --_count: var(--hr-font-size-2xs)/var(--hr-font-line-height-2xs) var(--hr-font-family); }
.hr-textarea--3xs { --_py: 6px;  --_px: 6px;  --_r: 4px; --_font: var(--hr-text-lg);  --_lh: 20px; --_count: var(--hr-font-size-3xs)/var(--hr-font-line-height-3xs) var(--hr-font-family); }
</style>
