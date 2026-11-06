import { Gauge, ArrowLeftRight, CreditCard, Landmark, Scale, ChartColumn, Settings, FileText, FileSignature, ShoppingBag, Ticket, Repeat, Link, Receipt, Package, Gift } from 'lucide-vue-next';
import type { NavItem } from '../../components/app-shell/HrAppShell.vue';

// Commerce › Fastpay section nav, from the prototype's Shared nav board (live mode).
export function commerceNav(base: string): NavItem[] {
  return [
    {
      key: 'fastpay', label: 'Fastpay', tag: 'New', to: `#${base}/dashboard`,
      children: [
        { key: 'overview', label: 'Overview', icon: Gauge, to: `#${base}/dashboard` },
        { key: 'migration', label: 'Migration', icon: ArrowLeftRight, badge: '3/8' },
        { key: 'payments', label: 'Payments', icon: CreditCard, to: `#${base}/payments` },
        { key: 'payouts', label: 'Payouts', icon: Landmark },
        { key: 'disputes', label: 'Disputes', icon: Scale, badge: 2, badgeTone: 'error' },
        { key: 'reports', label: 'Reports', icon: ChartColumn },
        { key: 'settings', label: 'Settings', icon: Settings },
      ],
    },
    { key: 'invoices', label: 'Invoices & Estimates', icon: FileText },
    { key: 'documents', label: 'Documents & Contracts', icon: FileSignature },
    { key: 'orders', label: 'Orders', icon: ShoppingBag },
    { key: 'coupons', label: 'Coupons', icon: Ticket },
    { key: 'subscriptions', label: 'Subscriptions', icon: Repeat },
    { key: 'payment-links', label: 'Payment Links', icon: Link },
    { key: 'transactions', label: 'Transactions', icon: Receipt },
    { key: 'products', label: 'Products', icon: Package },
    { key: 'gift-cards', label: 'Gift Cards', icon: Gift },
  ];
}
