<script setup lang="ts">
// Shows the generated handoff for one prototype, rendered from its markdown, with a copy button.
import { computed, ref } from 'vue';
import LibraryLayout from './LibraryLayout.vue';
import { HrButton, HrEmptyState } from '../components';
import handoff from '../generated/handoff.json';

const props = defineProps<{ id: string }>();
const md = computed(() => (handoff as Record<string, string>)[props.id]);
const copied = ref(false);
async function copy() {
  try { await navigator.clipboard.writeText(md.value); copied.value = true; setTimeout(() => (copied.value = false), 1500); } catch { copied.value = false; }
}
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const inline = (s: string) => esc(s).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>').replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
// Small renderer for the subset of markdown the generator writes.
const html = computed(() => {
  if (!md.value) return '';
  const lines = md.value.split('\n'); const out: string[] = []; let i = 0;
  while (i < lines.length) {
    const l = lines[i];
    if (l.startsWith('```')) { const b: string[] = []; i++; while (i < lines.length && !lines[i].startsWith('```')) b.push(lines[i++]); out.push(`<pre><code>${esc(b.join('\n'))}</code></pre>`); i++; continue; }
    if (l.startsWith('|')) { const rows: string[][] = []; while (i < lines.length && lines[i].startsWith('|')) { rows.push(lines[i].split('|').slice(1, -1).map((c) => c.trim())); i++; } const body = rows.filter((r) => !r.every((c) => /^-+$/.test(c))); out.push(`<div class="tw"><table>${body.map((r, ri) => `<tr>${r.map((c) => (ri === 0 && rows[1]?.every((x) => /^-+$/.test(x)) ? `<th>${inline(c)}</th>` : `<td>${inline(c)}</td>`)).join('')}</tr>`).join('')}</table></div>`); continue; }
    if (l.startsWith('# ')) out.push(`<h1>${inline(l.slice(2))}</h1>`);
    else if (l.startsWith('## ')) out.push(`<h2>${inline(l.slice(3))}</h2>`);
    else if (l.startsWith('- ')) { const items: string[] = []; while (i < lines.length && lines[i].startsWith('- ')) items.push(lines[i++].slice(2)); out.push(`<ul>${items.map((x) => `<li>${x.startsWith('[ ] ') ? '☐ ' + inline(x.slice(4)) : inline(x)}</li>`).join('')}</ul>`); continue; }
    else if (l.trim()) out.push(`<p>${inline(l)}</p>`);
    i++;
  }
  return out.join('\n');
});
</script>

<template>
  <LibraryLayout>
    <HrEmptyState v-if="!md" title="No handoff yet" text="Mark the prototype ready-for-dev in src/playground/registry.json and run npm run handoff." />
    <article v-else class="ho">
      <div class="ho__bar">
        <HrButton variant="secondary" theme="neutral" size="sm" href="#/playground">Back to playground</HrButton>
        <HrButton size="sm" @click="copy">{{ copied ? 'Copied' : 'Copy markdown' }}</HrButton>
      </div>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="ho__md" v-html="html" />
    </article>
  </LibraryLayout>
</template>

<style scoped>
.ho { max-width: 900px; }
.ho__bar { display: flex; justify-content: space-between; gap: 8px; margin-bottom: 24px; }
.ho__md :deep(h1) { margin: 0 0 16px; font: var(--hr-font-size-6xl)/var(--hr-font-line-height-6xl) var(--hr-font-family); font-weight: var(--hr-font-weight-bold); letter-spacing: -0.02em; }
.ho__md :deep(h2) { margin: 32px 0 10px; font: var(--hr-text-3xl); font-weight: var(--hr-font-weight-semibold); }
.ho__md :deep(p), .ho__md :deep(li) { font: var(--hr-text-2xl); color: var(--hr-text-neutral-body-1); max-width: 68ch; }
.ho__md :deep(ul) { padding-left: 20px; margin: 0; }
.ho__md :deep(code) { font: var(--hr-font-size-sm)/1.4 ui-monospace, SFMono-Regular, Menlo, monospace; padding: 1px 5px; border-radius: 4px; background: var(--hr-surface-sunken); }
.ho__md :deep(pre) { padding: 14px 16px; border-radius: 8px; background: var(--hr-surface-sunken); overflow-x: auto; }
.ho__md :deep(pre code) { padding: 0; background: none; }
.ho__md :deep(.tw) { overflow-x: auto; }
.ho__md :deep(table) { border-collapse: collapse; width: 100%; font: var(--hr-text-lg); }
.ho__md :deep(th), .ho__md :deep(td) { text-align: left; padding: 8px 10px; border-bottom: 1px solid var(--hr-border-neutral-subtle-1); vertical-align: top; }
.ho__md :deep(th) { background: var(--hr-surface-base); font-weight: var(--hr-font-weight-semibold); }
.ho__md :deep(a) { color: var(--hr-text-primary-body-1); }
</style>
