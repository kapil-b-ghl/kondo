<script setup lang="ts">
/**
 * HrAppShell — HighLevel app frame with the new left nav (from the FastPay prototype "Shared nav" board):
 *   • 56px account rail (agency + sub-account avatars)
 *   • 232px main nav (sub-account switcher + modules)
 *   • 248px section nav (e.g. Commerce) with nested items and badges; collapsible
 *   • page area with a 64px top bar (title, actions)
 * Items use `to` (hash route) so prototypes can link screens together.
 */
import { ref } from 'vue';
import {
  Gauge, Sparkles, Contact, MessageCircle, Workflow, Megaphone, LayoutTemplate, ChartLine, ShoppingCart, Smartphone, Settings,
  ChevronsUpDown, X, PanelLeftOpen,
} from 'lucide-vue-next';

export interface NavItem { key: string; label: string; to?: string; badge?: string | number; badgeTone?: 'neutral' | 'error'; tag?: string; children?: NavItem[]; icon?: unknown }
const props = withDefaults(
  defineProps<{
    account?: { name: string; location?: string; initials?: string };
    module?: string; sectionTitle?: string; section?: NavItem[]; active?: string; title?: string; back?: string;
  }>(),
  { account: () => ({ name: 'BrightSmile Dental', location: 'San Francisco, CA', initials: 'BD' }), module: 'commerce' },
);
// On small screens the section nav is an overlay, so it starts closed there.
const sectionOpen = ref(typeof window === 'undefined' || window.innerWidth > 900);
const modules = [
  { key: 'dashboard', label: 'Dashboard', icon: Gauge }, { key: 'ai', label: 'AI', icon: Sparkles }, { key: 'crm', label: 'CRM', icon: Contact },
  { key: 'conversations', label: 'Conversations', icon: MessageCircle }, { key: 'automations', label: 'Automations', icon: Workflow },
  { key: 'marketing', label: 'Marketing', icon: Megaphone }, { key: 'sites', label: 'Sites', icon: LayoutTemplate }, { key: 'reporting', label: 'Reporting', icon: ChartLine },
  { key: 'commerce', label: 'Commerce', icon: ShoppingCart }, { key: 'client-apps', label: 'Client Apps', icon: Smartphone },
];
void props;
</script>

<template>
  <div class="hr-shell">
    <div class="hr-shell__rail" aria-label="Accounts">
      <span class="hr-shell__agency">UA</span>
      <span class="hr-shell__rail-sep" />
      <span class="hr-shell__sub" :title="account.name">{{ account.initials }}</span>
    </div>
    <nav class="hr-shell__main" aria-label="Main">
      <button type="button" class="hr-shell__switcher">
        <span><span class="hr-shell__acct">{{ account.name }}</span><span v-if="account.location" class="hr-shell__loc">{{ account.location }}</span></span>
        <ChevronsUpDown :size="16" aria-hidden="true" />
      </button>
      <a v-for="m in modules" :key="m.key" class="hr-nav-item" :class="{ 'is-active': module === m.key }" href="#" :aria-current="module === m.key ? 'page' : undefined" @click="m.key === module && sectionOpen === false && (sectionOpen = true)">
        <component :is="m.icon" :size="18" :stroke-width="1.8" aria-hidden="true" />{{ m.label }}
      </a>
      <span class="hr-shell__sep" />
      <a class="hr-nav-item" href="#"><Settings :size="18" :stroke-width="1.8" aria-hidden="true" />Settings</a>
    </nav>
    <nav v-if="section && sectionOpen" class="hr-shell__section" :aria-label="sectionTitle">
      <div class="hr-shell__section-head">
        <span>{{ sectionTitle }}</span>
        <button type="button" class="hr-shell__icon-btn" :aria-label="`Close ${sectionTitle} menu`" @click="sectionOpen = false"><X :size="16" /></button>
      </div>
      <template v-for="it in section" :key="it.key">
        <a class="hr-nav-item" :class="{ 'is-active': active === it.key }" :href="it.to ?? '#'" :aria-current="active === it.key ? 'page' : undefined">
          <component :is="it.icon" v-if="it.icon" :size="18" :stroke-width="1.8" aria-hidden="true" />{{ it.label }}
          <span v-if="it.tag" class="hr-nav-item__tag">{{ it.tag }}</span>
          <span v-else-if="it.badge !== undefined" class="hr-nav-item__badge" :class="`is-${it.badgeTone ?? 'neutral'}`">{{ it.badge }}</span>
        </a>
        <div v-if="it.children" class="hr-shell__children">
          <a v-for="c in it.children" :key="c.key" class="hr-nav-item hr-nav-item--child" :class="{ 'is-active': active === c.key }" :href="c.to ?? '#'" :aria-current="active === c.key ? 'page' : undefined">
            <component :is="c.icon" v-if="c.icon" :size="16" :stroke-width="1.8" aria-hidden="true" />{{ c.label }}
            <span v-if="c.badge !== undefined" class="hr-nav-item__badge" :class="`is-${c.badgeTone ?? 'neutral'}`">{{ c.badge }}</span>
          </a>
        </div>
      </template>
    </nav>
    <div class="hr-shell__page">
      <header class="hr-shell__bar">
        <button v-if="section && !sectionOpen" type="button" class="hr-shell__icon-btn" :aria-label="`Open ${sectionTitle} menu`" @click="sectionOpen = true"><PanelLeftOpen :size="18" /></button>
        <a v-if="back" :href="back" class="hr-shell__icon-btn" aria-label="Back">
          <svg viewBox="0 0 20 20" width="18" height="18" fill="none"><path d="M12.5 15 7.5 10l5-5" stroke="currentColor" stroke-width="1.67" stroke-linecap="round" stroke-linejoin="round" /></svg>
        </a>
        <h1 class="hr-shell__title">{{ title }}<slot name="title-after" /></h1>
        <div class="hr-shell__bar-actions"><slot name="actions" /></div>
      </header>
      <main class="hr-shell__content"><slot /></main>
    </div>
  </div>
</template>

<style>
.hr-shell { display: flex; min-height: 100vh; font-family: var(--hr-font-family); color: var(--hr-text-neutral-title-1); background: var(--hr-surface-raised); }
.hr-shell__rail { width: 56px; flex: none; display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 14px 0; background: var(--hr-color-neutral-gray-50); border-right: 1px solid var(--hr-color-neutral-gray-200); }
.hr-shell__agency { width: 32px; height: 32px; border-radius: 8px; background: var(--hr-color-neutral-gray-600); color: var(--hr-text-on-color); font: var(--hr-text-xs); font-weight: var(--hr-font-weight-bold); display: flex; align-items: center; justify-content: center; }
.hr-shell__rail-sep { width: 24px; height: 1px; background: var(--hr-color-neutral-gray-300); }
.hr-shell__sub { width: 32px; height: 32px; border-radius: 50%; background: var(--hr-color-primary-blue-50); border: 1px solid var(--hr-color-primary-blue-200); color: var(--hr-color-primary-blue-700); font: var(--hr-text-xs); font-weight: var(--hr-font-weight-bold); display: flex; align-items: center; justify-content: center; }
.hr-shell__main, .hr-shell__section { flex: none; display: flex; flex-direction: column; gap: 2px; padding: 14px 10px; border-right: 1px solid var(--hr-color-neutral-gray-200); }
.hr-shell__main { width: 232px; }
.hr-shell__section { width: 248px; }
.hr-shell__switcher { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 2px 10px 12px; border: 0; background: none; text-align: left; cursor: pointer; color: var(--hr-color-neutral-gray-500); }
.hr-shell__acct { display: block; font: var(--hr-font-size-xl)/22px var(--hr-font-family); font-weight: var(--hr-font-weight-semibold); color: var(--hr-text-neutral-title-1); }
.hr-shell__loc { display: block; font: var(--hr-text-sm); color: var(--hr-color-neutral-gray-500); }
.hr-shell__sep { height: 1px; background: var(--hr-color-neutral-gray-200); margin: 8px 10px; }
.hr-shell__section-head { display: flex; align-items: center; justify-content: space-between; padding: 4px 10px 12px; font: var(--hr-text-2xl); font-weight: var(--hr-font-weight-semibold); }
.hr-shell__children { display: flex; flex-direction: column; gap: 2px; margin: 2px 0 6px; }
.hr-shell__icon-btn { display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; border: 0; border-radius: 6px; background: none; color: var(--hr-color-neutral-gray-500); cursor: pointer; }
.hr-shell__icon-btn:hover { background: var(--hr-color-neutral-gray-50); color: var(--hr-color-neutral-gray-700); }
.hr-shell__icon-btn:focus-visible { outline: none; box-shadow: var(--hr-focus-ring-primary); }

.hr-nav-item { display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-radius: 6px; font: var(--hr-text-lg); font-weight: var(--hr-font-weight-medium); color: var(--hr-color-neutral-gray-700); text-decoration: none; }
.hr-nav-item svg { flex: none; }
.hr-nav-item:hover { background: var(--hr-color-neutral-gray-50); }
.hr-nav-item:focus-visible { outline: none; box-shadow: var(--hr-focus-ring-primary); }
.hr-nav-item.is-active { background: var(--hr-color-primary-blue-50); color: var(--hr-color-primary-blue-700); }
.hr-nav-item--child { padding-left: 22px; }
.hr-nav-item__badge { margin-left: auto; padding: 1px 6px; border-radius: 10px; font: var(--hr-text-xs); font-weight: var(--hr-font-weight-semibold); background: var(--hr-color-neutral-gray-100); color: var(--hr-color-neutral-gray-700); }
.hr-nav-item__badge.is-error { background: var(--hr-color-secondary-error-50); color: var(--hr-color-secondary-error-700); }
.hr-nav-item.is-active .hr-nav-item__badge { background: var(--hr-color-neutral-white-base); color: var(--hr-color-primary-blue-700); }
.hr-nav-item__tag { margin-left: auto; height: 20px; padding: 0 6px; border-radius: 4px; display: inline-flex; align-items: center; font: var(--hr-text-xs); font-weight: var(--hr-font-weight-medium); background: var(--hr-color-primary-blue-50); border: 1px solid var(--hr-color-primary-blue-200); color: var(--hr-color-primary-blue-700); }

.hr-shell__page { flex: 1; min-width: 0; display: flex; flex-direction: column; background: var(--hr-surface-base); }
.hr-shell__bar { position: sticky; top: 0; z-index: var(--hr-z-index-2); display: flex; align-items: center; gap: 12px; height: 64px; padding: 0 32px; background: var(--hr-surface-raised); border-bottom: 1px solid var(--hr-color-neutral-gray-200); }
.hr-shell__title { flex: 1; min-width: 0; margin: 0; display: flex; align-items: center; gap: 10px; font: var(--hr-text-3xl); font-weight: var(--hr-font-weight-semibold); }
.hr-shell__bar-actions { display: flex; align-items: center; gap: 12px; }
.hr-shell__content { flex: 1; padding: 24px 32px 48px; }

@media (max-width: 1200px) { .hr-shell__main { width: 64px; } .hr-shell__main .hr-nav-item { font-size: 0; justify-content: center; } .hr-shell__switcher { display: none; } }
@media (max-width: 900px) { .hr-shell__rail, .hr-shell__main { display: none; } .hr-shell__section { position: fixed; inset: 0 auto 0 0; z-index: var(--hr-z-index-6); background: var(--hr-surface-raised); box-shadow: var(--hr-shadow-xl); } .hr-shell__bar, .hr-shell__content { padding-left: 16px; padding-right: 16px; } }
</style>
