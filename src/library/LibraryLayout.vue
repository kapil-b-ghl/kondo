<script setup lang="ts">
// Library frame: brand bar, search, grouped component nav, playground link.
import { computed, ref } from 'vue';
import { Search } from 'lucide-vue-next';
import { components, GROUPS, slug, STATUS, totals } from './lib';
import { route } from '../router';

const q = ref('');
const groups = computed(() => GROUPS.map((g) => ({
  name: g,
  items: components.filter((c) => c.group === g && (!q.value || c.name.toLowerCase().includes(q.value.toLowerCase()) || c.tag.toLowerCase().includes(q.value.toLowerCase()))),
})).filter((g) => g.items.length));
const dot = (s: string) => STATUS[s]?.color ?? 'gray';
</script>

<template>
  <div class="lib">
    <header class="lib__bar">
      <a href="#/" class="lib__brand"><span class="lib__mark" aria-hidden="true">H</span>HighRise <span class="lib__ver">1.1</span></a>
      <span class="lib__crumb">Lab</span>
      <span class="lib__sync"><span class="lib__dot" aria-hidden="true" />Generated from Figma · {{ totals.components }} components · {{ totals.gaps }} open questions</span>
      <a class="lib__pg" href="#/playground">Playground</a>
    </header>
    <div class="lib__body">
      <nav class="lib__nav" aria-label="Library">
        <label class="lib__search"><Search :size="16" aria-hidden="true" /><span class="hr-sr-only">Search components</span><input id="lib-search" v-model="q" type="search" placeholder="Search components" /></label>
        <a href="#/" class="lib__link" :aria-current="route === '/' ? 'page' : undefined">Overview</a>
        <a href="#/tokens" class="lib__link" :aria-current="route === '/tokens' ? 'page' : undefined">Tokens</a>
        <a href="#/audit" class="lib__link" :aria-current="route === '/audit' ? 'page' : undefined">Figma audit</a>
        <div v-for="g in groups" :key="g.name" class="lib__group">
          <div class="lib__gname">{{ g.name }}<span>{{ g.items.length }}</span></div>
          <a v-for="c in g.items" :key="c.tag" :href="`#/c/${slug(c.name)}`" class="lib__link" :aria-current="route === `/c/${slug(c.name)}` ? 'page' : undefined">
            <span class="lib__st" :class="`is-${dot(c.status)}`" :title="STATUS[c.status]?.label" />{{ c.name }}
          </a>
        </div>
      </nav>
      <main class="lib__main"><slot /></main>
    </div>
  </div>
</template>

<style scoped>
.lib { min-height: 100vh; background: var(--hr-surface-raised); font-family: var(--hr-font-family); color: var(--hr-text-neutral-title-1); }
.lib__bar { position: sticky; top: 0; z-index: 5; display: flex; align-items: center; gap: 14px; height: 56px; padding: 0 max(20px, env(safe-area-inset-right, 0px)) 0 max(20px, env(safe-area-inset-left, 0px)); background: var(--hr-surface-raised); border-bottom: 1px solid var(--hr-border-neutral-subtle-1); }
.lib__brand { display: flex; align-items: center; gap: 8px; font: var(--hr-text-2xl); font-weight: var(--hr-font-weight-bold); color: inherit; text-decoration: none; }
.lib__mark { width: 26px; height: 26px; border-radius: 6px; display: grid; place-items: center; background: var(--hr-background-primary-default); color: var(--hr-text-on-color); font: var(--hr-text-md); font-weight: var(--hr-font-weight-bold); }
.lib__ver { font: var(--hr-text-md); font-weight: var(--hr-font-weight-medium); color: var(--hr-text-neutral-base); }
.lib__crumb { font: var(--hr-text-md); color: var(--hr-text-neutral-base); padding-left: 14px; border-left: 1px solid var(--hr-border-neutral-subtle-1); }
.lib__sync { margin-left: auto; display: flex; align-items: center; gap: 8px; font: var(--hr-text-sm); color: var(--hr-text-neutral-base); }
.lib__dot { width: 8px; height: 8px; border-radius: 50%; background: var(--hr-icon-success-default); }
.lib__pg { font: var(--hr-text-lg); font-weight: var(--hr-font-weight-semibold); color: var(--hr-text-primary-body-1); text-decoration: none; }
.lib__body { display: grid; grid-template-columns: 248px minmax(0, 1fr); }
.lib__nav { position: sticky; top: 56px; align-self: start; height: calc(100vh - 56px); overflow: auto; display: flex; flex-direction: column; gap: 2px; padding: 16px 12px 32px; border-right: 1px solid var(--hr-border-neutral-subtle-1); background: var(--hr-surface-base); }
.lib__search { display: flex; align-items: center; gap: 8px; height: 36px; padding: 0 10px; margin-bottom: 12px; border: 1px solid var(--hr-border-neutral-base); border-radius: 8px; background: var(--hr-surface-raised); color: var(--hr-icon-neutral-base); box-shadow: var(--hr-shadow-xs); }
.lib__search:focus-within { border-color: var(--hr-border-primary-subtle-1); box-shadow: var(--hr-shadow-xs), var(--hr-focus-ring-primary); }
.lib__search input { flex: 1; min-width: 0; border: 0; outline: 0; background: transparent; font: var(--hr-text-lg); color: var(--hr-text-neutral-title-1); }
.lib__group { margin-top: 14px; display: flex; flex-direction: column; gap: 2px; }
.lib__gname { display: flex; justify-content: space-between; padding: 0 10px 4px; font: var(--hr-text-xs); font-weight: var(--hr-font-weight-semibold); letter-spacing: 0.06em; text-transform: uppercase; color: var(--hr-text-neutral-base); }
.lib__link { display: flex; align-items: center; gap: 8px; padding: 6px 10px; border-radius: 6px; font: var(--hr-text-lg); color: var(--hr-text-neutral-body-1); text-decoration: none; }
.lib__link:hover { background: var(--hr-background-neutral-subtle-2); }
.lib__link:focus-visible { outline: none; box-shadow: var(--hr-focus-ring-primary); }
.lib__link[aria-current='page'] { background: var(--hr-background-primary-subtle-1); color: var(--hr-text-primary-body-1); font-weight: var(--hr-font-weight-medium); }
.lib__st { width: 7px; height: 7px; border-radius: 50%; flex: none; background: var(--hr-icon-neutral-subtle-0); }
.lib__st.is-success { background: var(--hr-icon-success-default); }
.lib__st.is-primary { background: var(--hr-icon-primary-default); }
.lib__st.is-warning { background: var(--hr-icon-warning-default); }
.lib__st.is-purple { background: var(--hr-text-neutral-base); }
.lib__main { min-width: 0; padding: 40px max(24px, env(safe-area-inset-right, 0px)) 80px 48px; }
@media (max-width: 860px) {
  .lib__body { grid-template-columns: 1fr; }
  .lib__nav { position: static; height: auto; border-right: 0; border-bottom: 1px solid var(--hr-border-neutral-subtle-1); }
  .lib__sync { display: none; }
  .lib__main { padding: 24px max(16px, env(safe-area-inset-right, 0px)) 64px max(16px, env(safe-area-inset-left, 0px)); }
}
</style>
