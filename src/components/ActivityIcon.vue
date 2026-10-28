<script setup>
import { useId } from 'vue'

defineProps({ src: String, motion: String })
const id = useId()
const fragment = name => `url(#${id}-${name})`
</script>

<template>
  <svg v-if="motion === 'spin'" class="activity-icon activity-wheel" viewBox="0 0 1280 1280" aria-hidden="true" focusable="false">
    <defs>
      <clipPath :id="`${id}-wheel-face`"><circle cx="638" cy="626" r="396" /></clipPath>
      <clipPath :id="`${id}-wheel-hub`"><circle cx="638" cy="626" r="92" /></clipPath>
      <clipPath :id="`${id}-wheel-pointer`"><path d="M480 40H800V150L675 298H590L480 150Z" /></clipPath>
      <linearGradient :id="`${id}-cream`" x1="0" y1="0" x2="0" y2="1">
        <stop stop-color="#fffef4" /><stop offset="1" stop-color="#f7dfc9" />
      </linearGradient>
    </defs>
    <image :href="src" width="1280" height="1280" />
    <g :clip-path="fragment('wheel-face')">
      <g class="activity-moving activity-wheel-rotor">
        <image :href="src" width="1280" height="1280" />
        <!-- Restore the cream wedge hidden by the pointer in the source image. -->
        <path d="M638 626L486.5 260.1A396 396 0 0 1 789.5 260.1Z" :fill="fragment('cream')" stroke="#1b0822" stroke-width="22" stroke-linejoin="round" />
      </g>
    </g>
    <image :href="src" width="1280" height="1280" :clip-path="fragment('wheel-hub')" />
    <image :href="src" width="1280" height="1280" :clip-path="fragment('wheel-pointer')" />
  </svg>

  <svg v-else-if="motion === 'open-close'" class="activity-icon activity-chest" viewBox="0 0 1280 1280" aria-hidden="true" focusable="false">
    <defs>
      <clipPath :id="`${id}-chest-body`"><rect y="660" width="1280" height="620" /></clipPath>
      <clipPath :id="`${id}-chest-coins`"><rect y="500" width="1280" height="180" /></clipPath>
      <clipPath :id="`${id}-chest-lid`"><rect width="1280" height="500" /></clipPath>
    </defs>
    <image :href="src" width="1280" height="1280" :clip-path="fragment('chest-body')" />
    <g class="activity-moving activity-chest-coins">
      <image :href="src" width="1280" height="1280" :clip-path="fragment('chest-coins')" />
    </g>
    <g class="activity-moving activity-chest-lid">
      <image :href="src" width="1280" height="1280" :clip-path="fragment('chest-lid')" />
    </g>
  </svg>

  <img v-else :src="src" :class="['activity-icon', 'activity-moving', `activity-motion-${motion}`]" alt="" draggable="false" />
</template>

<style scoped>
.activity-wheel-rotor {
  transform-box: view-box;
  transform-origin: 638px 626px;
  animation: wheel-turn 7s linear infinite;
}
.activity-chest-lid {
  transform-box: view-box;
  transform-origin: 640px 500px;
  animation: chest-open-close 4.8s ease-in-out infinite;
}
.activity-chest-coins { animation: chest-reveal 4.8s ease-in-out infinite; }

@keyframes wheel-turn { to { transform: rotate(360deg); } }
@keyframes chest-open-close {
  0%, 15%, 85%, 100% { transform: translateY(185px) rotateX(38deg); }
  38%, 68% { transform: translateY(0) rotateX(0); }
}
@keyframes chest-reveal {
  0%, 18%, 83%, 100% { opacity: 0; }
  32%, 70% { opacity: 1; }
}
</style>
