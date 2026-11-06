import { computed, ref } from 'vue';

// Tiny hash router so the built site works as a single static page.
// Routes look like  #/p/fastpay/a/dashboard?state=paused
const hash = ref(location.hash.slice(1) || '/');
window.addEventListener('hashchange', () => { hash.value = location.hash.slice(1) || '/'; window.scrollTo(0, 0); });

export const route = computed(() => hash.value.split('?')[0]);
export const query = computed(() => new URLSearchParams(hash.value.split('?')[1] ?? ''));
export const go = (path: string) => { location.hash = path; };
export function setQuery(key: string, value: string | null) {
  const q = new URLSearchParams(query.value);
  if (value === null) q.delete(key); else q.set(key, value);
  const s = q.toString();
  history.replaceState(null, '', `#${route.value}${s ? '?' + s : ''}`);
  hash.value = `${route.value}${s ? '?' + s : ''}`;
}
