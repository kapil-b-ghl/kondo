<script setup lang="ts">
/**
 * HrDatePicker — HighRise 1.1 Date Picker (Figma 1143:85678): Picker Menu (27344:49200) with
 * Dates cells (27344:47235), opened from an Input Field-style trigger.
 * Single date (v-model 'YYYY-MM-DD') or `range` (v-model ['YYYY-MM-DD', 'YYYY-MM-DD']).
 * Views: days → months → years (click the month or year in the header). Footer: optional preset
 * buttons and Cancel / Confirm, as in Figma (Footer Options Position=Bottom).
 * Keyboard on the grid: arrows move a day/week, PageUp/PageDown a month, Enter picks, Esc closes.
 * Not built: Footer Options Position=Left, Date Time Range (see registry).
 */
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { Calendar, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-vue-next';
import HrField from '../field/HrField.vue';
import HrButton from '../button/HrButton.vue';

type Value = string | [string, string] | undefined;
export interface DatePreset { label: string; value: string | [string, string] }
const model = defineModel<Value>();
const props = withDefaults(
  defineProps<{ label?: string; hint?: string; error?: string; placeholder?: string; range?: boolean; min?: string; max?: string; presets?: DatePreset[]; size?: 'xs' | 'sm' | 'md' | 'lg'; disabled?: boolean; required?: boolean; today?: string }>(),
  { size: 'md', presets: () => [] },
);
const uid = `hr-dp-${Math.random().toString(36).slice(2, 8)}`;

const pad = (n: number) => String(n).padStart(2, '0');
const iso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parse = (s?: string) => { if (!s) return undefined; const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const todayIso = computed(() => props.today ?? iso(new Date()));
const fmt = (s?: string) => (s ? parse(s)!.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '');
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const open = ref(false);
const view = ref<'days' | 'months' | 'years'>('days');
const draft = ref<string[]>([]);
const focus = ref(todayIso.value);
const cursor = ref(parse(todayIso.value)!);
const root = ref<HTMLElement>();
const trigger = ref<HTMLButtonElement>();

const display = computed(() => {
  const v = model.value;
  if (!v) return '';
  return Array.isArray(v) ? `${fmt(v[0])} – ${fmt(v[1])}` : fmt(v);
});
function show() {
  if (props.disabled) return;
  const v = model.value;
  draft.value = !v ? [] : Array.isArray(v) ? [...v] : [v];
  focus.value = draft.value[0] ?? todayIso.value;
  cursor.value = parse(focus.value)!;
  view.value = 'days';
  open.value = true;
  nextTick(focusDay);
}
function close(refocus = true) { open.value = false; if (refocus) nextTick(() => trigger.value?.focus()); }
function confirm() { if (props.range) { if (draft.value.length === 2) model.value = [draft.value[0], draft.value[1]]; } else model.value = draft.value[0]; close(); }

const disabledDay = (s: string) => (props.min && s < props.min) || (props.max && s > props.max);
const weeks = computed(() => {
  const y = cursor.value.getFullYear(), m = cursor.value.getMonth();
  const start = new Date(y, m, 1 - new Date(y, m, 1).getDay());
  return Array.from({ length: 42 }, (_, i) => { const d = new Date(start); d.setDate(start.getDate() + i); return { iso: iso(d), day: d.getDate(), out: d.getMonth() !== m }; });
});
const [lo, hi] = [computed(() => [...draft.value].sort()[0]), computed(() => [...draft.value].sort()[1])];
const inRange = (s: string) => props.range && lo.value && hi.value && s > lo.value && s < hi.value;
const isSel = (s: string) => draft.value.includes(s);

function pick(s: string) {
  if (disabledDay(s)) return;
  focus.value = s;
  if (!props.range) draft.value = [s];
  else draft.value = draft.value.length === 1 ? [draft.value[0], s].sort() : [s];
}
function shiftMonth(n: number) { const c = cursor.value; cursor.value = new Date(c.getFullYear(), c.getMonth() + n, 1); }
function moveFocus(days: number) {
  const d = parse(focus.value)!; d.setDate(d.getDate() + days);
  focus.value = iso(d);
  if (d.getMonth() !== cursor.value.getMonth() || d.getFullYear() !== cursor.value.getFullYear()) cursor.value = new Date(d.getFullYear(), d.getMonth(), 1);
  nextTick(focusDay);
}
function focusDay() { (root.value?.querySelector<HTMLElement>(`[data-day="${focus.value}"]`) ?? root.value?.querySelector<HTMLElement>('.hr-dp__day:not(:disabled)'))?.focus(); }
function onGridKey(e: KeyboardEvent) {
  const map: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
  if (map[e.key]) { e.preventDefault(); moveFocus(map[e.key]); }
  else if (e.key === 'PageUp' || e.key === 'PageDown') { e.preventDefault(); const d = parse(focus.value)!; d.setMonth(d.getMonth() + (e.key === 'PageUp' ? -1 : 1)); moveFocus(Math.round((d.getTime() - parse(focus.value)!.getTime()) / 864e5)); }
}
function onKey(e: KeyboardEvent) { if (e.key === 'Escape' && open.value) { e.preventDefault(); close(); } }
function applyPreset(p: DatePreset) { draft.value = Array.isArray(p.value) ? [...p.value] : [p.value]; focus.value = draft.value[0]; cursor.value = parse(focus.value)!; }
const years = computed(() => { const s = cursor.value.getFullYear() - (cursor.value.getFullYear() % 12); return Array.from({ length: 12 }, (_, i) => s + i); });
watch(() => props.today, () => { if (!open.value) cursor.value = parse(todayIso.value)!; });

const outside = (e: MouseEvent) => { if (open.value && root.value && !root.value.contains(e.target as Node)) close(false); };
onMounted(() => document.addEventListener('mousedown', outside));
onBeforeUnmount(() => document.removeEventListener('mousedown', outside));
</script>

<template>
  <HrField :label="label" :hint="hint" :error="error" :required="required" :for-id="uid">
    <div ref="root" class="hr-dp" @keydown="onKey">
      <button
        :id="uid" ref="trigger" type="button" class="hr-input hr-dp__trigger" :class="[`hr-input--${size}`, { 'is-error': error, 'is-disabled': disabled }]"
        :disabled="disabled" aria-haspopup="dialog" :aria-expanded="open" :aria-invalid="!!error || undefined" @click="open ? close() : show()"
      >
        <span class="hr-input__icon"><Calendar /></span>
        <span class="hr-dp__value" :class="{ 'is-placeholder': !display }">{{ display || placeholder || (range ? 'Select dates' : 'Select date') }}</span>
      </button>

      <div v-if="open" class="hr-dp__menu" role="dialog" :aria-label="label || 'Choose date'">
        <div class="hr-dp__head">
          <div class="hr-dp__nav">
            <HrButton variant="ghost" theme="neutral" size="2xs" icon-only aria-label="Previous year" @click="shiftMonth(view === 'years' ? -144 : -12)"><ChevronsLeft /></HrButton>
            <HrButton v-if="view === 'days'" variant="ghost" theme="neutral" size="2xs" icon-only aria-label="Previous month" @click="shiftMonth(-1)"><ChevronLeft /></HrButton>
          </div>
          <div class="hr-dp__title" aria-live="polite">
            <button v-if="view === 'days'" type="button" class="hr-dp__cell hr-dp__titlebtn" @click="view = 'months'">{{ MONTHS[cursor.getMonth()] }}</button>
            <button type="button" class="hr-dp__cell hr-dp__titlebtn" @click="view = 'years'">{{ view === 'years' ? `${years[0]} – ${years[11]}` : cursor.getFullYear() }}</button>
          </div>
          <div class="hr-dp__nav">
            <HrButton v-if="view === 'days'" variant="ghost" theme="neutral" size="2xs" icon-only aria-label="Next month" @click="shiftMonth(1)"><ChevronRight /></HrButton>
            <HrButton variant="ghost" theme="neutral" size="2xs" icon-only aria-label="Next year" @click="shiftMonth(view === 'years' ? 144 : 12)"><ChevronsRight /></HrButton>
          </div>
        </div>

        <template v-if="view === 'days'">
          <div class="hr-dp__dow" aria-hidden="true"><span v-for="d in DAYS" :key="d">{{ d }}</span></div>
          <div class="hr-dp__grid" role="grid" :aria-label="`${MONTHS[cursor.getMonth()]} ${cursor.getFullYear()}`" @keydown="onGridKey">
            <button
              v-for="c in weeks" :key="c.iso" type="button" role="gridcell" class="hr-dp__cell hr-dp__day" :data-day="c.iso"
              :class="{ 'is-out': c.out, 'is-today': c.iso === todayIso, 'is-selected': isSel(c.iso), 'is-range': inRange(c.iso), 'is-start': range && draft.length === 2 && c.iso === lo, 'is-end': range && draft.length === 2 && c.iso === hi }"
              :tabindex="c.iso === focus ? 0 : -1" :disabled="!!disabledDay(c.iso)" :aria-selected="isSel(c.iso)" :aria-current="c.iso === todayIso ? 'date' : undefined"
              :aria-label="parse(c.iso)!.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })"
              @click="pick(c.iso)" @keydown.enter.prevent="pick(c.iso)"
            >{{ c.day }}</button>
          </div>
        </template>
        <div v-else-if="view === 'months'" class="hr-dp__picks">
          <button v-for="(m, i) in MONTHS" :key="m" type="button" class="hr-dp__cell hr-dp__pick" :class="{ 'is-selected': i === cursor.getMonth() }" @click="cursor = new Date(cursor.getFullYear(), i, 1); view = 'days'">{{ m }}</button>
        </div>
        <div v-else class="hr-dp__picks">
          <button v-for="y in years" :key="y" type="button" class="hr-dp__cell hr-dp__pick" :class="{ 'is-selected': y === cursor.getFullYear() }" @click="cursor = new Date(y, cursor.getMonth(), 1); view = 'months'">{{ y }}</button>
        </div>

        <div v-if="presets.length" class="hr-dp__presets">
          <HrButton v-for="p in presets" :key="p.label" variant="secondary" theme="neutral" size="3xs" @click="applyPreset(p)">{{ p.label }}</HrButton>
        </div>
        <div class="hr-dp__actions">
          <HrButton variant="secondary" theme="neutral" size="2xs" @click="close()">Cancel</HrButton>
          <HrButton size="2xs" :disabled="range ? draft.length !== 2 : !draft.length" @click="confirm">Confirm</HrButton>
        </div>
      </div>
    </div>
  </HrField>
</template>

<style>
.hr-dp { position: relative; }
.hr-dp__trigger { width: 100%; text-align: left; cursor: pointer; font-family: var(--hr-font-family); }
.hr-dp__trigger:focus-visible { outline: none; border-color: var(--hr-color-primary-blue-300); box-shadow: var(--hr-shadow-xs), var(--hr-focus-ring-primary); }
.hr-dp__trigger:disabled { cursor: not-allowed; }
.hr-dp__value { flex: 1; min-width: 0; font: var(--_font); color: var(--hr-color-neutral-gray-900); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.hr-dp__value.is-placeholder { color: var(--hr-color-neutral-gray-500); }
.hr-dp__trigger:disabled .hr-dp__value { color: var(--hr-color-neutral-gray-400); }
.hr-dp__menu {
  position: absolute; top: calc(100% + 4px); left: 0; z-index: var(--hr-z-index-6); width: 280px; box-sizing: border-box;
  display: flex; flex-direction: column; gap: 8px; padding: 8px;
  background: var(--hr-color-neutral-white-base); border: 1px solid var(--hr-color-neutral-gray-100); border-radius: 8px; box-shadow: var(--hr-shadow-md);
  font-family: var(--hr-font-family);
}
.hr-dp__head { display: flex; align-items: center; justify-content: space-between; }
.hr-dp__nav { display: flex; width: 56px; }
.hr-dp__nav:last-child { justify-content: flex-end; }
.hr-dp__title { display: flex; gap: 2px; }
.hr-dp__cell { box-sizing: border-box; border: 0; background: none; padding: 0; border-radius: 4px; cursor: pointer; font-family: var(--hr-font-family); }
.hr-dp__cell:focus-visible { outline: none; box-shadow: var(--hr-focus-ring-primary); }
.hr-dp__titlebtn { height: 24px; padding: 0 4px; font: var(--hr-text-2xl); font-weight: var(--hr-font-weight-semibold); color: var(--hr-color-neutral-gray-800); }
.hr-dp__titlebtn:hover { background: var(--hr-color-neutral-gray-100); }
.hr-dp__dow { display: grid; grid-template-columns: repeat(7, 24px); column-gap: 16px; padding: 8px 0; border-bottom: 1px solid var(--hr-color-neutral-gray-100); }
.hr-dp__dow span { text-align: center; font: var(--hr-text-lg); font-weight: var(--hr-font-weight-semibold); color: var(--hr-color-neutral-gray-400); }
.hr-dp__grid { display: grid; grid-template-columns: repeat(7, 24px); column-gap: 16px; row-gap: 8px; }
.hr-dp__day { position: relative; width: 24px; height: 24px; font: var(--hr-text-md); font-weight: var(--hr-font-weight-medium); color: var(--hr-color-neutral-gray-600); }
.hr-dp__day.is-out { color: var(--hr-color-neutral-gray-300); }
.hr-dp__day:hover:not(:disabled) { background: var(--hr-color-neutral-gray-100); color: var(--hr-color-neutral-gray-900); }
.hr-dp__day:disabled { color: var(--hr-color-neutral-gray-300); cursor: not-allowed; }
.hr-dp__day.is-today::after { content: ''; position: absolute; left: 50%; bottom: 0; width: 4px; height: 4px; margin-left: -2px; border-radius: 50%; background: var(--hr-color-primary-blue-600); }
.hr-dp__day.is-range { border-radius: 0; background: var(--hr-color-primary-blue-50); }
.hr-dp__day.is-range:hover { background: var(--hr-color-primary-blue-100); }
.hr-dp__day.is-range::before, .hr-dp__day.is-end::before { content: ''; position: absolute; top: 0; bottom: 0; left: -16px; width: 16px; background: var(--hr-color-primary-blue-50); }
.hr-dp__day:nth-child(7n + 1)::before { display: none; }
.hr-dp__day.is-selected { background: var(--hr-color-primary-blue-50); box-shadow: inset 0 0 0 1px var(--hr-color-primary-blue-600); color: var(--hr-color-primary-blue-900); font-weight: var(--hr-font-weight-semibold); }
.hr-dp__day.is-selected:hover:not(:disabled) { background: var(--hr-color-primary-blue-900); color: var(--hr-color-neutral-white-base); }
.hr-dp__day.is-selected.is-today::after { background: var(--hr-color-primary-blue-900); }
.hr-dp__day.is-selected:hover.is-today::after { background: var(--hr-color-neutral-white-base); }
.hr-dp__day.is-start { border-radius: 4px 0 0 4px; }
.hr-dp__day.is-end { border-radius: 0 4px 4px 0; }
.hr-dp__day.is-selected:focus-visible { box-shadow: inset 0 0 0 1px var(--hr-color-primary-blue-600), var(--hr-focus-ring-primary); }
.hr-dp__picks { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; padding: 8px 0; }
.hr-dp__pick { height: 32px; font: var(--hr-text-md); font-weight: var(--hr-font-weight-medium); color: var(--hr-color-neutral-gray-600); }
.hr-dp__pick:hover { background: var(--hr-color-neutral-gray-100); color: var(--hr-color-neutral-gray-900); }
.hr-dp__pick.is-selected { background: var(--hr-color-primary-blue-50); box-shadow: inset 0 0 0 1px var(--hr-color-primary-blue-600); color: var(--hr-color-primary-blue-900); font-weight: var(--hr-font-weight-semibold); }
.hr-dp__presets { display: flex; flex-wrap: wrap; gap: 6px; }
.hr-dp__actions { display: grid; grid-template-columns: 1fr 1fr; gap: 4px; }
.hr-dp__actions > * { width: 100%; }
</style>
