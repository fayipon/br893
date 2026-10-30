<script setup>
import { computed, onMounted, onUnmounted, ref, useId } from 'vue'

const props = defineProps({
  banner: { type: Object, required: true },
  type: { type: String, default: 'layered' },
  loading: { type: String, default: 'eager' },
  priority: { type: String, default: 'auto' },
})
const asset = path => `${import.meta.env.BASE_URL}${path}`
const id = useId()
const refId = name => `url(#${id}-${name})`
const element = ref(null)
const ready = ref(false)
const assetFailed = ref(false)
const visible = ref(false)
const pageVisible = ref(true)
const reducedMotion = ref(false)
const motionEnabled = computed(() => props.type === 'layered' && !reducedMotion.value)
const animated = computed(() => motionEnabled.value && ready.value && !assetFailed.value)
let observer, motionPreference, disposed = false

// The six sprite regions share one transparent source, in original artwork coordinates.
const depositSprites = [
  { id: 'coin', x: 885, y: 265, width: 380, height: 305, duration: '4.6s', delay: '0s', travel: '-12px' },
  { id: 'ruby-left-high', x: 15, y: 90, width: 100, height: 105, duration: '5.2s', delay: '-1.8s', travel: '-10px' },
  { id: 'ruby-left-low', x: 0, y: 480, width: 80, height: 110, duration: '6.1s', delay: '-3.1s', travel: '-13px' },
  { id: 'ruby-center', x: 935, y: 665, width: 110, height: 110, duration: '5.6s', delay: '-.8s', travel: '-9px' },
  { id: 'ruby-right-high', x: 1770, y: 205, width: 120, height: 110, duration: '4.9s', delay: '-2.4s', travel: '-14px' },
  { id: 'ruby-right-low', x: 1875, y: 600, width: 108, height: 155, duration: '6.3s', delay: '-4s', travel: '-11px' },
]
const sprites = computed(() => props.banner.motion.spritesImage ? depositSprites : [])
const textLayers = computed(() => props.banner.motion.textLayers ?? [
  { id: 'slogan', x: 0, y: 0, width: 1400, height: 447 },
  { id: 'caption', x: 0, y: 447, width: 1400, height: 110 },
])
const updateVisibility = () => { pageVisible.value = !document.hidden }
const updateMotion = () => { reducedMotion.value = motionPreference.matches }

onMounted(() => {
  updateVisibility()
  document.addEventListener('visibilitychange', updateVisibility)
  motionPreference = matchMedia('(prefers-reduced-motion: reduce)')
  updateMotion()
  motionPreference.addEventListener('change', updateMotion)
  observer = new IntersectionObserver(entries => { visible.value = entries.some(entry => entry.isIntersecting) }, { threshold: .05 })
  observer.observe(element.value)
  Promise.all([props.banner.motion.backgroundImage, props.banner.motion.letteringImage, props.banner.motion.spritesImage].filter(Boolean).map(path => new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = resolve
    image.onerror = reject
    image.src = asset(path)
  }))).then(() => { if (!disposed) ready.value = true }).catch(() => { if (!disposed) assetFailed.value = true })
})
onUnmounted(() => {
  disposed = true
  observer?.disconnect()
  motionPreference?.removeEventListener('change', updateMotion)
  document.removeEventListener('visibilitychange', updateVisibility)
})
</script>

<template>
  <div ref="element" class="hero-banner jito-deposit" :class="[banner.variant, { 'motion-ready': animated, 'motion-running': animated && visible && pageVisible }]" :style="{ '--slogan-origin': banner.motion.sloganOrigin ?? '650px 260px' }" :data-banner-type="animated ? 'layered' : 'image'" role="img" :aria-label="banner.alt">
    <img v-if="!motionEnabled || assetFailed" class="jito-static" :src="asset(banner.image)" alt="" width="1983" height="793" :loading="loading" :fetchpriority="priority" />
    <svg v-else class="jito-motion" viewBox="0 0 1983 793" aria-hidden="true" focusable="false">
      <defs>
        <clipPath v-for="sprite in sprites" :id="`${id}-${sprite.id}`" :key="sprite.id"><rect :x="sprite.x" :y="sprite.y" :width="sprite.width" :height="sprite.height" /></clipPath>
        <radialGradient :id="`${id}-halo-falloff`"><stop offset=".7" stop-color="white" /><stop offset="1" stop-color="white" stop-opacity="0" /></radialGradient>
        <mask :id="`${id}-halo-area`" maskUnits="userSpaceOnUse" x="0" y="0" width="1983" height="793"><ellipse cx="1475" cy="140" rx="450" ry="370" :fill="refId('halo-falloff')" /></mask>
        <clipPath v-for="layer in textLayers" :id="`${id}-${layer.id}-source`" :key="layer.id"><rect :x="layer.x" :y="layer.y" :width="layer.width" :height="layer.height" /></clipPath>
        <!-- Select cyan light rather than hard-cut silhouettes, preserving warm skin and clothing. -->
        <filter :id="`${id}-teal-key`" color-interpolation-filters="sRGB">
          <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  -6 3 3 0 -.12" />
        </filter>
        <mask :id="`${id}-halo-mask`" maskUnits="userSpaceOnUse" x="0" y="0" width="1983" height="793" style="mask-type: alpha">
          <image :href="asset(banner.motion.backgroundImage)" width="1983" height="793" :filter="refId('teal-key')" />
        </mask>
        <mask :id="`${id}-slogan-mask`" maskUnits="userSpaceOnUse" x="0" y="0" width="1983" height="793" style="mask-type: alpha">
          <image :href="asset(banner.motion.letteringImage)" width="1983" height="793" />
        </mask>
        <linearGradient :id="`${id}-shine`">
          <stop offset="0" stop-color="#fff8db" stop-opacity="0" />
          <stop offset=".34" stop-color="#fff8db" stop-opacity=".12" />
          <stop offset=".5" stop-color="#fff" stop-opacity=".7" />
          <stop offset=".66" stop-color="#fff7da" stop-opacity=".14" />
          <stop offset="1" stop-color="#fff7da" stop-opacity="0" />
        </linearGradient>
      </defs>
      <image :href="asset(banner.motion.backgroundImage)" width="1983" height="793" />
      <g v-if="banner.motion.halo !== false" :mask="refId('halo-area')">
        <rect class="halo-dim" width="1983" height="793" fill="#001a19" :mask="refId('halo-mask')" />
        <image class="halo-breathe" :href="asset(banner.motion.backgroundImage)" width="1983" height="793" :filter="refId('teal-key')" />
      </g>
      <!-- Register the extracted typography to the approved poster, then animate each text group independently. -->
      <g :transform="banner.motion.letteringTransform ?? 'translate(10 9) scale(.86 .88)'">
        <g v-for="layer in textLayers" :key="layer.id" :class="`${layer.id}-enter`">
          <g :clip-path="refId(`${layer.id}-source`)"><image :href="asset(banner.motion.letteringImage)" width="1983" height="793" /></g>
          <g v-if="layer.id === 'slogan'" :clip-path="refId(`${layer.id}-source`)" :mask="refId('slogan-mask')"><path class="slogan-shine" d="M-70 0H200L40 793H-230Z" :fill="refId('shine')" /></g>
        </g>
      </g>
      <g v-for="sprite in sprites" :key="sprite.id" class="jito-float" :data-motion="sprite.id" :style="{ '--float-duration': sprite.duration, '--float-delay': sprite.delay, '--float-travel': sprite.travel }">
        <g :clip-path="refId(sprite.id)"><image :href="asset(banner.motion.spritesImage)" width="1983" height="793" /></g>
      </g>
    </svg>
  </div>
</template>

<style scoped>
.jito-deposit { position: relative; isolation: isolate; width: 100%; aspect-ratio: 1983 / 793; overflow: hidden; }
.jito-static, .jito-motion { display: block; position: absolute; inset: 0; width: 100%; height: 100%; }
.jito-motion { pointer-events: none; }
.halo-dim { opacity: .9; }
.halo-breathe, .slogan-shine { opacity: 0; mix-blend-mode: screen; }
.slogan-enter, .caption-enter, .eyebrow-enter, .jito-float { opacity: 0; }
.slogan-enter { transform-origin: var(--slogan-origin); }
.motion-ready .eyebrow-enter { animation: eyebrow-enter .55s .08s ease-out both; }
.motion-ready .slogan-enter { animation: slogan-enter 1.25s cubic-bezier(.22, .65, .3, 1) both; }
.motion-ready .caption-enter { animation: caption-enter .65s .55s cubic-bezier(.16, 1, .3, 1) both; }
.motion-ready .halo-dim { animation: halo-dim 5.2s ease-in-out infinite; }
.motion-ready .halo-breathe { animation: halo-breathe 5.2s ease-in-out infinite; }
.motion-ready .jito-float { opacity: 1; animation: jito-float var(--float-duration) var(--float-delay) ease-in-out infinite; }
.motion-ready .slogan-shine { animation: slogan-shine 7.5s ease-in-out infinite; }
.motion-ready :is(.halo-dim, .halo-breathe, .jito-float, .slogan-shine, .slogan-enter, .caption-enter, .eyebrow-enter) { animation-play-state: paused; }
.motion-running :is(.halo-dim, .halo-breathe, .jito-float, .slogan-shine, .slogan-enter, .caption-enter, .eyebrow-enter) { animation-play-state: running; }
@keyframes eyebrow-enter {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes slogan-enter {
  0% { opacity: 0; transform: translateX(-180px) scale(.82); filter: blur(6px); }
  70% { opacity: 1; transform: translateX(10px) scale(1.045); filter: blur(0); }
  100% { opacity: 1; transform: translateX(0) scale(1); filter: blur(0); }
}
@keyframes caption-enter {
  from { opacity: 0; transform: translateY(18px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes halo-dim { 0%, 100% { opacity: .9; } 50% { opacity: .03; } }
@keyframes halo-breathe { 0%, 100% { opacity: 0; } 50% { opacity: .5; } }
@keyframes jito-float { 0%, 100% { transform: translateY(2px); } 50% { transform: translateY(var(--float-travel)); } }
/* The warm narrow sweep matches BR893's 1.45s metal shine, with a quiet interval between passes. */
@keyframes slogan-shine {
  0%, 18% { opacity: 0; transform: translateX(-300px); }
  22% { opacity: .75; }
  34% { opacity: .75; }
  38%, 100% { opacity: 0; transform: translateX(1600px); }
}
@media (prefers-reduced-motion: reduce) {
  .jito-deposit :is(.halo-dim, .halo-breathe, .jito-float, .slogan-shine, .slogan-enter, .caption-enter, .eyebrow-enter) { animation: none; }
}
</style>
