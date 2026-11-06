<script setup lang="ts">
// Live examples for each registry component, used on the library pages.
import { ref } from 'vue';
import { Search, Mail, Plus, MoreHorizontal, Download, RotateCcw, Copy, Trash2, ChevronDown } from 'lucide-vue-next';
import {
  HrAlert, HrButton, HrCard, HrCheckbox, HrDescriptionList, HrEmptyState, HrInput, HrModal, HrPagination, HrRadio,
  HrSelect, HrStat, HrTable, HrTabs, HrTag, HrTimeline, HrToggle, HrTooltip,
  HrBanner, HrDatePicker, HrDropdownMenu, HrFileUploader, HrProgressSteps, HrSkeleton, HrTextarea,
} from '../components';
import type { UploadFile } from '../components/file-uploader/HrFileUploader.vue';

defineProps<{ tag: string }>();
const c1 = ref(true), c2 = ref(false), r = ref('daily'), t = ref(true), v = ref(''), s = ref<string | number>('weekly'), tab = ref('all'), seg = ref('full');
const page = ref(2), modal = ref(false), drawer = ref(false);
const opts = [{ label: 'Daily', value: 'daily' }, { label: 'Weekly', value: 'weekly', hint: 'Every Monday' }, { label: 'Monthly', value: 'monthly' }];
const rows = [
  { id: 1, amount: '$249.00', status: 'Succeeded', customer: 'Taylor Nguyen', date: 'Nov 2' },
  { id: 2, amount: '$480.00', status: 'Disputed', customer: 'Jamie Fox', date: 'Oct 30' },
  { id: 3, amount: '$39.00', status: 'Failed', customer: 'Jordan Smith', date: 'Oct 30' },
];
const note = ref(''), menuPick = ref<string | number>('weekly'), channels = ref<(string | number)[]>(['link']), lastAction = ref('');
const day = ref<string | [string, string] | undefined>('2026-11-04'), span = ref<string | [string, string] | undefined>(['2026-11-02', '2026-11-06']);
const bannerPage = ref(1), bannerOpen = ref(true);
const files = ref<UploadFile[]>([
  { id: 1, name: 'Bank statement October.pdf', size: '200 KB', state: 'progress', progress: 40 },
  { id: 2, name: 'Owner ID front.jpg', size: '1.2 MB', state: 'complete' },
  { id: 3, name: 'Owner ID back.jpg', size: '4.8 MB', state: 'error', error: 'File is over 4 MB' },
  { id: 4, name: 'Articles of incorporation.pdf', size: '540 KB', state: 'queued' },
]);
function addFiles(list: File[]) { for (const f of list) files.value.push({ id: Date.now() + f.name, name: f.name, size: `${Math.max(1, Math.round(f.size / 1024))} KB`, state: 'complete' }); }
const tagFor = (st: string) => (st === 'Succeeded' ? 'success' : st === 'Disputed' ? 'error' : 'warning') as 'success' | 'error' | 'warning';
</script>

<template>
  <div class="demo">
    <template v-if="tag === 'HrButton'">
      <div class="row"><HrButton>Primary</HrButton><HrButton variant="secondary" theme="neutral">Secondary</HrButton><HrButton variant="tertiary">Tertiary</HrButton><HrButton variant="ghost" theme="neutral">Ghost</HrButton><HrButton variant="link">Link</HrButton></div>
      <div class="row"><HrButton theme="destructive">Delete</HrButton><HrButton theme="success" variant="secondary">Approve</HrButton><HrButton loading>Saving</HrButton><HrButton disabled>Disabled</HrButton><HrButton icon-only variant="secondary" theme="neutral" aria-label="Add"><Plus /></HrButton></div>
      <div class="row"><HrButton v-for="z in ['3xs','2xs','xs','sm','md','lg','xl','2xl']" :key="z" :size="(z as any)">{{ z }}</HrButton></div>
      <a class="more" href="#/spec/button">See all 1,000 variants →</a>
    </template>
    <template v-else-if="tag === 'HrCheckbox'"><div class="row"><HrCheckbox v-model="c1" label="Email me a receipt" hint="Sent after each payout" /><HrCheckbox v-model="c2" label="Unchecked" /><HrCheckbox :model-value="false" indeterminate label="Some selected" /><HrCheckbox :model-value="false" error label="Required" /><HrCheckbox :model-value="true" disabled label="Disabled" /></div></template>
    <template v-else-if="tag === 'HrRadio'"><div class="row"><HrRadio v-model="r" value="daily" label="Daily" hint="2 business days after each sale" /><HrRadio v-model="r" value="weekly" label="Weekly" /><HrRadio v-model="r" value="monthly" label="Monthly" /><HrRadio :model-value="'x'" value="x" label="Disabled" disabled /></div></template>
    <template v-else-if="tag === 'HrToggle'"><div class="row"><HrToggle v-model="t" label="Apple Pay" hint="Shown at checkout on supported devices" /><HrToggle :model-value="false" label="Google Pay" /><HrToggle v-model="t" size="sm" label="Small" /><HrToggle :model-value="true" disabled label="Disabled" /></div></template>
    <template v-else-if="tag === 'HrTag'">
      <div class="row"><HrTag color="success">Paid</HrTag><HrTag color="warning">Action needed</HrTag><HrTag color="error">Disputed</HrTag><HrTag color="primary">In transit</HrTag><HrTag>Refunded</HrTag><HrTag color="purple" outline rounded dot>New</HrTag><HrTag color="blue" removable interactive>Funnel</HrTag></div>
    </template>
    <template v-else-if="tag === 'HrTooltip'"><div class="row tip"><HrTooltip title="Next payout" text="Money from each day is paid out 2 business days later."><HrButton variant="secondary" theme="neutral" size="sm">Hover or focus me</HrButton></HrTooltip><HrTooltip theme="light" placement="right" text="Light theme"><HrButton variant="secondary" theme="neutral" size="sm">Light</HrButton></HrTooltip></div></template>
    <template v-else-if="tag === 'HrInput'"><div class="grid"><HrInput v-model="v" label="Email" placeholder="you@business.com" hint="Receipts go here."><template #leading><Mail /></template></HrInput><HrInput model-value="12-345678" label="EIN" error="Enter all 9 digits of your EIN" /><HrInput model-value="100.00" label="Refund amount" prefix="$" suffix="USD" /><HrInput placeholder="Search payments" size="sm"><template #leading><Search /></template></HrInput></div></template>
    <template v-else-if="tag === 'HrSelect'"><div class="grid"><HrSelect v-model="s" :options="opts" label="Payout schedule" hint="Use ↑ ↓ and Enter" /><HrSelect :options="opts" label="Disabled" disabled /></div></template>
    <template v-else-if="tag === 'HrAlert'"><div class="stack"><HrAlert color="warning" title="We need a few details to keep your payouts running">3 items to fix by Nov 12. Payments keep working.<template #aside><HrButton size="sm">Fix now</HrButton></template></HrAlert><HrAlert color="success" title="Refund sent" dismissible /><HrAlert color="primary" title="You're ready to take payments">Share a payment link to take your first payment.<template #actions><HrButton variant="link" size="sm">Create payment link</HrButton></template></HrAlert></div></template>
    <template v-else-if="tag === 'HrCard'"><HrCard title="Payouts" description="Paid 2 business days after each sale"><template #actions><HrButton variant="link" size="sm">View all</HrButton></template>Card body content.<template #footer>Footer note</template></HrCard></template>
    <template v-else-if="tag === 'HrStat'"><div class="grid4"><HrStat label="Available balance" value="$4,812.40" note="Reserved: $500.00" /><HrStat label="Next payout" value="$3,904.12" note="Paused until details are fixed" tone="error" /><HrStat label="Balance" value="−$142.30" negative note="Covered by next payments" /><HrStat label="Open disputes" value="2" note="Nearest deadline in 7 days" tone="warning" href="#" /></div></template>
    <template v-else-if="tag === 'HrTable'">
      <HrCard padding="none"><HrTable :columns="[{ key: 'amount', label: 'Amount', primary: true }, { key: 'status', label: 'Status' }, { key: 'customer', label: 'Customer' }, { key: 'date', label: 'Date' }]" :rows="rows" row-key="id" clickable>
        <template #cell-status="{ row }"><HrTag :color="tagFor(row.status as string)" size="sm">{{ row.status }}</HrTag></template>
      </HrTable></HrCard>
    </template>
    <template v-else-if="tag === 'HrTabs'"><div class="stack"><HrTabs v-model="tab" :tabs="[{ key: 'all', label: 'All' }, { key: 'attention', label: 'Needs attention', count: 3 }, { key: 'refunds', label: 'Refunds' }, { key: 'off', label: 'Disabled', disabled: true }]" /><HrTabs v-model="seg" type="segment" :tabs="[{ key: 'full', label: 'Full refund' }, { key: 'partial', label: 'Partial refund' }]" /></div></template>
    <template v-else-if="tag === 'HrModal'">
      <div class="row"><HrButton @click="modal = true">Open modal</HrButton><HrButton variant="secondary" theme="neutral" @click="drawer = true">Open drawer</HrButton></div>
      <HrModal v-model="modal" title="Change bank account" description="We’ll email the owner and hold payouts for 24 hours.">Payouts go to the new account once it’s verified.<template #footer><HrButton variant="secondary" theme="neutral" @click="modal = false">Cancel</HrButton><HrButton @click="modal = false">Continue</HrButton></template></HrModal>
      <HrModal v-model="drawer" side="right" title="Payment" description="Taylor Nguyen · Nov 2, 9:41 AM"><HrDescriptionList :items="[{ label: 'Amount', value: '$249.00' }, { label: 'Fee', value: '−$6.92' }, { label: 'Net', value: '$242.08', total: true }]" /></HrModal>
    </template>
    <template v-else-if="tag === 'HrPagination'"><HrPagination v-model="page" :total="212" /></template>
    <template v-else-if="tag === 'HrEmptyState'"><HrEmptyState title="No payments match these filters" text="Try a different status or channel, or clear the filters."><template #actions><HrButton variant="secondary" theme="neutral" size="sm">Clear filters</HrButton></template></HrEmptyState></template>
    <template v-else-if="tag === 'HrDescriptionList'"><HrDescriptionList :items="[{ label: 'Amount', value: '$100.00' }, { label: 'Fastpay fee (2.7% + 20¢)', value: '−$2.90' }, { label: 'Payment ID', value: 'pay_7Q2KX9', mono: true }, { label: 'Net to your balance', value: '$97.10', total: true }]" /></template>
    <template v-else-if="tag === 'HrTimeline'"><HrTimeline :items="[{ text: 'Payment started by Taylor Nguyen', when: 'Nov 2, 9:41 AM' }, { text: 'Authorized and captured', when: 'Nov 2, 9:41 AM', tone: 'success' }, { text: 'Added to the payout for Nov 4', when: 'Expected Nov 4', tone: 'primary' }]" /></template>
    <template v-else-if="tag === 'HrTextarea'"><div class="grid"><HrTextarea v-model="note" label="Note to customer" placeholder="Shown on the receipt" :maxlength="200" hint="Optional" /><HrTextarea model-value="Refunded the shipping fee." label="Refund reason" error="Keep it under 20 characters" size="sm" :rows="3" /><HrTextarea model-value="Locked note" label="Disabled" disabled size="xs" :rows="2" /></div></template>
    <template v-else-if="tag === 'HrDropdownMenu'">
      <div class="row tall">
        <HrDropdownMenu label="Payment actions" :items="[{ label: 'Download receipt', icon: Download }, { label: 'Copy payment ID', icon: Copy }, { type: 'divider' }, { label: 'Refund', icon: RotateCcw, description: 'Full or partial' }, { label: 'Delete draft', icon: Trash2, disabled: true }]" @select="(i) => (lastAction = i.label ?? '')">
          <HrButton variant="secondary" theme="neutral" size="sm" icon-only aria-label="More actions"><MoreHorizontal /></HrButton>
        </HrDropdownMenu>
        <HrDropdownMenu v-model="menuPick" label="Payout schedule" :items="[{ type: 'group', label: 'Automatic' }, { label: 'Daily', value: 'daily' }, { label: 'Weekly', value: 'weekly', description: 'Every Monday' }, { label: 'Monthly', value: 'monthly' }, { type: 'group', label: 'Manual' }, { label: 'On request', value: 'manual' }]">
          <HrButton variant="secondary" theme="neutral" size="sm">Schedule: {{ menuPick }} <ChevronDown :size="16" /></HrButton>
        </HrDropdownMenu>
        <HrDropdownMenu v-model="channels" multiple searchable search-placeholder="Search channels" label="Channels" :items="[{ label: 'Payment links', value: 'link' }, { label: 'Invoices', value: 'invoice' }, { label: 'Funnels', value: 'funnel' }, { label: 'Text to pay', value: 'sms' }, { label: 'Tap to pay', value: 'tap' }]">
          <HrButton variant="secondary" theme="neutral" size="sm">Channels ({{ channels.length }}) <ChevronDown :size="16" /></HrButton>
        </HrDropdownMenu>
        <span v-if="lastAction" class="note">Chose: {{ lastAction }}</span>
      </div>
    </template>
    <template v-else-if="tag === 'HrDatePicker'"><div class="grid tall"><HrDatePicker v-model="day" label="Payout date" today="2026-11-06" :presets="[{ label: 'Yesterday', value: '2026-11-05' }, { label: 'Today', value: '2026-11-06' }, { label: 'Tomorrow', value: '2026-11-07' }]" /><HrDatePicker v-model="span" range label="Payments between" today="2026-11-06" :presets="[{ label: 'Last 7 days', value: ['2026-10-31', '2026-11-06'] }, { label: 'This month', value: ['2026-11-01', '2026-11-06'] }]" /><HrDatePicker label="Disabled" disabled /></div></template>
    <template v-else-if="tag === 'HrProgressSteps'"><div class="stack"><HrProgressSteps :current="2" :steps="[{ title: 'Business details', hint: 'Name, address, EIN' }, { title: 'Owner', hint: 'Identity check' }, { title: 'Bank account', hint: 'Where payouts go' }, { title: 'Review', hint: 'Check and submit' }]" /><HrProgressSteps direction="vertical" :steps="[{ title: 'Business details', state: 'completed' }, { title: 'Owner identity', hint: 'ID photo is blurry. Upload again.', state: 'error' }, { title: 'Bank account', hint: 'Verifying micro-deposits', state: 'loading' }, { title: 'Tax form', hint: 'Due before your first payout', state: 'warning' }, { title: 'Go live', state: 'next' }]" /></div></template>
    <template v-else-if="tag === 'HrFileUploader'"><HrFileUploader :files="files" hint="PDF, JPG or PNG, up to 4 MB" @add="addFiles" @remove="(id) => (files = files.filter((f) => f.id !== id))" @retry="(id) => (files = files.map((f) => (f.id === id ? { ...f, state: 'progress', progress: 10 } : f)))" /></template>
    <template v-else-if="tag === 'HrBanner'"><div class="stack flush">
      <HrBanner v-if="bannerOpen" v-model:page="bannerPage" :pages="2" color="primary" :title="bannerPage === 1 ? 'Fastpay is now on for your account' : 'Tap to Pay works on iPhone'" text="Take your first payment with a payment link, invoice or funnel." dismissible @dismiss="bannerOpen = false"><template #actions><HrButton variant="link" theme="neutral" size="sm">Learn more</HrButton><HrButton variant="link" size="sm">Create payment link</HrButton></template></HrBanner>
      <HrBanner color="warning" title="Payouts are paused" text="Add your EIN to restart payouts. Payments keep working." />
      <HrBanner color="error" title="We couldn’t reach your bank" />
      <HrBanner color="success" title="Bank account verified" />
      <HrBanner color="gray" title="Scheduled maintenance Sunday 2–3 AM" />
      <HrBanner title="Default (white) banner" text="It has no border, so on a white page only the text shows." />
    </div></template>
    <template v-else-if="tag === 'HrSkeleton'"><div class="row"><HrSkeleton type="circle" /><HrSkeleton type="doughnut" width="96px" height="96px" /><div class="stack" style="flex: 1; min-width: 220px"><HrSkeleton type="text" :lines="3" /><HrSkeleton type="bar" /><HrSkeleton type="block" height="80px" /></div></div></template>
    <template v-else-if="tag === 'HrAppShell'"><p class="note">The app shell wraps every FastPay screen. <a href="#/p/fastpay/dashboard">Open it in the playground →</a></p></template>
  </div>
</template>

<style scoped>
.demo { display: flex; flex-direction: column; gap: 16px; }
.row { display: flex; flex-wrap: wrap; gap: 16px; align-items: flex-start; }
.tip { padding-top: 84px; }
.tall { min-height: 420px; align-content: flex-start; }
.flush { margin: -12px; }
.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; }
.grid4 { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; }
.stack { display: flex; flex-direction: column; gap: 12px; }
.more, .note a { font: var(--hr-text-md); color: var(--hr-text-primary-body-1); }
.note { margin: 0; font: var(--hr-text-lg); color: var(--hr-text-neutral-body-2); }
</style>
