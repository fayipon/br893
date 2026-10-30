import { createApp, defineAsyncComponent } from 'vue'
import App from './App.vue'
import DesignPreview from './components/DesignPreview.vue'
import ProjectHub from './components/ProjectHub.vue'
import './styles/backgrounds.css'
import './styles/home.css'
import './styles/ipa.css'

const searchParams = new URLSearchParams(location.search)
const isDesign = searchParams.get('page') === 'design'
const isPreview = searchParams.get('preview') === '1'
const isIpa = searchParams.get('page') === 'ipa' || (isDesign && searchParams.get('site') === 'ipa')
const isBr893 = !isIpa && (searchParams.get('page') === 'br893' || searchParams.has('background'))
const isSite = isIpa || isBr893
const site = isIpa ? 'ipa' : 'br893'
const siteName = isIpa ? 'Jito' : 'BR893'
const page = isDesign
  ? defineAsyncComponent(() => import('./components/DesignPage.vue'))
  : isPreview ? DesignPreview : isSite ? App : ProjectHub

document.documentElement.classList.toggle('ipa-theme', isIpa)
document.documentElement.lang = isDesign ? 'en' : isPreview || !isSite ? 'zh-Hant' : isIpa ? 'en' : 'pt-BR'
document.title = isDesign ? `${siteName} · Design` : isPreview ? `${siteName} · 設計預覽` : isSite ? `${siteName} · Homepage Design` : 'Project Hub · 專案入口'
document.querySelector('meta[name="description"]').content = isDesign
  ? `${siteName} design library: colors, typography, icons and banners.`
  : isPreview ? `${siteName} 響應式設計預覽，切換裝置尺寸與背景。`
    : isIpa ? 'Jito Gaming — Burgundy homepage design preview.'
      : isBr893 ? 'BR893 — prévia estática do design da página inicial.'
        : '從專案入口探索 BR893、Jito 網站與 Design 設計展示。'
document.querySelector('meta[name="theme-color"]').content = isIpa ? '#240b12' : '#281538'
createApp(page, isDesign || isPreview || isSite ? { site } : undefined).mount('#app')
