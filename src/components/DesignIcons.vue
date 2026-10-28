<script setup>
import { ref } from 'vue'
import ActivityIcon from './ActivityIcon.vue'
import UiIcon from './UiIcon.vue'
import data from '../data/home.json'

const asset = path => `${import.meta.env.BASE_URL}${path}`
const fileName = path => path.split('/').pop()
const motionPaused = ref(false)
const activityDetails = {
  spin: { title: 'Roda da Sorte', detail: 'Wheel rotation', timing: '7s · Linear' },
  'open-close': { title: 'Convide amigos', detail: 'Chest opening & closing', timing: '4.8s · Ease in / out' },
  bounce: { title: 'Mina Misteriosa', detail: 'Gift bounce', timing: '4.8s · Ease in / out' },
}
const activities = data.activities.filter(item => activityDetails[item.motion]).map(item => ({ ...item, ...activityDetails[item.motion] }))
const interfaceIcons = [
  { name: 'menu', label: 'Menu' }, { name: 'close', label: 'Close' },
  { name: 'left', label: 'Previous' }, { name: 'right', label: 'Next' },
  { name: 'chevron', label: 'Expand' }, { name: 'search', label: 'Search' },
  { name: 'download', label: 'Download' }, { name: 'crown', label: 'VIP' },
  { name: 'gift', label: 'Gift' }, { name: 'people', label: 'Invite' },
  { name: 'calendar', label: 'Check-in' }, { name: 'support', label: 'Support' },
]
const navigationNames = ['Início', 'Promoção', 'Depósito', 'Convidar', 'Perfil']
const artworkIcons = [
  ...data.nav.map((image, index) => ({ image, label: navigationNames[index] })),
  { image: data.hot, label: 'Quente', hot: true },
  { image: data.search, label: 'Search' },
  { image: data.notice, label: 'Notice' },
]
</script>

<template>
  <div class="design-icons">
    <div class="icon-group-heading"><div><h3>Activity motion</h3><p>The three icons from the floating activity panel.</p></div><button type="button" class="motion-control" :aria-pressed="motionPaused" @click="motionPaused = !motionPaused">{{ motionPaused ? 'Play motion' : 'Pause motion' }}</button></div>
    <div class="motion-grid" :class="{ 'motion-paused': motionPaused }">
      <article v-for="(item, index) in activities" :key="item.image" class="motion-card">
        <div class="motion-stage" role="img" :aria-label="`${item.title} — ${item.detail}`">
          <span class="motion-index" aria-hidden="true">0{{ index + 1 }}</span>
          <span class="motion-status">{{ motionPaused ? 'Paused' : 'Motion' }}</span>
          <ActivityIcon :src="asset(item.image)" :motion="item.motion" />
        </div>
        <div class="motion-info"><h4>{{ item.title }}</h4><p>{{ item.detail }}</p><span class="motion-timing">{{ item.timing }}</span></div>
        <div class="motion-source">
          <div class="source-thumbnail"><img :src="asset(item.image)" :alt="`${item.title} original PNG`" width="64" height="64" loading="lazy" /></div>
          <div class="source-details"><span>Original asset</span><code>{{ fileName(item.image) }}</code><a :href="asset(item.image)" :download="fileName(item.image)" :aria-label="`Download ${item.title} PNG`"><UiIcon name="download" :size="14" />Download PNG</a></div>
        </div>
      </article>
    </div>
    <p class="motion-note">Transparent PNG originals with live motion previews. Motion follows your device’s reduced-motion preference.</p>

    <div class="icon-group-heading icon-group-spaced"><div><h3>Interface icons</h3><p>The shared outline icon set.</p></div><span class="icon-count">{{ interfaceIcons.length }} components</span></div>
    <div class="interface-grid">
      <figure v-for="icon in interfaceIcons" :key="icon.name" class="interface-card"><div class="interface-symbol"><UiIcon :name="icon.name" :size="28" /></div><figcaption>{{ icon.label }}</figcaption></figure>
    </div>

    <div class="icon-group-heading icon-group-spaced"><div><h3>Navigation &amp; shortcuts</h3><p>Original artwork used across the homepage.</p></div><span class="icon-count">{{ artworkIcons.length }} assets</span></div>
    <div class="artwork-icon-grid">
      <a v-for="icon in artworkIcons" :key="icon.image" class="artwork-icon-card" :href="asset(icon.image)" :download="fileName(icon.image)" :aria-label="`Download ${icon.label} icon`"><div class="artwork-icon-stage"><span v-if="icon.hot" class="hot-icon"><img :src="asset(icon.image)" alt="" width="40" height="40" loading="lazy" /></span><img v-else :src="asset(icon.image)" alt="" width="64" height="64" loading="lazy" /></div><div class="artwork-icon-caption"><span>{{ icon.label }}</span><UiIcon name="download" :size="15" /></div></a>
    </div>
  </div>
</template>

<style scoped>
.icon-group-heading { display: flex; align-items: center; justify-content: space-between; gap: 20px; margin-bottom: 18px; }
.icon-group-heading h3 { margin: 0; font-size: 18px; font-weight: 500; }
.icon-group-heading p { margin-top: 3px; color: var(--text-muted); font-size: 13px; }
.icon-count { flex-shrink: 0; color: var(--text-muted); font-size: 12px; }
.icon-group-spaced { margin-top: 38px; }
.motion-control { flex-shrink: 0; min-height: 40px; padding: 8px 14px; border: 1px solid rgb(221 166 194 / 27%); border-radius: 9px; color: #f2dce8; background: rgb(176 90 133 / 17%); font-size: 13px; }
.motion-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 18px; }
.motion-card { overflow: hidden; min-width: 0; border: 1px solid var(--panel-border); border-radius: 15px; background: var(--panel-surface); }
.motion-stage { position: relative; display: grid; place-items: center; min-height: 225px; padding: 38px 20px 22px; background: radial-gradient(ellipse at 50% 70%, rgb(176 90 133 / 14%), transparent 68%), var(--mobile-base); --activity-image-size: 150px; }
.motion-index, .motion-status { position: absolute; top: 16px; font-size: 10px; letter-spacing: .08em; }
.motion-index { left: 18px; color: #bd7499; }
.motion-status { right: 18px; color: var(--text-muted); text-transform: uppercase; }
.motion-info { padding: 18px 20px; }
.motion-info h4 { margin: 0 0 3px; font-size: 19px; font-weight: 600; }
.motion-info p { color: var(--text-secondary); font-size: 13px; }
.motion-timing { display: inline-block; margin-top: 9px; color: #c38aa9; font-size: 11px; }
.motion-source { display: flex; align-items: center; gap: 12px; margin: 0 18px; padding: 15px 0 18px; border-top: 1px solid var(--panel-border); }
.source-thumbnail { display: grid; place-items: center; flex-shrink: 0; width: 64px; height: 64px; border: 1px solid var(--panel-border); border-radius: 10px; background-color: #302639; background-image: conic-gradient(#ffffff08 25%, transparent 0 50%, #ffffff08 0 75%, transparent 0); background-size: 12px 12px; }
.source-thumbnail img { width: 56px; height: 56px; object-fit: contain; }
.source-details { display: flex; flex-direction: column; gap: 5px; min-width: 0; }
.source-details > span { color: var(--text-secondary); font-size: 11px; }
.source-details code { color: var(--text-muted); font-size: 10px; overflow-wrap: anywhere; }
.source-details a { display: inline-flex; align-items: center; align-self: flex-start; gap: 6px; min-height: 28px; color: #edbfd7; text-decoration: none; font-size: 12px; }
.motion-note { margin-top: 13px; color: var(--text-muted); font-size: 12px; }
.motion-paused :deep(.activity-moving) { animation-play-state: paused; }
.interface-grid { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 12px; }
.interface-card { display: flex; flex-direction: column; align-items: center; gap: 14px; margin: 0; padding: 24px 10px 17px; border: 1px solid var(--panel-border); border-radius: 12px; background: var(--panel-surface); }
.interface-symbol { display: grid; place-items: center; width: 40px; height: 40px; color: var(--text-primary); }
.interface-card figcaption { color: var(--text-secondary); font-size: 12px; }
.artwork-icon-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; }
.artwork-icon-card { min-width: 0; border: 1px solid var(--panel-border); border-radius: 12px; overflow: hidden; color: var(--text-secondary); text-decoration: none; }
.artwork-icon-stage { display: grid; place-items: center; min-height: 112px; padding: 18px; background: var(--mobile-base); }
.artwork-icon-stage > img { width: 68px; height: 68px; object-fit: contain; }
.hot-icon { display: grid; place-items: center; width: 56px; height: 56px; border: 1px solid #dba1bf; border-radius: 13px; background: var(--pink-action-gradient); box-shadow: inset 0 1px 0 rgb(255 255 255 / 18%); }
.hot-icon img { filter: brightness(0) invert(1); object-fit: contain; }
.artwork-icon-caption { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 12px 15px; font-size: 13px; }
.artwork-icon-caption svg { flex-shrink: 0; color: #bd7499; }
@media (max-width: 1000px) { .motion-grid { gap: 12px; }.motion-stage { --activity-image-size: 128px; min-height: 205px; }.motion-source { flex-direction: column; align-items: flex-start; }.interface-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); } }
@media (max-width: 640px) { .icon-group-heading { align-items: flex-start; gap: 12px; }.icon-group-heading p { max-width: 240px; }.icon-count { display: none; }.motion-grid { grid-template-columns: 1fr; gap: 18px; }.motion-stage { --activity-image-size: 160px; min-height: 235px; }.motion-source { flex-direction: row; align-items: center; }.interface-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 9px; }.artwork-icon-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; } }
</style>
