<script setup lang="ts">
// J8.4 — refund with the refund fee shown before the merchant confirms (PRD J8 rules).
import { computed, ref, watch } from 'vue';
import { HrModal, HrTabs, HrInput, HrButton, HrDescriptionList, HrAlert } from '../../../components';
import { type Payment, money, fee, STICKER } from '../data';

const open = defineModel<boolean>({ default: false });
const props = defineProps<{ payment: Payment; balance: number }>();
const emit = defineEmits<{ refunded: [amount: number] }>();

const type = ref<'full' | 'partial'>('full');
const amount = ref('');
const busy = ref(false);
const left = computed(() => Math.round((props.payment.amt - props.payment.refunded) * 100) / 100);
watch(open, (v) => { if (v) { type.value = 'full'; amount.value = ''; busy.value = false; } }, { immediate: true });

const value = computed(() => (type.value === 'full' ? left.value : Number(amount.value)));
const error = computed(() => {
  if (type.value === 'full') return '';
  if (!amount.value) return '';
  if (!(value.value > 0)) return 'Enter an amount above $0.00';
  if (value.value > left.value) return `You can refund up to ${money(left.value)}`;
  return '';
});
const valid = computed(() => value.value > 0 && !error.value);
const rfee = computed(() => (valid.value ? fee(value.value) : 0));
const total = computed(() => value.value + rfee.value);
const lowBalance = computed(() => valid.value && total.value > props.balance);

function submit() {
  if (!valid.value) return;
  busy.value = true;
  setTimeout(() => { emit('refunded', value.value); open.value = false; }, 700);
}
</script>

<template>
  <HrModal v-model="open" :width="520" :title="`Refund ${payment.customer}`" :description="`Original payment ${money(payment.amt)} · ${payment.method}`">
    <div class="rf">
      <HrTabs v-model="type" type="segment" label="Refund type" :tabs="[{ key: 'full', label: payment.refunded ? `Refund the rest · ${money(left)}` : `Full refund · ${money(left)}` }, { key: 'partial', label: 'Partial refund' }]" />
      <HrInput v-if="type === 'partial'" v-model="amount" label="Refund amount" prefix="$" inputmode="decimal" placeholder="0.00" :hint="`Up to ${money(left)}`" :error="error" autocomplete="off" />
      <HrDescriptionList :items="[
        { label: 'Refund to customer', value: valid ? money(value) : '—' },
        { label: `Refund fee (${STICKER.label} on the refund)`, value: valid ? money(rfee) : '—' },
        { label: 'Taken from your balance', value: valid ? money(total) : '—', total: true },
      ]" />
      <p class="rf__note">We keep the fee from the original payment. The customer sees the refund in 5–10 business days.</p>
      <HrAlert v-if="lowBalance" color="warning" title="Your balance is too low for this refund">It will go through and your balance will go negative until new payments cover it.</HrAlert>
    </div>
    <template #footer>
      <HrButton variant="secondary" theme="neutral" @click="open = false">Cancel</HrButton>
      <HrButton theme="destructive" :disabled="!valid" :loading="busy" @click="submit">{{ valid ? `Refund ${money(value)}` : 'Refund' }}</HrButton>
    </template>
  </HrModal>
</template>

<style scoped>
.rf { display: flex; flex-direction: column; gap: 16px; }
.rf__note { margin: 0; font: var(--hr-text-md); color: var(--hr-text-neutral-base); }
</style>
