<script setup lang="ts">
import LibraryLayout from './LibraryLayout.vue';
import { HrTag } from '../components';
import { components, totals, protos, slug, STATUS, palette } from './lib';

const recent = protos.slice().reverse();
const swatch = ['primary/blue', 'neutral/gray', 'secondary/success', 'secondary/warning', 'secondary/error'].map((k) => palette[k][7]);
const pTone = (s: string) => (s === 'ready-for-dev' ? 'success' : s === 'in-review' ? 'primary' : 'gray') as 'success' | 'primary' | 'gray';
</script>

<template>
  <LibraryLayout>
    <div class="home">
      <section class="hero">
        <h1>HighRise in code.</h1>
        <p>Every token, component and prototype here is generated from the HighRise 1.1 Figma file and checked against it. Designers prototype with these components, PMs review working screens, and engineers get the same code.</p>
        <dl class="stats">
          <div><dt>Components</dt><dd>{{ totals.components }}</dd></div>
          <div><dt>Prototypes</dt><dd>{{ totals.screens }}</dd></div>
          <div><dt>Tokens</dt><dd>{{ totals.tokens }}</dd></div>
          <div><dt>Open questions for Figma</dt><dd>{{ totals.gaps }}</dd></div>
        </dl>
      </section>

      <section class="tiles">
        <a href="#/tokens" class="tile">
          <span class="tile__k">Style guide</span>
          <span class="tile__art"><span v-for="(c, i) in swatch" :key="i" :style="{ background: c }" /></span>
          <span class="tile__t">Tokens</span>
          <span class="tile__d">Colour scales, semantic roles, type, spacing, radius and shadow. Primitives come straight from the Figma variables.</span>
        </a>
        <a :href="`#/c/${slug(components[0].name)}`" class="tile">
          <span class="tile__k">Library</span>
          <span class="tile__art tile__art--ui"><span class="ui-btn">Pay $249.00</span><span class="ui-tag">Paid</span><span class="ui-in">you@business.com</span></span>
          <span class="tile__t">Components</span>
          <span class="tile__d">Vue 3 components with every Figma state, live examples, and an audit of where code and Figma disagree.</span>
        </a>
        <a href="#/playground" class="tile">
          <span class="tile__k">Playground</span>
          <span class="tile__art mini" aria-hidden="true"><i class="mini__nav" /><i class="mini__main"><i class="mini__kpis"><i /><i /><i /></i><i class="mini__rows"><i /><i /><i /></i></i></span>
          <span class="tile__t">Prototypes</span>
          <span class="tile__d">Working screens built only from these components. Every state from the PRD is one click away.</span>
        </a>
      </section>

      <section>
        <h2>Prototype history</h2>
        <ul class="hist">
          <li v-for="p in recent" :key="p.id">
            <div><a :href="`#${p.route}`">{{ p.title }}</a><div class="muted">{{ p.journey }} · {{ p.author }} · {{ p.created }}</div></div>
            <HrTag :color="pTone(p.status)" size="sm" dot>{{ p.status }}</HrTag>
          </li>
        </ul>
      </section>

      <section>
        <h2>Components by audit status</h2>
        <div class="byst">
          <div v-for="(meta, key) in STATUS" :key="key" class="byst__col">
            <HrTag :color="meta.color" size="sm">{{ meta.label }}</HrTag>
            <a v-for="c in components.filter((x) => x.status === key)" :key="c.tag" :href="`#/c/${slug(c.name)}`">{{ c.name }}</a>
            <span v-if="!components.some((x) => x.status === key)" class="muted">None</span>
          </div>
        </div>
      </section>
    </div>
  </LibraryLayout>
</template>

<style scoped>
.home { max-width: 1040px; display: flex; flex-direction: column; gap: 48px; }
.hero h1 { margin: 0 0 12px; font: var(--hr-font-size-8xl)/1 var(--hr-font-family); font-weight: var(--hr-font-weight-bold); letter-spacing: -0.03em; text-wrap: balance; }
.hero p { margin: 0; max-width: 620px; font: var(--hr-text-3xl); color: var(--hr-text-neutral-body-2); }
.stats { display: flex; flex-wrap: wrap; gap: 40px; margin: 28px 0 0; padding-top: 20px; border-top: 1px solid var(--hr-border-neutral-subtle-1); }
.stats dt { font: var(--hr-text-sm); color: var(--hr-text-neutral-base); }
.stats dd { margin: 2px 0 0; font: var(--hr-font-size-6xl)/var(--hr-font-line-height-6xl) var(--hr-font-family); font-weight: var(--hr-font-weight-semibold); font-variant-numeric: tabular-nums; }
.tiles { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
.tile { display: flex; flex-direction: column; gap: 8px; padding: 20px; border: 1px solid var(--hr-border-neutral-subtle-1); border-radius: 12px; color: inherit; text-decoration: none; transition: border-color 120ms, box-shadow 120ms; }
.tile:hover { border-color: var(--hr-border-neutral-base); box-shadow: var(--hr-shadow-md); }
.tile:focus-visible { outline: none; box-shadow: var(--hr-focus-ring-primary); }
.tile__k { font: var(--hr-text-xs); font-weight: var(--hr-font-weight-semibold); letter-spacing: 0.06em; text-transform: uppercase; color: var(--hr-text-neutral-base); }
.tile__art { height: 96px; margin: 4px 0 8px; border-radius: 8px; background: var(--hr-surface-sunken); display: flex; align-items: center; justify-content: center; gap: 6px; overflow: hidden; }
.tile__art > span { width: 26px; height: 56px; border-radius: 6px; }
.tile__art--ui { flex-wrap: wrap; padding: 12px; gap: 8px; }
.ui-btn { padding: 6px 12px; border-radius: 6px; background: var(--hr-background-primary-default); color: var(--hr-text-on-color); font: var(--hr-text-md); font-weight: var(--hr-font-weight-semibold); width: auto !important; height: auto !important; }
.ui-tag { padding: 2px 8px; border-radius: 4px; background: var(--hr-background-success-subtle-1); color: var(--hr-text-success-body-1); font: var(--hr-text-sm); font-weight: var(--hr-font-weight-medium); width: auto !important; height: auto !important; }
.ui-in { padding: 6px 10px; border: 1px solid var(--hr-border-neutral-base); border-radius: 6px; background: var(--hr-surface-raised); color: var(--hr-text-neutral-base); font: var(--hr-text-sm); width: auto !important; height: auto !important; }
.mini { display: grid !important; grid-template-columns: 34px 1fr; gap: 6px; padding: 10px; align-items: stretch; justify-content: stretch; }
.mini i { display: block; font-style: normal; }
.mini__nav { border-radius: 4px; background: var(--hr-surface-raised); border: 1px solid var(--hr-border-neutral-subtle-1); }
.mini__main { display: flex !important; flex-direction: column; gap: 6px; }
.mini__kpis { display: grid !important; grid-template-columns: repeat(3, 1fr); gap: 6px; height: 28px; }
.mini__kpis i { border-radius: 4px; background: var(--hr-surface-raised); border: 1px solid var(--hr-border-neutral-subtle-1); }
.mini__kpis i:first-child { border-color: var(--hr-border-primary-subtle-1); background: var(--hr-background-primary-subtle-1); }
.mini__rows { flex: 1; display: flex !important; flex-direction: column; gap: 4px; padding: 6px; border-radius: 4px; background: var(--hr-surface-raised); border: 1px solid var(--hr-border-neutral-subtle-1); }
.mini__rows i { height: 6px; border-radius: 3px; background: var(--hr-background-neutral-subtle-2); }
.mini__rows i:nth-child(2) { width: 70%; background: var(--hr-background-success-subtle-1); }
.tile__t { font: var(--hr-text-3xl); font-weight: var(--hr-font-weight-semibold); }
.tile__d { font: var(--hr-text-lg); color: var(--hr-text-neutral-body-2); }
h2 { margin: 0 0 12px; font: var(--hr-text-3xl); font-weight: var(--hr-font-weight-semibold); }
.hist { list-style: none; margin: 0; padding: 0; border-top: 1px solid var(--hr-border-neutral-subtle-1); }
.hist li { display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid var(--hr-border-neutral-subtle-1); }
.hist a, .byst a { font: var(--hr-text-lg); font-weight: var(--hr-font-weight-medium); color: var(--hr-text-primary-body-1); text-decoration: none; }
.hist a:hover, .byst a:hover { text-decoration: underline; }
.muted { font: var(--hr-text-md); color: var(--hr-text-neutral-base); }
.byst { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 20px; }
.byst__col { display: flex; flex-direction: column; gap: 6px; align-items: flex-start; }
@media (max-width: 860px) { .tiles { grid-template-columns: 1fr; } .hero h1 { font-size: var(--hr-font-size-6xl); } }
</style>
