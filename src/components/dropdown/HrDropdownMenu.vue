<script setup lang="ts">
/**
 * HrDropdownMenu — HighRise 1.1 Dropdown (Figma 28430:223073) with Dropdown List Item
 * (26683:55162): menu items with icon, description, selected check, disabled; group titles;
 * dividers; optional search; single or multi select (checkbox items).
 * The trigger is your own element in the default slot (usually an HrButton); the menu opens on
 * click, ↓ or Enter. Keyboard: ↑ ↓ Home End move, Enter/Space choose, Esc closes, type-ahead.
 * Emits `select` for action menus; use v-model for single (value) or multi (array) selection.
 */
import { computed, nextTick, onBeforeUnmount, onMounted, ref, type Component } from 'vue';
import HrCheckbox from '../checkbox/HrCheckbox.vue';

export interface DropdownItem {
  label?: string; value?: string | number; description?: string; icon?: Component; disabled?: boolean; danger?: boolean;
  type?: 'item' | 'group' | 'divider';
}
const model = defineModel<string | number | (string | number)[] | undefined>();
const props = withDefaults(
  defineProps<{ items: DropdownItem[]; multiple?: boolean; searchable?: boolean; searchPlaceholder?: string; align?: 'start' | 'end'; width?: string; label?: string }>(),
  { searchPlaceholder: 'Search', align: 'start' },
);
const emit = defineEmits<{ select: [item: DropdownItem] }>();
const uid = `hr-dd-${Math.random().toString(36).slice(2, 8)}`;
const open = ref(false);
const q = ref('');
const active = ref(-1);
const root = ref<HTMLElement>();
const search = ref<HTMLInputElement>();

const visible = computed(() => {
  if (!q.value) return props.items;
  const s = q.value.toLowerCase();
  return props.items.filter((i) => (i.type ?? 'item') === 'item' && i.label?.toLowerCase().includes(s));
});
const selectable = computed(() => visible.value.map((it, i) => ({ it, i })).filter(({ it }) => (it.type ?? 'item') === 'item' && !it.disabled));
const isSelected = (it: DropdownItem) => (props.multiple ? Array.isArray(model.value) && model.value.includes(it.value!) : it.value !== undefined && model.value === it.value);

function show(v = !open.value) {
  open.value = v;
  if (v) {
    q.value = '';
    nextTick(() => {
      const sel = selectable.value.find(({ it }) => isSelected(it));
      active.value = sel ? sel.i : selectable.value[0]?.i ?? -1;
      if (props.searchable) search.value?.focus(); else root.value?.querySelector<HTMLElement>('.hr-dd__menu')?.focus();
    });
  }
}
function close(refocus = true) { open.value = false; if (refocus) root.value?.querySelector<HTMLElement>('.hr-dd__trigger > *')?.focus(); }
function choose(it: DropdownItem) {
  if (it.disabled || (it.type ?? 'item') !== 'item') return;
  if (props.multiple) {
    const cur = Array.isArray(model.value) ? [...model.value] : [];
    const k = cur.indexOf(it.value!);
    if (k >= 0) cur.splice(k, 1); else cur.push(it.value!);
    model.value = cur;
  } else {
    if (it.value !== undefined) model.value = it.value;
    close();
  }
  emit('select', it);
}
function move(d: number) {
  const s = selectable.value; if (!s.length) return;
  const at = s.findIndex(({ i }) => i === active.value);
  active.value = s[(at + d + s.length) % s.length].i;
  nextTick(() => root.value?.querySelector('.hr-dd__item.is-active')?.scrollIntoView({ block: 'nearest' }));
}
function onKey(e: KeyboardEvent) {
  if (!open.value) { if (['ArrowDown', 'Enter', ' '].includes(e.key)) { e.preventDefault(); show(true); } return; }
  if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
  else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
  else if (e.key === 'Home') { e.preventDefault(); active.value = selectable.value[0]?.i ?? -1; }
  else if (e.key === 'End') { e.preventDefault(); active.value = selectable.value.at(-1)?.i ?? -1; }
  else if (e.key === 'Enter' || (e.key === ' ' && !props.searchable)) { e.preventDefault(); const it = visible.value[active.value]; if (it) choose(it); }
  else if (e.key === 'Escape' || e.key === 'Tab') { if (e.key === 'Escape') e.preventDefault(); close(e.key === 'Escape'); }
  else if (!props.searchable && e.key.length === 1) { const hit = selectable.value.find(({ it }) => it.label?.toLowerCase().startsWith(e.key.toLowerCase())); if (hit) active.value = hit.i; }
}
const outside = (e: MouseEvent) => { if (open.value && root.value && !root.value.contains(e.target as Node)) close(false); };
onMounted(() => document.addEventListener('mousedown', outside));
onBeforeUnmount(() => document.removeEventListener('mousedown', outside));
</script>

<template>
  <div ref="root" class="hr-dd" @keydown="onKey">
    <span class="hr-dd__trigger" :aria-expanded="open" aria-haspopup="menu" :aria-controls="uid" @click="show()"><slot :open="open" /></span>
    <div v-if="open" :id="uid" class="hr-dd__menu" :class="`is-${align}`" :style="width ? { width } : undefined" :role="multiple || model !== undefined ? 'listbox' : 'menu'" :aria-multiselectable="multiple || undefined" :aria-label="label" tabindex="-1" :aria-activedescendant="active >= 0 ? `${uid}-${active}` : undefined">
      <div v-if="searchable" class="hr-dd__search">
        <svg viewBox="0 0 16 16" width="12" height="12" fill="none" aria-hidden="true"><circle cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.5" /><path d="m11 11 3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" /></svg>
        <input ref="search" v-model="q" type="text" :placeholder="searchPlaceholder" :aria-label="searchPlaceholder" @input="active = selectable[0]?.i ?? -1" />
      </div>
      <template v-for="(it, i) in visible" :key="i">
        <div v-if="it.type === 'divider'" class="hr-dd__divider" role="separator" />
        <div v-else-if="it.type === 'group'" class="hr-dd__group" role="presentation"><component :is="it.icon" v-if="it.icon" :size="12" aria-hidden="true" />{{ it.label }}</div>
        <div
          v-else :id="`${uid}-${i}`" class="hr-dd__item" :class="{ 'is-active': i === active, 'is-selected': isSelected(it) && !multiple, 'is-disabled': it.disabled, 'is-danger': it.danger }"
          :role="multiple || model !== undefined ? 'option' : 'menuitem'" :aria-selected="multiple || model !== undefined ? isSelected(it) : undefined" :aria-disabled="it.disabled || undefined"
          @mousemove="!it.disabled && (active = i)" @click="choose(it)"
        >
          <HrCheckbox v-if="multiple" :model-value="isSelected(it)" size="xs" :disabled="it.disabled" tabindex="-1" aria-hidden="true" class="hr-dd__cb" @click.prevent />
          <component :is="it.icon" v-if="it.icon" class="hr-dd__icon" :size="14" aria-hidden="true" />
          <span class="hr-dd__text"><span class="hr-dd__label">{{ it.label }}</span><span v-if="it.description" class="hr-dd__desc">{{ it.description }}</span></span>
          <svg v-if="!multiple && isSelected(it)" class="hr-dd__check" viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true"><path d="M13.3 4 6 11.3 2.7 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
        </div>
      </template>
      <div v-if="!selectable.length" class="hr-dd__empty">No matches</div>
    </div>
  </div>
</template>

<style>
.hr-dd { position: relative; display: inline-flex; }
.hr-dd__trigger { display: inline-flex; }
.hr-dd__menu {
  position: absolute; top: calc(100% + 4px); z-index: var(--hr-z-index-6); min-width: 182px; max-height: 320px; overflow: auto;
  display: flex; flex-direction: column; gap: 2px; padding: 4px 0; box-sizing: border-box;
  background: var(--hr-color-neutral-white-base); border: 1px solid var(--hr-color-neutral-gray-300); border-radius: 4px; box-shadow: var(--hr-shadow-md);
  font-family: var(--hr-font-family); outline: none;
}
.hr-dd__menu.is-start { left: 0; }
.hr-dd__menu.is-end { right: 0; }
.hr-dd__item { display: flex; align-items: center; gap: 8px; padding: 4px 8px; min-height: 26px; box-sizing: border-box; cursor: pointer; color: var(--hr-color-neutral-gray-700); }
.hr-dd__item.is-active { background: var(--hr-color-neutral-gray-100); }
.hr-dd__item.is-selected { background: var(--hr-color-primary-blue-50); }
.hr-dd__item.is-disabled { background: var(--hr-color-neutral-gray-50); color: var(--hr-color-neutral-gray-400); cursor: not-allowed; }
.hr-dd__item.is-danger .hr-dd__label { color: var(--hr-color-secondary-error-700); }
.hr-dd__icon { flex: none; color: var(--hr-color-neutral-gray-600); }
.hr-dd__item.is-disabled .hr-dd__icon { color: var(--hr-color-neutral-gray-300); }
.hr-dd__text { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.hr-dd__label { font: var(--hr-text-md); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.hr-dd__desc { font: var(--hr-text-xs); color: var(--hr-color-neutral-gray-600); }
.hr-dd__item.is-disabled .hr-dd__desc { color: var(--hr-color-neutral-gray-400); }
.hr-dd__check { flex: none; color: var(--hr-color-primary-blue-700); }
.hr-dd__cb { pointer-events: none; }
.hr-dd__group { display: flex; align-items: center; gap: 4px; padding: 8px 10px 4px 8px; background: var(--hr-color-neutral-gray-50); font: var(--hr-text-xs); font-weight: var(--hr-font-weight-medium); text-transform: uppercase; color: var(--hr-color-neutral-gray-400); }
.hr-dd__divider { height: 1px; background: var(--hr-color-neutral-gray-200); }
.hr-dd__search { display: flex; align-items: center; gap: 8px; margin: 4px 8px; height: 28px; padding: 0 8px; border: 1px solid var(--hr-color-neutral-gray-300); border-radius: 4px; color: var(--hr-color-neutral-gray-500); }
.hr-dd__search:focus-within { border-color: var(--hr-color-primary-blue-300); box-shadow: var(--hr-focus-ring-primary); }
.hr-dd__search input { flex: 1; min-width: 0; border: 0; outline: 0; background: transparent; font: var(--hr-text-lg); color: var(--hr-color-neutral-gray-900); }
.hr-dd__search input::placeholder { color: var(--hr-color-neutral-gray-500); }
.hr-dd__empty { padding: 8px; font: var(--hr-text-md); color: var(--hr-color-neutral-gray-500); }
</style>
