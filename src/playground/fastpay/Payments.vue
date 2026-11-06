<script setup lang="ts">
// J8.2 — payments list with filters (customer, date, status, channel) and pagination.
import { computed, ref, watch } from 'vue';
import { Search } from 'lucide-vue-next';
import { HrButton, HrCard, HrInput, HrSelect, HrTable, HrTag, HrPagination, HrEmptyState } from '../../components';
import FastpayFrame from './parts/FastpayFrame.vue';
import { payments, money, fee, netOf, STATUS_TAG, STICKER } from './data';
import { go } from '../../router';

const base = '/p/fastpay';
const q = ref('');
const date = ref<string | number>('30');
const status = ref<string | number>('all');
const channel = ref<string | number>('all');
const page = ref(1);
const perPage = 8;

const filtered = computed(() => payments.filter((p) =>
  (!q.value || p.customer.toLowerCase().includes(q.value.toLowerCase())) &&
  (status.value === 'all' || p.status === status.value) &&
  (channel.value === 'all' || p.channel === channel.value)));
const pageRows = computed(() => filtered.value.slice((page.value - 1) * perPage, page.value * perPage));
watch([q, status, channel], () => { page.value = 1; });
const any = computed(() => q.value || status.value !== 'all' || channel.value !== 'all');
function reset() { q.value = ''; status.value = 'all'; channel.value = 'all'; }

const statusOpts = ['all', 'Succeeded', 'Refunded', 'Partially refunded', 'Disputed', 'Failed'].map((s) => ({ label: s === 'all' ? 'All statuses' : s, value: s }));
const channelOpts = ['all', 'Funnel', 'Invoice', 'Subscription', 'Payment link', 'Store', 'Calendar', 'Text-to-pay', 'Membership', 'Form'].map((s) => ({ label: s === 'all' ? 'All channels' : s, value: s }));
const dateOpts = [{ label: 'Last 30 days', value: '30' }, { label: 'Last 7 days', value: '7' }, { label: 'This month', value: 'month' }];
const cols = [
  { key: 'amt', label: 'Amount', primary: true }, { key: 'status', label: 'Status' }, { key: 'customer', label: 'Customer' },
  { key: 'channel', label: 'Channel', hideBelow: 1100 }, { key: 'fee', label: 'Fee', align: 'right' as const, hideBelow: 1100 },
  { key: 'net', label: 'Net', align: 'right' as const, hideBelow: 760 }, { key: 'date', label: 'Date', hideBelow: 760 },
];
</script>

<template>
  <FastpayFrame :base="base" active="payments" title="Payments">
    <template #actions><HrButton variant="secondary" theme="neutral" size="sm">Export CSV</HrButton></template>
    <div class="page">
      <div class="filters">
        <HrInput v-model="q" label="Customer" placeholder="Search by name" type="search" size="sm"><template #leading><Search /></template></HrInput>
        <HrSelect v-model="date" label="Date" :options="dateOpts" size="sm" />
        <HrSelect v-model="status" label="Status" :options="statusOpts" size="sm" />
        <HrSelect v-model="channel" label="Channel" :options="channelOpts" size="sm" />
      </div>
      <HrCard padding="none">
        <HrTable :columns="cols" :rows="pageRows" row-key="id" clickable caption="Payments" @row-click="(r) => go(`${base}/payments/${r.id}`)">
          <template #cell-amt="{ row }">{{ money(row.amt) }}</template>
          <template #cell-status="{ row }"><HrTag :color="STATUS_TAG[row.status]" size="sm">{{ row.status }}</HrTag></template>
          <template #cell-fee="{ row }">{{ row.status === 'Failed' ? '—' : money(fee(row.amt)) }}</template>
          <template #cell-net="{ row }">{{ money(netOf(row)) }}</template>
          <template #empty>
            <HrEmptyState size="sm" title="No payments match these filters" text="Try a different status or channel, or clear the filters.">
              <template #actions><HrButton v-if="any" variant="secondary" theme="neutral" size="sm" @click="reset">Clear filters</HrButton></template>
            </HrEmptyState>
          </template>
        </HrTable>
        <template #footer>
          <div class="foot">
            <span>Fees are the Fastpay rate of {{ STICKER.label }} · Times in Pacific Time</span>
            <HrPagination v-if="filtered.length > perPage" v-model="page" :total="filtered.length" :per-page="perPage" size="sm" />
          </div>
        </template>
      </HrCard>
    </div>
  </FastpayFrame>
</template>

<style scoped>
.page { display: flex; flex-direction: column; gap: 16px; max-width: 1240px; }
.filters { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 12px; }
.foot { display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap; }
@media (max-width: 900px) { .filters { grid-template-columns: 1fr 1fr; } }
</style>
