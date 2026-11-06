<script setup lang="ts">
// Playground home: every prototype from registry.json, with its status and states.
import { HrCard, HrTag, HrButton } from '../components';
import reg from './registry.json';

const tone = (s: string) => (s === 'ready-for-dev' ? 'success' : s === 'in-review' ? 'primary' : 'gray') as 'success' | 'primary' | 'gray';
</script>

<template>
  <div class="pg">
    <header class="pg__head">
      <a href="#/" class="pg__crumb">HighRise Lab</a>
      <h1>Playground</h1>
      <p>Prototypes built only from HighRise components. Every button works and every state is real, so what you learn in a test is about the product.</p>
    </header>
    <div class="pg__grid">
      <HrCard v-for="p in reg.prototypes" :key="p.id" :title="p.title" :description="`${p.product} · ${p.journey}`">
        <template #actions><HrTag :color="tone(p.status)" size="sm" dot>{{ p.status }}</HrTag></template>
        <p class="pg__idea">{{ p.idea }}</p>
        <div class="pg__states"><HrTag v-for="s in p.states" :key="s" size="xs" outline>{{ s }}</HrTag></div>
        <div class="pg__actions">
          <HrButton size="sm" :href="`#${p.route}`">Open prototype</HrButton>
          <HrButton v-if="p.status === 'ready-for-dev'" variant="secondary" theme="neutral" size="sm" :href="`#/handoff/${p.id}`">Handoff</HrButton>
        </div>
        <template #footer>{{ p.author }} · {{ p.created }} · <code>{{ p.file }}</code></template>
      </HrCard>
    </div>
  </div>
</template>

<style scoped>
.pg { max-width: 1240px; margin: 0 auto; padding: 32px 24px 64px; font-family: var(--hr-font-family); }
.pg__crumb { font: var(--hr-text-md); color: var(--hr-text-primary-body-1); text-decoration: none; }
.pg__head h1 { margin: 4px 0 8px; font: var(--hr-font-size-6xl)/var(--hr-font-line-height-6xl) var(--hr-font-family); font-weight: var(--hr-font-weight-semibold); }
.pg__head p { margin: 0 0 24px; max-width: 640px; font: var(--hr-text-2xl); color: var(--hr-text-neutral-body-2); }
.pg__grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 20px; }
.pg__idea { margin: 0 0 12px; font: var(--hr-text-lg); color: var(--hr-text-neutral-body-1); }
.pg__states { display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 16px; }
.pg__actions { display: flex; gap: 8px; }
code { font-size: var(--hr-font-size-sm); }
</style>
