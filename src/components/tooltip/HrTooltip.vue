<script setup lang="ts">
/**
 * HrTooltip — HighRise 1.1 Tooltip (Figma 26683:76792).
 * Wraps a trigger; shows on hover and keyboard focus. Padding 8, radius 4, Shadow/lg,
 * title 12/17 Semi Bold, supporting text 12/17 Medium.
 */
import { ref } from 'vue';

export type TooltipTheme = 'light' | 'dark' | 'info' | 'gray' | 'success' | 'warning' | 'error';
export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';
withDefaults(defineProps<{ title?: string; text?: string; theme?: TooltipTheme; placement?: TooltipPlacement; arrow?: boolean; maxWidth?: number }>(), {
  theme: 'dark', placement: 'top', arrow: true, maxWidth: 320,
});
const open = ref(false);
const id = `hr-tt-${Math.random().toString(36).slice(2, 8)}`;
</script>

<template>
  <span class="hr-tooltip" @mouseenter="open = true" @mouseleave="open = false" @focusin="open = true" @focusout="open = false" @keydown.esc="open = false">
    <span :aria-describedby="id"><slot /></span>
    <span v-show="open" :id="id" role="tooltip" class="hr-tooltip__bubble" :class="[`hr-tooltip--${theme}`, `hr-tooltip--${placement}`, { 'has-arrow': arrow }]" :style="{ maxWidth: maxWidth + 'px' }">
      <span v-if="title" class="hr-tooltip__title">{{ title }}</span>
      <span v-if="text || $slots.content" class="hr-tooltip__text"><slot name="content">{{ text }}</slot></span>
    </span>
  </span>
</template>

<style>
.hr-tooltip { position: relative; display: inline-flex; }
.hr-tooltip__bubble {
  position: absolute; z-index: var(--hr-z-index-5); width: max-content;
  display: flex; flex-direction: column; gap: 2px; padding: 8px; border-radius: 4px;
  background: var(--_bg); border: 1px solid var(--_bd); box-shadow: var(--hr-shadow-lg);
  font-family: var(--hr-font-family); pointer-events: none;
}
.hr-tooltip__title { font: var(--hr-text-sm); font-weight: var(--hr-font-weight-semibold); color: var(--_title); }
.hr-tooltip__text { font: var(--hr-text-sm); font-weight: var(--hr-font-weight-medium); color: var(--_text); }
.hr-tooltip__bubble.has-arrow::after { content: ''; position: absolute; width: 8px; height: 8px; background: var(--_bg); border: inherit; transform: rotate(45deg); }
.hr-tooltip--top    { bottom: calc(100% + 8px); left: 50%; translate: -50% 0; }
.hr-tooltip--bottom { top: calc(100% + 8px); left: 50%; translate: -50% 0; }
.hr-tooltip--left   { right: calc(100% + 8px); top: 50%; translate: 0 -50%; }
.hr-tooltip--right  { left: calc(100% + 8px); top: 50%; translate: 0 -50%; }
.hr-tooltip--top.has-arrow::after    { bottom: -5px; left: calc(50% - 4px); border-top: 0; border-left: 0; }
.hr-tooltip--bottom.has-arrow::after { top: -5px; left: calc(50% - 4px); border-bottom: 0; border-right: 0; }
.hr-tooltip--left.has-arrow::after   { right: -5px; top: calc(50% - 4px); border-bottom: 0; border-left: 0; }
.hr-tooltip--right.has-arrow::after  { left: -5px; top: calc(50% - 4px); border-top: 0; border-right: 0; }

.hr-tooltip--light   { --_bg: var(--hr-color-neutral-white-base); --_bd: transparent; --_title: var(--hr-color-neutral-gray-700); --_text: var(--hr-color-neutral-gray-500); }
.hr-tooltip--dark    { --_bg: var(--hr-color-neutral-gray-900); --_bd: transparent; --_title: var(--hr-color-neutral-white-base); --_text: var(--hr-color-neutral-white-base); }
.hr-tooltip--info    { --_bg: var(--hr-color-primary-blue-25); --_bd: var(--hr-color-primary-blue-300); --_title: var(--hr-color-primary-blue-700); --_text: var(--hr-color-primary-blue-600); }
.hr-tooltip--gray    { --_bg: var(--hr-color-neutral-gray-25); --_bd: var(--hr-color-neutral-gray-300); --_title: var(--hr-color-neutral-gray-700); --_text: var(--hr-color-neutral-gray-600); }
.hr-tooltip--success { --_bg: var(--hr-color-secondary-success-25); --_bd: var(--hr-color-secondary-success-300); --_title: var(--hr-color-secondary-success-700); --_text: var(--hr-color-secondary-success-600); }
.hr-tooltip--warning { --_bg: var(--hr-color-secondary-warning-25); --_bd: var(--hr-color-secondary-warning-300); --_title: var(--hr-color-secondary-warning-700); --_text: var(--hr-color-secondary-warning-600); }
.hr-tooltip--error   { --_bg: var(--hr-color-secondary-error-25); --_bd: var(--hr-color-secondary-error-300); --_title: var(--hr-color-secondary-error-700); --_text: var(--hr-color-secondary-error-600); }
</style>
