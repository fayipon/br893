<script setup>
import { computed, ref } from 'vue'

const props = defineProps({ site: { type: String, default: 'br893' } })
const siteName = props.site === 'ipa' ? 'Jito' : 'BR893'
const width = ref('web')
const original = ref(false)
const portalUrl = import.meta.env.BASE_URL
const frameSource = computed(() => `${portalUrl}?page=${props.site === 'ipa' ? 'ipa' : 'br893'}&background=${original.value ? 'original' : 'gradient'}`)
const widths = [
  { value: 'web', label: 'Web' },
  { value: '390', label: 'Mobile 390' },
  { value: '430', label: 'Mobile 430' },
  { value: '320', label: 'Mobile 320' },
]
</script>

<template>
  <div class="preview-workspace">
    <header class="preview-toolbar">
      <div class="preview-heading"><span>{{ siteName }}</span><strong>首頁設計預覽</strong></div>
      <nav aria-label="預覽尺寸"><button v-for="option in widths" :key="option.value" :aria-pressed="width === option.value" @click="width = option.value">{{ option.label }}</button></nav>
      <label class="preview-background"><input v-model="original" type="checkbox" /> {{ props.site === 'ipa' ? '比較純色背景' : '比較原版背景' }}</label>
    </header>
    <main class="preview-stage">
      <iframe :src="frameSource" :style="{ width: width === 'web' ? '100%' : `${width}px` }" :title="`${siteName} 首頁預覽`" />
    </main>
  </div>
</template>

<style scoped>
.preview-workspace { height: 100dvh; display: flex; flex-direction: column; background: #09060f; font-family: Arial, 'Microsoft JhengHei', sans-serif; }
.preview-toolbar { min-height: 68px; flex-shrink: 0; display: flex; align-items: center; gap: 24px; padding: 12px 22px; border-bottom: 1px solid #34263f; background: #1b1225; }
.preview-heading { display: flex; align-items: center; gap: 10px; white-space: nowrap; }
.preview-heading span { color: #f18fcd; font-size: 13px; font-weight: 800; letter-spacing: .07em; }
.preview-heading strong { font-size: 13px; font-weight: 400; color: #d0bedc; }
.preview-toolbar nav { display: flex; gap: 4px; padding: 4px; border-radius: 9px; background: #100a18; }
.preview-toolbar nav button { min-height: 30px; padding: 6px 12px; font-size: 12px; color: #ad98bf; border-radius: 6px; white-space: nowrap; }
.preview-toolbar nav button[aria-pressed='true'] { color: #fff; background: #624078; }
.preview-background { display: flex; gap: 6px; align-items: center; margin-left: auto; color: #bca6ca; font-size: 12px; white-space: nowrap; cursor: pointer; }
.preview-background input { accent-color: #d980be; }
.preview-stage { flex: 1; min-height: 0; display: flex; justify-content: center; }
iframe { display: block; border: 0; height: 100%; max-width: 100%; box-shadow: 0 0 0 1px #3b294b; background: #0e0917; }
@media (max-width: 800px) { .preview-toolbar { flex-wrap: wrap; gap: 10px 16px; padding: 12px; }.preview-heading { margin-right: auto; }.preview-toolbar nav { order: 3; width: 100%; }.preview-toolbar nav button { flex: 1; }.preview-heading strong { font-size: 12px; } }
</style>
