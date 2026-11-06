// Builds one self-contained HTML file (JS, CSS and fonts inlined) for publishing as an artifact.
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig({
  plugins: [vue(), viteSingleFile()],
  define: { 'import.meta.env.VITE_MEMORY_ROUTER': JSON.stringify('1') },
  build: { outDir: 'dist-artifact', assetsInlineLimit: 100_000_000 },
});
