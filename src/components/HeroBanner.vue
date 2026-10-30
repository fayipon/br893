<script setup>
import { computed, onMounted, onUnmounted, ref, useId, watch } from 'vue'
import JitoDepositBanner from './JitoDepositBanner.vue'

const props = defineProps({
  banner: { type: Object, required: true },
  type: { type: String, default: 'layered' },
  loading: { type: String, default: 'eager' },
  priority: { type: String, default: 'auto' },
})
const asset = path => `${import.meta.env.BASE_URL}${path}`
const outlineId = useId()
const frameStyle = layer => {
  const style = Object.fromEntries(Object.entries(layer.frame).map(([key, value]) => [key, `${value}%`]))
  if (layer.rotation) {
    const [x, y] = layer.rotationOrigin
    style.rotate = `${layer.rotation}deg`
    style.transformOrigin = `${(x - layer.frame.left) / layer.frame.width * 100}% ${(y - layer.frame.top) / layer.frame.height * 100}%`
  }
  return style
}
const layered = computed(() => props.type === 'layered' && props.banner.backgroundImage && props.banner.lettering?.length)
const source = computed(() => asset(layered.value ? props.banner.backgroundImage : props.banner.image))
const element = ref(null)
const visible = ref(false)
const backgroundReady = ref(false)
const loadedLayers = ref(0)
const ready = computed(() => visible.value && backgroundReady.value && loadedLayers.value >= (props.banner.lettering?.length || 0))
let observer

watch([source, () => props.type], () => {
  backgroundReady.value = false
  loadedLayers.value = 0
})

onMounted(() => {
  observer = new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting)) {
      visible.value = true
      observer.disconnect()
    }
  }, { threshold: .2 })
  if (element.value) observer.observe(element.value)
})
watch(element, target => {
  observer?.disconnect()
  if (target && observer) observer.observe(target)
}, { flush: 'post' })
onUnmounted(() => observer?.disconnect())
</script>

<template>
  <JitoDepositBanner v-if="banner.variant === 'jito-deposit'" :banner="banner" :type="type" :loading="loading" :priority="priority" />
  <div v-else ref="element" class="hero-banner" :class="`hero-banner-${banner.variant}`" :data-banner-type="layered ? 'layered' : 'image'" role="img" :aria-label="banner.alt">
    <svg v-if="layered && banner.variant === 'vip'" class="hero-filter-defs" width="0" height="0" aria-hidden="true" focusable="false">
      <defs>
        <filter :id="outlineId" x="-.05" y="-.05" width="1.1" height="1.1" primitiveUnits="objectBoundingBox" color-interpolation-filters="sRGB">
          <feComponentTransfer in="SourceAlpha" result="letter-edge"><feFuncA type="discrete" tableValues="0 0 0 1 1" /></feComponentTransfer>
          <feMorphology in="letter-edge" operator="dilate" radius=".0038 .0095" result="outer-edge" />
          <feFlood flood-color="#f5d68d" /><feComposite in2="outer-edge" operator="in" result="gold-rim" />
          <feMorphology in="letter-edge" operator="dilate" radius=".0025 .00625" result="inner-edge" />
          <feFlood flood-color="#391019" /><feComposite in2="inner-edge" operator="in" result="dark-outline" />
          <feMerge><feMergeNode in="gold-rim" /><feMergeNode in="dark-outline" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
    </svg>
    <img :key="source" class="hero-background" :src="source" alt="" width="1983" height="793" :loading="loading" :fetchpriority="priority" @load="backgroundReady = true" />
    <div v-if="layered" class="hero-lettering" :class="{ 'is-ready': ready }" aria-hidden="true">
      <div v-for="layer in banner.lettering" :key="layer.image" class="hero-lettering-layer" :class="`hero-lettering-${layer.id}`" :style="{ transformOrigin: layer.origin }">
        <div class="hero-lettering-artwork" :style="frameStyle(layer)">
          <img :src="asset(layer.image)" :style="banner.variant === 'vip' && layer.id === 'amount' ? { filter: `url(#${outlineId})` } : undefined" alt="" width="1983" height="793" :loading="loading" @load="loadedLayers++" />
          <span v-if="layer.id === 'amount'" class="hero-lettering-shine" :style="{ maskImage: `url('${asset(layer.image)}')`, WebkitMaskImage: `url('${asset(layer.image)}')` }" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hero-banner { position: relative; isolation: isolate; width: 100%; aspect-ratio: 1983 / 793; overflow: hidden; text-align: left; }
.hero-banner .hero-background, .hero-lettering-artwork > img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: fill; }
.hero-lettering-artwork { position: absolute; }
.hero-filter-defs { position: absolute; pointer-events: none; }
.hero-lettering, .hero-lettering-layer { position: absolute; inset: 0; pointer-events: none; }
.hero-lettering { opacity: 0; }
.hero-lettering.is-ready { opacity: 1; }
.hero-lettering-headline { z-index: 1; }
.hero-lettering-amount { z-index: 2; }
.hero-lettering-caption { z-index: 3; }
.is-ready .hero-lettering-headline { animation: lettering-headline-in .7s cubic-bezier(.16, 1, .3, 1) both; }
.is-ready .hero-lettering-amount { animation: lettering-amount-in .95s .14s cubic-bezier(.16, 1, .3, 1) both; }
.is-ready .hero-lettering-caption { animation: lettering-caption-in .65s .36s cubic-bezier(.16, 1, .3, 1) both; }
.hero-lettering-shine { position: absolute; inset: 0; opacity: 0; background: linear-gradient(110deg, transparent 34%, rgb(255 248 219 / 12%) 43%, rgb(255 255 255 / 70%) 49%, rgb(255 247 218 / 14%) 55%, transparent 64%); background-size: 260% 100%; background-position: 160% 0; mask-size: 100% 100%; mask-repeat: no-repeat; -webkit-mask-size: 100% 100%; -webkit-mask-repeat: no-repeat; mix-blend-mode: screen; }
.is-ready .hero-lettering-shine { animation: lettering-metal-shine 1.45s .95s ease-in-out both; }
@keyframes lettering-headline-in {
  from { opacity: 0; transform: translateX(-3%); filter: blur(2px); }
  to { opacity: 1; transform: translateX(0); filter: blur(0); }
}
@keyframes lettering-amount-in {
  0% { opacity: 0; transform: translateY(4%) scale(.88); filter: blur(2px); }
  65% { opacity: 1; transform: translateY(-.4%) scale(1.025); filter: blur(0); }
  100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
}
@keyframes lettering-caption-in {
  from { opacity: 0; transform: translateY(3%); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes lettering-metal-shine {
  0% { opacity: 0; background-position: 160% 0; }
  24% { opacity: .75; }
  72% { opacity: .75; }
  100% { opacity: 0; background-position: -60% 0; }
}
@media (prefers-reduced-motion: reduce) {
  .is-ready .hero-lettering-layer { animation: none; opacity: 1; transform: none; filter: none; }
  .is-ready .hero-lettering-shine { animation: none; opacity: 0; }
}
</style>
