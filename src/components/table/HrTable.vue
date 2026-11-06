<script setup lang="ts" generic="Row extends Record<string, unknown>">
/**
 * HrTable — HighRise 1.1 Table (Cell 28471:129537, Row Content 28471:131709).
 * Header cell: 36px, gray/50, 12px side padding, 14/20 Semi Bold gray-900.
 * Body cell: 14/20 Medium gray-600, hover gray/50, "Hover Clickable" when rows open something.
 * Columns use slots named `cell-<key>` for custom content (tags, links).
 */
export interface Column { key: string; label: string; align?: 'left' | 'right'; width?: string; hideBelow?: number; primary?: boolean }
defineProps<{ columns: Column[]; rows: Row[]; rowKey: keyof Row; clickable?: boolean; caption?: string; empty?: string; selectedKey?: unknown }>();
defineEmits<{ rowClick: [Row] }>();
</script>

<template>
  <div class="hr-table-wrap">
    <table class="hr-table" :class="{ 'is-clickable': clickable }">
      <caption v-if="caption" class="hr-sr-only">{{ caption }}</caption>
      <thead>
        <tr>
          <th v-for="c in columns" :key="c.key" scope="col" :style="{ width: c.width, textAlign: c.align }" :class="c.hideBelow ? `hide-below-${c.hideBelow}` : ''">{{ c.label }}</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="r in rows" :key="String(r[rowKey])" :class="{ 'is-selected': selectedKey !== undefined && r[rowKey] === selectedKey }"
          :tabindex="clickable ? 0 : undefined" @click="clickable && $emit('rowClick', r)" @keydown.enter="clickable && $emit('rowClick', r)"
        >
          <td v-for="c in columns" :key="c.key" :style="{ textAlign: c.align }" :class="[c.hideBelow ? `hide-below-${c.hideBelow}` : '', { 'is-primary': c.primary }]">
            <slot :name="`cell-${c.key}`" :row="r">{{ r[c.key] }}</slot>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="!rows.length" class="hr-table__empty"><slot name="empty">{{ empty ?? 'Nothing to show yet.' }}</slot></div>
  </div>
</template>

<style>
.hr-table-wrap { width: 100%; overflow-x: auto; }
.hr-table { width: 100%; border-collapse: collapse; font-family: var(--hr-font-family); }
.hr-table th {
  height: 36px; padding: 0 12px; text-align: left; white-space: nowrap;
  background: var(--hr-color-neutral-gray-50); border-bottom: 1px solid var(--hr-color-neutral-gray-300);
  font: var(--hr-text-lg); font-weight: var(--hr-font-weight-semibold); color: var(--hr-color-neutral-gray-900);
}
.hr-table td {
  height: 48px; padding: 0 12px; border-bottom: 1px solid var(--hr-color-neutral-gray-200); white-space: nowrap;
  font: var(--hr-text-lg); font-weight: var(--hr-font-weight-medium); color: var(--hr-color-neutral-gray-600);
  font-variant-numeric: tabular-nums;
}
.hr-table td.is-primary { color: var(--hr-color-neutral-gray-900); font-weight: var(--hr-font-weight-semibold); }
.hr-table th:first-child, .hr-table td:first-child { padding-left: 20px; }
.hr-table th:last-child, .hr-table td:last-child { padding-right: 20px; }
.hr-table tbody tr:hover td { background: var(--hr-color-neutral-gray-50); }
.hr-table.is-clickable tbody tr { cursor: pointer; }
.hr-table.is-clickable tbody tr:focus-visible { outline: none; box-shadow: inset 0 0 0 2px var(--hr-color-primary-blue-500); }
.hr-table tbody tr.is-selected td { background: var(--hr-color-primary-blue-25); }
.hr-table tbody tr:last-child td { border-bottom: 0; }
.hr-table__empty { padding: 32px 20px; text-align: center; font: var(--hr-text-lg); color: var(--hr-text-neutral-base); }
.hr-sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
@media (max-width: 760px) { .hide-below-760 { display: none; } }
@media (max-width: 1100px) { .hide-below-1100 { display: none; } }
</style>
