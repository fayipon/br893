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
const players = computed(() => props.banner.motion.players ?? [])
const wheel = computed(() => props.banner.motion.wheel)
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
  Promise.all([props.banner.motion.backgroundImage, props.banner.motion.letteringImage, props.banner.motion.spritesImage, props.banner.motion.foregroundImage, wheel.value?.image, ...players.value.map(player => player.image)].filter(Boolean).map(path => new Promise((resolve, reject) => {
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
  <div ref="element" class="hero-banner jito-deposit" :class="[banner.variant, { 'motion-ready': animated, 'motion-running': animated && visible && pageVisible }]" :style="{ '--slogan-origin': banner.motion.sloganOrigin ?? '650px 260px', '--slogan-delay': banner.motion.sloganDelay ?? '0s', '--caption-delay': banner.motion.captionDelay ?? '.55s', '--shine-delay': banner.motion.shineDelay ?? '0s' }" :data-banner-type="animated ? 'layered' : 'image'" role="img" :aria-label="banner.alt">
    <img v-if="!motionEnabled || assetFailed" class="jito-static" :src="asset(banner.image)" alt="" width="1983" height="793" :loading="loading" :fetchpriority="priority" />
    <svg v-else class="jito-motion" viewBox="0 0 1983 793" aria-hidden="true" focusable="false">
      <defs>
        <!-- The disc rotates in its own circular plane before the fixed perspective projection. -->
        <clipPath v-if="wheel" :id="`${id}-wheel-face`"><circle r="570" /></clipPath>
        <clipPath v-if="wheel" :id="`${id}-wheel-fixed`">
          <ellipse cx="1464" cy="389" rx="84" ry="82" />
          <path d="M1420 25L1454 4L1499 0L1518 24L1466 125Z" />
        </clipPath>
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
        <linearGradient v-if="banner.motion.foregroundImage" :id="`${id}-speed-light`" gradientUnits="userSpaceOnUse" x1="1790" y1="290" x2="1450" y2="700">
          <stop offset="0" stop-color="#A8D8E8" stop-opacity="0" />
          <stop offset=".32" stop-color="#A8D8E8" />
          <stop offset=".58" stop-color="#597CFF" stop-opacity=".8" />
          <stop offset="1" stop-color="#597CFF" stop-opacity="0" />
        </linearGradient>
      </defs>
      <image :href="asset(banner.motion.backgroundImage)" width="1983" height="793" />
      <template v-if="wheel">
        <g :transform="wheel.projection">
          <g :clip-path="refId('wheel-face')">
            <g class="wheel-spin" :style="{ '--wheel-duration': wheel.duration }">
              <image :href="asset(wheel.image)" x="-622" y="-615" width="1254" height="1254" />
            </g>
          </g>
        </g>
        <!-- Reapply the fixed pointer and hub above the rotating face; the outer rim stays in the plate. -->
        <image :href="asset(banner.motion.backgroundImage)" width="1983" height="793" :clip-path="refId('wheel-fixed')" />
      </template>
      <g v-if="banner.motion.halo !== false" :mask="refId('halo-area')">
        <rect class="halo-dim" width="1983" height="793" fill="#001a19" :mask="refId('halo-mask')" />
        <image class="halo-breathe" :href="asset(banner.motion.backgroundImage)" width="1983" height="793" :filter="refId('teal-key')" />
      </g>
      <g v-if="banner.motion.foregroundImage" class="speed-trails" :stroke="refId('speed-light')" fill="none" stroke-linecap="round">
        <path d="M1760 280C1550 300 1265 470 1400 700" pathLength="100" stroke-width="6" />
        <path d="M1790 290C1580 310 1310 470 1450 700" pathLength="100" stroke-width="3" />
        <path d="M1820 300C1610 320 1355 470 1500 700" pathLength="100" stroke-width="8" />
      </g>
      <g v-if="banner.motion.foregroundImage" class="car-enter">
        <image :href="asset(banner.motion.foregroundImage)" width="1983" height="793" />
      </g>
      <!-- Array order controls depth; the center player is drawn last, in front of both sides. -->
      <g v-for="player in players" :key="player.id" class="player-enter" :class="`player-${player.id}`" :style="{ '--player-delay': player.delay, '--player-x': player.x, '--player-origin': player.origin }">
        <g :transform="player.transform ?? 'translate(0 0)'"><image :href="asset(player.image)" width="1983" height="793" /></g>
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
.slogan-enter, .caption-enter, .eyebrow-enter, .jito-float, .car-enter, .speed-trails, .player-enter { opacity: 0; }
.slogan-enter { transform-origin: var(--slogan-origin); }
.player-enter { transform-box: view-box; transform-origin: var(--player-origin); }
.wheel-spin { transform-box: view-box; transform-origin: 0 0; }
/* Anchor at the tire contact plane so perspective scaling keeps the car on the road. */
.car-enter { transform-box: view-box; transform-origin: 1450px 700px; }
.speed-trails { mix-blend-mode: screen; stroke-dasharray: 26 100; }
.motion-ready .eyebrow-enter { animation: eyebrow-enter .55s .08s ease-out both; }
.motion-ready .slogan-enter { animation: slogan-enter 1.25s var(--slogan-delay) cubic-bezier(.22, .65, .3, 1) both; }
.motion-ready .caption-enter { animation: caption-enter .65s var(--caption-delay) cubic-bezier(.16, 1, .3, 1) both; }
.motion-ready .player-enter { animation: player-side-enter .72s var(--player-delay) cubic-bezier(.18, .7, .25, 1) both; }
.motion-ready .player-center { animation-name: player-center-enter; animation-duration: .85s; }
.jito-cricket.motion-ready .slogan-enter { animation-name: cricket-amount-enter; animation-duration: .95s; }
.jito-lucky-wheel.motion-ready .slogan-enter { animation-name: lucky-title-drop; animation-duration: .65s; animation-timing-function: linear; }
.motion-ready .wheel-spin { animation: lucky-wheel-spin var(--wheel-duration) linear infinite; }
.motion-ready .car-enter { animation: car-enter 1.65s .06s linear both; }
.motion-ready .speed-trails { animation: speed-trails 1.65s .06s linear both; }
.motion-ready .halo-dim { animation: halo-dim 5.2s ease-in-out infinite; }
.motion-ready .halo-breathe { animation: halo-breathe 5.2s ease-in-out infinite; }
.motion-ready .jito-float { opacity: 1; animation: jito-float var(--float-duration) var(--float-delay) ease-in-out infinite; }
.motion-ready .slogan-shine { animation: slogan-shine 7.5s var(--shine-delay) ease-in-out infinite; }
.jito-lucky-wheel.motion-ready .slogan-shine { animation-name: lucky-title-shine; animation-duration: 6.5s; }
.motion-ready :is(.halo-dim, .halo-breathe, .jito-float, .slogan-shine, .slogan-enter, .caption-enter, .eyebrow-enter, .car-enter, .speed-trails, .player-enter, .wheel-spin) { animation-play-state: paused; }
.motion-running :is(.halo-dim, .halo-breathe, .jito-float, .slogan-shine, .slogan-enter, .caption-enter, .eyebrow-enter, .car-enter, .speed-trails, .player-enter, .wheel-spin) { animation-play-state: running; }
@keyframes lucky-wheel-spin { to { transform: rotate(360deg); } }
@keyframes lucky-title-shine {
  0% { opacity: 0; transform: translateX(-300px); }
  4%, 18% { opacity: .75; }
  22%, 100% { opacity: 0; transform: translateX(1600px); }
}
@keyframes lucky-title-drop {
  0% { opacity: 0; transform: translateY(-360px) scale(.94); filter: blur(5px); animation-timing-function: cubic-bezier(.45, 0, .8, .55); }
  18% { opacity: 1; }
  65% { opacity: 1; transform: translateY(18px) scale(1.018, .975); filter: blur(0); animation-timing-function: ease-out; }
  82% { opacity: 1; transform: translateY(-12px) scale(.995, 1.01); filter: blur(0); animation-timing-function: ease-in-out; }
  100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
}
@keyframes player-side-enter {
  from { opacity: 0; transform: translate(var(--player-x), 22px) scale(.96); filter: blur(3px); }
  to { opacity: 1; transform: translate(0, 0) scale(1); filter: blur(0); }
}
@keyframes player-center-enter {
  0% { opacity: 0; transform: translateY(58px) scale(.88); filter: blur(4px); }
  74% { opacity: 1; transform: translateY(-4px) scale(1.018); filter: blur(0); }
  100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
}
@keyframes cricket-amount-enter {
  0% { opacity: 0; transform: translateY(36px) scale(.72); filter: blur(4px); }
  72% { opacity: 1; transform: translateY(-5px) scale(1.055); filter: blur(0); }
  100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
}
@keyframes car-enter {
  0% { opacity: 0; transform: translate(340px, -410px) scale(.16) rotate(-6deg); filter: blur(3px); }
  18% { opacity: 1; transform: translate(240px, -388px) scale(.24) rotate(-5deg); filter: blur(2px); }
  40% { opacity: 1; transform: translate(100px, -300px) scale(.43) rotate(-3deg); filter: blur(1.6px); }
  62% { opacity: 1; transform: translate(-5px, -172px) scale(.69) rotate(-1deg); filter: blur(.8px); }
  82% { opacity: 1; transform: translate(-15px, -50px) scale(.91) rotate(.4deg); filter: blur(0); animation-timing-function: cubic-bezier(.2, .65, .35, 1); }
  100% { opacity: 1; transform: translate(0, 0) scale(1) rotate(0); filter: blur(0); }
}
@keyframes speed-trails {
  0% { opacity: 0; stroke-dashoffset: 26; }
  18% { opacity: .65; }
  62% { opacity: .5; }
  100% { opacity: 0; stroke-dashoffset: -100; }
}
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
  .jito-deposit :is(.halo-dim, .halo-breathe, .jito-float, .slogan-shine, .slogan-enter, .caption-enter, .eyebrow-enter, .car-enter, .speed-trails, .player-enter, .wheel-spin) { animation: none; }
}
</style>
