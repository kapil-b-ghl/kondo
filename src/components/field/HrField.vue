<script setup lang="ts">
/**
 * HrField — label + control + hint/error wrapper shared by HrInput and HrSelect.
 * Figma: Input Field outer frame is vertical, gap 4. Label and hint styles are
 * taken from the Checkbox group row (14/20 Medium gray-700, 13/18 gray-500).
 */
defineProps<{ label?: string; hint?: string; error?: string; required?: boolean; forId: string; optional?: boolean }>();
</script>

<template>
  <div class="hr-field">
    <label v-if="label" class="hr-field__label" :for="forId">
      {{ label }}<span v-if="required" class="hr-field__req" aria-hidden="true">*</span>
      <span v-if="optional" class="hr-field__opt">(optional)</span>
    </label>
    <slot />
    <p v-if="error" :id="forId + '-msg'" class="hr-field__msg is-error">{{ error }}</p>
    <p v-else-if="hint" :id="forId + '-msg'" class="hr-field__msg">{{ hint }}</p>
  </div>
</template>

<style>
.hr-field { display: flex; flex-direction: column; gap: 4px; min-width: 0; font-family: var(--hr-font-family); }
.hr-field__label { font: var(--hr-text-lg); font-weight: var(--hr-font-weight-medium); color: var(--hr-text-neutral-body-1); }
.hr-field__req { color: var(--hr-color-secondary-error-500); margin-left: 2px; }
.hr-field__opt { color: var(--hr-text-neutral-base); font-weight: var(--hr-font-weight-regular); margin-left: 4px; }
.hr-field__msg { margin: 0; font: var(--hr-text-md); color: var(--hr-text-neutral-base); }
.hr-field__msg.is-error { color: var(--hr-color-secondary-error-600); }
</style>
