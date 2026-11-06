<script setup lang="ts">
// Variant B — "Money timeline". Idea: merchants' first question is "when do I get my money?".
// The balance is shown as a flow (sales → on its way → next payout → bank), each step explains
// itself, and anything blocking the flow sits on the step it blocks.
import { computed, ref } from 'vue';
import { HrAlert, HrButton, HrCard, HrTable, HrTag, HrTabs, HrEmptyState, HrTooltip } from '../../components';
import FastpayFrame from './parts/FastpayFrame.vue';
import PaymentQuickView from './parts/PaymentQuickView.vue';
import { payments, money, balances, BANNERS, saved, STATUS_TAG, netOf, type Payment, type Scenario } from './data';
import { VARIANTS } from './variants';

const base = '/p/fastpay';
const sel = ref<Payment | null>(null);
const qv = ref(false);
const tab = ref('all');
function openPay(p: Payment) { sel.value = p; qv.value = true; }
const rows = computed(() => (tab.value === 'all' ? payments : payments.filter((p) => p.status === 'Disputed' || p.status === 'Failed')).slice(0, 8));
const attention = computed(() => payments.filter((p) => p.status === 'Disputed' || p.status === 'Failed').length);
const cols = [
  { key: 'amt', label: 'Amount', primary: true }, { key: 'net', label: 'Net', hideBelow: 760 }, { key: 'status', label: 'Status' },
  { key: 'customer', label: 'Customer' }, { key: 'date', label: 'Date', hideBelow: 1100 },
];
function steps(sc: Scenario) {
  const b = balances(sc);
  const blocked = sc === 'paused' || sc === 'negative' || sc === 'closing';
  return [
    { key: 'today', label: 'Today’s sales', value: sc === 'fresh' ? '$0.00' : '$1,284.00', note: sc === 'fresh' ? 'No payments yet' : '14 payments so far', state: 'ok' },
    { key: 'pending', label: 'On its way', value: money(b.pending), note: 'Settles in 1–2 business days', state: 'ok' },
    { key: 'available', label: 'Available', value: money(b.available), note: b.reservedNote, state: b.available < 0 ? 'error' : 'ok' },
    { key: 'payout', label: 'Next payout', value: b.next === null ? '—' : money(b.next), note: b.nextNote, state: blocked ? 'error' : 'ok' },
  ];
}
</script>

<template>
  <FastpayFrame v-slot="{ scenario }" :base="base" active="overview" title="Fastpay" variant="b" :variants="VARIANTS">
    <div class="dash">
      <HrCard padding="md">
        <div class="hero">
          <div>
            <div class="muted">Your money</div>
            <div class="hero__v" :class="{ 'is-neg': balances(scenario).available < 0 }">{{ money(balances(scenario).available + balances(scenario).pending) }}</div>
            <div class="muted">available and on its way · paid to Chase •••• 6789</div>
          </div>
          <div v-if="scenario !== 'fresh' && scenario !== 'closing'" class="hero__saved">
            <HrTooltip theme="dark" title="How we work this out" text="Compared with Stripe’s standard 2.9% + 30¢ on the same payments, minus Fastpay fees and refund fees.">
              <HrTag color="success" dot>{{ money(saved.month) }} saved this month</HrTag>
            </HrTooltip>
          </div>
        </div>
        <ol class="flow" aria-label="Where your money is">
          <li v-for="(s, i) in steps(scenario)" :key="s.key" class="flow__step" :class="`is-${s.state}`">
            <span class="flow__n" aria-hidden="true">{{ i + 1 }}</span>
            <div class="flow__label">{{ s.label }}</div>
            <div class="flow__v">{{ s.value }}</div>
            <div class="flow__note">{{ s.note }}</div>
          </li>
        </ol>
        <HrAlert v-if="BANNERS[scenario] && scenario !== 'fresh'" :color="BANNERS[scenario]!.color" :title="BANNERS[scenario]!.title" class="hero__alert">
          {{ BANNERS[scenario]!.text }}
          <template #aside><HrButton :variant="BANNERS[scenario]!.ctaVariant" :theme="BANNERS[scenario]!.ctaVariant === 'primary' ? 'primary' : 'neutral'" size="sm">{{ BANNERS[scenario]!.cta }}</HrButton></template>
        </HrAlert>
      </HrCard>

      <HrCard title="Payments" padding="none">
        <template #actions><HrButton variant="secondary" theme="neutral" size="xs" :href="`#${base}/payments`">All payments</HrButton></template>
        <div class="tabs"><HrTabs v-model="tab" :tabs="[{ key: 'all', label: 'Latest' }, { key: 'attention', label: 'Needs attention', count: scenario === 'fresh' ? 0 : attention }]" label="Payment view" /></div>
        <HrEmptyState v-if="scenario === 'fresh'" size="sm" title="No payments yet" text="Share a payment link or open a funnel checkout to take your first payment.">
          <template #actions><HrButton size="sm">Create payment link</HrButton></template>
        </HrEmptyState>
        <HrTable v-else :columns="cols" :rows="rows" row-key="id" clickable caption="Payments" @row-click="openPay">
          <template #cell-amt="{ row }">{{ money(row.amt) }}</template>
          <template #cell-net="{ row }">{{ money(netOf(row)) }}</template>
          <template #cell-status="{ row }"><HrTag :color="STATUS_TAG[row.status]" size="sm">{{ row.status }}</HrTag></template>
        </HrTable>
      </HrCard>
    </div>
    <PaymentQuickView v-model="qv" :payment="sel" :base="base" />
  </FastpayFrame>
</template>

<style scoped>
.dash { display: flex; flex-direction: column; gap: 20px; max-width: 1240px; }
.muted { color: var(--hr-text-neutral-base); font: var(--hr-text-md); }
.hero { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; }
.hero__v { font: var(--hr-font-size-7xl)/var(--hr-font-line-height-7xl) var(--hr-font-family); font-weight: var(--hr-font-weight-semibold); color: var(--hr-text-neutral-title-1); font-variant-numeric: tabular-nums; margin: 4px 0; }
.hero__v.is-neg { color: var(--hr-text-error-body-1); }
.hero__alert { margin-top: 16px; }
.flow { list-style: none; margin: 20px 0 0; padding: 0; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 0; }
.flow__step { position: relative; padding: 14px 16px 14px 16px; border: 1px solid var(--hr-border-neutral-subtle-1); background: var(--hr-background-neutral-subtle-1); }
.flow__step:first-child { border-radius: 8px 0 0 8px; }
.flow__step:last-child { border-radius: 0 8px 8px 0; }
.flow__step + .flow__step { border-left: 0; }
.flow__step.is-error { background: var(--hr-background-error-subtle-1); border-color: var(--hr-border-error-subtle-1); }
.flow__n { position: absolute; top: 14px; right: 14px; width: 20px; height: 20px; border-radius: 50%; display: grid; place-items: center; font: var(--hr-text-xs); font-weight: var(--hr-font-weight-semibold); background: var(--hr-background-neutral-base); color: var(--hr-text-neutral-base); border: 1px solid var(--hr-border-neutral-subtle-1); }
.flow__label { font: var(--hr-text-md); color: var(--hr-text-neutral-base); }
.flow__v { font: var(--hr-text-3xl); font-weight: var(--hr-font-weight-semibold); color: var(--hr-text-neutral-title-1); font-variant-numeric: tabular-nums; }
.flow__note { font: var(--hr-text-sm); color: var(--hr-text-neutral-base); }
.flow__step.is-error .flow__v, .flow__step.is-error .flow__note { color: var(--hr-text-error-body-1); }
.tabs { padding: 0 20px; }
@media (max-width: 900px) { .flow { grid-template-columns: 1fr 1fr; } .flow__step { border-radius: 0 !important; border-left: 1px solid var(--hr-border-neutral-subtle-1) !important; } }
</style>
