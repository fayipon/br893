<script setup>
import UiIcon from './UiIcon.vue'
import IpaBrand from './IpaBrand.vue'
import data from '../data/home.json'
import { ipaData } from '../data/ipaData'

const baseUrl = import.meta.env.BASE_URL
const asset = path => `${baseUrl}${path}`
const projects = [
  {
    id: 'br893', number: '01', name: 'BR893', category: 'WEBSITE',
    description: '探索完整首頁、活動 Banner 與互動體驗。',
    detail: 'Web & Mobile',
    buttons: [
      { label: 'Design', href: `${baseUrl}?page=design`, ariaLabel: 'BR893 Design', icon: 'palette' },
      { label: '演示站', href: `${baseUrl}?page=br893`, ariaLabel: 'BR893 演示站', icon: 'arrow', primary: true },
    ],
  },
  {
    id: 'ipa', number: '02', name: 'Jito', category: 'WEBSITE',
    description: '探索酒紅主題、活動 Banner 與互動體驗。',
    detail: 'Web & Mobile',
    buttons: [
      { label: 'Design', href: `${baseUrl}?page=design&site=ipa`, ariaLabel: 'Jito Design', icon: 'palette' },
      { label: '演示站', href: `${baseUrl}?page=ipa`, ariaLabel: 'Jito 演示站', icon: 'arrow', primary: true },
    ],
    links: [{ label: '尺寸預覽', href: `${baseUrl}?page=ipa&preview=1`, ariaLabel: 'Jito 尺寸預覽' }],
  },
]
</script>

<template>
  <div class="project-hub">
    <a class="skip-link" href="#projects">跳至專案列表</a>
    <header class="hub-header">
      <a class="hub-brand" :href="baseUrl" aria-label="Project Hub 首頁">
        <span class="hub-mark" aria-hidden="true"><i /><i /><i /><i /></span>
        <span>Project Hub<span class="hub-brand-dot">.</span></span>
      </a>
      <span class="hub-header-label">DESIGN WORKSPACE</span>
    </header>

    <main class="hub-main">
      <section class="hub-intro" aria-labelledby="hub-title">
        <p class="hub-eyebrow"><span /> A SPACE FOR EVERY PROJECT</p>
        <h1 id="hub-title">專案入口<span>.</span></h1>
        <p class="hub-lead">從網站體驗到設計細節，選擇你想探索的內容。</p>
      </section>

      <section id="projects" class="hub-projects" aria-labelledby="projects-title">
        <div class="hub-section-heading">
          <h2 id="projects-title">所有專案 <span>{{ String(projects.length).padStart(2, '0') }}</span></h2>
          <span>選擇一張卡片開始探索</span>
        </div>
        <div class="project-grid">
          <article v-for="project in projects" :key="project.id" class="project-card" :class="`project-card--${project.id}`">
            <component :is="project.buttons ? 'div' : 'a'" class="project-main-link" :href="project.buttons ? undefined : project.href" :aria-label="project.buttons ? undefined : `${project.name} — ${project.action}`">
              <div class="project-artwork" aria-hidden="true">
                <span class="project-number">{{ project.number }} / {{ project.category }}</span>
                <div v-if="project.id === 'br893'" class="site-preview">
                  <div class="site-preview-bar"><span /><span /><span /><small>br893 / homepage</small></div>
                  <div class="site-preview-header"><img :src="asset(data.brand)" alt="" /><span>Entrar</span><strong>Registro</strong></div>
                  <div class="site-preview-body">
                    <img class="site-preview-hero" :src="asset(data.banners[0].image)" alt="" />
                    <div class="site-preview-promos"><img v-for="promo in data.promotions" :key="promo.image" :src="asset(promo.image)" alt="" /></div>
                  </div>
                </div>
                <div v-else-if="project.id === 'ipa'" class="site-preview ipa-preview">
                  <div class="site-preview-bar"><span /><span /><span /><small>jito / homepage</small></div>
                  <div class="site-preview-header"><IpaBrand class="ipa-preview-mark" /><span>Login</span><strong>Register</strong></div>
                  <div class="site-preview-body">
                    <img class="site-preview-hero" :src="asset(ipaData.banners[0].image)" alt="" />
                    <div class="site-preview-promos"><img v-for="promo in ipaData.promotions" :key="promo.image" :src="asset(promo.image)" alt="" /></div>
                  </div>
                </div>
              </div>
              <div class="project-copy">
                <div class="project-title-row"><h3>{{ project.name }}</h3><span class="project-status"><i />可瀏覽</span></div>
                <p>{{ project.description }}</p>
                <div v-if="project.buttons" class="project-buttons">
                  <a v-for="button in project.buttons" :key="button.href" class="project-button" :class="{ 'project-button--primary': button.primary }" :href="button.href" :aria-label="button.ariaLabel"><UiIcon :name="button.icon" :size="18" /><span>{{ button.label }}</span></a>
                </div>
                <span v-else class="project-action">{{ project.action }}<UiIcon name="arrow" :size="19" /></span>
              </div>
            </component>
            <div class="project-footer"><span>{{ project.detail }}</span><div v-if="project.links" class="project-links"><a v-for="link in project.links" :key="link.href" :href="link.href" :aria-label="link.ariaLabel">{{ link.label }}<UiIcon name="right" :size="14" /></a></div></div>
          </article>
        </div>
      </section>
    </main>

    <footer class="hub-footer"><span>Project Hub <span class="footer-divider">/</span> 設計與體驗的集合</span><span>{{ String(projects.length).padStart(2, '0') }} PROJECTS</span></footer>
  </div>
</template>

<style scoped>
.project-hub { --hub-muted: #a99eb3; min-height: 100svh; display: flex; flex-direction: column; padding: 0 48px; background: radial-gradient(ellipse 740px 440px at 85% 20%, rgb(99 68 124 / 14%), transparent 75%), #17131d; color: #f7f2fa; font-family: Arial, 'Microsoft JhengHei', sans-serif; -webkit-font-smoothing: antialiased; }
.hub-header, .hub-main, .hub-footer { width: 100%; max-width: 1120px; margin-inline: auto; }
.hub-header { min-height: 98px; display: flex; align-items: center; justify-content: space-between; gap: 24px; border-bottom: 1px solid rgb(219 197 240 / 10%); }
.hub-brand { display: inline-flex; align-items: center; gap: 12px; color: inherit; text-decoration: none; font-size: 21px; font-weight: 700; letter-spacing: -.6px; }
.hub-brand-dot { color: #cfb5ee; }
.hub-mark { display: grid; grid-template-columns: repeat(2, 7px); gap: 4px; padding: 11px; border: 1px solid #55425f; border-radius: 12px; background: #2d2238; }
.hub-mark i { width: 7px; height: 7px; background: #cfb5ee; border-radius: 2px; }
.hub-mark i:last-child { opacity: .4; }
.hub-header-label { color: var(--hub-muted); font-size: 10px; letter-spacing: 2px; }
.hub-main { flex: 1; padding-top: 64px; padding-bottom: 68px; }
.hub-eyebrow { display: flex; align-items: center; gap: 9px; color: #baa1d1; font-size: 10px; font-weight: 600; letter-spacing: 2px; }
.hub-eyebrow > span { height: 6px; width: 6px; border-radius: 50%; background: #cfb5ee; }
.hub-intro h1 { margin: 18px 0 17px; font-size: clamp(38px, 5vw, 56px); font-weight: 700; letter-spacing: -2px; line-height: 1.2; }
.hub-intro h1 > span { margin-left: 7px; color: #cfb5ee; }
.hub-lead { color: var(--hub-muted); font-size: 14px; line-height: 1.8; }
.hub-projects { margin-top: 50px; scroll-margin-top: 24px; }
.hub-section-heading { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 18px; }
.hub-section-heading h2 { display: flex; align-items: center; gap: 11px; font-size: 14px; font-weight: 500; }
.hub-section-heading h2 > span { padding: 3px 7px; border: 1px solid #493b53; border-radius: 5px; color: #c9b2db; font-size: 10px; }
.hub-section-heading > span { color: var(--hub-muted); font-size: 11px; }
.project-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr)); gap: 26px; }
.project-card { display: flex; flex-direction: column; min-width: 0; overflow: hidden; border: 1px solid rgb(212 182 235 / 17%); border-radius: 18px; background: #211b2a; box-shadow: 0 12px 30px rgb(0 0 0 / 10%); transition: border-color .2s ease; }
.project-card:focus-within { border-color: #cfb5ee; }
.project-main-link { display: block; flex: 1; color: inherit; text-decoration: none; }
.project-main-link:focus-visible { outline-offset: -4px; border-radius: 16px 16px 0 0; }
.project-artwork { position: relative; width: 100%; min-height: 230px; aspect-ratio: 1.95; overflow: hidden; border-bottom: 1px solid rgb(212 182 235 / 10%); background: radial-gradient(ellipse at 50% 100%, #503358, #30233b 80%); }
.project-number { position: absolute; top: 20px; left: 24px; z-index: 1; color: #c1adcf; font-size: 9px; letter-spacing: 1.5px; }
.site-preview { width: 76%; margin: 57px auto 0; overflow: hidden; border: 1px solid #6a507c; border-radius: 9px 9px 0 0; background: #30203e; box-shadow: 0 15px 35px rgb(0 0 0 / 26%); transform: rotate(-3deg); }
.site-preview-bar { height: 21px; display: flex; align-items: center; gap: 4px; padding: 0 9px; background: #241b2d; }
.site-preview-bar > span { width: 4px; height: 4px; border-radius: 50%; background: #796388; }
.site-preview-bar small { margin: auto; padding-right: 18px; color: #af9dbd; font-size: 7px; letter-spacing: 1px; }
.site-preview-header { display: flex; align-items: center; gap: 8px; height: 40px; padding: 5px 12px; }
.site-preview-header img { width: 75px; height: 30px; object-fit: contain; margin-right: auto; }
.site-preview-header > span, .site-preview-header > strong { padding: 4px 9px; border-radius: 4px; font-size: 8px; font-weight: 600; background: #503b62; }
.site-preview-header > strong { background: #a7507b; }
.site-preview-body { padding: 6px 12px 12px; }
.site-preview-hero { width: 100%; border-radius: 6px; aspect-ratio: 1983 / 793; object-fit: cover; }
.site-preview-promos { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 5px; margin-top: 7px; }
.site-preview-promos img { width: 100%; border-radius: 4px; }
.project-card--ipa { background: #261018; border-color: rgb(232 199 125 / 24%); }
.project-card--ipa:focus-within { border-color: #e8c77d; }
.project-card--ipa .project-artwork { background: radial-gradient(ellipse at 50% 100%, #681c32, #300d17 85%); border-color: rgb(232 199 125 / 16%); }
.project-card--ipa .project-number { color: #e8c77d; }
.ipa-preview { border-color: #9e7545; background: #240b12; transform: rotate(3deg); }
.ipa-preview .site-preview-bar { background: #1c080e; }
.ipa-preview .site-preview-bar > span { background: #b89456; }
.ipa-preview .site-preview-bar small { color: #d7c2aa; }
.ipa-preview .site-preview-header { background: #240b12; }
.ipa-preview .site-preview-header > .ipa-preview-mark { margin-right: auto; padding: 0; font-size: 14px; background: none; }
.ipa-preview .site-preview-header > span { background: #681c32; color: #f3deb2; }
.ipa-preview .site-preview-header > strong { color: #341019; background: linear-gradient(180deg, #f8e7ba, #e8c77d 48%, #c99a50); }
.project-links { display: flex; align-items: center; gap: 14px; }
.project-copy { padding: 25px 26px 24px; }
.project-title-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
.project-title-row h3 { margin: 0; font: 600 31px/1.2 'Baloo 2', Arial, sans-serif; letter-spacing: -.5px; }
.project-status { display: inline-flex; align-items: center; gap: 6px; color: #c0b2cd; font-size: 10px; }
.project-status i { width: 5px; height: 5px; border-radius: 50%; background: #aaa1c9; }
.project-copy > p { margin-top: 11px; color: #b9adC4; font-size: 12px; line-height: 1.8; }
.project-action { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-top: 26px; color: #e2caF6; font-size: 12px; font-weight: 600; }
.project-action > svg { transform: rotate(45deg); }
.project-buttons { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; margin-top: 24px; }
.project-button { display: inline-flex; align-items: center; justify-content: center; gap: 9px; min-height: 46px; padding: 10px 14px; border: 1px solid #594568; border-radius: 11px; color: #e7d7f3; background: #33283f; font-size: 13px; font-weight: 600; text-decoration: none; }
.project-button--primary { border-color: #d8bff0; color: #2a1936; background: #cfb5ee; }
.project-button--primary svg { transform: rotate(45deg); }
.project-card--ipa .project-button { border-color: rgb(232 199 125 / 38%); color: #f3deb2; background: #491323; }
.project-card--ipa .project-button--primary { border-color: #f3dda7; color: #341019; background: linear-gradient(180deg, #f8e7ba, #e8c77d 48%, #c99a50); }
.project-card--ipa .project-status, .project-card--ipa .project-copy > p { color: #d7c2aa; }
.project-card--ipa .project-status i { background: #e8c77d; }
.project-footer { min-height: 49px; display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 5px 26px; border-top: 1px solid rgb(212 182 235 / 10%); color: var(--hub-muted); font-size: 10px; letter-spacing: .25px; }
.project-footer a { display: inline-flex; align-items: center; gap: 4px; min-height: 36px; color: #d3bddf; text-decoration: none; font-size: 11px; }
.project-card--ipa .project-footer { border-color: rgb(232 199 125 / 16%); color: #b39b87; }
.project-card--ipa .project-footer a { color: #e8c77d; }
.hub-footer { display: flex; align-items: center; justify-content: space-between; gap: 20px; min-height: 76px; border-top: 1px solid rgb(219 197 240 / 10%); color: var(--hub-muted); font-size: 10px; letter-spacing: .3px; }
.hub-footer > span:last-child { font-size: 9px; letter-spacing: 1.5px; }
.footer-divider { margin: 0 9px; color: #665572; }
@media (hover: hover) { .project-card:hover { border-color: #80628f; }.project-card--ipa:hover { border-color: #b89456; } }
@media (min-width: 1500px) { .hub-main { padding-top: 82px; } }
@media (max-width: 760px) {
  .project-hub { padding-inline: 24px; }
  .hub-header { min-height: 80px; }
  .hub-header-label { font-size: 8px; letter-spacing: 1px; }
  .hub-main { padding-top: 44px; padding-bottom: 40px; }
  .hub-projects { margin-top: 36px; }
  .project-grid { grid-template-columns: 1fr; gap: 22px; }
  .project-artwork { aspect-ratio: 1.9; }
}
@media (max-width: 400px) {
  .project-hub { padding-inline: 18px; }
  .hub-header-label, .hub-section-heading > span { display: none; }
  .hub-lead { font-size: 12px; }
  .hub-eyebrow { font-size: 8px; letter-spacing: 1.5px; }
  .project-copy { padding: 22px 20px; }
  .project-footer { padding-inline: 20px; }
  .project-number { top: 17px; left: 20px; font-size: 8px; }
  .site-preview { width: 82%; margin-top: 45px; }
  .hub-footer { font-size: 9px; }
  .hub-footer > span:last-child { font-size: 8px; }
}
@media (prefers-reduced-motion: reduce) { .project-card { transition: none; } }
</style>
