import { computed, ref } from 'vue';

// Tiny router. In the repo build it uses the URL hash (#/p/fastpay/dashboard?state=paused) so
// every screen and state has a shareable link. In the published-artifact build
// (VITE_MEMORY_ROUTER=1) it keeps the route in memory, because the artifact host only passes
// plain #names through; links still work because clicks on "#/…" anchors are intercepted.
const memory = import.meta.env.VITE_MEMORY_ROUTER === '1';
const initial = memory ? '/' : location.hash.slice(1) || '/';
const hash = ref(initial);

function set(path: string, replace = false) {
  hash.value = path || '/';
  if (!memory) {
    if (replace) history.replaceState(null, '', `#${hash.value}`);
    else location.hash = hash.value;
  }
  if (!replace) window.scrollTo(0, 0);
}

if (memory) {
  document.addEventListener('click', (e) => {
    const a = (e.target as HTMLElement).closest?.('a[href^="#/"]') as HTMLAnchorElement | null;
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey) return;
    e.preventDefault();
    set(a.getAttribute('href')!.slice(1));
  });
} else {
  window.addEventListener('hashchange', () => { hash.value = location.hash.slice(1) || '/'; window.scrollTo(0, 0); });
}

export const route = computed(() => hash.value.split('?')[0]);
export const query = computed(() => new URLSearchParams(hash.value.split('?')[1] ?? ''));
export const go = (path: string) => set(path);
export function setQuery(key: string, value: string | null) {
  const q = new URLSearchParams(query.value);
  if (value === null) q.delete(key); else q.set(key, value);
  const s = q.toString();
  set(`${route.value}${s ? '?' + s : ''}`, true);
}
