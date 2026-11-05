<script setup>
import { computed, onMounted, onUnmounted, ref, useId, watch } from 'vue'

const props = defineProps({ type: { type: String, default: 'layered' } })
const asset = name => `${import.meta.env.BASE_URL}assets/pinoyplay/${name}`
const artwork = asset('register-bonus-v4-orange.png')
const boot = asset('welcome-cass-raised-boot-v1.png')
const layer = name => asset(`register-bonus-${name}-v1.png`)
const textGroups = [
  { id: 'badge', x: 30, y: 55, width: 395, height: 78 },
  { id: 'headline', x: 30, y: 133, width: 675, height: 115 },
  { id: 'amount', x: 0, y: 250, width: 555, height: 465 },
  { id: 'register', x: 1190, y: 80, width: 310, height: 165 },
  { id: 'auto-credit', x: 1205, y: 485, width: 360, height: 195 },
  { id: 'footer', x: 20, y: 740, width: 630, height: 70 },
]
const id = useId()
const element = ref(null)
const ready = ref(false)
const failed = ref(false)
const visible = ref(false)
const pageVisible = ref(true)
const reducedMotion = ref(false)
const motionEnabled = computed(() => props.type === 'layered' && !reducedMotion.value)
const animated = computed(() => motionEnabled.value && ready.value && !failed.value)
const running = computed(() => animated.value && visible.value && pageVisible.value)
let observer, preference, started = false, mounted = false, disposed = false
const updateVisibility = () => { pageVisible.value = !document.hidden }
const updatePreference = () => { reducedMotion.value = preference.matches }

function preload() {
  if (!mounted || !motionEnabled.value || started) return
  started = true
  Promise.all([artwork, boot, ...['background', 'welcome-word', 'copy', 'cass-body'].map(layer)].map(src => new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = resolve
    image.onerror = reject
    image.src = src
  }))).then(() => { if (!disposed) ready.value = true }).catch(() => { if (!disposed) failed.value = true })
}

watch(motionEnabled, preload)
onMounted(() => {
  mounted = true
  updateVisibility()
  document.addEventListener('visibilitychange', updateVisibility)
  preference = matchMedia('(prefers-reduced-motion: reduce)')
  updatePreference()
  preference.addEventListener('change', updatePreference)
  observer = new IntersectionObserver(entries => { visible.value = entries.some(entry => entry.isIntersecting) }, { threshold: .1 })
  observer.observe(element.value)
  preload()
})
onUnmounted(() => {
  disposed = true
  observer?.disconnect()
  preference?.removeEventListener('change', updatePreference)
  document.removeEventListener('visibilitychange', updateVisibility)
})
</script>

<template>
  <div ref="element" class="pinoy-welcome-art" :class="{ 'pinoy-welcome-art--running': running }" :data-banner-type="animated ? 'layered' : 'image'" role="img" aria-label="₱20 Register Bonus. Deposit required to play. 5× Slot wagering.">
    <img v-if="!animated" :src="artwork" alt="" width="1882" height="836" />
    <svg v-else viewBox="0 0 1882 836" aria-hidden="true" focusable="false">
      <defs>
        <clipPath :id="`${id}-boot-crop`"><rect x="620" y="415" width="270" height="280" /></clipPath>
        <clipPath v-for="group in textGroups" :id="`${id}-${group.id}`" :key="group.id"><rect :x="group.x" :y="group.y" :width="group.width" :height="group.height" /></clipPath>
        <filter :id="`${id}-ground-shadow`" x="-20%" y="-100%" width="140%" height="300%"><feGaussianBlur stdDeviation="12" /></filter>
      </defs>
      <image :href="layer('background')" width="1882" height="836" preserveAspectRatio="none" />
      <g class="pinoy-welcome-enter register-word-entry"><g class="pinoy-welcome-drift register-word-drift"><image :href="layer('welcome-word')" width="1882" height="836" preserveAspectRatio="none" /></g></g>
      <ellipse cx="1015" cy="814" rx="250" ry="14" fill="#0b2456" opacity=".18" :filter="`url(#${id}-ground-shadow)`" />
      <image :href="layer('cass-body')" width="1882" height="836" preserveAspectRatio="none" />
      <g class="pinoy-cass-boot"><g :clip-path="`url(#${id}-boot-crop)`"><image :href="boot" width="1882" height="836" preserveAspectRatio="none" /></g></g>
      <g v-for="group in textGroups" :key="group.id" class="pinoy-welcome-enter" :class="`register-${group.id}-entry`"><g :class="{ 'pinoy-welcome-drift register-label-drift': group.id === 'register' || group.id === 'auto-credit' }"><g :clip-path="`url(#${id}-${group.id})`"><image :href="layer('copy')" width="1882" height="836" preserveAspectRatio="none" /></g></g></g>
    </svg>
  </div>
</template>

<style scoped>
.pinoy-welcome-art { width: 100%; height: 100%; aspect-ratio: 1882 / 836; overflow: hidden; }
.pinoy-welcome-art > img, .pinoy-welcome-art > svg { display: block; width: 100%; height: 100%; }
.pinoy-welcome-art > svg { pointer-events: none; }
.pinoy-welcome-enter { transform-box: view-box; }
.register-badge-entry { animation: register-copy-slide .65s .1s cubic-bezier(.2, .7, .25, 1) both; }
.register-headline-entry { animation: register-copy-slide .75s .22s cubic-bezier(.2, .7, .25, 1) both; }
.register-word-entry { transform-origin: 1220px 490px; animation: register-word-in 1s .15s cubic-bezier(.2, .7, .25, 1) both; }
.register-word-drift { animation: register-word-float 6.2s 1.15s ease-in-out infinite; }
.register-amount-entry { transform-origin: 280px 480px; animation: register-amount-in 1.05s .62s cubic-bezier(.2, .7, .25, 1) both; }
.register-register-entry { transform-origin: 1330px 170px; animation: register-tag-in .8s .55s cubic-bezier(.2, .7, .25, 1) both; }
.register-auto-credit-entry { transform-origin: 1380px 580px; animation: register-tag-in .8s .85s cubic-bezier(.2, .7, .25, 1) both; }
.register-footer-entry { animation: register-footer-in .65s 1.1s ease-out both; }
.register-label-drift { animation: register-label-float 4.8s 1.8s ease-in-out infinite; }
.pinoy-cass-boot { transform-box: view-box; transform-origin: 835px 460px; animation: pinoy-cass-foot-swing 3.8s .8s ease-in-out infinite; animation-play-state: paused; }
.pinoy-welcome-enter, .pinoy-welcome-drift { animation-play-state: paused; }
.pinoy-welcome-art--running :is(.pinoy-cass-boot, .pinoy-welcome-enter, .pinoy-welcome-drift) { animation-play-state: running; }
@keyframes register-copy-slide { from { opacity: 0; transform: translateX(-110px); } to { opacity: 1; transform: translateX(0); } }
@keyframes register-word-in { from { opacity: 0; transform: translateX(130px) scale(1.025); } to { opacity: 1; transform: translateX(0) scale(1); } }
@keyframes register-word-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
@keyframes register-amount-in {
  0% { opacity: 0; transform: scale(.4); }
  60% { opacity: 1; transform: scale(1.22); }
  82% { opacity: 1; transform: scale(.985); }
  100% { opacity: 1; transform: scale(1); }
}
@keyframes register-tag-in { from { opacity: 0; transform: translate(100px, 25px) rotate(5deg); } to { opacity: 1; transform: translate(0, 0) rotate(0); } }
@keyframes register-footer-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes register-label-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
@keyframes pinoy-cass-foot-swing {
  0%, 14%, 100% { transform: rotate(0deg); }
  44% { transform: rotate(7deg); }
  76% { transform: rotate(-1deg); }
}
@media (prefers-reduced-motion: reduce) { .pinoy-cass-boot, .pinoy-welcome-enter, .pinoy-welcome-drift { animation: none; } }
</style>
