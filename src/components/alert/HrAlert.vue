<script setup lang="ts">
/**
 * HrAlert — HighRise 1.1 Alert (Figma 1130:81134). Colours: default, primary, gray, error, warning, success.
 * Title 14/20 Semi Bold, text 13/18, radius 12. Actions go in the #actions slot (use HrButton variant="link").
 */
export type AlertColor = 'default' | 'primary' | 'gray' | 'error' | 'warning' | 'success';
withDefaults(defineProps<{ color?: AlertColor; title?: string; dismissible?: boolean; role?: 'status' | 'alert' }>(), { color: 'default', role: 'status' });
defineEmits<{ dismiss: [] }>();
</script>

<template>
  <div class="hr-alert" :class="`hr-alert--${color}`" :role="role">
    <svg class="hr-alert__icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="8.3" stroke="currentColor" stroke-width="1.67" />
      <path v-if="color === 'success'" d="m6.7 10 2.2 2.2 4.4-4.4" stroke="currentColor" stroke-width="1.67" stroke-linecap="round" stroke-linejoin="round" />
      <path v-else d="M10 6.7V10m0 3.3h.01" stroke="currentColor" stroke-width="1.67" stroke-linecap="round" />
    </svg>
    <div class="hr-alert__body">
      <div v-if="title" class="hr-alert__title">{{ title }}</div>
      <div v-if="$slots.default" class="hr-alert__text"><slot /></div>
      <div v-if="$slots.actions" class="hr-alert__actions"><slot name="actions" /></div>
    </div>
    <div v-if="$slots.aside" class="hr-alert__aside"><slot name="aside" /></div>
    <button v-if="dismissible" type="button" class="hr-alert__close" aria-label="Dismiss" @click="$emit('dismiss')">
      <svg viewBox="0 0 20 20" fill="none"><path d="M15 5 5 15M5 5l10 10" stroke="currentColor" stroke-width="1.67" stroke-linecap="round" /></svg>
    </button>
  </div>
</template>

<style>
.hr-alert {
  display: flex; gap: 8px; align-items: flex-start; padding: 8px; border-radius: 12px;
  background: var(--_bg); border: 1px solid var(--_bd); font-family: var(--hr-font-family);
}
.hr-alert__icon { width: 20px; height: 20px; flex: none; color: var(--_ic); }
.hr-alert__body { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 4px; }
.hr-alert__title { font: var(--hr-text-lg); font-weight: var(--hr-font-weight-semibold); color: var(--_title); }
.hr-alert__text { font: var(--hr-text-md); color: var(--_text); }
.hr-alert__actions { display: flex; gap: 12px; margin-top: 4px; }
.hr-alert__aside { flex: none; align-self: center; display: flex; gap: 8px; }
.hr-alert__close { flex: none; width: 20px; height: 20px; padding: 0; border: 0; background: none; color: var(--hr-color-neutral-gray-600); cursor: pointer; }

.hr-alert--default { --_bg: var(--hr-color-neutral-white-base); --_bd: var(--hr-color-neutral-gray-300); --_title: var(--hr-color-neutral-gray-700); --_text: var(--hr-color-neutral-gray-600); --_ic: var(--hr-color-neutral-gray-700); }
.hr-alert--gray    { --_bg: var(--hr-color-neutral-gray-25); --_bd: var(--hr-color-neutral-gray-300); --_title: var(--hr-color-neutral-gray-700); --_text: var(--hr-color-neutral-gray-600); --_ic: var(--hr-color-neutral-gray-700); }
.hr-alert--primary { --_bg: var(--hr-color-primary-blue-25); --_bd: var(--hr-color-primary-blue-300); --_title: var(--hr-color-primary-blue-700); --_text: var(--hr-color-primary-blue-700); --_ic: var(--hr-color-primary-blue-600); }
.hr-alert--error   { --_bg: var(--hr-color-secondary-error-25); --_bd: var(--hr-color-secondary-error-300); --_title: var(--hr-color-secondary-error-700); --_text: var(--hr-color-secondary-error-700); --_ic: var(--hr-color-secondary-error-600); }
.hr-alert--warning { --_bg: var(--hr-color-secondary-warning-25); --_bd: var(--hr-color-secondary-warning-300); --_title: var(--hr-color-secondary-warning-700); --_text: var(--hr-color-secondary-warning-700); --_ic: var(--hr-color-secondary-warning-600); }
.hr-alert--success { --_bg: var(--hr-color-secondary-success-25); --_bd: var(--hr-color-secondary-success-300); --_title: var(--hr-color-secondary-success-700); --_text: var(--hr-color-secondary-success-700); --_ic: var(--hr-color-secondary-success-600); }
</style>
