<script setup lang="ts">
/**
 * HrTag — HighRise 1.1 Tag (Figma 26957:99489, 832 variants).
 * Colours come from the 1.1 "Component Specific" collection (tag/{color}/{part}/{state}).
 * Status meaning: gray = neutral/info, success = done/paid, warning = needs attention,
 * error = failed/blocked, primary = in progress / selected.
 */
export type TagColor = 'gray' | 'primary' | 'error' | 'warning' | 'success' | 'blue-gray' | 'blue-light' | 'blue' | 'indigo' | 'purple' | 'pink' | 'rose' | 'orange-dark';
export type TagSize = 'xs' | 'sm' | 'md' | 'lg';
withDefaults(
  defineProps<{ color?: TagColor; size?: TagSize; outline?: boolean; rounded?: boolean; dot?: boolean; removable?: boolean; interactive?: boolean }>(),
  { color: 'gray', size: 'md', outline: false, rounded: false },
);
defineEmits<{ remove: []; click: [MouseEvent] }>();
</script>

<template>
  <component
    :is="interactive ? 'button' : 'span'" :type="interactive ? 'button' : undefined"
    class="hr-tag" :class="[`hr-tag--${color}`, `hr-tag--${size}`, { 'hr-tag--outline': outline, 'hr-tag--rounded': rounded, 'hr-tag--interactive': interactive }]"
    @click="(e: MouseEvent) => interactive && $emit('click', e)"
  >
    <span v-if="dot" class="hr-tag__dot" aria-hidden="true" />
    <span v-if="$slots.leading" class="hr-tag__icon"><slot name="leading" /></span>
    <span class="hr-tag__label"><slot /></span>
    <span v-if="removable" class="hr-tag__remove" role="button" tabindex="0" aria-label="Remove" @click.stop="$emit('remove')" @keydown.enter.stop="$emit('remove')">
      <svg viewBox="0 0 12 12" fill="none"><path d="M9 3 3 9M3 3l6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" /></svg>
    </span>
  </component>
</template>

<style>
.hr-tag {
  box-sizing: border-box; display: inline-flex; align-items: center; gap: 2px;
  height: var(--_h); padding: 0 var(--_px); border-radius: 4px;
  font: var(--_font); font-weight: var(--hr-font-weight-medium); font-family: var(--hr-font-family);
  white-space: nowrap; border: 1px solid transparent;
  background: var(--_bg); color: var(--_fg);
}
.hr-tag--outline { background: var(--hr-color-neutral-white-base); border-color: var(--_bd); }
.hr-tag--rounded { border-radius: 12px; }
.hr-tag--interactive { cursor: pointer; }
.hr-tag--interactive:hover { background: var(--_bg-h); border-color: var(--_bd-h); color: var(--_fg-h); }
.hr-tag--interactive:not(.hr-tag--outline):hover { border-color: transparent; }
.hr-tag--interactive:active { background: var(--_bg-a); border-color: var(--_bd-a); color: var(--_fg-a); }
.hr-tag--interactive:focus-visible { outline: none; background: var(--_bg-h); border-color: var(--_bd-f); color: var(--_fg-h); box-shadow: 0 0 0 4px var(--_ring); }
.hr-tag__dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; margin-right: 4px; }
.hr-tag__icon, .hr-tag__remove { display: inline-flex; width: var(--_icon); height: var(--_icon); }
.hr-tag__icon > svg { width: 100%; height: 100%; }
.hr-tag__remove { cursor: pointer; margin-left: 2px; border-radius: 2px; opacity: 0.8; }
.hr-tag__remove:hover { opacity: 1; }

.hr-tag--xs { --_h: 18px; --_px: 6px; --_font: var(--hr-text-xs); --_icon: 10px; }
.hr-tag--sm { --_h: 22px; --_px: 8px; --_font: var(--hr-text-sm); --_icon: 12px; }
.hr-tag--md { --_h: 24px; --_px: 8px; --_font: var(--hr-text-md); --_icon: 14px; }
.hr-tag--lg { --_h: 28px; --_px: 8px; --_font: var(--hr-text-md); --_icon: 16px; }

/* Standard colour recipe: bg 50 · border 600 · label 700 → hover 100/700/800 → active 200/800/900 → focus border 300 */
.hr-tag--primary     { --_bg: var(--hr-color-primary-blue-50);  --_bd: var(--hr-color-primary-blue-600);  --_fg: var(--hr-color-primary-blue-700);  --_bg-h: var(--hr-color-primary-blue-100);  --_bd-h: var(--hr-color-primary-blue-700);  --_fg-h: var(--hr-color-primary-blue-800);  --_bg-a: var(--hr-color-primary-blue-200);  --_bd-a: var(--hr-color-primary-blue-800);  --_fg-a: var(--hr-color-primary-blue-900);  --_bd-f: var(--hr-color-primary-blue-300);  --_ring: var(--hr-color-primary-blue-100); }
.hr-tag--error       { --_bg: var(--hr-color-secondary-error-50);  --_bd: var(--hr-color-secondary-error-600);  --_fg: var(--hr-color-secondary-error-700);  --_bg-h: var(--hr-color-secondary-error-100);  --_bd-h: var(--hr-color-secondary-error-700);  --_fg-h: var(--hr-color-secondary-error-800);  --_bg-a: var(--hr-color-secondary-error-200);  --_bd-a: var(--hr-color-secondary-error-800);  --_fg-a: var(--hr-color-secondary-error-900);  --_bd-f: var(--hr-color-secondary-error-300);  --_ring: var(--hr-color-secondary-error-100); }
.hr-tag--warning     { --_bg: var(--hr-color-secondary-warning-50);  --_bd: var(--hr-color-secondary-warning-600);  --_fg: var(--hr-color-secondary-warning-700);  --_bg-h: var(--hr-color-secondary-warning-100);  --_bd-h: var(--hr-color-secondary-warning-700);  --_fg-h: var(--hr-color-secondary-warning-800);  --_bg-a: var(--hr-color-secondary-warning-200);  --_bd-a: var(--hr-color-secondary-warning-800);  --_fg-a: var(--hr-color-secondary-warning-900);  --_bd-f: var(--hr-color-secondary-warning-300);  --_ring: var(--hr-color-secondary-warning-100); }
.hr-tag--success     { --_bg: var(--hr-color-secondary-success-50);  --_bd: var(--hr-color-secondary-success-600);  --_fg: var(--hr-color-secondary-success-700);  --_bg-h: var(--hr-color-secondary-success-100);  --_bd-h: var(--hr-color-secondary-success-700);  --_fg-h: var(--hr-color-secondary-success-800);  --_bg-a: var(--hr-color-secondary-success-200);  --_bd-a: var(--hr-color-secondary-success-800);  --_fg-a: var(--hr-color-secondary-success-900);  --_bd-f: var(--hr-color-secondary-success-300);  --_ring: var(--hr-color-secondary-success-100); }
.hr-tag--blue-gray   { --_bg: var(--hr-color-neutral-gray-blue-50);  --_bd: var(--hr-color-neutral-gray-blue-600);  --_fg: var(--hr-color-neutral-gray-blue-700);  --_bg-h: var(--hr-color-neutral-gray-blue-100);  --_bd-h: var(--hr-color-neutral-gray-blue-700);  --_fg-h: var(--hr-color-neutral-gray-blue-800);  --_bg-a: var(--hr-color-neutral-gray-blue-200);  --_bd-a: var(--hr-color-neutral-gray-blue-800);  --_fg-a: var(--hr-color-neutral-gray-blue-900);  --_bd-f: var(--hr-color-neutral-gray-blue-300);  --_ring: var(--hr-color-neutral-gray-blue-100); }
.hr-tag--blue-light  { --_bg: var(--hr-color-accent-blue-light-50);  --_bd: var(--hr-color-accent-blue-light-600);  --_fg: var(--hr-color-accent-blue-light-700);  --_bg-h: var(--hr-color-accent-blue-light-100);  --_bd-h: var(--hr-color-accent-blue-light-700);  --_fg-h: var(--hr-color-accent-blue-light-800);  --_bg-a: var(--hr-color-accent-blue-light-200);  --_bd-a: var(--hr-color-accent-blue-light-800);  --_fg-a: var(--hr-color-accent-blue-light-900);  --_bd-f: var(--hr-color-accent-blue-light-300);  --_ring: var(--hr-color-accent-blue-light-100); }
.hr-tag--blue        { --_bg: var(--hr-color-accent-blue-50);  --_bd: var(--hr-color-accent-blue-600);  --_fg: var(--hr-color-accent-blue-700);  --_bg-h: var(--hr-color-accent-blue-100);  --_bd-h: var(--hr-color-accent-blue-700);  --_fg-h: var(--hr-color-accent-blue-800);  --_bg-a: var(--hr-color-accent-blue-200);  --_bd-a: var(--hr-color-accent-blue-800);  --_fg-a: var(--hr-color-accent-blue-900);  --_bd-f: var(--hr-color-accent-blue-300);  --_ring: var(--hr-color-accent-blue-100); }
.hr-tag--indigo      { --_bg: var(--hr-color-accent-indigo-50);  --_bd: var(--hr-color-accent-indigo-600);  --_fg: var(--hr-color-accent-indigo-700);  --_bg-h: var(--hr-color-accent-indigo-100);  --_bd-h: var(--hr-color-accent-indigo-700);  --_fg-h: var(--hr-color-accent-indigo-800);  --_bg-a: var(--hr-color-accent-indigo-200);  --_bd-a: var(--hr-color-accent-indigo-800);  --_fg-a: var(--hr-color-accent-indigo-900);  --_bd-f: var(--hr-color-accent-indigo-300);  --_ring: var(--hr-color-accent-indigo-100); }
.hr-tag--purple      { --_bg: var(--hr-color-accent-purple-50);  --_bd: var(--hr-color-accent-purple-600);  --_fg: var(--hr-color-accent-purple-700);  --_bg-h: var(--hr-color-accent-purple-100);  --_bd-h: var(--hr-color-accent-purple-700);  --_fg-h: var(--hr-color-accent-purple-800);  --_bg-a: var(--hr-color-accent-purple-200);  --_bd-a: var(--hr-color-accent-purple-800);  --_fg-a: var(--hr-color-accent-purple-900);  --_bd-f: var(--hr-color-accent-purple-300);  --_ring: var(--hr-color-accent-purple-100); }
.hr-tag--pink        { --_bg: var(--hr-color-accent-pink-50);  --_bd: var(--hr-color-accent-pink-600);  --_fg: var(--hr-color-accent-pink-700);  --_bg-h: var(--hr-color-accent-pink-100);  --_bd-h: var(--hr-color-accent-pink-700);  --_fg-h: var(--hr-color-accent-pink-800);  --_bg-a: var(--hr-color-accent-pink-100);  --_bd-a: var(--hr-color-accent-pink-800);  --_fg-a: var(--hr-color-accent-pink-900);  --_bd-f: var(--hr-color-accent-pink-300);  --_ring: var(--hr-color-accent-pink-100); }
.hr-tag--rose        { --_bg: var(--hr-color-accent-rose-50);  --_bd: var(--hr-color-accent-rose-600);  --_fg: var(--hr-color-accent-rose-700);  --_bg-h: var(--hr-color-accent-rose-100);  --_bd-h: var(--hr-color-accent-rose-700);  --_fg-h: var(--hr-color-accent-rose-800);  --_bg-a: var(--hr-color-accent-rose-200);  --_bd-a: var(--hr-color-accent-rose-800);  --_fg-a: var(--hr-color-accent-rose-900);  --_bd-f: var(--hr-color-accent-rose-300);  --_ring: var(--hr-color-accent-rose-100); }
.hr-tag--orange-dark { --_bg: var(--hr-color-accent-orange-dark-50);  --_bd: var(--hr-color-accent-orange-dark-600);  --_fg: var(--hr-color-accent-orange-dark-700);  --_bg-h: var(--hr-color-accent-orange-dark-100);  --_bd-h: var(--hr-color-accent-orange-dark-700);  --_fg-h: var(--hr-color-accent-orange-dark-800);  --_bg-a: var(--hr-color-accent-orange-dark-200);  --_bd-a: var(--hr-color-accent-orange-dark-800);  --_fg-a: var(--hr-color-accent-orange-dark-900);  --_bd-f: var(--hr-color-accent-orange-dark-300);  --_ring: var(--hr-color-accent-orange-dark-100); }
/* Gray has its own recipe in Figma: bg 100 · border 300 · label 600 */
.hr-tag--gray        { --_bg: var(--hr-color-neutral-gray-100); --_bd: var(--hr-color-neutral-gray-300); --_fg: var(--hr-color-neutral-gray-600); --_bg-h: var(--hr-color-neutral-gray-100); --_bd-h: var(--hr-color-neutral-gray-400); --_fg-h: var(--hr-color-neutral-gray-800); --_bg-a: var(--hr-color-neutral-gray-200); --_bd-a: var(--hr-color-neutral-gray-600); --_fg-a: var(--hr-color-neutral-gray-900); --_bd-f: var(--hr-color-neutral-gray-300); --_ring: var(--hr-color-neutral-gray-100); }
</style>
