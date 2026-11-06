<script setup lang="ts">
/**
 * HrCard — surface/raised container with optional header (title, description, actions) and footer.
 * HighRise 1.1 has no Card set on the Components pages (the "Card" page is in the backlog);
 * values follow the FastPay prototype: white, gray/200 border, 12px radius, 20px padding.
 */
withDefaults(defineProps<{ title?: string; description?: string; padding?: 'none' | 'sm' | 'md'; as?: string; interactive?: boolean }>(), { padding: 'md', as: 'section' });
</script>

<template>
  <component :is="as" class="hr-card" :class="[`hr-card--pad-${padding}`, { 'hr-card--interactive': interactive }]">
    <header v-if="title || $slots.header || $slots.actions" class="hr-card__head">
      <div class="hr-card__titles">
        <slot name="header"><h2 v-if="title" class="hr-card__title">{{ title }}</h2></slot>
        <p v-if="description" class="hr-card__desc">{{ description }}</p>
      </div>
      <div v-if="$slots.actions" class="hr-card__actions"><slot name="actions" /></div>
    </header>
    <div class="hr-card__body"><slot /></div>
    <footer v-if="$slots.footer" class="hr-card__foot"><slot name="footer" /></footer>
  </component>
</template>

<style>
.hr-card {
  display: flex; flex-direction: column; min-width: 0; background: var(--hr-surface-raised);
  border: 1px solid var(--hr-border-neutral-subtle-1); border-radius: 12px; font-family: var(--hr-font-family);
  color: inherit; text-decoration: none;
}
.hr-card--interactive { cursor: pointer; transition: border-color 120ms, box-shadow 120ms; }
.hr-card--interactive:hover { border-color: var(--hr-border-neutral-base); box-shadow: var(--hr-shadow-xs); }
.hr-card--interactive:focus-visible { outline: none; box-shadow: var(--hr-focus-ring-primary); }
.hr-card__head { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; padding: 16px 20px 0; }
.hr-card__title { margin: 0; font: var(--hr-text-2xl); font-weight: var(--hr-font-weight-semibold); color: var(--hr-text-neutral-title-1); }
.hr-card__desc { margin: 2px 0 0; font: var(--hr-text-md); color: var(--hr-text-neutral-base); }
.hr-card__actions { display: flex; gap: 8px; flex: none; }
.hr-card--pad-md > .hr-card__body { padding: 16px 20px 20px; }
.hr-card--pad-sm > .hr-card__body { padding: 12px 16px; }
.hr-card--pad-none > .hr-card__body { padding: 12px 0 0; }
.hr-card--pad-none > .hr-card__head + .hr-card__body { padding-top: 12px; }
.hr-card__foot { padding: 12px 20px; border-top: 1px solid var(--hr-border-neutral-subtle-1); font: var(--hr-text-md); color: var(--hr-text-neutral-base); }
</style>
