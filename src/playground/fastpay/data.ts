// FastPay (LC Payments) prototype data — mirrors the PRD (J8) and the Claude design prototype.
// All money in USD. Fee = the sticker rate the merchant sees; IC++ never appears here.
import { reactive } from 'vue';

export const STICKER = { pct: 0.027, fixed: 0.2, label: '2.7% + 20¢' };
export const COMPARE = { name: "Stripe's standard rate", pct: 0.029, fixed: 0.3, label: '2.9% + 30¢' };

export const money = (n: number) =>
  (n < 0 ? '−$' : '$') + Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const fee = (amt: number) => Math.round((amt * STICKER.pct + STICKER.fixed) * 100) / 100;

export type PayStatus = 'Succeeded' | 'Refunded' | 'Partially refunded' | 'Disputed' | 'Failed';
export const STATUS_TAG: Record<PayStatus, 'success' | 'gray' | 'error' | 'warning' | 'blue-gray'> = {
  Succeeded: 'success', Refunded: 'gray', 'Partially refunded': 'blue-gray', Disputed: 'error', Failed: 'warning',
};

export interface Payment {
  id: string; psp: string; amt: number; status: PayStatus; customer: string; email: string;
  channel: string; channelDetail: string; method: string; date: string; refunded: number;
}

export const payments = reactive<Payment[]>([
  { id: 'pay_7Q2KX9', psp: '8816 9301 2240 1182', amt: 249, status: 'Succeeded', customer: 'Taylor Nguyen', email: 'taylor.n@email.com', channel: 'Invoice', channelDetail: 'Invoice INV-1042', method: 'Visa •••• 4242', date: 'Nov 2, 9:41 AM', refunded: 0 },
  { id: 'pay_7Q2KW1', psp: '8816 9301 2240 1144', amt: 49, status: 'Succeeded', customer: 'Sam Patel', email: 'sam.patel@email.com', channel: 'Funnel', channelDetail: 'Funnel · Whitening kit', method: 'Apple Pay · Visa •••• 1881', date: 'Nov 2, 9:12 AM', refunded: 0 },
  { id: 'pay_7Q2KT4', psp: '8816 9301 2239 9907', amt: 39, status: 'Succeeded', customer: 'Riley Chen', email: 'riley.chen@email.com', channel: 'Subscription', channelDetail: 'Subscription · Smile Club', method: 'Mastercard •••• 4444', date: 'Nov 1, 6:00 PM', refunded: 0 },
  { id: 'pay_7Q2KP8', psp: '8816 9301 2239 7720', amt: 1200, status: 'Refunded', customer: 'Morgan Diaz', email: 'morgan.d@email.com', channel: 'Payment link', channelDetail: 'Payment link · Implant deposit', method: 'Amex •••• 0005', date: 'Nov 1, 2:15 PM', refunded: 1200 },
  { id: 'pay_7Q2KJ2', psp: '8816 9301 2238 4410', amt: 480, status: 'Disputed', customer: 'Jamie Fox', email: 'jamie.fox@email.com', channel: 'Invoice', channelDetail: 'Invoice INV-1038', method: 'Visa •••• 0341', date: 'Oct 30, 11:05 AM', refunded: 0 },
  { id: 'pay_7Q2KH6', psp: '8816 9301 2238 1001', amt: 39, status: 'Failed', customer: 'Jordan Smith', email: 'jordan.s@email.com', channel: 'Subscription', channelDetail: 'Subscription · Smile Club', method: 'Visa •••• 9995', date: 'Oct 30, 6:00 PM', refunded: 0 },
  { id: 'pay_7Q2KD3', psp: '8816 9301 2237 6612', amt: 320, status: 'Partially refunded', customer: 'Casey Brooks', email: 'casey.b@email.com', channel: 'Calendar', channelDetail: 'Calendar · Deep cleaning', method: 'Discover •••• 1117', date: 'Oct 29, 3:30 PM', refunded: 120 },
  { id: 'pay_7Q2KB9', psp: '8816 9301 2237 5503', amt: 89, status: 'Succeeded', customer: 'Avery Kim', email: 'avery.kim@email.com', channel: 'Store', channelDetail: 'Store · Electric toothbrush', method: 'Google Pay · Mastercard •••• 2201', date: 'Oct 29, 1:02 PM', refunded: 0 },
  { id: 'pay_7Q2K80', psp: '8816 9301 2236 9045', amt: 150, status: 'Succeeded', customer: 'Drew Park', email: 'drew.park@email.com', channel: 'Text-to-pay', channelDetail: 'Text-to-pay', method: 'Visa •••• 4242', date: 'Oct 28, 4:45 PM', refunded: 0 },
  { id: 'pay_7Q2K72', psp: '8816 9301 2236 7788', amt: 497, status: 'Succeeded', customer: 'Quinn Ross', email: 'quinn.ross@email.com', channel: 'Membership', channelDetail: 'Membership · Aligner course', method: 'Mastercard •••• 5100', date: 'Oct 28, 10:20 AM', refunded: 0 },
  { id: 'pay_7Q2K61', psp: '8816 9301 2236 1120', amt: 75, status: 'Succeeded', customer: 'Logan Reyes', email: 'logan.r@email.com', channel: 'Form', channelDetail: 'Form · New patient deposit', method: 'Visa •••• 4012', date: 'Oct 27, 2:00 PM', refunded: 0 },
  { id: 'pay_7Q2K44', psp: '8816 9301 2231 4471', amt: 189, status: 'Disputed', customer: 'Alex Moreno', email: 'alex.m@email.com', channel: 'Funnel', channelDetail: 'Funnel · Night guard', method: 'Visa •••• 3220', date: 'Oct 21, 9:50 AM', refunded: 0 },
]);

export function netOf(p: Payment) {
  if (p.status === 'Failed') return 0;
  return p.amt - fee(p.amt) - p.refunded - (p.refunded ? fee(p.refunded) : 0);
}

export function refundPayment(p: Payment, amount: number) {
  p.refunded = Math.round((p.refunded + amount) * 100) / 100;
  p.status = p.refunded >= p.amt ? 'Refunded' : 'Partially refunded';
}

export function timelineOf(p: Payment) {
  const t: { text: string; when: string; tone?: 'neutral' | 'success' | 'warning' | 'error' | 'primary' }[] = [
    { text: `Payment started by ${p.customer}`, when: p.date },
  ];
  if (p.status === 'Failed') {
    t.push({ text: 'Declined by the bank: insufficient funds', when: p.date, tone: 'warning' });
    t.push({ text: 'Automatic retry scheduled', when: 'Nov 3, 6:00 PM', tone: 'primary' });
    return t;
  }
  t.push({ text: 'Authorized and captured', when: p.date, tone: 'success' });
  t.push({ text: `Fastpay fee taken (${STICKER.label})`, when: p.date });
  if (p.status === 'Disputed') t.push({ text: 'Customer opened a dispute', when: 'Nov 2, 8:00 AM', tone: 'error' });
  if (p.refunded) t.push({ text: `Refunded ${money(p.refunded)} to customer`, when: 'Nov 1, 4:30 PM', tone: 'neutral' });
  else if (p.status === 'Succeeded') t.push({ text: 'Added to the payout for Nov 4', when: 'Expected Nov 4', tone: 'primary' });
  return t;
}

// Account states from the PRD "Merchant statuses" table, as they reach the dashboard.
export type Scenario = 'ready' | 'action' | 'paused' | 'negative' | 'fresh' | 'closing';
export const SCENARIOS: { key: Scenario; label: string; status: string; tag: 'success' | 'warning' | 'error' }[] = [
  { key: 'ready', label: 'Ready', status: 'Ready', tag: 'success' },
  { key: 'action', label: 'Action needed', status: 'Action needed', tag: 'warning' },
  { key: 'paused', label: 'Payouts paused', status: 'Payouts paused', tag: 'error' },
  { key: 'negative', label: 'Negative balance', status: 'Negative balance', tag: 'warning' },
  { key: 'fresh', label: 'First day, no payments', status: 'Ready', tag: 'success' },
  { key: 'closing', label: 'Account closing', status: 'Closing', tag: 'error' },
];

export function balances(sc: Scenario) {
  const fresh = sc === 'fresh';
  return {
    available: fresh ? 0 : sc === 'negative' ? -142.3 : sc === 'closing' ? 3240.18 : 4812.4,
    reservedNote: fresh ? 'Nothing reserved' : sc === 'closing' ? 'Held for refunds and chargebacks' : 'Reserved: $500.00',
    pending: fresh ? 0 : 2130.55,
    next: fresh || sc === 'closing' ? null : sc === 'negative' ? 0 : 3904.12,
    nextNote: fresh ? 'After your first sales day' : sc === 'closing' ? 'Final payout expected Feb 14, 2027'
      : sc === 'paused' ? 'Paused until details are fixed' : sc === 'negative' ? 'No payout while balance is negative' : 'Nov 4 to Chase •••• 6789',
    nextTone: (sc === 'paused' || sc === 'negative' ? 'error' : 'neutral') as 'error' | 'neutral',
    disputes: fresh ? 0 : 2,
    disputeNote: fresh ? 'Nothing to answer' : 'Nearest deadline in 7 days',
  };
}

export const payouts = [
  { amount: 3904.12, when: 'Nov 4', bank: 'Chase •••• 6789', status: 'Scheduled' },
  { amount: 2871.66, when: 'Nov 3', bank: 'Chase •••• 6789', status: 'In transit' },
  { amount: 4102.9, when: 'Nov 2', bank: 'Chase •••• 6789', status: 'Paid' },
];
export const disputes = [
  { amount: 480, customer: 'Jamie Fox', reason: "Customer says they didn't authorize it", daysLeft: 7 },
  { amount: 189, customer: 'Alex Moreno', reason: "Customer says the service wasn't provided", daysLeft: 12 },
];
export const saved = { month: 253.98, total: 1186.4, since: 'Jul 2026', payments: 412, volume: 106390, atCompare: 3208.91, ours: 2954.93, refundFees: 6.92 };

export const BANNERS: Record<Scenario, { color: 'warning' | 'error' | 'primary' | 'success'; title: string; text: string; cta?: string; ctaVariant?: 'primary' | 'secondary' } | null> = {
  ready: null,
  action: { color: 'warning', title: 'We need a few details to keep your payouts running', text: '3 items to fix by Nov 12, 2026. Payments keep working. If they aren’t fixed by then, payouts pause.', cta: 'Fix now', ctaVariant: 'primary' },
  paused: { color: 'error', title: 'Payouts are paused', text: 'We need a current ID for Dana Brooks. Payments still work and your balance is safe. Payouts restart as soon as it’s verified.', cta: 'Fix now', ctaVariant: 'primary' },
  negative: { color: 'warning', title: 'Your balance is −$142.30', text: 'A $480.00 chargeback and its fee came out of your balance. We’ll cover it from your next payments. Payouts restart once your balance is above $0.', cta: 'View dispute', ctaVariant: 'secondary' },
  fresh: { color: 'primary', title: 'You’re ready to take payments', text: 'Fastpay is on for every sales channel. Share a payment link or open a funnel checkout to take your first payment.', cta: 'Create payment link', ctaVariant: 'secondary' },
  closing: { color: 'error', title: 'Fastpay will stop taking payments on Nov 16, 2026', text: 'After a risk review, we’re closing your Fastpay account. Refunds and disputes keep working. We hold your balance for 90 days to cover refunds and chargebacks, then pay out what’s left.', cta: 'Connect another provider', ctaVariant: 'primary' },
};
