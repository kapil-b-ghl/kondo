<script setup lang="ts">
/**
 * HrSkeleton — HighRise 1.1 Skeleton Loader (Figma 27786:26135).
 * Types: block (radius 4) · bar (34px, radius 4) · circle · doughnut (ring) · text (lines).
 * Fill gray/200 with the Figma shimmer: a gray/500 band at 40% opacity, Color Burn blend,
 * sweeping left to right (Figma shows two animation stages). Respects reduced motion.
 * `text` is not in Figma (see registry).
 */
withDefaults(defineProps<{ type?: 'block' | 'bar' | 'circle' | 'doughnut' | 'text'; width?: string; height?: string; lines?: number; label?: string }>(), { type: 'block', lines: 3, label: 'Loading' });
</script>

<template>
  <div v-if="type === 'text'" class="hr-skel-lines" role="status" :aria-label="label" :style="{ width }">
    <span v-for="n in lines" :key="n" class="hr-skel hr-skel--line" :style="{ width: n === lines && lines > 1 ? '60%' : '100%' }" />
  </div>
  <span v-else class="hr-skel" :class="`hr-skel--${type}`" role="status" :aria-label="label" :style="{ width, height }" />
</template>

<style>
.hr-skel { position: relative; display: block; overflow: hidden; isolation: isolate; background: var(--hr-color-neutral-gray-200); }
.hr-skel::after {
  content: ''; position: absolute; inset: 0; opacity: 0.4; mix-blend-mode: color-burn;
  background: linear-gradient(90deg, transparent 0%, var(--hr-color-neutral-gray-500) 36%, var(--hr-color-neutral-gray-500) 63%, transparent 100%);
  transform: translateX(-100%); animation: hr-skel-sweep 1.4s ease-in-out infinite;
}
.hr-skel--block { width: 100%; height: 120px; border-radius: 4px; }
.hr-skel--bar { width: 100%; height: 34px; border-radius: 4px; }
.hr-skel--circle { width: 48px; height: 48px; border-radius: 50%; }
.hr-skel--doughnut { width: 120px; height: 120px; border-radius: 50%; -webkit-mask: radial-gradient(circle closest-side, transparent 77%, #000 77.5%); mask: radial-gradient(circle closest-side, transparent 77%, #000 77.5%); }
.hr-skel--line { height: 12px; border-radius: 4px; }
.hr-skel-lines { display: flex; flex-direction: column; gap: 8px; }
@keyframes hr-skel-sweep { to { transform: translateX(100%); } }
@media (prefers-reduced-motion: reduce) { .hr-skel::after { animation: none; opacity: 0; } }
</style>
