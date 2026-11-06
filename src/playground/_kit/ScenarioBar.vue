<script setup lang="ts">
/**
 * Prototype control bar (playground only, never shipped). Switch account state and
 * prototype variant so user tests and reviews can jump straight to any state.
 */
defineProps<{ label?: string; options: { key: string; label: string }[]; variants?: { key: string; label: string; to: string }[]; variant?: string }>();
const model = defineModel<string>();
</script>

<template>
  <div class="pg-bar" role="region" aria-label="Prototype controls">
    <b>Prototype</b>
    <span class="pg-bar__lbl">{{ label ?? 'Account state' }}</span>
    <button v-for="o in options" :key="o.key" type="button" class="pg-bar__chip" :aria-pressed="model === o.key" @click="model = o.key">{{ o.label }}</button>
    <template v-if="variants">
      <span class="pg-bar__lbl pg-bar__lbl--sep">Variant</span>
      <a v-for="v in variants" :key="v.key" class="pg-bar__chip" :aria-pressed="variant === v.key" :href="v.to">{{ v.label }}</a>
    </template>
    <a class="pg-bar__back" href="#/playground">All prototypes</a>
  </div>
</template>

<style scoped>
.pg-bar { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; padding: 8px 16px; background: var(--hr-color-neutral-gray-900); color: var(--hr-color-neutral-gray-300); font: var(--hr-text-sm); font-family: var(--hr-font-family); }
.pg-bar b { color: var(--hr-text-on-color); margin-right: 6px; }
.pg-bar__lbl { margin-left: 4px; }
.pg-bar__lbl--sep { margin-left: 16px; }
.pg-bar__chip { height: 26px; padding: 0 10px; border-radius: 13px; border: 1px solid var(--hr-color-neutral-gray-600); background: transparent; color: var(--hr-color-neutral-gray-200); font: inherit; cursor: pointer; display: inline-flex; align-items: center; text-decoration: none; }
.pg-bar__chip:hover { background: var(--hr-color-neutral-gray-800); }
.pg-bar__chip[aria-pressed='true'] { background: var(--hr-color-neutral-white-base); color: var(--hr-color-neutral-gray-900); border-color: var(--hr-color-neutral-white-base); }
.pg-bar__chip:focus-visible, .pg-bar__back:focus-visible { outline: 2px solid var(--hr-color-primary-blue-300); outline-offset: 2px; }
.pg-bar__back { margin-left: auto; color: var(--hr-color-neutral-gray-300); }
</style>
