<script setup lang="ts">
/**
 * HrSelect — HighRise 1.1 Select (Figma 26683:57778). Trigger matches Input Field;
 * the open menu uses surface/overlay + Shadow/lg. Keyboard: ↑ ↓ Enter Esc, type-ahead.
 */
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import HrField from '../field/HrField.vue';

export interface SelectOption { label: string; value: string | number; hint?: string; disabled?: boolean }
export type SelectSize = '3xs' | '2xs' | 'xs' | 'sm' | 'md' | 'lg';
const model = defineModel<string | number | undefined>();
const props = withDefaults(
  defineProps<{ options: SelectOption[]; label?: string; hint?: string; error?: string; placeholder?: string; size?: SelectSize; disabled?: boolean; required?: boolean }>(),
  { size: 'md', placeholder: 'Select' },
);
const uid = `hr-sel-${Math.random().toString(36).slice(2, 8)}`;
const open = ref(false);
const active = ref(-1);
const root = ref<HTMLElement>();
const selected = computed(() => props.options.find((o) => o.value === model.value));

function toggle(v = !open.value) {
  if (props.disabled) return;
  open.value = v;
  if (v) { active.value = Math.max(0, props.options.findIndex((o) => o.value === model.value)); nextTick(scrollActive); }
}
function pick(o: SelectOption) { if (o.disabled) return; model.value = o.value; open.value = false; }
function move(d: number) {
  if (!open.value) return toggle(true);
  let i = active.value;
  do { i = (i + d + props.options.length) % props.options.length; } while (props.options[i].disabled && i !== active.value);
  active.value = i; nextTick(scrollActive);
}
function scrollActive() { root.value?.querySelector('.hr-select__opt.is-active')?.scrollIntoView({ block: 'nearest' }); }
function onKey(e: KeyboardEvent) {
  if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
  else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
  else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (open.value && props.options[active.value]) pick(props.options[active.value]); else toggle(true); }
  else if (e.key === 'Escape') open.value = false;
  else if (e.key.length === 1) { const i = props.options.findIndex((o) => o.label.toLowerCase().startsWith(e.key.toLowerCase())); if (i >= 0) { active.value = i; if (!open.value) pick(props.options[i]); } }
}
const outside = (e: MouseEvent) => { if (root.value && !root.value.contains(e.target as Node)) open.value = false; };
onMounted(() => document.addEventListener('mousedown', outside));
onBeforeUnmount(() => document.removeEventListener('mousedown', outside));
</script>

<template>
  <HrField :label="label" :hint="hint" :error="error" :required="required" :for-id="uid">
    <div ref="root" class="hr-select" :class="[`hr-select--${size}`]">
      <button
        :id="uid" type="button" class="hr-select__trigger" :class="{ 'is-open': open, 'is-error': error, 'is-placeholder': !selected }"
        :disabled="disabled" role="combobox" :aria-expanded="open" :aria-controls="uid + '-list'" aria-haspopup="listbox"
        :aria-invalid="!!error || undefined" @click="toggle()" @keydown="onKey"
      >
        <span v-if="$slots.leading" class="hr-select__icon"><slot name="leading" /></span>
        <span class="hr-select__value">{{ selected?.label ?? placeholder }}</span>
        <svg class="hr-select__chev" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m5 7.5 5 5 5-5" stroke="currentColor" stroke-width="1.67" stroke-linecap="round" stroke-linejoin="round" /></svg>
      </button>
      <ul v-show="open" :id="uid + '-list'" class="hr-select__menu" role="listbox" :aria-labelledby="uid">
        <li
          v-for="(o, i) in options" :key="o.value" role="option" class="hr-select__opt"
          :class="{ 'is-active': i === active, 'is-selected': o.value === model, 'is-disabled': o.disabled }"
          :aria-selected="o.value === model" :aria-disabled="o.disabled || undefined"
          @mousedown.prevent="pick(o)" @mouseenter="active = i"
        >
          <span class="hr-select__opt-text"><span>{{ o.label }}</span><small v-if="o.hint">{{ o.hint }}</small></span>
          <svg v-if="o.value === model" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M16.7 5 7.5 14.2 3.3 10" stroke="currentColor" stroke-width="1.67" stroke-linecap="round" stroke-linejoin="round" /></svg>
        </li>
      </ul>
    </div>
  </HrField>
</template>

<style>
.hr-select { position: relative; }
.hr-select__trigger {
  box-sizing: border-box; width: 100%; display: flex; align-items: center; gap: 8px;
  height: var(--_h); padding: 0 var(--_px); border-radius: var(--_r); cursor: pointer; text-align: left;
  background: var(--hr-color-neutral-white-base); border: 1px solid var(--hr-color-neutral-gray-300); box-shadow: var(--hr-shadow-xs);
  font: var(--_font); font-family: var(--hr-font-family); color: var(--hr-color-neutral-gray-900);
}
.hr-select__trigger:hover { border-color: var(--hr-color-primary-blue-600); }
.hr-select__trigger:focus-visible, .hr-select__trigger.is-open { outline: none; border-color: var(--hr-color-primary-blue-300); box-shadow: var(--hr-shadow-xs), var(--hr-focus-ring-primary); }
.hr-select__trigger.is-error { border-color: var(--hr-color-secondary-error-300); }
.hr-select__trigger.is-placeholder .hr-select__value { color: var(--hr-color-neutral-gray-500); }
.hr-select__trigger:disabled { background: var(--hr-color-neutral-gray-50); color: var(--hr-color-neutral-gray-400); cursor: not-allowed; }
.hr-select__value { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.hr-select__chev { width: 20px; height: 20px; color: var(--hr-color-neutral-gray-500); flex: none; transition: transform 150ms; }
.hr-select__trigger.is-open .hr-select__chev { transform: rotate(180deg); }
.hr-select__icon { display: inline-flex; width: 20px; height: 20px; color: var(--hr-color-neutral-gray-500); }
.hr-select__menu {
  position: absolute; z-index: var(--hr-z-index-5); left: 0; right: 0; top: calc(100% + 4px); margin: 0; padding: 4px; list-style: none;
  max-height: 280px; overflow: auto; border-radius: 8px; border: 1px solid var(--hr-border-neutral-subtle-1);
  background: var(--hr-surface-overlay); box-shadow: var(--hr-shadow-lg);
}
.hr-select__opt { display: flex; align-items: center; gap: 8px; padding: 10px 10px; border-radius: 6px; cursor: pointer; font: var(--hr-text-lg); color: var(--hr-color-neutral-gray-900); }
.hr-select__opt.is-active { background: var(--hr-color-neutral-gray-50); }
.hr-select__opt.is-selected { color: var(--hr-color-primary-blue-700); }
.hr-select__opt.is-disabled { color: var(--hr-color-neutral-gray-400); cursor: not-allowed; }
.hr-select__opt svg { width: 20px; height: 20px; margin-left: auto; color: var(--hr-color-primary-blue-600); flex: none; }
.hr-select__opt-text { display: flex; flex-direction: column; min-width: 0; }
.hr-select__opt-text small { font: var(--hr-text-md); color: var(--hr-color-neutral-gray-500); }

.hr-select--3xs { --_h: 24px; --_px: 6px;  --_r: 4px; --_font: var(--hr-text-lg); }
.hr-select--2xs { --_h: 28px; --_px: 6px;  --_r: 4px; --_font: var(--hr-text-lg); }
.hr-select--xs  { --_h: 32px; --_px: 8px;  --_r: 4px; --_font: var(--hr-text-lg); }
.hr-select--sm  { --_h: 36px; --_px: 8px;  --_r: 6px; --_font: var(--hr-text-lg); }
.hr-select--md  { --_h: 40px; --_px: 14px; --_r: 8px; --_font: var(--hr-text-2xl); }
.hr-select--lg  { --_h: 44px; --_px: 14px; --_r: 8px; --_font: var(--hr-text-2xl); }
</style>
