<script setup lang="ts">
// J8.3 payment detail + J8.4 refund. Refunds are off for disputed and failed payments,
// and for people without the refund permission (PRD: "Refunds sit behind a permission").
import { computed, ref, watch } from 'vue';
import { HrAlert, HrButton, HrCard, HrDescriptionList, HrTag, HrTimeline, HrEmptyState, HrToggle } from '../../components';
import FastpayFrame from './parts/FastpayFrame.vue';
import RefundModal from './parts/RefundModal.vue';
import { payments, money, fee, netOf, STATUS_TAG, STICKER, timelineOf, refundPayment, balances } from './data';
import { query, setQuery } from '../../router';

const props = defineProps<{ id: string }>();
const base = '/p/fastpay';
const p = computed(() => payments.find((x) => x.id === props.id));
const refundOpen = ref(query.value.get('refund') === '1');
watch(refundOpen, (v) => { if (!v) setQuery('refund', null); });
const canRefund = ref(true);
const toast = ref('');
const blocked = computed(() => !p.value || p.value.status === 'Disputed' || p.value.status === 'Failed' || p.value.status === 'Refunded');

const money_lines = computed(() => {
  const x = p.value!;
  const out = [{ label: 'Amount', value: money(x.amt) }, { label: `Fastpay fee (${STICKER.label})`, value: x.status === 'Failed' ? '—' : money(-fee(x.amt)) }];
  if (x.refunded) out.push({ label: 'Refunded to customer', value: money(-x.refunded) }, { label: `Refund fee (${STICKER.label} on refunded amount)`, value: money(-fee(x.refunded)) });
  return [...out, { label: 'Net to your balance', value: money(netOf(x)), total: true }];
});
function onRefunded(a: number) {
  refundPayment(p.value!, a);
  toast.value = `Refund of ${money(a)} sent to ${p.value!.customer}. The refund fee was ${money(fee(a))}.`;
}
</script>

<template>
  <FastpayFrame :base="base" active="payments" :title="p ? `Payment ${money(p.amt)}` : 'Payment'" :back="`#${base}/payments`">
    <template #actions><HrToggle v-model="canRefund" size="sm" label="Can refund (prototype)" /></template>
    <HrEmptyState v-if="!p" title="Payment not found" text="It may have been removed from this prototype." />
    <div v-else class="detail">
      <div class="main">
        <HrAlert v-if="toast" color="success" :title="toast" dismissible @dismiss="toast = ''" />
        <HrCard>
          <div class="head">
            <span class="amt">{{ money(p.amt) }}</span>
            <HrTag :color="STATUS_TAG[p.status]">{{ p.status }}</HrTag>
            <div class="actions">
              <HrButton variant="secondary" theme="neutral" size="sm">Send receipt</HrButton>
              <HrButton size="sm" :disabled="blocked || !canRefund" @click="refundOpen = true">Refund</HrButton>
            </div>
          </div>
          <p v-if="!canRefund" class="muted">You don't have permission to refund payments. Ask an admin of BrightSmile Dental.</p>
          <HrAlert v-if="p.status === 'Disputed'" color="error">This payment is disputed. Refunds are off while the dispute is open.<template #actions><HrButton variant="link" theme="destructive" size="sm">Respond to the dispute</HrButton></template></HrAlert>
          <HrAlert v-if="p.status === 'Failed'" color="warning">The bank declined this payment. There’s nothing to refund.</HrAlert>
          <HrDescriptionList :items="money_lines" />
        </HrCard>
        <HrCard title="Timeline"><HrTimeline :items="timelineOf(p)" /></HrCard>
      </div>
      <HrCard title="Details" class="side">
        <HrDescriptionList align="grid" :items="[
          { label: 'Customer', value: p.customer }, { label: 'Email', value: p.email }, { label: 'Channel', value: p.channelDetail },
          { label: 'Payment method', value: p.method }, { label: 'Statement shows', value: 'BRIGHTSMILE DENTAL' },
          { label: 'Payment ID', value: p.id, mono: true }, { label: 'Reference', value: p.psp, mono: true },
        ]" />
      </HrCard>
    </div>
    <RefundModal v-if="p" v-model="refundOpen" :payment="p" :balance="balances('ready').available" @refunded="onRefunded" />
  </FastpayFrame>
</template>

<style scoped>
.detail { display: grid; grid-template-columns: minmax(0, 1fr) 380px; gap: 20px; align-items: start; max-width: 1240px; }
.main { display: flex; flex-direction: column; gap: 20px; min-width: 0; }
.head { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; flex-wrap: wrap; }
.amt { font: var(--hr-text-5xl); font-weight: var(--hr-font-weight-semibold); color: var(--hr-text-neutral-title-1); }
.actions { margin-left: auto; display: flex; gap: 8px; }
.muted { margin: 0 0 12px; font: var(--hr-text-md); color: var(--hr-text-neutral-base); }
.main :deep(.hr-alert) { margin-bottom: 12px; }
@media (max-width: 1100px) { .detail { grid-template-columns: 1fr; } }
</style>
