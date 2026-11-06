<script setup>
import { ref } from 'vue'
import PinoyBanner from './PinoyBanner.vue'
import PinoyIcon from './PinoyIcon.vue'
import BannerTypeSwitch from './BannerTypeSwitch.vue'
import GameBrightnessControl from './GameBrightnessControl.vue'
import { useGameBrightness } from '../gameBrightness'
import { useBannerType } from '../bannerType'
import { motionCampaigns } from '../data/pinoyCampaignMotion'
import data from '../data/pinoyplay.json'
import '../styles/pinoyplay.css'
const baseUrl = import.meta.env.BASE_URL
const { gameBrightness } = useGameBrightness()
const { bannerType } = useBannerType()
const replayCounts = ref({ weekly: 0, payday: 0, deposits: 0, carnival: 0 })
const colors = [{ name: 'Pinoy Navy', hex: '#123474' }, { name: 'Play Red', hex: '#FA2541' }, { name: 'White', hex: '#FFFFFF' }, { name: 'Canvas', hex: '#F1F4FA' }, { name: 'Slate', hex: '#71809B' }]
</script>

<template>
  <main class="pinoy-design" :style="{ '--game-brightness': gameBrightness / 100 }">
    <header class="pinoy-design-header"><img :src="`${baseUrl}assets/pinoyplay/logo.webp`" alt="PinoyPlay" width="200" height="43" /><a :href="`${baseUrl}?page=pinoyplay`"><PinoyIcon name="left" :size="16" /> Back to site</a></header>
    <p class="pinoy-design-eyebrow">DESIGN LIBRARY / 03</p><h1>PinoyPlay<span>.</span></h1><p class="pinoy-design-intro">Good games. Brighter days. A red, white and blue homepage.</p>
    <section><h2>01 / Colors</h2><div class="pinoy-color-grid"><article v-for="color in colors" :key="color.hex"><span :style="{ background: color.hex }" /><strong>{{ color.name }}</strong><code>{{ color.hex }}</code></article></div></section>
    <section><h2>02 / Typography & icons</h2><div class="pinoy-type-sample"><strong>Play more together.</strong><p>Arial · clean, readable type at every screen size.</p></div><div class="pinoy-icon-samples"><div v-for="item in ['home', 'gift', 'rebate', 'cashback', 'wheel', 'calendar', 'bag', 'wallet', 'people', 'profile']" :key="item"><PinoyIcon :name="item" :size="28" /><small>{{ item }}</small></div></div></section>
    <section>
      <h2>03 / Featured banners</h2><BannerTypeSwitch />
      <div class="pinoy-design-banners">
        <PinoyBanner bonus /><PinoyBanner />
        <article v-for="(campaign, key) in motionCampaigns" :key="key" class="pinoy-motion-preview">
          <div class="pinoy-motion-preview-header"><h3>{{ campaign.label }}</h3><button type="button" :disabled="bannerType !== 'layered'" :aria-label="`Replay ${campaign.label} motion`" @click="replayCounts[key]++">Replay motion <span aria-hidden="true">↻</span></button></div>
          <PinoyBanner :key="`${key}-${replayCounts[key]}`" :weekly="key === 'weekly'" :payday="key === 'payday'" :deposits="key === 'deposits'" :royal="key === 'carnival'" />
        </article>
      </div>
    </section>
    <section><h2>04 / Game cards</h2><GameBrightnessControl /><div class="pinoy-game-grid pinoy-design-games"><div v-for="game in data.groups[0].games.slice(0, 3)" :key="game.image" class="pinoy-game-card"><img :src="`${baseUrl}${game.image}`" :alt="game.name" width="320" height="320" /><span>{{ game.name }}</span></div></div></section>
    <a class="pinoy-primary" :href="`${baseUrl}?page=pinoyplay`">Open homepage <PinoyIcon name="arrow" :size="18" /></a>
  </main>
</template>
