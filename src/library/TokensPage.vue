<script setup lang="ts">
import { ref } from 'vue';
import LibraryLayout from './LibraryLayout.vue';
import { HrTabs } from '../components';
import { palette, steps, prim, semanticColors as semantic } from './lib';

const tab = ref('semantic');
const scales = Object.entries(palette);
const copied = ref('');
async function copy(v: string) {
  try { await navigator.clipboard.writeText(v); copied.value = v; setTimeout(() => (copied.value = ''), 1200); } catch { copied.value = ''; }
}
const ink = (i: number) => (i >= 6 ? 'var(--hr-text-on-color)' : 'var(--hr-text-neutral-title-1)');
const groups = ['surface', 'text', 'background', 'border', 'icon', 'focus'];
</script>

<template>
  <LibraryLayout>
    <article class="tk">
      <h1>Tokens</h1>
      <p class="lede">Primitives are exact copies of the HighRise 1.1 Figma variables. Semantic tokens give each role a name; components and prototypes use only those.</p>
      <HrTabs v-model="tab" :tabs="[{ key: 'semantic', label: 'Semantic roles' }, { key: 'color', label: 'Colour scales' }, { key: 'type', label: 'Type' }, { key: 'space', label: 'Spacing & radius' }]" />

      <section v-if="tab === 'semantic'" class="sem">
        <div v-for="g in groups" :key="g" class="sem__group">
          <h2>{{ g }}</h2>
          <div v-for="t in semantic.filter((s) => s.name.startsWith('hr-' + g))" :key="t.name" class="sem__row">
            <span class="sem__sw" :style="g === 'focus' ? { boxShadow: `var(--${t.name})`, background: 'var(--hr-surface-raised)' } : { background: `var(--${t.name})` }" />
            <code>--{{ t.name }}</code>
            <span class="sem__v">{{ t.value.replace(/var\(--hr-color-/g, '').replace(/\)/g, '') }}</span>
            <span class="sem__n">{{ t.note }}</span>
          </div>
        </div>
      </section>

      <section v-if="tab === 'color'" class="scales">
        <div v-for="[name, vals] in scales" :key="name" class="scale">
          <div class="scale__name">{{ name }}</div>
          <div class="scale__row">
            <button v-for="(v, i) in vals" :key="i" type="button" class="scale__sw" :style="{ background: v, color: ink(i) }" :title="`--hr-color-${name.replace('/', '-')}-${steps[i]} · ${v}`" @click="copy(v)">
              <span>{{ steps[i] }}</span><span class="scale__hex">{{ copied === v ? 'Copied' : v }}</span>
            </button>
          </div>
        </div>
      </section>

      <section v-if="tab === 'type'" class="type">
        <div v-for="(px, k) in prim.fontSize" :key="k" class="type__row">
          <code>{{ k }}</code><span class="type__meta">{{ px }}/{{ (prim.lineHeight as Record<string, number>)[k] }}</span>
          <span :style="{ fontSize: px + 'px', lineHeight: (prim.lineHeight as Record<string, number>)[k] + 'px' }">Payouts land 2 business days later</span>
        </div>
      </section>

      <section v-if="tab === 'space'" class="space">
        <h2>Spacing</h2>
        <div v-for="(px, k) in prim.spacing" :key="k" class="space__row"><code>spacing/{{ k }}</code><span class="space__bar" :style="{ width: px + 'px' }" /><span>{{ px }}px</span></div>
        <h2>Radius</h2>
        <div class="radii"><div v-for="(px, k) in prim.radius" :key="k" class="radius"><span :style="{ borderRadius: Math.min(px, 40) + 'px' }" /><code>{{ k }}</code><small>{{ px }}px</small></div></div>
      </section>
    </article>
  </LibraryLayout>
</template>

<style scoped>
.tk { max-width: 1040px; display: flex; flex-direction: column; gap: 20px; }
h1 { margin: 0; font: var(--hr-font-size-6xl)/var(--hr-font-line-height-6xl) var(--hr-font-family); font-weight: var(--hr-font-weight-bold); letter-spacing: -0.02em; }
.lede { margin: 0; max-width: 640px; font: var(--hr-text-2xl); color: var(--hr-text-neutral-body-2); }
h2 { margin: 16px 0 8px; font: var(--hr-text-xs); font-weight: var(--hr-font-weight-semibold); letter-spacing: 0.06em; text-transform: uppercase; color: var(--hr-text-neutral-base); }
code { font: var(--hr-font-size-sm)/1.4 ui-monospace, SFMono-Regular, Menlo, monospace; color: var(--hr-text-neutral-body-1); }
.sem { display: grid; grid-template-columns: repeat(auto-fit, minmax(440px, 1fr)); gap: 8px 40px; }
.sem__row { display: grid; grid-template-columns: 28px minmax(0, 1.4fr) minmax(0, 1fr); gap: 4px 12px; align-items: center; padding: 6px 0; border-bottom: 1px solid var(--hr-border-neutral-subtle-0); }
.sem__sw { width: 28px; height: 28px; border-radius: 6px; border: 1px solid var(--hr-border-neutral-subtle-1); grid-row: span 2; }
.sem__v { font: var(--hr-text-sm); color: var(--hr-text-neutral-base); }
.sem__n { grid-column: 2 / 4; font: var(--hr-text-sm); color: var(--hr-text-neutral-base); }
.sem__n:empty { display: none; }
.scales { display: flex; flex-direction: column; gap: 14px; }
.scale__name { font: var(--hr-text-md); font-weight: var(--hr-font-weight-semibold); margin-bottom: 4px; }
.scale__row { display: grid; grid-template-columns: repeat(13, minmax(0, 1fr)); border-radius: 8px; overflow: hidden; }
.scale__sw { all: unset; box-sizing: border-box; cursor: pointer; display: flex; flex-direction: column; justify-content: flex-end; height: 56px; padding: 6px; font: var(--hr-text-xs); font-weight: var(--hr-font-weight-semibold); }
.scale__sw:focus-visible { outline: 2px solid var(--hr-border-primary-default); outline-offset: -2px; }
.scale__hex { font-weight: var(--hr-font-weight-regular); opacity: 0.8; }
.type { display: flex; flex-direction: column; }
.type__row { display: grid; grid-template-columns: 56px 64px minmax(0, 1fr); gap: 12px; align-items: baseline; padding: 8px 0; border-bottom: 1px solid var(--hr-border-neutral-subtle-0); overflow: hidden; white-space: nowrap; }
.type__meta { font: var(--hr-text-sm); color: var(--hr-text-neutral-base); font-variant-numeric: tabular-nums; }
.space__row { display: grid; grid-template-columns: 120px minmax(0, 1fr) 56px; gap: 12px; align-items: center; padding: 3px 0; font: var(--hr-text-sm); color: var(--hr-text-neutral-base); }
.space__bar { height: 10px; max-width: 100%; border-radius: 2px; background: var(--hr-background-primary-subtle-2); border: 1px solid var(--hr-border-primary-subtle-1); }
.radii { display: flex; flex-wrap: wrap; gap: 16px; }
.radius { display: flex; flex-direction: column; align-items: center; gap: 4px; }
.radius span { width: 56px; height: 56px; background: var(--hr-surface-sunken); border: 1px solid var(--hr-border-neutral-base); }
.radius small { font: var(--hr-text-xs); color: var(--hr-text-neutral-base); }
@media (max-width: 760px) { .sem { grid-template-columns: 1fr; } .scale__row { grid-template-columns: repeat(7, minmax(0, 1fr)); } .scale__hex { display: none; } }
</style>
