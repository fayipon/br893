<script setup>
import { computed, onMounted, onUnmounted, ref, useId, watch } from 'vue'

const props = defineProps({ type: { type: String, default: 'layered' } })
const asset = name => `${import.meta.env.BASE_URL}assets/pinoyplay/${name}`
const layerAssets = { offer: 'slot-rebate-offer-v3-berry.png', rabbit: 'slot-rebate-rabbit-v2-clean.png' }
const layer = name => asset(layerAssets[name] || `slot-rebate-${name}-v1.png`)
const id = useId()
const refId = name => `url(#${id}-${name})`
const element = ref(null)
const ready = ref(false)
const failed = ref(false)
const visible = ref(false)
const pageVisible = ref(true)
const reducedMotion = ref(false)
const motionEnabled = computed(() => props.type === 'layered' && !reducedMotion.value)
const animated = computed(() => motionEnabled.value && ready.value && !failed.value)
const running = computed(() => animated.value && visible.value && pageVisible.value)

// Original 1882 × 836 artwork coordinates; array order preserves foreground overlap.
const characters = [
  { id: 'horse', delay: '.32s', duration: '1.05s', x: '180px', y: '-30px', origin: '1435px 610px' },
  { id: 'girl', delay: '.08s', duration: '1.15s', x: '-180px', y: '70px', origin: '1000px 750px' },
  { id: 'rabbit', delay: '.92s', duration: '.95s', x: '0px', y: '160px', origin: '1220px 810px' },
  { id: 'boy', delay: '.60s', duration: '1.1s', x: '230px', y: '70px', origin: '1660px 810px' },
]
const offerLayers = [
  { id: 'up-to', x: 70, y: 280, width: 650, height: 90, transform: 'translate(0 -12)' },
  { id: 'amount', x: 70, y: 370, width: 650, height: 267, transform: 'translate(-43.8 -61.2) scale(1.12)' },
  { id: 'all-slots', x: 70, y: 637, width: 650, height: 155, transform: 'translate(0 14)' },
]
const assetNames = ['background', 'headline', 'offer', ...characters.map(character => character.id)]
let observer, preference, started = false, mounted = false, disposed = false
const updatePageVisibility = () => { pageVisible.value = !document.hidden }
const updateMotionPreference = () => { reducedMotion.value = preference.matches }

function preload() {
  if (!mounted || !motionEnabled.value || started) return
  started = true
  Promise.all(assetNames.map(name => new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve()
    image.onerror = reject
    image.src = layer(name)
  }))).then(() => { if (!disposed) ready.value = true }).catch(() => { if (!disposed) failed.value = true })
}

watch(motionEnabled, preload)
onMounted(() => {
  mounted = true
  updatePageVisibility()
  document.addEventListener('visibilitychange', updatePageVisibility)
  preference = matchMedia('(prefers-reduced-motion: reduce)')
  updateMotionPreference()
  preference.addEventListener('change', updateMotionPreference)
  observer = new IntersectionObserver(entries => { visible.value = entries.some(entry => entry.isIntersecting) }, { threshold: .1 })
  observer.observe(element.value)
  preload()
})
onUnmounted(() => {
  disposed = true
  observer?.disconnect()
  preference?.removeEventListener('change', updateMotionPreference)
  document.removeEventListener('visibilitychange', updatePageVisibility)
})
</script>

<template>
  <div ref="element" class="pinoy-rebate" :class="{ 'pinoy-rebate--running': running }" :data-banner-type="animated ? 'layered' : 'image'" role="img" aria-label="Slot Daily Rebate — up to 1.5%, all slot games">
    <img v-if="!animated" class="pinoy-rebate-static" :src="asset('slot-daily-rebate-v4-berry-outline.png')" alt="" width="1882" height="836" fetchpriority="high" />
    <svg v-else class="pinoy-rebate-motion" viewBox="0 0 1882 836" aria-hidden="true" focusable="false">
      <defs>
        <filter :id="`${id}-character-detail`" x="-2%" y="-2%" width="104%" height="104%" color-interpolation-filters="sRGB"><feConvolveMatrix order="3" kernelMatrix="0 -.18 0 -.18 1.72 -.18 0 -.18 0" divisor="1" preserveAlpha="true" edgeMode="duplicate" /></filter>
        <mask :id="`${id}-headline`" maskUnits="userSpaceOnUse" x="0" y="0" width="1882" height="836" style="mask-type: alpha"><image :href="layer('headline')" width="1882" height="836" preserveAspectRatio="none" /></mask>
        <linearGradient :id="`${id}-shine`" gradientUnits="userSpaceOnUse" x1="25" y1="25" x2="120" y2="120"><stop offset="0" stop-color="#d9eaff" stop-opacity="0" /><stop offset=".3" stop-color="#e4efff" stop-opacity=".18" /><stop offset=".5" stop-color="#fff" stop-opacity=".95" /><stop offset=".7" stop-color="#fff5d9" stop-opacity=".22" /><stop offset="1" stop-color="#fff5d9" stop-opacity="0" /></linearGradient>
        <clipPath v-for="text in offerLayers" :id="`${id}-${text.id}`" :key="text.id"><rect :x="text.x" :y="text.y" :width="text.width" :height="text.height" /></clipPath>
        <filter :id="`${id}-amount-outline`" x="-10%" y="-10%" width="120%" height="120%" color-interpolation-filters="sRGB"><feMorphology in="SourceAlpha" operator="dilate" radius="6" result="outline" /><feFlood flood-color="#fff" /><feComposite in2="outline" operator="in" /><feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      <image :href="layer('background')" width="1882" height="836" preserveAspectRatio="none" />
      <image :href="layer('headline')" width="1882" height="836" preserveAspectRatio="none" />
      <g :mask="refId('headline')"><path class="rebate-headline-shine" d="M90 -40H280L-90 330H-280Z" :fill="refId('shine')" /></g>
      <g v-for="text in offerLayers" :key="text.id" class="rebate-offer-enter" :class="`rebate-${text.id}`" :filter="text.id === 'amount' ? refId('amount-outline') : undefined"><g :transform="text.transform" :clip-path="refId(text.id)"><image :href="layer('offer')" width="1882" height="836" preserveAspectRatio="none" /></g></g>
      <g v-for="character in characters" :key="character.id" class="rebate-character-enter" :class="`rebate-${character.id}`" :style="{ '--enter-delay': character.delay, '--enter-duration': character.duration, '--enter-x': character.x, '--enter-y': character.y, '--enter-origin': character.origin }"><image :href="layer(character.id)" :filter="refId('character-detail')" width="1882" height="836" preserveAspectRatio="none" /></g>
    </svg>
  </div>
</template>

<style scoped>
.pinoy-rebate { position: relative; width: 100%; height: 100%; aspect-ratio: 1882 / 836; overflow: hidden; }
.pinoy-rebate-static, .pinoy-rebate-motion { display: block; width: 100%; height: 100%; }
.pinoy-rebate-motion { pointer-events: none; }
.rebate-character-enter { transform-box: view-box; transform-origin: var(--enter-origin); animation: rebate-character-in var(--enter-duration) var(--enter-delay) cubic-bezier(.2, .7, .25, 1) both; }
.rebate-rabbit { animation-name: rebate-rabbit-in; }
.rebate-offer-enter { transform-box: view-box; }
.rebate-up-to { animation: rebate-label-in .65s .18s cubic-bezier(.2, .7, .25, 1) both; }
.rebate-amount { transform-origin: 365px 510px; animation: rebate-amount-in 1.05s .62s cubic-bezier(.2, .7, .25, 1) both; }
.rebate-all-slots { animation: rebate-caption-in .7s 1.12s cubic-bezier(.2, .7, .25, 1) both; }
.rebate-headline-shine { opacity: 0; mix-blend-mode: screen; animation: rebate-title-shine 6.5s 1.9s ease-in-out infinite; }
.rebate-character-enter, .rebate-offer-enter, .rebate-headline-shine { animation-play-state: paused; }
.pinoy-rebate--running :is(.rebate-character-enter, .rebate-offer-enter, .rebate-headline-shine) { animation-play-state: running; }
@keyframes rebate-character-in {
  0% { opacity: 0; transform: translate(var(--enter-x), var(--enter-y)) scale(.9); }
  75% { opacity: 1; transform: translate(0, -5px) scale(1.015); }
  100% { opacity: 1; transform: translate(0, 0) scale(1); }
}
@keyframes rebate-rabbit-in {
  0% { opacity: 0; transform: translateY(160px) scale(.7); }
  70% { opacity: 1; transform: translateY(-12px) scale(1.045); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes rebate-label-in { from { opacity: 0; transform: translateX(-170px); } to { opacity: 1; transform: translateX(0); } }
@keyframes rebate-amount-in {
  0% { opacity: 0; transform: scale(.4); }
  60% { opacity: 1; transform: scale(1.22); }
  82% { opacity: 1; transform: scale(.985); }
  100% { opacity: 1; transform: scale(1); }
}
@keyframes rebate-caption-in { from { opacity: 0; transform: translateY(55px); } to { opacity: 1; transform: translateY(0); } }
@keyframes rebate-title-shine {
  0% { opacity: 0; transform: translateX(-260px); }
  3% { opacity: 1; }
  19% { opacity: 1; }
  22%, 100% { opacity: 0; transform: translateX(2210px); }
}
@media (prefers-reduced-motion: reduce) { .rebate-character-enter, .rebate-offer-enter, .rebate-headline-shine { animation: none; } .rebate-headline-shine { display: none; } }
</style>
