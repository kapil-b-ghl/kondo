<script setup lang="ts">
// Renders the same variant grid as the Figma Button page, for side-by-side audit.
import HrButton, { type ButtonVariant, type ButtonTheme, type ButtonSize } from '../../components/button/HrButton.vue';

const variants: ButtonVariant[] = ['primary', 'secondary', 'tertiary', 'ghost', 'link'];
const themes: ButtonTheme[] = ['primary', 'neutral', 'destructive', 'warning', 'success'];
const sizes: ButtonSize[] = ['3xs', '2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'];
const states = ['default', 'hover', 'active', 'focussed', 'disabled'] as const;
</script>

<template>
  <main class="spec">
    <section v-for="t in themes" :key="t" class="theme" :data-theme="t">
      <h2>{{ t }}</h2>
      <div class="grid">
        <div />
        <div v-for="s in states" :key="s" class="col">{{ s }}</div>
        <template v-for="v in variants" :key="v">
          <div class="row">{{ v }}</div>
          <div v-for="s in states" :key="s" :class="`force-${s}`">
            <HrButton :variant="v" :theme="t" :disabled="s === 'disabled'">
              <template #leading><svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7.5" stroke="currentColor" stroke-width="1.67"/></svg></template>
              Button CTA
              <template #trailing><svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7.5" stroke="currentColor" stroke-width="1.67"/></svg></template>
            </HrButton>
          </div>
        </template>
      </div>
    </section>
    <section class="theme">
      <h2>sizes</h2>
      <div class="sizes"><HrButton v-for="z in sizes" :key="z" :size="z">Button CTA</HrButton></div>
    </section>
  </main>
</template>

<style scoped>
.spec { padding: 24px; display: grid; gap: 32px; background: var(--hr-surface-raised); }
.spec h2 { font: var(--hr-text-2xl); font-weight: 600; margin: 0 0 12px; text-transform: capitalize; }
.grid { display: grid; grid-template-columns: 90px repeat(5, 190px); gap: 12px; align-items: center; }
.col, .row { font: var(--hr-text-sm); color: var(--hr-text-neutral-base); text-transform: capitalize; }
.sizes { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
/* Force pseudo-states for the audit grid */
.force-hover :deep(.hr-btn) { background: var(--_bg-hover); border-color: var(--_bd-hover); color: var(--_fg-hover); box-shadow: var(--_fx-hover); }
.force-active :deep(.hr-btn) { background: var(--_bg-active); border-color: var(--_bd-active); color: var(--_fg-active); box-shadow: var(--_fx-active); }
.force-focussed :deep(.hr-btn) { background: var(--_bg-focussed); border-color: var(--_bd-focussed); color: var(--_fg-focussed); box-shadow: var(--_fx-focussed); }
</style>
