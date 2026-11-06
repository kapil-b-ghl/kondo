<script setup lang="ts">
// App frame for every FastPay screen: prototype bar + HighLevel shell with Commerce › Fastpay nav.
import { computed } from 'vue';
import { HrAppShell, HrTag } from '../../../components';
import ScenarioBar from '../../_kit/ScenarioBar.vue';
import { commerceNav } from '../nav';
import { SCENARIOS, type Scenario } from '../data';
import { query, setQuery } from '../../../router';

const props = defineProps<{ base: string; active: string; title: string; back?: string; variant?: string; variants?: { key: string; label: string; to: string }[] }>();
const scenario = computed<Scenario>({
  get: () => (query.value.get('state') as Scenario) || 'ready',
  set: (v) => setQuery('state', v === 'ready' ? null : v),
});
const status = computed(() => SCENARIOS.find((s) => s.key === scenario.value)!);
const nav = computed(() => commerceNav(props.base));
// Variant links keep the current account state so reviewers compare like with like.
const variantLinks = computed(() => props.variants?.map((v) => ({ ...v, to: v.to + (query.value.toString() ? '?' + query.value.toString() : '') })));
defineExpose({ scenario });
</script>

<template>
  <div>
    <ScenarioBar v-model="scenario" :options="SCENARIOS" :variants="variantLinks" :variant="variant" />
    <HrAppShell module="commerce" section-title="Commerce" :section="nav" :active="active" :title="title" :back="back">
      <template #title-after><HrTag v-if="active === 'overview'" :color="status.tag" size="sm" dot>{{ status.status }}</HrTag></template>
      <template #actions><slot name="actions" /></template>
      <slot :scenario="scenario" />
    </HrAppShell>
  </div>
</template>
