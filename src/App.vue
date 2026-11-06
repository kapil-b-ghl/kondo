<script setup lang="ts">
import { computed } from 'vue';
import { route } from './router';
import ButtonSpec from './library/specs/ButtonSpec.vue';
import ElementsSpec from './library/specs/ElementsSpec.vue';

const view = computed(() => {
  if (route.value.startsWith('/spec/button')) return ButtonSpec;
  if (route.value.startsWith('/spec/elements')) return ElementsSpec;
  return ButtonSpec;
});
</script>

<template>
  <component :is="view" />
</template>
