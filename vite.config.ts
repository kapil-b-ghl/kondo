import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// base './' so the built site works when published as a single static page.
export default defineConfig({ plugins: [vue()], base: './' });
