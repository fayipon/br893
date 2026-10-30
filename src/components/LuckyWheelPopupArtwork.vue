<script setup>
import { computed, onMounted, onUnmounted, ref, useId } from 'vue'

const props = defineProps({ artwork: { type: Object, required: true }, type: { type: String, default: 'layered' } })
const asset = path => `${import.meta.env.BASE_URL}${path}`
const id = useId()
const refId = name => `url(#${id}-${name})`
const element = ref(null)
const ready = ref(false)
const failed = ref(false)
const visible = ref(false)
const pageVisible = ref(true)
const reducedMotion = ref(false)
const animated = computed(() => props.type === 'layered' && ready.value && !failed.value && !reducedMotion.value)
let observer, preference, disposed = false
const syncVisibility = () => { pageVisible.value = !document.hidden }
const syncMotion = () => { reducedMotion.value = preference.matches }
// All timing is CSS-based, so hidden tabs and offscreen previews pause the whole sequence together.
const bulbs = [[663,460],[750,495],[834,568],[890,660],[919,764],[919,871],[883,972],[820,1062],[745,1120],[651,1159],[536,1175],[424,1158],[328,1111],[253,1040],[205,954],[182,857],[191,755],[227,660],[286,575],[365,511],[453,468]]
const rain = Array.from({ length: 56 }, (_, index) => ({
  id: index,
  ruby: index % 3 === 0,
  x: Math.round(Math.cos(index * 2.39996) * (220 + (index % 7) * 70)),
  y: Math.round(Math.sin(index * 2.39996) * (240 + (index % 6) * 65) - 150),
  size: .85 + (index % 5) * .22,
  delay: 2 + (index % 5) * .035,
  duration: .85 + (index % 4) * .12,
  angle: (index * 47) % 360,
}))

onMounted(() => {
  preference = matchMedia('(prefers-reduced-motion: reduce)')
  syncMotion()
  syncVisibility()
  preference.addEventListener('change', syncMotion)
  document.addEventListener('visibilitychange', syncVisibility)
  observer = new IntersectionObserver(entries => { visible.value = entries.some(entry => entry.isIntersecting) }, { threshold: .05 })
  observer.observe(element.value)
  Promise.all([...Object.values(props.artwork.motion), ...Object.values(props.artwork.rewards)].map(path => new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = resolve
    image.onerror = reject
    image.src = asset(path)
  }))).then(() => { if (!disposed) ready.value = true }).catch(() => { if (!disposed) failed.value = true })
})
onUnmounted(() => {
  disposed = true
  observer?.disconnect()
  preference?.removeEventListener('change', syncMotion)
  document.removeEventListener('visibilitychange', syncVisibility)
})
</script>

<template>
  <div ref="element" class="lucky-popup-artwork" :class="{ 'has-motion': animated, 'motion-running': animated && visible && pageVisible }" :data-banner-type="animated ? 'layered' : 'image'" role="img" :aria-label="artwork.alt">
    <svg :key="animated ? 'motion' : 'static'" viewBox="0 0 1122 1402" aria-hidden="true" focusable="false">
      <defs>
        <clipPath :id="`${id}-disc`"><circle r="570" /></clipPath>
        <clipPath :id="`${id}-fixed`"><ellipse cx="552" cy="801" rx="86" ry="85" /><path d="M511 414L528 395L593 392L611 417L559 519Z" /></clipPath>
        <radialGradient :id="`${id}-flash`"><stop stop-color="#fff0b4" stop-opacity=".85" /><stop offset=".35" stop-color="#ffc651" stop-opacity=".48" /><stop offset="1" stop-color="#ffb72d" stop-opacity="0" /></radialGradient>
        <radialGradient :id="`${id}-bulb-glow`"><stop stop-color="#fff5bf" stop-opacity=".95" /><stop offset=".25" stop-color="#ffdf77" stop-opacity=".8" /><stop offset="1" stop-color="#ffae22" stop-opacity="0" /></radialGradient>
        <linearGradient :id="`${id}-coin`" x2=".7" y2="1"><stop stop-color="#fff2bb" /><stop offset=".42" stop-color="#efbc55" /><stop offset=".7" stop-color="#b96d12" /><stop offset="1" stop-color="#ffe196" /></linearGradient>
        <linearGradient :id="`${id}-ruby`" x2="1" y2="1"><stop stop-color="#ffadbb" /><stop offset=".4" stop-color="#f42751" /><stop offset="1" stop-color="#710c28" /></linearGradient>
        <radialGradient :id="`${id}-shade`"><stop stop-color="#240b12" stop-opacity=".86" /><stop offset=".65" stop-color="#240b12" stop-opacity=".65" /><stop offset="1" stop-color="#240b12" stop-opacity="0" /></radialGradient>
      </defs>
      <image v-if="!animated" :href="asset(artwork.image)" width="1122" height="1402" />
      <template v-else>
        <image :href="asset(artwork.motion.backgroundImage)" width="1122" height="1402" />
        <g transform="matrix(.6 -.018 .02 .578 554 811)"><g :clip-path="refId('disc')"><g class="popup-wheel-spin"><image :href="asset(artwork.motion.wheelImage)" x="-622" y="-615" width="1254" height="1254" /></g></g></g>
        <g v-for="(bulb, index) in bulbs" :key="`bulb-${index}`" :transform="`translate(${bulb[0]} ${bulb[1]})`" :style="{ '--bulb-delay': `${-1.8 + index * 1.8 / bulbs.length}s` }">
          <circle class="bulb-dimmer" r="17" fill="#9a4909" />
          <g class="bulb-wave"><circle r="51" :fill="refId('bulb-glow')" /><circle r="10" fill="#fff5c7" /></g>
        </g>
        <g class="popup-title-drop"><image :href="asset(artwork.motion.letteringImage)" x="235" y="18" width="650" height="342" /></g>
        <!-- Keep the fixed pointer above the heading even during its entrance overshoot. -->
        <image :href="asset(artwork.motion.backgroundImage)" width="1122" height="1402" :clip-path="refId('fixed')" />
        <g transform="translate(554 811)">
          <circle class="reward-flash" r="520" :fill="refId('flash')" />
          <circle class="reward-ring" r="180" fill="none" stroke="#ffe7a4" stroke-width="9" />
          <g class="reward-rays" stroke="#ffd77d" stroke-linecap="round"><path v-for="ray in 14" :key="ray" d="M0 -115L0 -320" :transform="`rotate(${ray * 360 / 14})`" :stroke-width="ray % 2 ? 5 : 8" /></g>
        </g>
        <g v-for="particle in rain" :key="particle.id" transform="translate(554 811)">
          <g class="reward-rain" :style="{ '--burst-x': `${particle.x}px`, '--burst-y': `${particle.y}px`, '--end-x': `${particle.x * 2.7}px`, '--end-y': `${particle.y * 2.7}px`, '--delay': `${particle.delay}s`, '--duration': `${particle.duration}s` }">
            <g :transform="`scale(${particle.size})`">
            <g class="reward-tumble" :style="{ '--angle': `${particle.angle}deg`, '--delay': `${particle.delay}s`, '--duration': `${particle.duration}s` }">
              <g v-if="particle.ruby"><path d="M-28 -21L15 -30L34 -7L0 37L-34 -4Z" :fill="refId('ruby')" stroke="#ff9caa" stroke-width="2" /><path d="M-28 -21L-8 -3L15 -30M-34 -4L-8 -3L0 37L13 -4L34 -7M-8 -3L13 -4L15 -30" fill="none" stroke="#ffbec5" stroke-width="2" /></g>
              <g v-else><ellipse rx="31" ry="35" :fill="refId('coin')" stroke="#9f530e" stroke-width="4" /><ellipse rx="24" ry="28" fill="none" stroke="#ffe8a6" stroke-width="2" /><text y="13" text-anchor="middle" font-size="38" font-weight="800" fill="#985111">₹</text></g>
            </g>
            </g>
          </g>
        </g>
      </template>
      <ellipse class="reward-shade" cx="561" cy="825" rx="500" ry="350" :fill="refId('shade')" />
      <g class="reward-min"><image :href="asset(artwork.rewards.min)" x="145" y="540" width="832" height="320" /></g>
      <g class="reward-max"><image :href="asset(artwork.rewards.max)" x="40" y="795" width="1042" height="310" /></g>
    </svg>
  </div>
</template>

<style scoped>
.lucky-popup-artwork { position: relative; width: 100%; aspect-ratio: 1122 / 1402; overflow: hidden; background: #240b12; }
.lucky-popup-artwork > svg { display: block; width: 100%; height: 100%; }
.popup-wheel-spin { transform-box: view-box; transform-origin: 0 0; animation: popup-wheel-spin 12s linear infinite; }
.popup-title-drop { transform-origin: 560px 300px; animation: popup-title-drop .65s .03s linear both; }
.bulb-dimmer { animation: bulb-dimmer 1.8s var(--bulb-delay) ease-in-out infinite; }
.bulb-wave { mix-blend-mode: screen; animation: bulb-wave 1.8s var(--bulb-delay) ease-in-out infinite; }
.reward-flash { animation: reward-flash .85s 2s ease-out both; }
.reward-ring { animation: reward-burst .85s 2s ease-out both; }
.reward-rays { animation: reward-burst .7s 2.04s ease-out both; }
.reward-rain { animation: reward-fall var(--duration) var(--delay) linear both; }
.reward-tumble { animation: reward-tumble var(--duration) var(--delay) linear both; }
.reward-min { transform-origin: 561px 700px; }
.reward-max { transform-origin: 561px 950px; }
.has-motion .reward-shade { animation: reward-shade .35s 3.4s ease-out both; }
.has-motion .reward-min { animation: reward-amount .85s 3.55s both; }
.has-motion .reward-max { animation: reward-amount .95s 4.9s both; }
.lucky-popup-artwork :is(.popup-wheel-spin, .popup-title-drop, .bulb-dimmer, .bulb-wave, .reward-flash, .reward-ring, .reward-rays, .reward-rain, .reward-tumble, .reward-shade, .reward-min, .reward-max) { animation-play-state: paused; }
.motion-running :is(.popup-wheel-spin, .popup-title-drop, .bulb-dimmer, .bulb-wave, .reward-flash, .reward-ring, .reward-rays, .reward-rain, .reward-tumble, .reward-shade, .reward-min, .reward-max) { animation-play-state: running; }
@keyframes popup-wheel-spin { to { transform: rotate(360deg); } }
@keyframes popup-title-drop {
  0% { opacity: 0; transform: translateY(-220px) scale(.94); filter: blur(4px); animation-timing-function: cubic-bezier(.45, 0, .8, .55); }
  18% { opacity: 1; }
  65% { opacity: 1; transform: translateY(12px) scale(1.018, .975); filter: blur(0); animation-timing-function: ease-out; }
  82% { opacity: 1; transform: translateY(-8px) scale(.995, 1.01); animation-timing-function: ease-in-out; }
  100% { opacity: 1; transform: none; filter: blur(0); }
}
@keyframes reward-flash { 0% { opacity: 0; transform: scale(.15); } 22% { opacity: .85; } 100% { opacity: 0; transform: scale(1.35); } }
@keyframes reward-burst { 0% { opacity: 0; transform: scale(.2); } 12% { opacity: .8; } 100% { opacity: 0; transform: scale(2.4); } }
@keyframes bulb-dimmer { 0%, 42%, 100% { opacity: .58; } 15% { opacity: 0; } }
@keyframes bulb-wave { 0%, 42%, 100% { opacity: 0; } 15% { opacity: 1; } }
@keyframes reward-fall {
  0% { opacity: 0; transform: translate(0, 0) scale(.15); animation-timing-function: cubic-bezier(.12, .7, .25, 1); }
  4% { opacity: 1; }
  36% { opacity: 1; transform: translate(var(--burst-x), var(--burst-y)) scale(1); animation-timing-function: ease-out; }
  65% { opacity: 1; }
  100% { opacity: 0; transform: translate(var(--end-x), var(--end-y)) scale(.65); }
}
@keyframes reward-tumble { from { transform: rotate(var(--angle)); } to { transform: rotate(calc(var(--angle) + 500deg)); } }
@keyframes reward-shade { from { opacity: 0; } to { opacity: 1; } }
@keyframes reward-amount {
  0% { opacity: 0; transform: translateY(50px) scale(.2); animation-timing-function: cubic-bezier(.16, .8, .3, 1); }
  62% { opacity: 1; transform: translateY(-5px) scale(1.1); animation-timing-function: ease-in-out; }
  82% { opacity: 1; transform: translateY(2px) scale(.97); animation-timing-function: ease-out; }
  100% { opacity: 1; transform: none; }
}
@media (prefers-reduced-motion: reduce) { .lucky-popup-artwork * { animation: none !important; } }
</style>
