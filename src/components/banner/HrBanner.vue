<script setup lang="ts">
/**
 * HrBanner — HighRise 1.1 Banner (Figma 28064:69303). Full-width page-level message.
 * Colours: default · primary · gray · error · warning · success. Optional supporting text,
 * actions slot (Link buttons), close, and pagination for a queue of banners (`page`/`pages`).
 * Figma has no border or radius; put it at the top of a page or section.
 */
import { computed } from 'vue';
import { Info, AlertCircle, AlertTriangle, CheckCircle2, X, ChevronLeft, ChevronRight } from 'lucide-vue-next';

export type BannerColor = 'default' | 'primary' | 'gray' | 'error' | 'warning' | 'success';
const props = withDefaults(defineProps<{ color?: BannerColor; title: string; text?: string; dismissible?: boolean; page?: number; pages?: number }>(), { color: 'default' });
const emit = defineEmits<{ dismiss: []; 'update:page': [n: number] }>();
const icon = computed(() => ({ error: AlertCircle, warning: AlertTriangle, success: CheckCircle2 } as Record<string, unknown>)[props.color] ?? Info);
const role = computed(() => (props.color === 'error' || props.color === 'warning' ? 'alert' : 'status'));
</script>

<template>
  <div class="hr-banner" :class="`hr-banner--${color}`" :role="role">
    <div v-if="pages && pages > 1" class="hr-banner__pager">
      <button type="button" class="hr-banner__btn" :disabled="(page ?? 1) <= 1" aria-label="Previous message" @click="emit('update:page', (page ?? 1) - 1)"><ChevronLeft :size="20" /></button>
      <button type="button" class="hr-banner__btn" :disabled="(page ?? 1) >= pages" aria-label="Next message" @click="emit('update:page', (page ?? 1) + 1)"><ChevronRight :size="20" /></button>
    </div>
    <component :is="icon" class="hr-banner__icon" :size="20" aria-hidden="true" />
    <div class="hr-banner__content">
      <div class="hr-banner__text">
        <div class="hr-banner__title">{{ title }}<slot name="title-after" /></div>
        <div v-if="text || $slots.default" class="hr-banner__body"><slot>{{ text }}</slot></div>
      </div>
      <div v-if="$slots.actions" class="hr-banner__actions"><slot name="actions" /></div>
    </div>
    <button v-if="dismissible" type="button" class="hr-banner__btn hr-banner__close" aria-label="Dismiss" @click="emit('dismiss')"><X :size="20" /></button>
  </div>
</template>

<style>
.hr-banner { display: flex; align-items: flex-start; gap: 8px; padding: 8px; background: var(--_bg); font-family: var(--hr-font-family); }
.hr-banner__pager { display: flex; flex: none; }
.hr-banner__icon { flex: none; color: var(--_icon); }
.hr-banner__content { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 4px; }
.hr-banner__text { display: flex; flex-direction: column; gap: 2px; }
.hr-banner__title { display: flex; align-items: center; gap: 8px; font: var(--hr-text-lg); font-weight: var(--hr-font-weight-semibold); color: var(--hr-color-neutral-gray-700); }
.hr-banner__body { font: var(--hr-text-md); color: var(--hr-color-neutral-gray-600); }
.hr-banner__actions { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; }
.hr-banner__btn { display: inline-flex; align-items: center; justify-content: center; padding: 0; border: 0; border-radius: 4px; background: none; color: var(--hr-color-neutral-gray-700); cursor: pointer; }
.hr-banner__btn:disabled { color: var(--hr-color-neutral-gray-300); cursor: default; }
.hr-banner__btn:focus-visible { outline: none; box-shadow: var(--hr-focus-ring-neutral); }
.hr-banner__close { flex: none; color: var(--hr-color-neutral-gray-600); }
.hr-banner--default { --_bg: var(--hr-color-neutral-white-base); --_icon: var(--hr-color-neutral-gray-700); }
.hr-banner--primary { --_bg: var(--hr-color-primary-blue-25); --_icon: var(--hr-color-primary-blue-600); }
.hr-banner--gray    { --_bg: var(--hr-color-neutral-gray-25); --_icon: var(--hr-color-neutral-gray-700); }
.hr-banner--error   { --_bg: var(--hr-color-secondary-error-25); --_icon: var(--hr-color-secondary-error-600); }
.hr-banner--warning { --_bg: var(--hr-color-secondary-warning-25); --_icon: var(--hr-color-secondary-warning-600); }
.hr-banner--success { --_bg: var(--hr-color-secondary-success-25); --_icon: var(--hr-color-secondary-success-600); }
</style>
