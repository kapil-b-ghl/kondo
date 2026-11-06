<script setup lang="ts">
// J8.1d — payment quick view drawer opened from the dashboard's recent payments.
import { computed } from 'vue';
import { HrModal, HrTag, HrAlert, HrButton, HrDescriptionList } from '../../../components';
import { type Payment, money, fee, netOf, STATUS_TAG, STICKER } from '../data';

const open = defineModel<boolean>({ default: false });
const props = defineProps<{ payment: Payment | null; base: string }>();

const note = computed(() => {
  const p = props.payment;
  if (!p) return null;
  if (p.status === 'Refunded') return { color: 'gray' as const, text: 'Refunded in full on Nov 1. Customers usually see it in 5–10 business days.' };
  if (p.status === 'Disputed') return { color: 'error' as const, text: 'The customer disputed this payment. Respond by Nov 9, 2026 (7 days left).' };
  if (p.status === 'Failed') return { color: 'warning' as const, text: 'Declined by the bank: insufficient funds. Retrying automatically, next try Nov 3.' };
  return null;
});
const lines = computed(() => {
  const p = props.payment!;
  const f = p.status === 'Failed' ? 0 : fee(p.amt);
  const out = [{ label: 'Amount', value: money(p.amt) }, { label: `Fastpay fee (${STICKER.label})`, value: money(-f) }];
  if (p.refunded) out.push({ label: 'Refunded', value: money(-p.refunded) }, { label: 'Refund fee', value: money(-fee(p.refunded)) });
  return [...out, { label: 'Net to your balance', value: money(netOf(p)), total: true }];
});
const cta = computed(() => {
  const p = props.payment!;
  if (p.status === 'Disputed') return 'Respond to dispute';
  if (p.status === 'Failed') return 'View subscription';
  if (p.status === 'Refunded') return 'Send receipt';
  return 'Refund';
});
</script>

<template>
  <HrModal v-if="payment" v-model="open" side="right" :width="440" title="Payment" :description="`${payment.customer} · ${payment.date}`">
    <div class="qv">
      <div class="qv__head">
        <span class="qv__amt">{{ money(payment.amt) }}</span>
        <HrTag :color="STATUS_TAG[payment.status]">{{ payment.status }}</HrTag>
      </div>
      <HrAlert v-if="note" :color="note.color">{{ note.text }}</HrAlert>
      <HrDescriptionList :items="lines" />
      <HrDescriptionList :items="[{ label: 'Channel', value: payment.channelDetail }, { label: 'Payment method', value: payment.method }, { label: 'Payment ID', value: payment.id, mono: true }]" />
    </div>
    <template #footer>
      <HrButton variant="secondary" theme="neutral" :href="`#${base}/payments/${payment.id}`">View full details</HrButton>
      <HrButton :href="`#${base}/payments/${payment.id}${cta === 'Refund' ? '?refund=1' : ''}`">{{ cta }}</HrButton>
    </template>
  </HrModal>
</template>

<style scoped>
.qv { display: flex; flex-direction: column; gap: 16px; }
.qv__head { display: flex; align-items: center; gap: 12px; }
.qv__amt { font: var(--hr-text-5xl); font-weight: var(--hr-font-weight-semibold); color: var(--hr-text-neutral-title-1); }
</style>
