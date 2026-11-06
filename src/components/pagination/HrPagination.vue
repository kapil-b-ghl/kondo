<script setup lang="ts">
/**
 * HrPagination — HighRise 1.1 Pagination (Figma 27457:34219). md: 32px items, 4px gap, radius 4.
 * Current page has a blue/500 border; Previous/Next are secondary buttons (disabled text gray/300).
 */
import { computed } from 'vue';
import HrButton from '../button/HrButton.vue';

const page = defineModel<number>({ default: 1 });
const props = withDefaults(defineProps<{ total: number; perPage?: number; size?: 'sm' | 'md' }>(), { perPage: 20, size: 'md' });
const pages = computed(() => Math.max(1, Math.ceil(props.total / props.perPage)));
const range = computed(() => {
  const n = pages.value, p = page.value;
  if (n <= 7) return Array.from({ length: n }, (_, i) => i + 1);
  const out: (number | '…')[] = [1];
  const a = Math.max(2, p - 1), b = Math.min(n - 1, p + 1);
  if (a > 2) out.push('…');
  for (let i = a; i <= b; i++) out.push(i);
  if (b < n - 1) out.push('…');
  out.push(n);
  return out;
});
const from = computed(() => (props.total ? (page.value - 1) * props.perPage + 1 : 0));
const to = computed(() => Math.min(props.total, page.value * props.perPage));
</script>

<template>
  <nav class="hr-pager" :class="`hr-pager--${size}`" aria-label="Pagination">
    <span class="hr-pager__count">{{ from }}–{{ to }} of {{ total }}</span>
    <div class="hr-pager__items">
      <HrButton variant="secondary" theme="neutral" :size="size === 'md' ? 'xs' : '2xs'" :disabled="page <= 1" @click="page--">Previous</HrButton>
      <template v-for="(p, i) in range" :key="i">
        <span v-if="p === '…'" class="hr-pager__gap">…</span>
        <button v-else type="button" class="hr-pager__num" :aria-current="p === page ? 'page' : undefined" @click="page = p">{{ p }}</button>
      </template>
      <HrButton variant="secondary" theme="neutral" :size="size === 'md' ? 'xs' : '2xs'" :disabled="page >= pages" @click="page++">Next</HrButton>
    </div>
  </nav>
</template>

<style>
.hr-pager { display: flex; align-items: center; justify-content: space-between; gap: 16px; font-family: var(--hr-font-family); }
.hr-pager__count { font: var(--hr-text-md); font-weight: var(--hr-font-weight-medium); color: var(--hr-color-neutral-gray-700); }
.hr-pager__items { display: flex; align-items: center; gap: 4px; }
.hr-pager__num {
  min-width: var(--_s); height: var(--_s); padding: 0 6px; border: 1px solid transparent; border-radius: 4px; background: none; cursor: pointer;
  font: var(--hr-text-md); color: var(--hr-color-neutral-gray-700); font-variant-numeric: tabular-nums;
}
.hr-pager__num:hover { background: var(--hr-color-neutral-gray-50); }
.hr-pager__num[aria-current='page'] { background: var(--hr-color-neutral-white-base); border-color: var(--hr-color-primary-blue-500); }
.hr-pager__num:focus-visible { outline: none; box-shadow: var(--hr-focus-ring-primary); }
.hr-pager__gap { min-width: 20px; text-align: center; color: var(--hr-color-neutral-gray-500); }
.hr-pager--md { --_s: 32px; }
.hr-pager--sm { --_s: 24px; }
</style>
