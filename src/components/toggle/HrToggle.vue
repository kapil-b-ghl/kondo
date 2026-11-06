<script setup lang="ts">
/** HrToggle — HighRise 1.1 Toggle (Figma 26953:5957). Track sm 28×16 · md 36×20 · lg 44×24, 2px inset knob. */
export type ToggleSize = 'sm' | 'md' | 'lg';
const model = defineModel<boolean>({ default: false });
withDefaults(defineProps<{ size?: ToggleSize; disabled?: boolean; error?: boolean; label?: string; hint?: string }>(), { size: 'md' });
const id = `hr-tg-${Math.random().toString(36).slice(2, 8)}`;
</script>

<template>
  <label class="hr-toggle" :class="[`hr-toggle--${size}`, { 'is-disabled': disabled }]" :for="id">
    <input :id="id" v-model="model" type="checkbox" role="switch" class="hr-toggle__input" :disabled="disabled" :aria-checked="model" :aria-invalid="error || undefined" />
    <span class="hr-toggle__track" :class="{ 'is-on': model, 'is-error': error }" aria-hidden="true"><span class="hr-toggle__knob" /></span>
    <span v-if="label || $slots.default || hint" class="hr-toggle__text">
      <span class="hr-toggle__label"><slot>{{ label }}</slot></span>
      <span v-if="hint" class="hr-toggle__hint">{{ hint }}</span>
    </span>
  </label>
</template>

<style>
.hr-toggle { position: relative; display: inline-flex; gap: 8px; align-items: flex-start; cursor: pointer; font-family: var(--hr-font-family); }
.hr-toggle.is-disabled { cursor: not-allowed; }
.hr-toggle__input { position: absolute; opacity: 0; width: var(--_w); height: var(--_h); margin: 0; cursor: inherit; }
.hr-toggle__track {
  flex: none; position: relative; width: var(--_w); height: var(--_h); border-radius: 12px; padding: 2px; box-sizing: border-box;
  background: var(--hr-color-neutral-gray-100); transition: background-color 150ms, box-shadow 150ms;
}
.hr-toggle__knob {
  display: block; width: var(--_k); height: var(--_k); border-radius: 50%;
  background: var(--hr-color-neutral-white-base);
  box-shadow: 0 1px 3px rgba(16, 24, 40, 0.1), 0 1px 2px rgba(16, 24, 40, 0.06);
  transition: transform 150ms;
}
.hr-toggle__track.is-on { background: var(--hr-color-primary-blue-600); }
.hr-toggle__track.is-on .hr-toggle__knob { transform: translateX(calc(var(--_w) - var(--_k) - 4px)); }
.hr-toggle:hover .hr-toggle__track:not(.is-on) { background: var(--hr-color-neutral-gray-200); }
.hr-toggle:hover .hr-toggle__track.is-on { background: var(--hr-color-primary-blue-700); }
.hr-toggle__input:focus-visible + .hr-toggle__track { box-shadow: var(--hr-focus-ring-primary); }
.hr-toggle__input:focus-visible + .hr-toggle__track:not(.is-on) { background: var(--hr-color-neutral-gray-50); }
.hr-toggle__track.is-error { box-shadow: inset 0 0 0 1px var(--hr-color-secondary-error-500); }
.hr-toggle.is-disabled .hr-toggle__track { background: var(--hr-color-neutral-gray-100); }
.hr-toggle.is-disabled .hr-toggle__knob { background: var(--hr-color-neutral-gray-50); }
.hr-toggle__text { display: flex; flex-direction: column; }
.hr-toggle__label { font: var(--hr-text-lg); font-weight: var(--hr-font-weight-medium); color: var(--hr-text-neutral-body-1); }
.hr-toggle__hint { font: var(--hr-text-md); color: var(--hr-text-neutral-base); }
@media (prefers-reduced-motion: reduce) { .hr-toggle__knob, .hr-toggle__track { transition: none; } }

.hr-toggle--sm { --_w: 28px; --_h: 16px; --_k: 12px; }
.hr-toggle--md { --_w: 36px; --_h: 20px; --_k: 16px; }
.hr-toggle--lg { --_w: 44px; --_h: 24px; --_k: 20px; }
</style>
