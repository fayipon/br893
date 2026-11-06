<script setup>
import { computed, onMounted, onUnmounted, ref, useId, watch } from 'vue'
import { roosterCampaigns } from '../data/pinoyRoosterMotion'

const props = defineProps({
  campaign: { type: String, required: true, validator: value => value in roosterCampaigns },
  type: { type: String, default: 'layered' },
})
const asset = name => `${import.meta.env.BASE_URL}assets/pinoyplay/${name}`
const config = computed(() => roosterCampaigns[props.campaign])
const layers = computed(() => Object.fromEntries(['background', 'rooster', 'copy'].map(part => [part, asset(`motion/${props.campaign}-${part}-v1.png`)])))
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
let observer, preference, mounted = false, started = false, generation = 0
const updateVisibility = () => { pageVisible.value = !document.hidden }
const updatePreference = () => { reducedMotion.value = preference.matches }

function preload() {
  if (!mounted || !motionEnabled.value || started) return
  started = true
  const request = ++generation
  Promise.all(Object.values(layers.value).map(src => new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = resolve
    image.onerror = reject
    image.src = src
  }))).then(() => {
    if (mounted && request === generation) ready.value = true
  }).catch(() => {
    if (mounted && request === generation) failed.value = true
  })
}

watch(motionEnabled, preload)
watch(() => props.campaign, () => {
  generation++
  ready.value = false
  failed.value = false
  started = false
  preload()
})
onMounted(() => {
  mounted = true
  updateVisibility()
  document.addEventListener('visibilitychange', updateVisibility)
  preference = matchMedia('(prefers-reduced-motion: reduce)')
  updatePreference()
  preference.addEventListener('change', updatePreference)
  observer = new IntersectionObserver(entries => {
    visible.value = entries.some(entry => entry.isIntersecting && entry.intersectionRatio >= .1)
  }, { threshold: .1 })
  observer.observe(element.value)
  preload()
})
onUnmounted(() => {
  mounted = false
  generation++
  observer?.disconnect()
  preference?.removeEventListener('change', updatePreference)
  document.removeEventListener('visibilitychange', updateVisibility)
})
</script>

<template>
  <div ref="element" class="pinoy-rooster-art" :class="{ 'is-running': running }" :data-campaign="campaign" :data-banner-type="animated ? 'layered' : 'image'" role="img" :aria-label="config.alt">
    <img v-if="!animated" :src="asset(config.artwork)" alt="" width="1882" height="836" />
    <svg v-else :key="campaign" viewBox="0 0 1882 836" aria-hidden="true" focusable="false">
      <defs>
        <clipPath v-for="group in config.textGroups" :id="`${id}-${group.id}`" :key="group.id"><path :d="group.path" /></clipPath>
      </defs>
      <image :href="layers.background" width="1882" height="836" preserveAspectRatio="none" />
      <g class="rooster-enter" :class="`rooster-enter--${campaign}`"><image :href="layers.rooster" width="1882" height="836" preserveAspectRatio="none" /></g>
      <g v-for="group in config.textGroups" :key="group.id" class="copy-enter" :class="`copy-enter--${group.kind}`" :data-motion-part="group.id" :style="{ animationDelay: group.delay, transformOrigin: group.kind === 'amount' ? config.amountOrigin : undefined }">
        <g :clip-path="`url(#${id}-${group.id})`"><image :href="layers.copy" width="1882" height="836" preserveAspectRatio="none" /></g>
      </g>
    </svg>
  </div>
</template>

<style scoped>
.pinoy-rooster-art { width: 100%; height: 100%; aspect-ratio: 1882 / 836; overflow: hidden; }
.pinoy-rooster-art > img, .pinoy-rooster-art > svg { display: block; width: 100%; height: 100%; }
.pinoy-rooster-art > svg { pointer-events: none; }
.rooster-enter, .copy-enter { transform-box: view-box; }
.copy-enter--slogan { animation: rooster-slogan-in .75s cubic-bezier(.2, .7, .25, 1) both; }
.copy-enter--amount { animation: rooster-amount-in 1.05s cubic-bezier(.2, .7, .25, 1) both; }
.rooster-enter { transform-origin: 1330px 600px; animation: rooster-slide-in .95s .22s cubic-bezier(.2, .7, .25, 1) both; }
.rooster-enter--payday { animation-name: rooster-leap-in; animation-delay: .18s; }
.rooster-enter--deposits { animation-name: rooster-welcome-in; animation-delay: .26s; }
.rooster-enter, .copy-enter { animation-play-state: paused; }
.is-running :is(.rooster-enter, .copy-enter) { animation-play-state: running; }
@keyframes rooster-slogan-in {
  from { opacity: 0; transform: translateX(-125px); }
  to { opacity: 1; transform: translateX(0); }
}
@keyframes rooster-amount-in {
  0% { opacity: 0; transform: scale(.35); }
  60% { opacity: 1; transform: scale(1.08); }
  82% { opacity: 1; transform: scale(.985); }
  100% { opacity: 1; transform: scale(1); }
}
@keyframes rooster-slide-in {
  from { opacity: 0; transform: translate(220px, 25px) scale(.92); }
  to { opacity: 1; transform: translate(0, 0) scale(1); }
}
@keyframes rooster-leap-in {
  0% { opacity: 0; transform: translate(90px, 210px) rotate(-7deg) scale(.86); }
  72% { opacity: 1; transform: translate(-7px, -14px) rotate(1deg) scale(1.015); }
  100% { opacity: 1; transform: translate(0, 0) rotate(0) scale(1); }
}
@keyframes rooster-welcome-in {
  from { opacity: 0; transform: translate(210px, 55px) scale(.88); }
  to { opacity: 1; transform: translate(0, 0) scale(1); }
}
@media (prefers-reduced-motion: reduce) { .rooster-enter, .copy-enter { animation: none; } }
</style>
