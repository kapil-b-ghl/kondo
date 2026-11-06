<script setup lang="ts">
// Variant C — "To-do first". Idea: most visits are reactions to an email ("dispute opened",
// "payout paused"). Lead with a short queue of things only the merchant can do, each with
// its deadline and one action; money stays visible in a compact side summary.
import { computed, ref } from 'vue';
import { HrButton, HrCard, HrTable, HrTag, HrEmptyState, HrDescriptionList } from '../../components';
import FastpayFrame from './parts/FastpayFrame.vue';
import PaymentQuickView from './parts/PaymentQuickView.vue';
import { payments, money, balances, disputes, STATUS_TAG, saved, type Payment, type Scenario } from './data';
import { VARIANTS } from './variants';

const base = '/p/fastpay';
const sel = ref<Payment | null>(null);
const qv = ref(false);
const done = ref<string[]>([]);
function openPay(p: Payment) { sel.value = p; qv.value = true; }

interface Task { id: string; tone: 'error' | 'warning' | 'primary'; title: string; text: string; due: string; cta: string }
function tasks(sc: Scenario): Task[] {
  const t: Task[] = [];
  if (sc === 'action') t.push({ id: 'kyc', tone: 'warning', title: 'Confirm 3 business details', text: 'Payouts pause on Nov 12 if these aren’t fixed. Payments keep working.', due: '5 days left', cta: 'Fix now' });
  if (sc === 'paused') t.push({ id: 'id', tone: 'error', title: 'Upload a current ID for Dana Brooks', text: 'Payouts are paused until it’s verified. Your balance is safe.', due: 'Payouts paused', cta: 'Upload ID' });
  if (sc === 'negative') t.push({ id: 'neg', tone: 'warning', title: 'Your balance is −$142.30', text: 'A chargeback and its fee came out of your balance. New payments will cover it.', due: 'No action needed', cta: 'View dispute' });
  if (sc === 'closing') t.push({ id: 'close', tone: 'error', title: 'Connect another provider before Nov 16', text: 'Fastpay stops taking payments on Nov 16. Refunds and disputes keep working.', due: '9 days left', cta: 'Connect provider' });
  if (sc !== 'fresh') {
    disputes.forEach((d) => t.push({ id: 'd-' + d.customer, tone: d.daysLeft <= 7 ? 'error' : 'warning', title: `Answer ${d.customer}’s dispute · ${money(d.amount)}`, text: d.reason, due: `${d.daysLeft} days left`, cta: 'Respond' }));
    t.push({ id: 'renew', tone: 'primary', title: 'Jordan Smith’s renewal failed', text: 'Smile Club · $39.00. We retry automatically on Nov 3; you can send an update-card link now.', due: 'Retrying', cta: 'Send link' });
  }
  return t;
}
const open = (sc: Scenario) => tasks(sc).filter((t) => !done.value.includes(t.id));
const cols = [{ key: 'amt', label: 'Amount', primary: true }, { key: 'status', label: 'Status' }, { key: 'customer', label: 'Customer' }, { key: 'date', label: 'Date', hideBelow: 760 }];
const recent = computed(() => payments.slice(0, 5));
</script>

<template>
  <FastpayFrame v-slot="{ scenario }" :base="base" active="overview" title="Fastpay" variant="c" :variants="VARIANTS">
    <div class="grid">
      <div class="main">
        <HrCard :title="open(scenario).length ? `${open(scenario).length} things need you` : 'You’re all caught up'" description="Sorted by deadline. Only things you can act on show here." padding="none">
          <HrEmptyState v-if="!open(scenario).length" size="sm" :title="scenario === 'fresh' ? 'Nothing to do yet' : 'Nothing needs you right now'" :text="scenario === 'fresh' ? 'Take your first payment and it will show below.' : 'We’ll email you if a dispute opens or a payout needs attention.'" />
          <ul v-else class="tasks">
            <li v-for="t in open(scenario)" :key="t.id" class="task" :class="`is-${t.tone}`">
              <span class="task__bar" aria-hidden="true" />
              <div class="task__body">
                <div class="task__title">{{ t.title }}</div>
                <div class="task__text">{{ t.text }}</div>
              </div>
              <HrTag :color="t.tone === 'primary' ? 'gray' : t.tone" size="sm">{{ t.due }}</HrTag>
              <HrButton size="sm" :variant="t.tone === 'primary' ? 'secondary' : 'primary'" :theme="t.tone === 'primary' ? 'neutral' : 'primary'" @click="done.push(t.id)">{{ t.cta }}</HrButton>
            </li>
          </ul>
        </HrCard>
        <HrCard title="Latest payments" padding="none">
          <template #actions><HrButton variant="secondary" theme="neutral" size="xs" :href="`#${base}/payments`">View all</HrButton></template>
          <HrEmptyState v-if="scenario === 'fresh'" size="sm" title="No payments yet" text="Your first payment shows here as soon as it's authorized." />
          <HrTable v-else :columns="cols" :rows="recent" row-key="id" clickable caption="Latest payments" @row-click="openPay">
            <template #cell-amt="{ row }">{{ money(row.amt) }}</template>
            <template #cell-status="{ row }"><HrTag :color="STATUS_TAG[row.status]" size="sm">{{ row.status }}</HrTag></template>
          </HrTable>
        </HrCard>
      </div>
      <aside class="side">
        <HrCard title="Balance">
          <HrDescriptionList :items="[
            { label: 'Available', value: money(balances(scenario).available), tone: balances(scenario).available < 0 ? 'negative' : 'neutral' },
            { label: 'On its way', value: money(balances(scenario).pending) },
            { label: 'Next payout', value: balances(scenario).next === null ? '—' : money(balances(scenario).next!) },
          ]" />
          <p class="note" :class="{ 'is-error': balances(scenario).nextTone === 'error' }">{{ balances(scenario).nextNote }}</p>
          <HrButton variant="secondary" theme="neutral" size="sm" block>View payouts</HrButton>
        </HrCard>
        <HrCard v-if="scenario !== 'fresh' && scenario !== 'closing'" title="Saved with Fastpay">
          <div class="saved">{{ money(saved.month) }}</div>
          <p class="note">this month, compared with Stripe’s standard rate · {{ money(saved.total) }} since {{ saved.since }}</p>
        </HrCard>
      </aside>
    </div>
    <PaymentQuickView v-model="qv" :payment="sel" :base="base" />
  </FastpayFrame>
</template>

<style scoped>
.grid { display: grid; grid-template-columns: minmax(0, 1fr) 320px; gap: 20px; align-items: start; max-width: 1240px; }
.main, .side { display: flex; flex-direction: column; gap: 20px; min-width: 0; }
.tasks { list-style: none; margin: 0; padding: 0; }
.task { display: grid; grid-template-columns: 4px minmax(0, 1fr) auto auto; gap: 16px; align-items: center; padding: 14px 20px 14px 0; border-top: 1px solid var(--hr-border-neutral-subtle-1); }
.task__bar { align-self: stretch; border-radius: 0 2px 2px 0; background: var(--hr-border-neutral-base); }
.task.is-error .task__bar { background: var(--hr-icon-error-default); }
.task.is-warning .task__bar { background: var(--hr-icon-warning-default); }
.task.is-primary .task__bar { background: var(--hr-icon-primary-default); }
.task__title { font: var(--hr-text-lg); font-weight: var(--hr-font-weight-semibold); color: var(--hr-text-neutral-title-1); }
.task__text { font: var(--hr-text-md); color: var(--hr-text-neutral-base); }
.note { margin: 8px 0 12px; font: var(--hr-text-md); color: var(--hr-text-neutral-base); }
.note.is-error { color: var(--hr-text-error-body-1); }
.saved { font: var(--hr-text-5xl); font-weight: var(--hr-font-weight-semibold); color: var(--hr-text-success-body-1); }
@media (max-width: 1100px) { .grid { grid-template-columns: 1fr; } }
@media (max-width: 700px) { .task { grid-template-columns: 4px 1fr; } .task > :nth-child(3), .task > :nth-child(4) { grid-column: 2; justify-self: start; } }
</style>
