<script setup lang="ts">
/**
 * HrModal — HighRise 1.1 Modal (Figma 28471:118828). Radius 8, white, gray/100 border, Shadow/xl.
 * Header 12/16 padding, body 16, footer = divider + 12 top/bottom, actions right-aligned.
 * `side="right"` turns it into a side drawer (same tokens) for quick views.
 * Focus moves into the dialog on open and returns on close; Esc closes.
 */
import { nextTick, onBeforeUnmount, ref, watch } from 'vue';

const open = defineModel<boolean>({ default: false });
const props = withDefaults(defineProps<{ title: string; description?: string; width?: number; side?: 'center' | 'right'; tone?: 'default' | 'destructive' }>(), { width: 480, side: 'center', tone: 'default' });
const panel = ref<HTMLElement>();
let opener: HTMLElement | null = null;
const titleId = `hr-md-${Math.random().toString(36).slice(2, 8)}`;

function close() { open.value = false; }
function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') { e.stopPropagation(); close(); }
  if (e.key === 'Tab' && panel.value) {
    const f = panel.value.querySelectorAll<HTMLElement>('button:not([disabled]), [href], input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])');
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
}
watch(open, async (v) => {
  if (v) { opener = document.activeElement as HTMLElement; await nextTick(); (panel.value?.querySelector<HTMLElement>('[autofocus], input, button.hr-btn--primary') ?? panel.value)?.focus(); }
  else opener?.focus();
}, { immediate: true });
onBeforeUnmount(() => opener?.focus());
void props;
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="hr-modal-overlay" :class="`is-${side}`" @mousedown.self="close" @keydown="onKey">
      <div ref="panel" class="hr-modal" :class="[`hr-modal--${side}`]" role="dialog" aria-modal="true" :aria-labelledby="titleId" tabindex="-1" :style="side === 'center' ? { width: width + 'px' } : { width: Math.max(width, 420) + 'px' }">
        <header class="hr-modal__head">
          <div class="hr-modal__titles">
            <h2 :id="titleId" class="hr-modal__title">{{ title }}</h2>
            <p v-if="description" class="hr-modal__desc">{{ description }}</p>
          </div>
          <button type="button" class="hr-modal__close" aria-label="Close" @click="close">
            <svg viewBox="0 0 20 20" fill="none"><path d="M15 5 5 15M5 5l10 10" stroke="currentColor" stroke-width="1.67" stroke-linecap="round" /></svg>
          </button>
        </header>
        <div class="hr-modal__body"><slot /></div>
        <footer v-if="$slots.footer" class="hr-modal__foot">
          <div class="hr-modal__foot-left"><slot name="footer-left" /></div>
          <div class="hr-modal__foot-right"><slot name="footer" /></div>
        </footer>
      </div>
    </div>
  </Teleport>
</template>

<style>
.hr-modal-overlay { position: fixed; inset: 0; z-index: var(--hr-z-index-8); background: rgba(16, 24, 40, 0.4); display: flex; align-items: center; justify-content: center; padding: 24px; }
.hr-modal-overlay.is-right { justify-content: flex-end; align-items: stretch; padding: 0; }
.hr-modal {
  display: flex; flex-direction: column; max-width: 100%; max-height: 100%; outline: none;
  background: var(--hr-surface-overlay); border: 1px solid var(--hr-color-neutral-gray-100); border-radius: 8px;
  box-shadow: var(--hr-shadow-xl); font-family: var(--hr-font-family);
}
.hr-modal--right { border-radius: 0; height: 100%; animation: hr-slide-in 180ms ease-out; }
@keyframes hr-slide-in { from { transform: translateX(24px); opacity: 0; } }
@media (prefers-reduced-motion: reduce) { .hr-modal--right { animation: none; } }
.hr-modal__head { display: flex; align-items: flex-start; gap: 8px; padding: 12px 16px 0; }
.hr-modal--right .hr-modal__head { padding: 16px 20px 12px; border-bottom: 1px solid var(--hr-color-neutral-gray-200); }
.hr-modal__titles { flex: 1; min-width: 0; padding-top: 6px; }
.hr-modal__title { margin: 0; font: var(--hr-text-2xl); font-weight: var(--hr-font-weight-semibold); color: var(--hr-text-neutral-title-1); }
.hr-modal__desc { margin: 2px 0 0; font: var(--hr-text-md); color: var(--hr-text-neutral-base); }
.hr-modal__close { flex: none; width: 32px; height: 32px; padding: 6px; border: 0; border-radius: 6px; background: none; color: var(--hr-color-neutral-gray-500); cursor: pointer; }
.hr-modal__close:hover { background: var(--hr-color-neutral-gray-50); }
.hr-modal__close:focus-visible { outline: none; box-shadow: var(--hr-focus-ring-neutral); }
.hr-modal__body { padding: 16px; overflow: auto; flex: 1; font: var(--hr-text-md); color: var(--hr-text-neutral-base); }
.hr-modal--right .hr-modal__body { padding: 20px; }
.hr-modal__foot { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 12px 16px; border-top: 1px solid var(--hr-color-neutral-gray-200); }
.hr-modal__foot-right { display: flex; gap: 12px; margin-left: auto; }
.hr-modal__foot-left { display: flex; gap: 12px; }
</style>
