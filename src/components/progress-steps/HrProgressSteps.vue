<script setup lang="ts">
/**
 * HrProgressSteps — HighRise 1.1 Progress Steps (Figma 27043:7342), built from Progress Step
 * (26956:11571) and Progress Step Icon (26955:8706).
 * Step states: completed · current · next · loading · error · warning. Horizontal or vertical.
 * State comes from `current` (earlier steps complete, later steps next) unless a step sets its
 * own `state`. Not built: "Pill Type" (see registry).
 */
import type { Component } from 'vue';

export type StepState = 'completed' | 'current' | 'next' | 'loading' | 'error' | 'warning';
export interface ProgressStep { title: string; hint?: string; state?: StepState; icon?: Component }
const props = withDefaults(defineProps<{ steps: ProgressStep[]; current?: number; direction?: 'horizontal' | 'vertical'; label?: string }>(), { current: 0, direction: 'horizontal', label: 'Progress' });
const stateOf = (s: ProgressStep, i: number): StepState => s.state ?? (i < props.current ? 'completed' : i === props.current ? 'current' : 'next');
const said: Record<StepState, string> = { completed: 'completed', current: 'current step', next: 'not started', loading: 'in progress', error: 'has an error', warning: 'needs attention' };
</script>

<template>
  <ol class="hr-steps" :class="`hr-steps--${direction}`" :aria-label="label">
    <li v-for="(s, i) in steps" :key="i" class="hr-step" :class="`is-${stateOf(s, i)}`" :aria-current="stateOf(s, i) === 'current' ? 'step' : undefined">
      <div class="hr-step__track">
        <span class="hr-step__icon">
          <span v-if="stateOf(s, i) === 'loading'" class="hr-step__spin" aria-hidden="true" />
          <component :is="s.icon" v-else-if="s.icon" :size="16" aria-hidden="true" />
          <svg v-else-if="stateOf(s, i) === 'completed'" viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true"><path d="M13.3 4 6 11.3 2.7 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
          <svg v-else-if="stateOf(s, i) === 'error'" viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true"><circle cx="8" cy="8" r="6.5" stroke="currentColor" stroke-width="1.5" /><path d="M8 7.3v3.4M8 5.3h.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" /></svg>
          <svg v-else-if="stateOf(s, i) === 'warning'" viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true"><path d="M8 2.2 14.3 13H1.7L8 2.2Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" /><path d="M8 6.5v3M8 11.2h.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" /></svg>
          <span v-else aria-hidden="true">{{ i + 1 }}</span>
        </span>
        <span v-if="i < steps.length - 1" class="hr-step__line" aria-hidden="true" />
      </div>
      <div class="hr-step__body">
        <span class="hr-step__title">{{ s.title }}<span class="hr-sr-only">, {{ said[stateOf(s, i)] }}</span></span>
        <span v-if="s.hint" class="hr-step__hint">{{ s.hint }}</span>
      </div>
    </li>
  </ol>
</template>

<style>
.hr-steps { list-style: none; margin: 0; padding: 0; display: flex; font-family: var(--hr-font-family); }
.hr-steps--horizontal { flex-direction: row; }
.hr-steps--vertical { flex-direction: column; }
.hr-step { --_c: var(--hr-color-primary-blue-600); display: flex; gap: 4px; min-width: 0; }
.hr-steps--horizontal .hr-step { flex: 1; flex-direction: column; }
.hr-steps--horizontal .hr-step:last-child { flex: 0 1 auto; }
.hr-steps--vertical .hr-step { flex-direction: row; }
.hr-step__track { display: flex; align-items: center; flex: none; }
.hr-steps--horizontal .hr-step__track { flex-direction: row; padding-right: 16px; }
.hr-steps--vertical .hr-step__track { flex-direction: column; align-self: stretch; padding-bottom: 0; }
.hr-step__icon {
  box-sizing: border-box; flex: none; width: 28px; height: 28px; border-radius: 14px; display: inline-flex; align-items: center; justify-content: center;
  font: var(--hr-text-xl); font-weight: var(--hr-font-weight-semibold);
}
.hr-step__line { flex: 1; background: var(--_line); }
.hr-steps--horizontal .hr-step__line { height: 2px; min-width: 16px; }
.hr-steps--vertical .hr-step__line { width: 2px; min-height: 16px; }
.hr-step__body { display: flex; flex-direction: column; gap: 2px; min-width: 0; padding-right: 16px; }
.hr-steps--vertical .hr-step__body { padding: 4px 0 16px; }
.hr-step__title { font: var(--hr-text-xl); font-weight: var(--hr-font-weight-semibold); color: var(--hr-color-neutral-gray-900); }
.hr-step__hint { font: var(--hr-text-sm); font-weight: var(--hr-font-weight-medium); color: var(--hr-color-neutral-gray-500); }

.hr-step.is-completed { --_line: var(--hr-color-primary-blue-600); }
.hr-step.is-completed .hr-step__icon { background: var(--hr-color-primary-blue-50); border: 1px solid var(--hr-color-primary-blue-600); color: var(--hr-color-primary-blue-600); }
.hr-step.is-current { --_line: var(--hr-color-primary-blue-600); }
.hr-step.is-current .hr-step__icon { background: var(--hr-color-primary-blue-600); border: 1px solid var(--hr-color-primary-blue-600); color: var(--hr-color-neutral-white-base); }
.hr-step.is-next { --_line: var(--hr-color-neutral-gray-300); }
.hr-step.is-next .hr-step__icon { background: var(--hr-color-neutral-white-base); border: 1px solid var(--hr-color-neutral-gray-300); color: var(--hr-color-neutral-gray-400); }
.hr-step.is-next .hr-step__title { color: var(--hr-color-neutral-gray-500); }
.hr-step.is-next .hr-step__hint { color: var(--hr-color-neutral-gray-400); }
.hr-step.is-loading { --_line: var(--hr-color-neutral-gray-300); }
.hr-step.is-error { --_line: var(--hr-color-secondary-error-300); }
.hr-step.is-error .hr-step__icon { background: var(--hr-color-secondary-error-100); border: 1px solid var(--hr-color-secondary-error-300); color: var(--hr-color-secondary-error-600); }
.hr-step.is-error .hr-step__hint { color: var(--hr-color-secondary-error-500); }
.hr-step.is-warning { --_line: var(--hr-color-secondary-warning-300); }
.hr-step.is-warning .hr-step__icon { background: var(--hr-color-secondary-warning-100); border: 1px solid var(--hr-color-secondary-warning-300); color: var(--hr-color-secondary-warning-600); }
.hr-step.is-warning .hr-step__hint { color: var(--hr-color-secondary-warning-600); }
.hr-step__spin { width: 20px; height: 20px; border-radius: 50%; border: 3.4px solid var(--hr-color-primary-blue-50); border-top-color: var(--hr-color-primary-blue-600); animation: hr-spin 800ms linear infinite; }
@keyframes hr-spin { to { transform: rotate(360deg); } }
@media (prefers-reduced-motion: reduce) { .hr-step__spin { animation-duration: 2.4s; } }
.hr-sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
</style>
