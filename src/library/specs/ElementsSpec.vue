<script setup lang="ts">
import { ref } from 'vue';
import { Search, Mail } from 'lucide-vue-next';
import HrCheckbox from '../../components/checkbox/HrCheckbox.vue';
import HrRadio from '../../components/radio/HrRadio.vue';
import HrToggle from '../../components/toggle/HrToggle.vue';
import HrTag, { type TagColor } from '../../components/tag/HrTag.vue';
import HrTooltip from '../../components/tooltip/HrTooltip.vue';
import HrInput from '../../components/input/HrInput.vue';
import HrSelect from '../../components/select/HrSelect.vue';
import HrButton from '../../components/button/HrButton.vue';

const colors: TagColor[] = ['gray', 'primary', 'error', 'warning', 'success', 'blue-gray', 'blue-light', 'blue', 'indigo', 'purple', 'pink', 'rose', 'orange-dark'];
const on = ref(true); const off = ref(false); const r = ref('a'); const t1 = ref(true); const t2 = ref(false);
const email = ref(''); const amt = ref('120.00'); const sel = ref<string | number>();
const opts = [{ label: 'Daily', value: 'daily' }, { label: 'Weekly', value: 'weekly', hint: 'Every Monday' }, { label: 'Monthly', value: 'monthly' }];
</script>

<template>
  <main class="spec">
    <section><h2>Checkbox</h2>
      <div class="row">
        <HrCheckbox v-model="off" label="Unchecked" hint="Hint text" />
        <HrCheckbox v-model="on" label="Checked" />
        <HrCheckbox :model-value="false" indeterminate label="Indeterminate" />
        <HrCheckbox :model-value="false" error label="Error" />
        <HrCheckbox :model-value="true" disabled label="Disabled" />
        <HrCheckbox v-for="s in ['3xs','2xs','xs','sm','md','lg']" :key="s" :model-value="true" :size="(s as any)" />
      </div>
    </section>
    <section><h2>Radio</h2>
      <div class="row">
        <HrRadio v-model="r" value="a" label="Option A" hint="Hint text" />
        <HrRadio v-model="r" value="b" label="Option B" />
        <HrRadio v-model="r" value="c" label="Error" error />
        <HrRadio :model-value="'d'" value="d" label="Disabled" disabled />
      </div>
    </section>
    <section><h2>Toggle</h2>
      <div class="row">
        <HrToggle v-model="t1" label="On" size="sm" /><HrToggle v-model="t1" label="On" /><HrToggle v-model="t1" size="lg" label="On" />
        <HrToggle v-model="t2" label="Off" hint="Hint text" /><HrToggle :model-value="true" disabled label="Disabled" />
      </div>
    </section>
    <section><h2>Tag</h2>
      <div class="row"><HrTag v-for="c in colors" :key="c" :color="c">{{ c }}</HrTag></div>
      <div class="row"><HrTag v-for="c in colors" :key="c" :color="c" outline rounded dot>{{ c }}</HrTag></div>
      <div class="row"><HrTag v-for="s in ['xs','sm','md','lg']" :key="s" :size="(s as any)" color="success" removable interactive>Paid</HrTag></div>
    </section>
    <section><h2>Tooltip</h2>
      <div class="row tips">
        <HrTooltip v-for="th in ['dark','light','info','error']" :key="th" :theme="(th as any)" title="Payouts" text="Money from each day is paid out 2 business days later.">
          <HrButton variant="secondary" theme="neutral" size="sm">{{ th }}</HrButton>
        </HrTooltip>
      </div>
    </section>
    <section><h2>Input</h2>
      <div class="grid2">
        <HrInput v-model="email" label="Email" placeholder="you@business.com" hint="We'll send receipts here." type="email"><template #leading><Mail /></template></HrInput>
        <HrInput v-model="amt" label="Refund amount" prefix="$" suffix="USD" inputmode="decimal" />
        <HrInput model-value="12-3456789" label="EIN" error="Enter a 9-digit EIN" />
        <HrInput model-value="Bright Smile Dental" label="Legal name" disabled />
        <HrInput placeholder="Search payments" size="sm"><template #leading><Search /></template></HrInput>
        <HrInput label="Password" type="password" model-value="hunter22" />
      </div>
    </section>
    <section><h2>Select</h2>
      <div class="grid2">
        <HrSelect v-model="sel" :options="opts" label="Payout schedule" hint="Payouts land 2 business days after the sales day." />
        <HrSelect :options="opts" label="Disabled" disabled />
      </div>
    </section>
  </main>
</template>

<style scoped>
.spec section { display: grid; gap: 12px; }
.row { display: flex; flex-wrap: wrap; gap: 16px; align-items: flex-start; }
.tips { padding-top: 90px; }
.grid2 { display: grid; grid-template-columns: repeat(2, minmax(0, 360px)); gap: 20px; }
</style>
