<script setup lang="ts">
/**
 * HrButton — HighRise 1.1 Button (Figma 26682:45841).
 * Colours and sizes come from button.generated.css, built from the Figma spec.
 * Do not add per-instance colour overrides; pick a variant + theme instead.
 */
import './button.generated.css';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'link';
export type ButtonTheme = 'primary' | 'neutral' | 'destructive' | 'warning' | 'success';
export type ButtonSize = '3xs' | '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

const props = withDefaults(
  defineProps<{
    variant?: ButtonVariant;
    theme?: ButtonTheme;
    size?: ButtonSize;
    /** Square button that shows only the icon slot. Needs an aria-label. */
    iconOnly?: boolean;
    disabled?: boolean;
    loading?: boolean;
    block?: boolean;
    type?: 'button' | 'submit' | 'reset';
    /** Render as a link instead of a <button>. */
    href?: string;
  }>(),
  { variant: 'primary', theme: 'primary', size: 'md', type: 'button' },
);
defineEmits<{ click: [MouseEvent] }>();
</script>

<template>
  <component
    :is="href ? 'a' : 'button'"
    :href="href && !disabled ? href : undefined"
    :type="href ? undefined : type"
    :disabled="href ? undefined : disabled || loading"
    :aria-disabled="disabled || loading || undefined"
    :aria-busy="loading || undefined"
    class="hr-btn"
    :class="[
      `hr-btn--${props.variant}`,
      `hr-btn--${props.theme}`,
      `hr-btn--${props.size}`,
      { 'hr-btn--icon-only': iconOnly, 'hr-btn--block': block, 'hr-btn--loading': loading },
    ]"
    @click="(e: MouseEvent) => !(disabled || loading) && $emit('click', e)"
  >
    <span v-if="loading" class="hr-btn__spinner" aria-hidden="true" />
    <span v-else-if="$slots.leading || (iconOnly && $slots.default)" class="hr-btn__icon">
      <slot :name="iconOnly ? 'default' : 'leading'" />
    </span>
    <span v-if="!iconOnly" class="hr-btn__label"><slot /></span>
    <span v-if="$slots.trailing && !iconOnly" class="hr-btn__icon"><slot name="trailing" /></span>
  </component>
</template>

<style>
.hr-btn {
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--_gap);
  height: var(--_h);
  padding: var(--_py) var(--_px);
  border-radius: var(--_r);
  border: var(--hr-border-width-default) solid var(--_bd);
  background: var(--_bg);
  color: var(--_fg);
  box-shadow: var(--_fx);
  font-family: var(--hr-font-family);
  font-size: var(--_fs);
  line-height: var(--_lh);
  font-weight: var(--hr-font-weight-semibold);
  white-space: nowrap;
  text-decoration: none;
  cursor: pointer;
  user-select: none;
  transition: background-color 120ms, border-color 120ms, color 120ms, box-shadow 120ms;
}
.hr-btn:hover { background: var(--_bg-hover); border-color: var(--_bd-hover); color: var(--_fg-hover); box-shadow: var(--_fx-hover); }
.hr-btn:active { background: var(--_bg-active); border-color: var(--_bd-active); color: var(--_fg-active); box-shadow: var(--_fx-active); }
.hr-btn:focus { outline: none; }
.hr-btn:focus-visible { background: var(--_bg-focussed); border-color: var(--_bd-focussed); color: var(--_fg-focussed); box-shadow: var(--_fx-focussed); }
.hr-btn:disabled, .hr-btn[aria-disabled='true'] {
  background: var(--_bg-disabled); border-color: var(--_bd-disabled); color: var(--_fg-disabled); box-shadow: var(--_fx-disabled);
  cursor: not-allowed;
}
.hr-btn--loading { cursor: progress; }

/* Link: no box, text-only sizing (Figma Link variants are 0×0 padding) */
.hr-btn--link { height: auto; padding: 0; border-width: 0; border-radius: var(--hr-border-radius-1); }
.hr-btn--link:hover .hr-btn__label { text-decoration: underline; }

.hr-btn--icon-only { width: var(--_h); padding: 0; }
.hr-btn--block { display: flex; width: 100%; }

.hr-btn__icon { display: inline-flex; width: var(--_icon); height: var(--_icon); flex: none; }
.hr-btn__icon > svg { width: 100%; height: 100%; }
.hr-btn__spinner {
  width: var(--_icon); height: var(--_icon); flex: none; box-sizing: border-box;
  border-radius: 50%; border: 2px solid currentColor; border-right-color: transparent;
  animation: hr-spin 700ms linear infinite;
}
@keyframes hr-spin { to { transform: rotate(360deg); } }
@media (prefers-reduced-motion: reduce) { .hr-btn__spinner { animation-duration: 2s; } }
</style>
