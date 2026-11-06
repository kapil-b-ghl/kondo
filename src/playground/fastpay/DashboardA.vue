<script setup lang="ts">
// Variant A — "Overview" (J8.1 · J8.5 · J10.1). Faithful to the Claude design prototype:
// status banner → migration → 4 KPIs → money saved → recent payments + payouts/disputes rail.
import { computed, ref } from 'vue';
import { HrAlert, HrButton, HrCard, HrStat, HrTable, HrTag, HrEmptyState, HrDescriptionList } from '../../components';
import FastpayFrame from './parts/FastpayFrame.vue';
import PaymentQuickView from './parts/PaymentQuickView.vue';
import { payments, money, balances, BANNERS, payouts, disputes, saved, STATUS_TAG, COMPARE, STICKER, type Payment, type Scenario } from './data';
import { VARIANTS } from './variants';

const base = '/p/fastpay';
const sel = ref<Payment | null>(null);
const qv = ref(false);
const savedOpen = ref(false);
function openPay(p: Payment) { sel.value = p; qv.value = true; }
const cols = [
  { key: 'amt', label: 'Amount', primary: true }, { key: 'status', label: 'Status', hideBelow: 760 },
  { key: 'customer', label: 'Customer' }, { key: 'channel', label: 'Channel', hideBelow: 1100 }, { key: 'date', label: 'Date', hideBelow: 760 },
];
const recent = computed(() => payments.slice(0, 6));
const payoutTag = (s: string) => (s === 'Paid' ? 'success' : s === 'In transit' ? 'primary' : 'gray') as 'success' | 'primary' | 'gray';
const k = (sc: Scenario) => balances(sc);
</script>

<template>
  <FastpayFrame v-slot="{ scenario }" :base="base" active="overview" title="Fastpay" variant="a" :variants="VARIANTS">
    <div class="dash">
      <HrAlert v-if="BANNERS[scenario]" :color="BANNERS[scenario]!.color" :title="BANNERS[scenario]!.title" role="alert">
        {{ BANNERS[scenario]!.text }}
        <template #aside><HrButton :variant="BANNERS[scenario]!.ctaVariant" :theme="BANNERS[scenario]!.ctaVariant === 'primary' ? 'primary' : 'neutral'" size="sm">{{ BANNERS[scenario]!.cta }}</HrButton></template>
      </HrAlert>

      <HrCard v-if="scenario === 'ready'" padding="sm">
        <div class="mig">
          <div>
            <div class="mig__title">Finish migrating to Fastpay · 3 of 8 done</div>
            <div class="muted">Waiting for your current provider to send the card export. Saved cards and renewals stay there until you switch them.</div>
          </div>
          <div class="mig__bar" role="progressbar" aria-valuemin="0" aria-valuemax="8" aria-valuenow="3"><span style="width: 37.5%" /></div>
          <HrButton size="sm">Continue migration</HrButton>
        </div>
      </HrCard>

      <section class="kpis" aria-label="Balance">
        <HrStat label="Available balance" :value="money(k(scenario).available)" :note="k(scenario).reservedNote" :negative="k(scenario).available < 0" />
        <HrStat label="On its way" :value="money(k(scenario).pending)" note="Settles in 1–2 business days" />
        <HrStat label="Next payout" :value="k(scenario).next === null ? '—' : money(k(scenario).next!)" :note="k(scenario).nextNote" :tone="k(scenario).nextTone" href="#" />
        <HrStat label="Open disputes" :value="String(k(scenario).disputes)" :note="k(scenario).disputeNote" :tone="k(scenario).disputes ? 'warning' : 'neutral'" href="#" />
      </section>

      <HrCard v-if="scenario !== 'fresh' && scenario !== 'closing'" padding="sm">
        <div class="saved">
          <div><div class="muted">Money saved with Fastpay</div><div class="saved__v">{{ money(saved.month) }} <span class="muted">this month</span></div></div>
          <div><div class="muted">Since joining in {{ saved.since }}</div><div class="saved__v">{{ money(saved.total) }}</div></div>
          <HrButton variant="tertiary" theme="neutral" size="sm" :aria-expanded="savedOpen" @click="savedOpen = !savedOpen">How it's worked out</HrButton>
        </div>
        <div v-if="savedOpen" class="saved__how">
          <p class="muted">Compared with {{ COMPARE.name }} of {{ COMPARE.label }}. For each payment, we take what that rate would have charged, minus our fee. We also subtract refund fees we charged, so the number isn't overstated.</p>
          <HrDescriptionList :items="[
            { label: `${saved.payments} payments this month`, value: money(saved.volume) },
            { label: `At ${COMPARE.name}`, value: money(saved.atCompare) },
            { label: `Fastpay fees (${STICKER.label})`, value: money(-saved.ours) },
            { label: 'Refund fees charged', value: money(-saved.refundFees) },
            { label: 'Saved this month', value: money(saved.month), total: true },
          ]" />
        </div>
      </HrCard>

      <div class="cols">
        <HrCard title="Recent payments" description="Select a payment to see its details" padding="none">
          <template #actions><HrButton variant="secondary" theme="neutral" size="xs" :href="`#${base}/payments`">View all payments</HrButton></template>
          <HrEmptyState v-if="scenario === 'fresh'" size="sm" title="No payments yet" text="Your first payment shows here as soon as it's authorized." />
          <HrTable v-else :columns="cols" :rows="recent" row-key="id" clickable caption="Recent payments" @row-click="openPay">
            <template #cell-amt="{ row }">{{ money(row.amt) }}</template>
            <template #cell-status="{ row }"><HrTag :color="STATUS_TAG[row.status]" size="sm">{{ row.status }}</HrTag></template>
            <template #cell-channel="{ row }">{{ row.channel }}</template>
          </HrTable>
        </HrCard>
        <aside class="rail">
          <HrCard title="Payouts">
            <template #actions><HrButton variant="link" size="sm" href="#">View all</HrButton></template>
            <p v-if="scenario === 'fresh'" class="muted">Your first payout may take a few extra days. After that, each day's sales are paid out 2 business days later.</p>
            <ul v-else class="list">
              <li v-for="(p, i) in payouts" :key="i">
                <div><div class="strong">{{ money(p.amount) }}</div><div class="muted">{{ p.when }} · {{ p.bank }}</div></div>
                <HrTag v-if="i === 0 && (scenario === 'paused' || scenario === 'negative')" color="error" size="sm">On hold</HrTag>
                <HrTag v-else :color="payoutTag(p.status)" size="sm">{{ p.status }}</HrTag>
              </li>
            </ul>
          </HrCard>
          <HrCard v-if="scenario !== 'fresh'" title="Disputes to answer">
            <template #actions><HrButton variant="link" size="sm" href="#">Open</HrButton></template>
            <ul class="list">
              <li v-for="d in disputes" :key="d.customer">
                <div><div class="strong">{{ money(d.amount) }} · {{ d.customer }}</div><div class="muted">{{ d.reason }}</div></div>
                <HrTag :color="d.daysLeft <= 7 ? 'error' : 'warning'" size="sm">{{ d.daysLeft }} days left</HrTag>
              </li>
            </ul>
          </HrCard>
        </aside>
      </div>
    </div>
    <PaymentQuickView v-model="qv" :payment="sel" :base="base" />
  </FastpayFrame>
</template>

<style scoped>
.dash { display: flex; flex-direction: column; gap: 20px; max-width: 1240px; }
.muted { color: var(--hr-text-neutral-base); font: var(--hr-text-md); margin: 0; }
.strong { font: var(--hr-text-lg); font-weight: var(--hr-font-weight-semibold); color: var(--hr-text-neutral-title-1); }
.mig { display: grid; grid-template-columns: minmax(0, 1fr) 160px auto; gap: 20px; align-items: center; }
.mig__title { font: var(--hr-text-lg); font-weight: var(--hr-font-weight-semibold); margin-bottom: 2px; }
.mig__bar { height: 8px; border-radius: 4px; background: var(--hr-background-neutral-subtle-2); overflow: hidden; }
.mig__bar span { display: block; height: 100%; background: var(--hr-background-primary-default); border-radius: 4px; }
.kpis { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; }
.saved { display: grid; grid-template-columns: 1fr 1fr auto; gap: 20px; align-items: center; }
.saved__v { font: var(--hr-text-3xl); font-weight: var(--hr-font-weight-semibold); color: var(--hr-text-success-body-1); }
.saved__v .muted { font-weight: var(--hr-font-weight-regular); }
.saved__how { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--hr-border-neutral-subtle-1); }
.cols { display: grid; grid-template-columns: minmax(0, 1fr) 340px; gap: 20px; align-items: start; }
.rail { display: flex; flex-direction: column; gap: 20px; }
.list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; }
.list li { display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid var(--hr-border-neutral-subtle-0); }
.list li:last-child { border-bottom: 0; }
@media (max-width: 1100px) { .kpis { grid-template-columns: repeat(2, minmax(0, 1fr)); } .cols { grid-template-columns: 1fr; } .mig { grid-template-columns: 1fr; } }
@media (max-width: 600px) { .kpis, .saved, .saved__how { grid-template-columns: 1fr; } }
</style>
