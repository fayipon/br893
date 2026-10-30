<script setup>
import { onMounted, ref } from 'vue'
import UiIcon from './UiIcon.vue'
import LuckyWheelPopupArtwork from './LuckyWheelPopupArtwork.vue'
import { useBannerType } from '../bannerType'
import { isLuckyWheelHiddenToday, rememberLuckyWheelForToday } from '../dailyPromotion'

defineProps({ artwork: { type: Object, required: true } })
const emit = defineEmits(['visibility-change'])
const { bannerType } = useBannerType()
const dialog = ref(null)
const isOpen = ref(false)
const hideToday = ref(false)
const storage = () => { try { return window.localStorage } catch { return null } }
function open() {
  if (dialog.value.open) return
  hideToday.value = isLuckyWheelHiddenToday(storage())
  isOpen.value = true
  dialog.value.showModal()
  emit('visibility-change', true)
}
function onClose() {
  isOpen.value = false
  emit('visibility-change', false)
}
onMounted(() => { if (!isLuckyWheelHiddenToday(storage())) open() })
defineExpose({ open })
</script>

<template>
  <dialog ref="dialog" class="lucky-welcome-dialog" aria-label="Lucky Wheel promotion" @close="onClose" @click="event => { if (event.target === event.currentTarget) dialog.close() }">
    <div class="lucky-welcome-content">
      <div class="lucky-welcome-card">
        <button class="lucky-welcome-close" aria-label="Close Lucky Wheel promotion" autofocus @click="dialog.close()"><UiIcon name="close" :size="20" /></button>
        <LuckyWheelPopupArtwork v-if="isOpen" :artwork="artwork" :type="bannerType" />
      </div>
      <footer class="lucky-welcome-footer">
        <label class="lucky-welcome-preference"><input v-model="hideToday" type="checkbox" @change="rememberLuckyWheelForToday(hideToday, storage())" /><span>Don't show again today</span></label>
      </footer>
    </div>
  </dialog>
</template>

<style scoped>
.lucky-welcome-dialog { position: fixed; inset: 0; width: min(420px, calc(100vw - 32px), calc(var(--mobile-max-width, 520px) - 32px), calc((100dvh - 80px) * .8)); max-width: none; max-height: calc(100dvh - 24px); margin: auto; overflow: auto; border: 0; border-radius: 0; background: transparent; box-shadow: none; }
.lucky-welcome-dialog::backdrop { inset: 0 max(0px, calc((100% - var(--mobile-max-width, 520px)) / 2)); background: rgb(16 5 7 / 78%); backdrop-filter: blur(5px); }
.lucky-welcome-content { position: relative; }
.lucky-welcome-card { position: relative; overflow: hidden; border: 1px solid rgb(232 199 125 / 65%); border-radius: 20px; background: #240b12; }
.lucky-welcome-close { position: absolute; z-index: 2; top: 10px; right: 10px; width: 36px; height: 36px; border: 1px solid rgb(232 199 125 / 55%); border-radius: 50%; color: #fff0ce; background: rgb(36 11 18 / 86%); }
.lucky-welcome-footer { display: grid; justify-items: center; padding: 12px 0 4px; }
.lucky-welcome-preference { display: inline-flex; align-items: center; justify-content: center; gap: 9px; min-height: 24px; color: #e4cfa8; font-size: 13px; cursor: pointer; }
.lucky-welcome-preference input { width: 17px; height: 17px; margin: 0; accent-color: #e8c77d; cursor: pointer; }
</style>
