<script setup>
import { computed, nextTick, onMounted, ref } from 'vue'
import UiIcon from './UiIcon.vue'
import HeroBanner from './HeroBanner.vue'
import BannerTypeSwitch from './BannerTypeSwitch.vue'
import GameBrightnessControl from './GameBrightnessControl.vue'
import DesignIcons from './DesignIcons.vue'
import { useBannerType } from '../bannerType'
import data from '../data/home.json'

const homeUrl = import.meta.env.BASE_URL
const { bannerType } = useBannerType()
const asset = path => `${homeUrl}${path}`
const sections = ['Colors', 'Typography', 'Buttons', 'Icons', 'Banners']
const colors = [
  { name: 'Midnight', value: '#19131F', color: 'var(--web-background)', role: 'Desktop canvas' },
  { name: 'Deep plum', value: '#32233F', color: 'var(--mobile-base)', role: 'Main surface' },
  { name: 'Soft violet', value: '#503B62', color: 'var(--surface-raised)', role: 'Raised surfaces' },
  { name: 'Rose', value: '#B05A85', color: '#b05a85', role: 'Primary actions' },
  { name: 'Lavender', value: '#CFB5EE', color: 'var(--accent)', role: 'Accents & focus' },
  { name: 'Ivory', value: '#F7F2FA', color: 'var(--text-primary)', role: 'Primary text' },
]
const typeWeight = ref(800)
const selectedControl = ref('Registro')
const controlDetails = {
  Registro: { role: 'Primary action', detail: 'Rose gradient · White text · Soft highlight' },
  Entrar: { role: 'Secondary action', detail: 'Violet surface · Light border · Soft highlight' },
  'Ver tudo': { role: 'Section action', detail: 'Muted rose · Compact shape · 14px text' },
  Menu: { role: 'Icon button', detail: 'Rounded square · Ivory icon · Violet surface' },
}
const selectedDetail = computed(() => controlDetails[selectedControl.value])
const artworkDialog = ref(null)
const selectedArtwork = ref(null)
const motionReplay = ref(0)

async function openArtwork(artwork) {
  selectedArtwork.value = artwork
  await nextTick()
  artworkDialog.value.showModal()
}

onMounted(() => {
  document.title = 'BR893 · Design'
  const section = location.hash.slice(1)
  if (sections.some(name => name.toLowerCase() === section)) document.getElementById(section)?.scrollIntoView()
})
</script>

<template>
  <div class="design-page">
    <a class="skip-link" href="#design-content">Skip to design library</a>
    <header class="design-header">
      <a class="design-wordmark" :href="homeUrl" aria-label="BR893 home"><span class="design-mark">B.</span><span>BR893 <small>DESIGN</small></span></a>
      <nav aria-label="Design sections"><a v-for="section in sections" :key="section" :href="`#${section.toLowerCase()}`">{{ section }}</a></nav>
      <a class="design-back" :href="homeUrl"><UiIcon name="left" :size="16" /><span>Back to site</span></a>
    </header>

    <main id="design-content" class="design-content">
      <section class="design-intro" aria-labelledby="design-title">
        <div>
          <p class="design-eyebrow">BR893 / VISUAL LIBRARY</p>
          <h1 id="design-title">Design<span>.</span></h1>
          <p class="design-lead">The colors, type and details<br />that bring BR893 together.</p>
        </div>
        <div class="design-palette-study" aria-hidden="true">
          <div class="design-palette-bars"><span v-for="(color, index) in colors" :key="color.name" :style="{ background: color.color, '--bar-index': index }" /></div>
          <p>Deep purple. Soft rose. A little light.</p>
        </div>
      </section>

      <section id="colors" class="design-section" aria-labelledby="colors-title">
        <header class="design-section-heading"><div><span class="design-section-number">01</span><h2 id="colors-title">Colors</h2></div><p>A quiet foundation with warm accents.</p></header>
        <div class="design-color-grid">
          <figure v-for="color in colors" :key="color.name" class="design-color">
            <div class="design-color-swatch" :style="{ background: color.color }" />
            <figcaption><strong>{{ color.name }}</strong><code>{{ color.value }}</code><span>{{ color.role }}</span></figcaption>
          </figure>
        </div>
        <div class="design-gradient-row">
          <div class="design-gradient-sample design-rose-gradient"><span>Action gradient</span><code>#B05A85 → #A7507B</code></div>
          <div class="design-gradient-sample design-surface-gradient"><span>Page gradient</span><code>#432F56 → #32233F</code></div>
        </div>
      </section>

      <section id="typography" class="design-section" aria-labelledby="type-title">
        <header class="design-section-heading"><div><span class="design-section-number">02</span><h2 id="type-title">Typography</h2></div><p>Rounded forms. Clear hierarchy.</p></header>
        <div class="design-type-grid">
          <article class="design-type-specimen">
            <div class="design-specimen-top"><span>Baloo 2</span><span>VARIABLE / 400–800</span></div>
            <p class="design-type-large" :style="{ fontWeight: typeWeight }">Aa<span>Bb</span></p>
            <p class="design-type-alphabet" :style="{ fontWeight: typeWeight }">ABCDEFGHIJKLMNOPQRSTUVWXYZ<br />abcdefghijklmnopqrstuvwxyz<br />0123456789 R$ % &amp;</p>
            <div class="design-weight-picker" role="group" aria-label="Font weight"><button v-for="weight in [400, 600, 800]" :key="weight" :aria-pressed="typeWeight === weight" @click="typeWeight = weight">{{ weight }}</button></div>
          </article>
          <div class="design-type-scale">
            <div><span class="design-sample-label">DISPLAY · 800</span><p class="design-display-sample">Ganhe mais.</p></div>
            <div><span class="design-sample-label">ACTION · 800</span><p class="design-action-sample">Entrar &amp; Registro</p></div>
            <div><span class="design-sample-label">BODY · 400</span><p class="design-body-sample">Explore os jogos e descubra seus favoritos.</p></div>
            <div><span class="design-sample-label">SECONDARY · 14px / 400</span><p class="design-secondary-sample">6 games</p></div>
          </div>
        </div>
      </section>

      <section id="buttons" class="design-section" aria-labelledby="buttons-title">
        <header class="design-section-heading"><div><span class="design-section-number">03</span><h2 id="buttons-title">Buttons</h2></div><p>Soft light, restrained borders.</p></header>
        <div class="design-button-board">
          <div class="design-button-samples">
            <div class="auth-buttons design-auth-samples"><button class="secondary-button glossy-control" :aria-pressed="selectedControl === 'Entrar'" @click="selectedControl = 'Entrar'">Entrar</button><button class="primary-button register-button glossy-control" :aria-pressed="selectedControl === 'Registro'" @click="selectedControl = 'Registro'">Registro</button></div>
            <button class="view-all" :aria-pressed="selectedControl === 'Ver tudo'" @click="selectedControl = 'Ver tudo'">Ver tudo</button>
            <button class="design-menu-sample" aria-label="Menu sample" :aria-pressed="selectedControl === 'Menu'" @click="selectedControl = 'Menu'"><span class="menu-symbol glossy-control"><UiIcon name="menu" :size="24" /></span></button>
          </div>
          <div class="design-control-detail" aria-live="polite"><span class="design-sample-label">{{ selectedDetail.role }}</span><strong>{{ selectedControl }}</strong><p>{{ selectedDetail.detail }}</p></div>
        </div>
        <p class="design-caption">Select a button to view its visual role.</p>
      </section>

      <section id="icons" class="design-section" aria-labelledby="icons-title">
        <header class="design-section-heading"><div><span class="design-section-number">04</span><h2 id="icons-title">Icons &amp; motion</h2></div><p>Small details, full of character.</p></header>
        <DesignIcons />
      </section>

      <section id="banners" class="design-section" aria-labelledby="banners-title">
        <header class="design-section-heading"><div><span class="design-section-number">05</span><h2 id="banners-title">Banners</h2></div><p>Cinematic artwork. One clear message.</p></header>
        <div class="design-banner-controls"><BannerTypeSwitch class="design-banner-switch" /><button class="design-motion-replay" :disabled="bannerType === 'image'" @click="motionReplay++">Replay motion</button></div>
        <p class="design-banner-mode-note">Original lettering, layered for motion. Main banners only; this choice also applies to the homepage.</p>
        <GameBrightnessControl class="design-game-brightness" />
        <div class="design-gallery-label"><h3>Main banners</h3><span>{{ data.banners.length }} artworks</span></div>
        <div class="design-banner-grid">
          <button v-for="(banner, index) in data.banners" :key="banner.image" class="design-artwork" :aria-label="`Preview ${banner.title}`" @click="openArtwork(banner)"><HeroBanner :key="motionReplay" :banner="banner" :type="bannerType" loading="lazy" /><span class="design-artwork-caption"><span><small>0{{ index + 1 }}</small>{{ banner.title }}</span><UiIcon name="right" :size="17" /></span></button>
        </div>
        <div class="design-gallery-label design-gallery-label-small"><h3>Small banners</h3><span>{{ data.promotions.length }} artworks</span></div>
        <div class="design-promo-grid">
          <button v-for="promotion in data.promotions" :key="promotion.image" class="design-artwork" :aria-label="`Preview ${promotion.title}`" @click="openArtwork(promotion)"><img :src="asset(promotion.image)" :alt="promotion.alt" width="1983" height="793" loading="lazy" /><span class="design-artwork-caption"><span>{{ promotion.title }}</span><UiIcon name="right" :size="17" /></span></button>
        </div>
        <p class="design-caption">Select an artwork for a closer look.</p>
      </section>

      <footer class="design-footer"><span>BR893 <span class="design-footer-dot">/</span> Design library</span><a :href="homeUrl">Back to site <UiIcon name="right" :size="16" /></a></footer>
    </main>

    <dialog ref="artworkDialog" class="design-artwork-dialog" aria-labelledby="artwork-title" @click="event => { if (event.target === event.currentTarget) artworkDialog.close() }" @close="selectedArtwork = null">
      <template v-if="selectedArtwork"><header><h2 id="artwork-title">{{ selectedArtwork.title }}</h2><button aria-label="Close artwork" autofocus @click="artworkDialog.close()"><UiIcon name="close" :size="23" /></button></header><HeroBanner v-if="selectedArtwork.backgroundImage" :banner="selectedArtwork" :type="bannerType" /><img v-else :src="asset(selectedArtwork.image)" :alt="selectedArtwork.alt" /><p class="design-artwork-description">{{ selectedArtwork.alt }}</p></template>
    </dialog>
  </div>
</template>

<style scoped>
.design-page { min-height: 100svh; background: radial-gradient(ellipse 900px 600px at 85% 0, rgb(176 90 133 / 10%), transparent 75%), var(--web-background); }
.design-page a { color: inherit; text-decoration: none; }
.design-header { display: flex; align-items: center; gap: 32px; min-height: 88px; width: min(1240px, calc(100% - 96px)); margin-inline: auto; border-bottom: 1px solid var(--panel-border); }
.design-wordmark { display: flex; align-items: center; gap: 12px; font-size: 19px; font-weight: 800; white-space: nowrap; }
.design-mark { display: grid; place-items: center; width: 36px; height: 36px; border: 1px solid rgb(221 166 194 / 32%); border-radius: 11px; color: #f7d8e8; background: var(--pink-action-gradient); font-size: 25px; }
.design-wordmark small { margin-left: 9px; color: var(--text-muted); font-size: 10px; font-weight: 500; letter-spacing: .15em; }
.design-header nav { display: flex; gap: 27px; margin-left: auto; color: var(--text-secondary); font-size: 14px; }
.design-header nav a { padding-block: 12px; }
.design-back { display: inline-flex; align-items: center; gap: 7px; min-height: 39px; padding: 7px 13px; border: 1px solid var(--panel-border); border-radius: 9px; font-size: 13px; }
.design-content { width: min(1120px, calc(100% - 96px)); margin-inline: auto; }
.design-intro { display: grid; grid-template-columns: 1fr 1fr; align-items: center; gap: 60px; padding: 76px 0 70px; }
.design-eyebrow, .design-sample-label { color: var(--text-muted); font-size: 11px; letter-spacing: .13em; font-weight: 500; }
.design-intro h1 { margin: 10px 0 7px; font-size: clamp(76px, 8vw, 112px); font-weight: 600; line-height: 1.05; letter-spacing: -.045em; }
.design-intro h1 > span { color: #bd7499; }
.design-lead { color: var(--text-secondary); font-size: 19px; line-height: 1.5; }
.design-palette-study { padding: 12px 0 0 42px; }
.design-palette-bars { display: flex; align-items: center; gap: 10px; height: 174px; }
.design-palette-bars span { flex: 1; height: calc(124px + var(--bar-index) * 9px); border: 1px solid rgb(255 255 255 / 10%); border-radius: 50px; transform: rotate(14deg); box-shadow: 0 12px 28px rgb(0 0 0 / 14%); }
.design-palette-study p { margin-top: 28px; text-align: right; color: var(--text-muted); font-size: 12px; }
.design-section { padding: 45px 0 54px; border-top: 1px solid var(--panel-border); scroll-margin-top: 24px; }
.design-section-heading { display: flex; align-items: center; justify-content: space-between; gap: 24px; margin-bottom: 27px; }
.design-section-heading > div { display: flex; align-items: baseline; gap: 16px; }
.design-section-number { color: #be7b9e; font-size: 12px; }
.design-section-heading h2 { font-size: 32px; font-weight: 600; letter-spacing: -.025em; }
.design-section-heading > p { color: var(--text-muted); font-size: 14px; }
.design-color-grid { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 15px; }
.design-color { margin: 0; }
.design-color-swatch { height: 130px; border: 1px solid rgb(255 255 255 / 12%); border-radius: 13px; }
.design-color figcaption { display: flex; flex-direction: column; padding: 13px 2px 0; }
.design-color strong { font-size: 15px; font-weight: 600; }
.design-color code { margin-top: 3px; color: var(--text-secondary); font-size: 11px; }
.design-color figcaption > span { margin-top: 6px; color: var(--text-muted); font-size: 12px; }
.design-gradient-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 28px; }
.design-gradient-sample { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 10px; min-height: 75px; padding: 17px 22px; border: 1px solid rgb(255 255 255 / 10%); border-radius: 12px; font-size: 14px; }
.design-gradient-sample code { color: #f0dce8; font-size: 11px; }
.design-rose-gradient { background: var(--pink-action-gradient); }
.design-surface-gradient { background: linear-gradient(135deg, var(--mobile-gradient-top), var(--mobile-gradient-bottom)); }
.design-type-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.design-type-specimen { padding: 28px 34px; border: 1px solid var(--panel-border); border-radius: 16px; background: linear-gradient(145deg, #39283f, #251c2f); }
.design-specimen-top { display: flex; align-items: center; justify-content: space-between; gap: 15px; font-size: 18px; }
.design-specimen-top > span + span { color: var(--text-muted); font-size: 10px; letter-spacing: .1em; }
.design-type-large { margin: 18px 0 2px; font-size: clamp(76px, 8vw, 120px); line-height: 1.2; letter-spacing: -.055em; }
.design-type-large > span { color: #bd7499; }
.design-type-alphabet { color: var(--text-secondary); font-size: 15px; letter-spacing: .07em; overflow-wrap: anywhere; }
.design-weight-picker { display: inline-flex; gap: 5px; margin-top: 23px; padding: 4px; border: 1px solid var(--panel-border); border-radius: 10px; }
.design-weight-picker button { min-width: 55px; min-height: 32px; border-radius: 6px; color: var(--text-secondary); font-size: 13px; }
.design-weight-picker button[aria-pressed='true'] { color: var(--text-primary); background: var(--surface-raised); }
.design-type-scale { display: flex; flex-direction: column; justify-content: center; padding: 4px 28px; }
.design-type-scale > div { padding: 14px 0; border-bottom: 1px solid var(--panel-border); }
.design-type-scale > div:last-child { border: 0; }
.design-display-sample { font-size: 41px; font-weight: 800; line-height: 1.2; }
.design-action-sample { margin-top: 3px; font-size: 19px; font-weight: 800; }
.design-body-sample { margin-top: 5px; font-size: 16px; }
.design-secondary-sample { margin-top: 5px; color: var(--text-secondary); font-size: 14px; }
.design-button-board { display: grid; grid-template-columns: 1.4fr 1fr; min-height: 180px; border: 1px solid var(--panel-border); border-radius: 16px; background: var(--mobile-base); }
.design-button-samples { display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 26px; padding: 36px 26px; }
.design-auth-samples { margin-left: 0; }
.design-menu-sample { min-width: 44px; min-height: 44px; }
.design-control-detail { display: flex; flex-direction: column; justify-content: center; padding: 28px; border-left: 1px solid var(--panel-border); }
.design-control-detail strong { margin-block: 3px; font-size: 25px; font-weight: 600; }
.design-control-detail p { color: var(--text-secondary); font-size: 13px; }
.design-caption { margin-top: 13px; color: var(--text-muted); font-size: 12px; }
.design-gallery-label { display: flex; align-items: center; justify-content: space-between; margin-bottom: 15px; }
.design-banner-mode-note { margin: 9px 0 25px; color: var(--text-muted); font-size: 12px; }
.design-banner-controls { display: flex; align-items: center; gap: 16px; }
.design-banner-switch { flex: 1; }
.design-game-brightness { margin: -9px 0 25px; }
.design-motion-replay { min-height: 44px; padding: 10px 16px; border: 1px solid rgb(218 195 237 / 25%); border-radius: 10px; color: var(--text-primary); background: var(--surface-raised); font-size: 14px; white-space: nowrap; }
.design-motion-replay:disabled { opacity: .4; }
.design-gallery-label h3 { margin: 0; font-size: 16px; font-weight: 500; }
.design-gallery-label > span { color: var(--text-muted); font-size: 12px; }
.design-banner-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 26px 22px; }
.design-artwork { display: flex; flex-direction: column; align-items: stretch; min-width: 0; text-align: left; }
.design-artwork > img { width: 100%; height: auto; aspect-ratio: 1983 / 793; object-fit: contain; border: 1px solid rgb(221 201 163 / 27%); border-radius: 12px; background: var(--mobile-base); }
.design-artwork > .hero-banner { border: 1px solid rgb(221 201 163 / 27%); border-radius: 12px; background: var(--mobile-base); }
.design-artwork-caption { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 12px 1px 0; color: var(--text-secondary); font-size: 14px; }
.design-artwork-caption > span { display: flex; align-items: baseline; gap: 12px; }
.design-artwork-caption small { color: var(--text-muted); font-size: 11px; }
.design-artwork-caption > svg { flex-shrink: 0; color: #bd7499; }
.design-gallery-label-small { margin-top: 36px; }
.design-promo-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 18px; }
.design-footer { display: flex; align-items: center; justify-content: space-between; gap: 20px; padding: 28px 0 36px; border-top: 1px solid var(--panel-border); color: var(--text-muted); font-size: 13px; }
.design-footer-dot { padding-inline: 10px; color: #bd7499; }
.design-footer a { display: inline-flex; align-items: center; gap: 8px; }
.design-artwork-dialog { width: min(1200px, calc(100vw - 48px)); max-width: none; max-height: calc(100dvh - 48px); border-radius: 16px; background: var(--web-background); }
.design-artwork-dialog header { display: flex; align-items: center; justify-content: space-between; gap: 20px; padding: 14px 22px; }
.design-artwork-dialog h2 { font-size: 20px; font-weight: 600; }
.design-artwork-dialog header button { flex-shrink: 0; width: 44px; height: 44px; }
.design-artwork-dialog > img { width: 100%; height: auto; }
.design-artwork-description { padding: 17px 22px 22px; color: var(--text-secondary); font-size: 14px; }
@media (max-width: 1000px) {
  .design-header { flex-wrap: wrap; gap: 16px 20px; width: calc(100% - 48px); padding-block: 18px; }
  .design-header nav { order: 3; width: 100%; justify-content: space-between; margin: 0; }
  .design-back { margin-left: auto; }
  .design-header nav { gap: 16px; }
  .design-content { width: calc(100% - 64px); }
  .design-intro { gap: 25px; }
  .design-palette-study { padding-left: 10px; }
  .design-color-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px 16px; }
  .design-color-swatch { height: 115px; }
  .design-button-board { grid-template-columns: 1fr; }
  .design-control-detail { border-left: 0; border-top: 1px solid var(--panel-border); padding: 20px 28px; }
}
@media (max-width: 640px) {
  .design-banner-controls { flex-wrap: wrap; gap: 10px; }.design-banner-switch { flex-basis: 100%; }
  .design-header { flex-wrap: wrap; gap: 16px; padding: 20px 0 12px; }
  .design-header nav { order: 3; width: 100%; justify-content: space-between; margin: 0; }
  .design-back { margin-left: auto; }
  .design-wordmark small { display: none; }
  .design-content { width: calc(100% - 40px); }
  .design-intro { grid-template-columns: 1fr; gap: 30px; padding: 44px 0; }
  .design-palette-study { max-width: 360px; padding: 0 10px; }
  .design-palette-bars { height: 100px; }
  .design-palette-bars span { height: calc(65px + var(--bar-index) * 6px); }
  .design-palette-study p { margin-top: 18px; text-align: left; }
  .design-section { padding: 30px 0 38px; }
  .design-section-heading { align-items: flex-start; flex-direction: column; gap: 5px; margin-bottom: 22px; }
  .design-color-grid { gap: 23px 12px; }
  .design-color-swatch { height: 90px; }
  .design-color strong { font-size: 14px; }
  .design-gradient-row, .design-type-grid, .design-banner-grid, .design-promo-grid { grid-template-columns: 1fr; }
  .design-type-specimen { padding: 23px; }
  .design-type-large { font-size: 100px; }
  .design-type-scale { padding-inline: 8px; }
  .design-button-samples { gap: 20px; padding: 30px 18px; }
  .design-auth-samples button { min-width: 0; width: auto; }
  .design-footer { font-size: 12px; }
}
</style>
