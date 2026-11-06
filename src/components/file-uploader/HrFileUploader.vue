<script setup lang="ts">
/**
 * HrFileUploader — HighRise 1.1 File Uploader (Figma 26953:22868) with File (26953:22730).
 * Drop zone: default · hover/drag-over · disabled. File rows: queued · start · in progress
 * (progress bar) · complete · error (Try again). The component does not upload anything: it emits
 * `add` with the chosen Files and renders whatever `files` you pass, so a prototype can fake
 * progress and errors.
 */
import { ref } from 'vue';
import { UploadCloud, FileText, X, Trash2, CheckCircle2 } from 'lucide-vue-next';
import HrTag from '../tag/HrTag.vue';

export interface UploadFile { id: string | number; name: string; size?: string; state: 'queued' | 'start' | 'progress' | 'complete' | 'error'; progress?: number; error?: string }
const props = withDefaults(defineProps<{ files?: UploadFile[]; accept?: string; multiple?: boolean; disabled?: boolean; hint?: string; label?: string }>(), {
  files: () => [], multiple: true, hint: 'SVG, PNG, JPG or GIF (max 800px x 400px)', label: 'Upload files',
});
const emit = defineEmits<{ add: [files: File[]]; remove: [id: string | number]; retry: [id: string | number] }>();
const input = ref<HTMLInputElement>();
const over = ref(false);
function pick(list: FileList | null | undefined) { if (!props.disabled && list?.length) emit('add', Array.from(list)); }
function onDrop(e: DragEvent) { over.value = false; pick(e.dataTransfer?.files); }
</script>

<template>
  <div class="hr-upload">
    <div
      class="hr-upload__zone" :class="{ 'is-over': over, 'is-disabled': disabled }"
      @dragover.prevent="!disabled && (over = true)" @dragleave="over = false" @drop.prevent="onDrop"
    >
      <span class="hr-upload__badge" aria-hidden="true"><UploadCloud :size="20" /></span>
      <span class="hr-upload__action">
        <button type="button" class="hr-upload__link" :disabled="disabled" @click="input?.click()">Click to upload</button>
        <span>or drag and drop</span>
      </span>
      <span v-if="hint" class="hr-upload__hint">{{ hint }}</span>
      <input ref="input" class="hr-upload__input" type="file" :accept="accept" :multiple="multiple" :disabled="disabled" :aria-label="label" tabindex="-1" @change="pick(($event.target as HTMLInputElement).files); ($event.target as HTMLInputElement).value = ''" />
    </div>
    <ul v-if="files.length" class="hr-upload__list" :aria-label="`${files.length} files`">
      <li v-for="f in files" :key="f.id" class="hr-file" :class="`is-${f.state}`">
        <span class="hr-file__icon" aria-hidden="true"><FileText :size="15" /></span>
        <div class="hr-file__main">
          <div class="hr-file__row">
            <div class="hr-file__text">
              <span class="hr-file__name">{{ f.name }}</span>
              <span v-if="f.error && f.state === 'error'" class="hr-file__size">{{ f.error }}</span>
              <span v-else-if="f.size" class="hr-file__size">{{ f.size }}</span>
            </div>
            <HrTag v-if="f.state === 'queued'" color="warning" size="xs" outline rounded>Queued</HrTag>
            <CheckCircle2 v-if="f.state === 'complete'" class="hr-file__ok" :size="16" aria-label="Uploaded" />
            <button v-if="f.state === 'complete'" type="button" class="hr-file__btn" :aria-label="`Delete ${f.name}`" @click="emit('remove', f.id)"><Trash2 :size="16" /></button>
            <button v-else type="button" class="hr-file__btn" :aria-label="`Remove ${f.name}`" @click="emit('remove', f.id)"><X :size="16" /></button>
          </div>
          <div v-if="f.state === 'progress' || f.state === 'start'" class="hr-file__progress">
            <span class="hr-file__bar" role="progressbar" :aria-valuenow="f.progress ?? 0" aria-valuemin="0" aria-valuemax="100" :aria-label="`Uploading ${f.name}`"><span :style="{ width: (f.progress ?? 0) + '%' }" /></span>
            <span class="hr-file__pct">{{ f.progress ?? 0 }}%</span>
          </div>
          <button v-if="f.state === 'error'" type="button" class="hr-file__retry" @click="emit('retry', f.id)">Try again</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<style>
.hr-upload { display: flex; flex-direction: column; gap: 4px; font-family: var(--hr-font-family); }
.hr-upload__zone {
  position: relative; display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 8px; text-align: center;
  background: var(--hr-color-neutral-white-base); border: 1px solid var(--hr-color-neutral-gray-200); border-radius: 8px; transition: border-color 120ms;
}
.hr-upload__zone:hover, .hr-upload__zone.is-over { border-color: var(--hr-color-primary-blue-600); }
.hr-upload__zone.is-disabled { background: var(--hr-color-neutral-gray-50); border-color: var(--hr-color-neutral-gray-200); }
.hr-upload__badge { width: 40px; height: 40px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; background: var(--hr-color-neutral-gray-100); box-shadow: 0 0 0 6px var(--hr-color-neutral-gray-50); color: var(--hr-color-neutral-gray-600); margin: 6px 0 4px; }
.hr-upload__action { display: flex; flex-wrap: wrap; justify-content: center; gap: 4px; font: var(--hr-text-md); color: var(--hr-color-neutral-gray-600); }
.hr-upload__link { padding: 0; border: 0; background: none; font: inherit; font-weight: var(--hr-font-weight-semibold); color: var(--hr-color-primary-blue-700); cursor: pointer; border-radius: 2px; }
.hr-upload__link:focus-visible { outline: none; box-shadow: var(--hr-focus-ring-primary); }
.hr-upload__link::after { content: ''; position: absolute; inset: 0; }
.hr-upload__hint { font: var(--hr-text-xs); color: var(--hr-color-neutral-gray-600); }
.hr-upload__zone.is-disabled .hr-upload__link { color: var(--hr-color-primary-blue-200); cursor: not-allowed; }
.hr-upload__zone.is-disabled .hr-upload__action, .hr-upload__zone.is-disabled .hr-upload__hint { color: var(--hr-color-neutral-gray-400); }
.hr-upload__input { position: absolute; width: 1px; height: 1px; opacity: 0; pointer-events: none; }
.hr-upload__list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 4px; }
.hr-file { display: flex; gap: 4px; padding: 8px; background: var(--hr-color-neutral-white-base); border: 1px solid var(--hr-color-neutral-gray-200); border-radius: 8px; }
.hr-file__icon { flex: none; width: 32px; height: 32px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-right: 4px; background: var(--hr-color-primary-blue-100); color: var(--hr-color-primary-blue-600); }
.hr-file.is-queued .hr-file__icon, .hr-file.is-start .hr-file__icon { background: var(--hr-color-neutral-gray-100); color: var(--hr-color-neutral-gray-300); }
.hr-file.is-complete .hr-file__icon { background: var(--hr-color-secondary-success-100); color: var(--hr-color-secondary-success-600); }
.hr-file.is-error { background: var(--hr-color-secondary-error-25); border-color: var(--hr-color-secondary-error-300); }
.hr-file.is-error .hr-file__icon { background: var(--hr-color-secondary-error-100); color: var(--hr-color-secondary-error-600); }
.hr-file__main { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 4px; }
.hr-file__row { display: flex; align-items: flex-start; gap: 8px; }
.hr-file__text { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.hr-file__name { font: var(--hr-text-md); font-weight: var(--hr-font-weight-medium); color: var(--hr-color-neutral-gray-700); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.hr-file__size { font: var(--hr-text-sm); color: var(--hr-color-neutral-gray-600); }
.hr-file__ok { flex: none; color: var(--hr-color-secondary-success-600); }
.hr-file__btn { flex: none; display: inline-flex; padding: 0; border: 0; border-radius: 4px; background: none; color: var(--hr-color-neutral-gray-600); cursor: pointer; }
.hr-file__btn:focus-visible, .hr-file__retry:focus-visible { outline: none; box-shadow: var(--hr-focus-ring-neutral); }
.hr-file__progress { display: flex; align-items: center; gap: 4px; }
.hr-file__bar { flex: 1; height: 8px; border-radius: 64px; background: var(--hr-color-neutral-gray-200); overflow: hidden; }
.hr-file__bar > span { display: block; height: 100%; border-radius: 64px; background: var(--hr-color-primary-blue-600); transition: width 200ms; }
.hr-file__pct { width: 32px; text-align: right; font: var(--hr-text-md); font-weight: var(--hr-font-weight-medium); color: var(--hr-color-neutral-gray-700); font-variant-numeric: tabular-nums; }
.hr-file__retry { align-self: flex-start; padding: 0; border: 0; background: none; font: var(--hr-text-md); font-weight: var(--hr-font-weight-semibold); color: var(--hr-color-secondary-error-700); cursor: pointer; border-radius: 2px; }
</style>
