<script setup lang="ts">
import { computed } from 'vue';
import { route } from './router';
import ButtonSpec from './library/specs/ButtonSpec.vue';
import ElementsSpec from './library/specs/ElementsSpec.vue';
import PlaygroundIndex from './playground/PlaygroundIndex.vue';
import DashboardA from './playground/fastpay/DashboardA.vue';
import DashboardB from './playground/fastpay/DashboardB.vue';
import DashboardC from './playground/fastpay/DashboardC.vue';
import Payments from './playground/fastpay/Payments.vue';
import PaymentDetail from './playground/fastpay/PaymentDetail.vue';

const view = computed(() => {
  const r = route.value;
  let m;
  if (r === '/spec/button') return { c: ButtonSpec };
  if (r === '/spec/elements') return { c: ElementsSpec };
  if (r === '/playground') return { c: PlaygroundIndex };
  if (r === '/p/fastpay/dashboard') return { c: DashboardA };
  if (r === '/p/fastpay/b/dashboard') return { c: DashboardB };
  if (r === '/p/fastpay/c/dashboard') return { c: DashboardC };
  if (r === '/p/fastpay/payments') return { c: Payments };
  if ((m = r.match(/^\/p\/fastpay\/payments\/([\w-]+)$/))) return { c: PaymentDetail, props: { id: m[1] }, key: m[1] };
  return { c: PlaygroundIndex };
});
</script>

<template>
  <component :is="view.c" v-bind="view.props" :key="view.key ?? route" />
</template>
