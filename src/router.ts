import { ref } from 'vue';

// Tiny hash router so the built site works as a single static page.
export const route = ref(location.hash.slice(1) || '/');
window.addEventListener('hashchange', () => { route.value = location.hash.slice(1) || '/'; });
export const go = (path: string) => { location.hash = path; };
