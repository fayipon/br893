<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import UiIcon from './components/UiIcon.vue'
import ActivityIcon from './components/ActivityIcon.vue'
import SakuraBackground from './components/SakuraBackground.vue'
import KoiBackground from './components/KoiBackground.vue'
import HeroBanner from './components/HeroBanner.vue'
import BannerTypeSwitch from './components/BannerTypeSwitch.vue'
import GameBrightnessControl from './components/GameBrightnessControl.vue'
import IpaBrand from './components/IpaBrand.vue'
import { ipaCopy } from './ipaCopy'
import { useBannerType } from './bannerType'
import { useGameBrightness } from './gameBrightness'
import baseData from './data/home.json'
import { ipaData } from './data/ipaData'
import { ipaNavigationIcons, ipaSupportIcon, ipaSearchIcon, ipaActivityIcons } from './data/ipaIcons'

const props = defineProps({ site: { type: String, default: 'br893' } })
const isIpa = props.site === 'ipa'
const data = isIpa ? ipaData : baseData
const siteFooterName = isIpa ? 'Jito' : 'BR893.COM'
const t = value => isIpa ? (ipaCopy[value] ?? value) : value
const asset = path => `${import.meta.env.BASE_URL}${path}`
const portalUrl = import.meta.env.BASE_URL
const { bannerType } = useBannerType()
const { gameBrightness } = useGameBrightness()
const originalBackground = ref(new URLSearchParams(location.search).get('background') === 'original')
const downloadVisible = ref(true)
const currentSlide = ref(0)
const activeBanner = computed(() => data.banners[currentSlide.value])
const slideDirection = ref(1)
const carouselPaused = ref(false)
const currentNotice = ref(0)
const noticePaused = ref(false)
const activeProvider = ref('Quente')
const providerDragging = ref(false)
const searchVisible = ref(false)
const searchQuery = ref('')
const searchInput = ref(null)
const activitiesExpanded = ref(false)
const pageScrolling = ref(false)
const activityDockTop = ref(null)
const activityDragging = ref(false)
const menuDialog = ref(null)
const infoDialog = ref(null)
const dialogContent = ref({ title: '', description: '', image: '' })
const toast = ref('')
let carouselTimer, noticeTimer, toastTimer, activityScrollTimer
let lastScrollY = 0
let activityDrag = null
let suppressActivityClick = false
let providerDrag = null
let suppressProviderClick = false

const noticeMessages = isIpa ? [
  { before: 'Welcome to ', highlight: 'Jito', after: '! Explore your favorite games.' },
  { before: 'Discover games from ', highlight: 'PG, PP and JILI', after: '.' },
  { before: 'See what is new in ', highlight: 'Promotion', after: '.' },
] : [
  { before: 'Bem-vindo à ', highlight: 'BR893', after: '! Confira nossos jogos e promoções.' },
  { before: 'Explore os jogos de ', highlight: 'PG, PP e JILI', after: '.' },
  { before: 'Confira as novidades em ', highlight: 'Promoção', after: '.' },
]
const activeNotice = computed(() => noticeMessages[currentNotice.value])

const activityNames = ['Roda da Sorte', 'Convide amigos', 'Mina Misteriosa']
const activityItems = data.activities.slice(1).map(activity => isIpa ? { ...activity, image: ipaActivityIcons[activity.motion] ?? activity.image } : activity)
const navigationIcons = isIpa ? ipaNavigationIcons : data.nav
const navItems = [
  { name: 'Início', icon: navigationIcons[0] },
  { name: 'Promoção', icon: navigationIcons[1] },
  { name: 'Depósito', icon: navigationIcons[2] },
  { name: 'Convidar', icon: navigationIcons[3] },
  { name: 'Perfil', icon: navigationIcons[4] },
]
const menuItems = [
  { name: 'Mina Misteriosa', icon: 'diamond' },
  { name: 'Bônus VIP', icon: 'crown' },
  { name: 'Agente', icon: 'people' },
  { name: 'Baixar App', icon: 'download' },
  { name: 'Check-in Diário', icon: 'calendar' },
]
const socialItems = ['X', 'Telegram', 'Facebook', 'Instagram', 'Whatsapp']
const providerLogoVariants = {
  FACHAI: 'provider-logo-detailed',
  ASKMESLOT: 'provider-logo-detailed',
  IGT: 'provider-logo-detailed',
  GAMEART: 'provider-logo-detailed',
  G759: 'provider-logo-detailed',
  OMGMINIGAME: 'provider-logo-inverted',
}
const displayedGroups = computed(() => {
  const query = searchQuery.value.trim().toLocaleLowerCase('pt-BR')
  return data.groups
    .filter(group => activeProvider.value === 'Quente' || group.name === activeProvider.value)
    .map(group => ({ ...group, games: group.games.filter(game => game.name.toLocaleLowerCase('pt-BR').includes(query)) }))
    .filter(group => group.games.length)
})

function changeSlide(step) {
  slideDirection.value = step < 0 ? -1 : 1
  currentSlide.value = (currentSlide.value + step + data.banners.length) % data.banners.length
}

function goToSlide(index) {
  if (index === currentSlide.value) return
  slideDirection.value = index > currentSlide.value ? 1 : -1
  currentSlide.value = index
}

function showNotice(title, image = '', banner = null) {
  menuDialog.value?.close()
  dialogContent.value = {
    title: t(title),
    image,
    banner,
    description: t('Esta é uma prévia de design. Esta interação é apenas uma demonstração, sem cadastro, pagamentos ou jogos reais.'),
  }
  infoDialog.value.showModal()
}

function showToast(message) {
  toast.value = t(message)
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toast.value = '' }, 3000)
}

function selectProvider(name) {
  activeProvider.value = name
}

function startProviderDrag(event) {
  if (event.pointerType !== 'mouse' || event.button !== 0) return
  suppressProviderClick = false
  providerDrag = { pointerId: event.pointerId, startX: event.clientX, scrollLeft: event.currentTarget.scrollLeft }
}

function moveProviderDrag(event) {
  if (!providerDrag || providerDrag.pointerId !== event.pointerId) return
  const distance = event.clientX - providerDrag.startX
  if (!providerDragging.value && Math.abs(distance) < 6) return
  event.preventDefault()
  providerDragging.value = true
  suppressProviderClick = true
  event.currentTarget.setPointerCapture(event.pointerId)
  event.currentTarget.scrollLeft = providerDrag.scrollLeft - distance
}

function endProviderDrag(event) {
  if (!providerDrag || providerDrag.pointerId !== event.pointerId) return
  if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
  providerDrag = null
  providerDragging.value = false
}

function handleProviderClick(event) {
  if (!suppressProviderClick) return
  event.preventDefault()
  event.stopPropagation()
  suppressProviderClick = false
}

async function viewProvider(name) {
  selectProvider(name)
  await nextTick()
  document.querySelector('#games-start')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

async function toggleSearch() {
  searchVisible.value = !searchVisible.value
  if (searchVisible.value) {
    await nextTick()
    searchInput.value?.focus()
  } else searchQuery.value = ''
}

function navigate(name) {
  if (name === 'Início') {
    activeProvider.value = 'Quente'
    searchQuery.value = ''
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } else showNotice(name)
}

function dismissBackdrop(event) {
  if (event.target === event.currentTarget) event.currentTarget.close()
}

function handlePageScroll() {
  const scrollY = window.scrollY
  if (scrollY === lastScrollY) return
  lastScrollY = scrollY
  if (menuDialog.value?.open || infoDialog.value?.open) return
  pageScrolling.value = true
  clearTimeout(activityScrollTimer)
  activityScrollTimer = setTimeout(() => { pageScrolling.value = false }, 800)
}

function toggleActivityDock() {
  activitiesExpanded.value = !activitiesExpanded.value
  pageScrolling.value = false
  clearTimeout(activityScrollTimer)
}

function startActivityDrag(event) {
  if (!event.isPrimary || event.button !== 0) return
  suppressActivityClick = false
  pageScrolling.value = false
  clearTimeout(activityScrollTimer)
  activityDrag = { pointerId: event.pointerId, startY: event.clientY, top: event.currentTarget.getBoundingClientRect().top }
}

function moveActivityDrag(event) {
  if (!activityDrag || activityDrag.pointerId !== event.pointerId) return
  const distance = event.clientY - activityDrag.startY
  if (!activityDragging.value && Math.abs(distance) < 6) return
  activityDragging.value = true
  suppressActivityClick = true
  event.currentTarget.setPointerCapture(event.pointerId)
  const bottomLimit = window.innerHeight - event.currentTarget.offsetHeight - 8
  activityDockTop.value = Math.max(8, Math.min(activityDrag.top + distance, bottomLimit))
}

function endActivityDrag(event) {
  if (!activityDrag || activityDrag.pointerId !== event.pointerId) return
  if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
  activityDrag = null
  activityDragging.value = false
}

function handleActivityClick(event) {
  if (!suppressActivityClick) return
  event.preventDefault()
  event.stopPropagation()
  suppressActivityClick = false
}

onMounted(() => {
  lastScrollY = window.scrollY
  window.addEventListener('scroll', handlePageScroll, { passive: true })
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    if (data.banners.length > 1) {
      carouselTimer = setInterval(() => {
        if (!carouselPaused.value && !document.hidden && !menuDialog.value?.open && !infoDialog.value?.open) changeSlide(1)
      }, 6000)
    }
    noticeTimer = setInterval(() => {
      if (!noticePaused.value && !document.hidden && !menuDialog.value?.open && !infoDialog.value?.open) {
        currentNotice.value = (currentNotice.value + 1) % noticeMessages.length
      }
    }, 3500)
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', handlePageScroll)
  clearTimeout(activityScrollTimer)
  clearInterval(carouselTimer)
  clearInterval(noticeTimer)
  clearTimeout(toastTimer)
})
</script>

<template>
  <div class="web-canvas" :class="{ 'background-original': originalBackground }">
    <KoiBackground v-if="isIpa" />
    <SakuraBackground v-else />
    <div class="desktop-design-tools"><a class="portal-return" :href="portalUrl"><UiIcon name="left" :size="14" /><span>專案入口</span></a><BannerTypeSwitch compact /><GameBrightnessControl compact /></div>
    <div class="mobile-shell">
      <a class="skip-link" href="#games-start">{{ t('Ir para os jogos') }}</a>

      <header class="site-header">
        <div v-if="downloadVisible" class="download-banner">
          <button class="download-close" :aria-label="t('Ocultar dica de download')" @click="downloadVisible = false"><UiIcon name="close" :size="13" /></button>
          <IpaBrand v-if="isIpa" class="app-icon" compact /><img v-else class="app-icon" :src="asset(data.appIcon)" alt="BR893" width="44" height="44" />
          <span class="download-copy">{{ t('Baixe Nosso APP') }}<br />{{ t('Ganhe Super Premios') }}</span>
          <img class="money-image" :src="asset(data.money)" alt="" width="48" height="48" />
          <button class="primary-button install-button" @click="showNotice('Baixar App')"><UiIcon name="download" :size="18" /> {{ t('Instalar') }}</button>
        </div>
        <div class="header-main">
          <button class="menu-button" :aria-label="t('Abrir menu')" aria-haspopup="dialog" @click="menuDialog.showModal()"><span class="menu-symbol glossy-control"><UiIcon name="menu" :size="24" /></span></button>
          <IpaBrand v-if="isIpa" class="brand-logo" /><img v-else class="brand-logo" :src="asset(data.brand)" alt="BR893 Entretenimento" width="128" height="56" />
          <div class="auth-buttons">
            <button class="secondary-button glossy-control" @click="showNotice('Entrar')">{{ t('Entrar') }}</button>
            <button class="primary-button register-button glossy-control" @click="showNotice('Registro')">{{ t('Registro') }}</button>
          </div>
        </div>
      </header>

      <main class="home-content">
        <section class="hero" :aria-label="t('Promoções em destaque')" :aria-roledescription="data.banners.length > 1 ? 'carousel' : undefined" @mouseenter="carouselPaused = true" @mouseleave="carouselPaused = false" @focusin="carouselPaused = true" @focusout="carouselPaused = false">
          <Transition :name="slideDirection < 0 ? 'hero-backward' : 'hero-forward'">
            <button :key="currentSlide" class="hero-image-button" :aria-label="`${activeBanner.alt} — ${currentSlide + 1} ${t('de')} ${data.banners.length}`" @click="showNotice(activeBanner.title, activeBanner.image, activeBanner)">
              <HeroBanner :banner="activeBanner" :type="bannerType" priority="high" />
            </button>
          </Transition>
          <button v-if="data.banners.length > 1" class="carousel-arrow previous" :aria-label="t('Promoção anterior')" @click="changeSlide(-1)"><UiIcon name="left" :size="17" /></button>
          <button v-if="data.banners.length > 1" class="carousel-arrow next" :aria-label="t('Próxima promoção')" @click="changeSlide(1)"><UiIcon name="right" :size="17" /></button>
          <div v-if="data.banners.length > 1" class="carousel-dots">
            <button v-for="(_, index) in data.banners" :key="index" :class="{ active: currentSlide === index }" :aria-label="`${t('Mostrar promoção')} ${index + 1}`" :aria-current="currentSlide === index ? 'true' : undefined" @click="goToSlide(index)" />
          </div>
        </section>

        <section class="promotion-grid" :aria-label="t('Ofertas e benefícios')">
          <button v-for="(promotion, index) in data.promotions" :key="index" :aria-label="`${promotion.alt} — ${t('oferta')} ${index + 1}`" @click="showNotice(promotion.title, promotion.image)">
            <img :src="asset(promotion.image)" :alt="promotion.alt" width="1983" height="793" />
          </button>
        </section>

        <div class="notice-search">
          <div class="notice-bar" role="region" :aria-label="t('Avisos')" tabindex="0" @mouseenter="noticePaused = true" @mouseleave="noticePaused = false" @focusin="noticePaused = true" @focusout="noticePaused = false">
            <img :src="asset(data.notice)" alt="" width="26" height="26" />
            <div class="notice-viewport" aria-live="off">
              <Transition name="notice-slide">
                <p :key="currentNotice" class="notice-message">{{ activeNotice.before }}<strong>{{ activeNotice.highlight }}</strong>{{ activeNotice.after }}</p>
              </Transition>
            </div>
          </div>
          <button class="search-toggle" :aria-label="t('Buscar jogos')" :aria-expanded="searchVisible" aria-controls="game-search" @click="toggleSearch"><img :src="asset(isIpa ? ipaSearchIcon : data.search)" alt="" width="34" height="34" /></button>
        </div>
        <form v-if="searchVisible" id="game-search" class="search-form" role="search" @submit.prevent="showToast(`${displayedGroups.reduce((count, group) => count + group.games.length, 0)} ${t('jogos encontrados')}`)">
          <label class="sr-only" for="search-input">{{ t('Buscar jogos') }}</label>
          <UiIcon name="search" :size="20" />
          <input id="search-input" ref="searchInput" v-model="searchQuery" type="search" :placeholder="t('Buscar jogos')" autocomplete="off" />
          <button type="button" :aria-label="t('Fechar busca')" @click="toggleSearch"><UiIcon name="close" :size="18" /></button>
        </form>

        <nav class="provider-list" :aria-label="t('Provedores de jogos')">
          <button type="button" class="provider-tab provider-hot" :class="{ active: activeProvider === 'Quente' }" :aria-pressed="activeProvider === 'Quente'" @click="selectProvider('Quente')">
            <span class="provider-icon"><img :src="asset(data.hot)" alt="" width="40" height="40" draggable="false" /></span>
            <span>{{ t('Quente') }}</span>
          </button>
          <div class="provider-scroll" :class="{ dragging: providerDragging }" @pointerdown="startProviderDrag" @pointermove="moveProviderDrag" @pointerup="endProviderDrag" @pointercancel="endProviderDrag" @lostpointercapture="endProviderDrag" @click.capture="handleProviderClick" @dragstart.prevent>
            <button v-for="provider in data.providers" :key="provider.name" type="button" class="provider-tab" :class="{ active: activeProvider === provider.name }" :aria-pressed="activeProvider === provider.name" @click="selectProvider(provider.name)">
              <span class="provider-icon"><img :src="asset(provider.image)" :class="providerLogoVariants[provider.name]" alt="" width="40" height="40" draggable="false" /></span>
              <span>{{ provider.name }}</span>
            </button>
          </div>
        </nav>

        <div id="games-start" class="game-sections" :style="{ '--game-brightness': gameBrightness / 100 }">
          <section v-for="(group, groupIndex) in displayedGroups" :key="group.name" class="game-section" :aria-label="`${group.name} ${t('jogos')}`">
            <div class="section-heading">
              <h2 :aria-label="`${group.name}: ${group.games.length} ${group.games.length === 1 ? 'game' : 'games'}`"><img :src="asset(group.image)" :class="providerLogoVariants[group.name]" alt="" width="34" height="30" /><span class="game-count">{{ group.games.length }} {{ group.games.length === 1 ? 'game' : 'games' }}</span></h2>
              <button class="view-all" :aria-label="`${t('Ver tudo')} ${group.name}`" @click="viewProvider(group.name)">{{ t('Ver tudo') }}</button>
            </div>
            <div class="game-grid">
              <button v-for="game in group.games" :key="game.name" class="game-card" :aria-label="game.name" @click="showNotice(game.name, game.image)">
                <img :src="asset(game.image)" :alt="game.name" width="300" height="300" :loading="groupIndex === 0 ? 'eager' : 'lazy'" decoding="async" />
                <span class="game-hover"><span>{{ game.name }}</span><span class="play-mark">▶</span></span>
              </button>
            </div>
            <button v-if="activeProvider !== 'Quente'" class="load-more" :aria-label="`${t('Carregar Mais')} ${group.name}`" @click="showToast('Todos os jogos desta prévia já estão na tela.')"><span />{{ t('Carregar Mais') }}<UiIcon name="chevron" :size="14" /><span /></button>
          </section>
          <div v-if="!displayedGroups.length" class="empty-state"><UiIcon name="search" :size="36" /><h2>{{ t('Nenhum jogo encontrado') }}</h2><p>{{ t('Tente outro nome ou provedor.') }}</p><button class="secondary-button" @click="searchQuery = ''; activeProvider = 'Quente'">{{ t('Limpar filtros') }}</button></div>
        </div>

        <footer class="site-footer">
          <p><strong>{{ siteFooterName }}</strong> {{ t('irá responder todas as suas dúvidas.') }}<br />{{ t('Entre em contato usando a forma de contato abaixo.') }}</p>
          <div class="partner-grid"><div v-for="brand in data.footer" :key="brand.name"><img :src="asset(brand.image)" :alt="brand.name" loading="lazy" /></div></div>
          <img class="footer-banner" :src="asset(data.footerBanner)" :alt="t('18+. Jogue com responsabilidade.')" loading="lazy" />
          <p class="copyright">{{ t('Direitos autorais') }} © 2026 {{ siteFooterName }}.<br />{{ t('Todos os direitos reservados.') }}</p>
          <p class="demo-note">{{ t('Prévia de design · Interações simuladas') }}</p>
        </footer>
      </main>

      <button class="support-float" :aria-label="t('Atendimento ao cliente')" @click="showNotice('Atendimento ao cliente')"><img :src="asset(isIpa ? ipaSupportIcon : data.activities[0].image)" :alt="t('Suporte ao cliente')" :width="isIpa ? 64 : 84" :height="isIpa ? 64 : 94" /><span v-if="isIpa" aria-hidden="true">Support</span></button>

      <aside v-show="!searchVisible" class="activity-dock" :class="{ expanded: activitiesExpanded, tucked: pageScrolling, dragging: activityDragging }" :style="activityDockTop === null ? undefined : { top: `${activityDockTop}px` }" :aria-label="t('Atividades')" @pointerdown="startActivityDrag" @pointermove="moveActivityDrag" @pointerup="endActivityDrag" @pointercancel="endActivityDrag" @lostpointercapture="endActivityDrag" @click.capture="handleActivityClick">
        <div class="activity-group">
          <div id="activity-items" class="activity-panel">
            <div class="activity-items">
              <button v-for="(activity, index) in activityItems" :key="activity.image" type="button" :aria-label="`${t(activityNames[index])} ${activity.amount}`" aria-haspopup="dialog" @click.stop="showNotice(activityNames[index], activity.image)">
                <ActivityIcon :src="asset(activity.image)" :motion="activity.motion" :tone="isIpa ? 'jito' : 'original'" />
                <span class="activity-amount" aria-hidden="true">{{ activity.amount }}</span>
                <span class="activity-label" aria-hidden="true">{{ t(activityNames[index]) }}</span>
              </button>
            </div>
          </div>
          <button class="activity-toggle" type="button" :aria-label="t(activitiesExpanded ? 'Recolher entrada de atividades' : 'Expandir entrada de atividades')" :aria-expanded="activitiesExpanded" aria-controls="activity-items" @click.stop="toggleActivityDock">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <defs><linearGradient id="activity-toggle-gradient" x1="12" y1="0" x2="12" y2="24" gradientUnits="userSpaceOnUse"><stop stop-color="var(--control-highlight)" /><stop offset=".55" stop-color="var(--accent)" /><stop offset="1" stop-color="var(--control-shadow)" /></linearGradient></defs>
              <circle cx="12" cy="12" r="11.5" fill="url(#activity-toggle-gradient)" stroke="var(--control-highlight)" />
              <path :d="activitiesExpanded ? 'M6 14L11.5 9L17 14' : 'M17 10L11.5 15L6 10'" stroke="var(--on-accent)" stroke-width="2" stroke-linecap="round" />
              <circle cx="8" cy="7" r="2" fill="white" fill-opacity=".25" />
            </svg>
          </button>
        </div>
      </aside>

      <nav class="bottom-nav" :aria-label="t('Navegação principal')">
        <button v-for="(item, index) in navItems" :key="item.name" :class="{ active: index === 0, 'deposit-item': index === 2 }" :aria-current="index === 0 ? 'page' : undefined" @click="navigate(item.name)"><img :src="asset(item.icon)" alt="" /><span>{{ t(item.name) }}</span></button>
      </nav>
    </div>

    <dialog ref="menuDialog" class="menu-dialog" :aria-label="t('Menu principal')" @click="dismissBackdrop">
      <div class="menu-content">
        <div class="drawer-heading"><button class="drawer-back" :aria-label="t('Fechar menu')" @click="menuDialog.close()"><UiIcon name="left" :size="18" /></button><IpaBrand v-if="isIpa" /><img v-else :src="asset(data.brand)" alt="BR893 Entretenimento" width="147" height="49" /></div>
        <div class="drawer-scroll">
          <div class="drawer-auth"><button class="secondary-button glossy-control" @click="showNotice('Entrar')">{{ t('Entrar') }}</button><button class="primary-button register-button glossy-control" @click="showNotice('Registro')">{{ t('Registro') }}</button></div>
          <section aria-labelledby="drawer-popular-title">
            <div class="drawer-section-heading"><h2 id="drawer-popular-title" class="drawer-title">{{ t('Popular') }}</h2><button class="drawer-view-all" @click="menuDialog.close(); viewProvider('Quente')">{{ t('Ver tudo') }}</button></div>
            <div class="drawer-games"><button v-for="game in data.groups[0].games.slice(0, 3)" :key="game.name" :aria-label="game.name" @click="showNotice(game.name, game.image)"><img :src="asset(game.image)" :alt="game.name" width="100" height="100" /></button></div>
          </section>
          <div class="drawer-links"><button v-for="item in menuItems" :key="item.name" @click="showNotice(item.name)"><img class="drawer-feature-icon" :src="asset(`assets/sidebar/${item.icon}.svg`)" alt="" width="24" height="24" /><span>{{ t(item.name) }}</span><UiIcon class="drawer-link-arrow" name="right" :size="14" /></button></div>
          <div class="app-links"><button v-for="platform in ['iOS', 'Android']" :key="platform" @click="showNotice(`App ${platform}`)"><img :src="asset(`assets/sidebar/${platform.toLowerCase()}.svg`)" alt="" width="22" height="22" /><span>{{ platform }}</span></button></div>
          <nav class="drawer-socials" :aria-label="t('Redes sociais')"><button v-for="social in socialItems" :key="social" :aria-label="social" @click="showNotice(social)"><span class="drawer-social-icon"><img :src="asset(`assets/sidebar/${social.toLowerCase()}.svg`)" alt="" width="38" height="38" /></span><span class="drawer-social-name">{{ social }}</span></button></nav>
          <button class="drawer-support" @click="showNotice('Atendimento')"><img class="drawer-feature-icon" :src="asset('assets/sidebar/support.svg')" alt="" width="24" height="24" /><span>{{ t('Atendimento') }}</span><UiIcon class="drawer-link-arrow" name="right" :size="14" /></button>
          <p class="drawer-note">{{ t('Versão') }}: 1.9 (20261027.162948)</p>
        </div>
      </div>
    </dialog>

    <dialog ref="infoDialog" class="info-dialog" aria-labelledby="dialog-title" aria-describedby="dialog-description" @click="dismissBackdrop">
      <div class="info-content"><button class="dialog-close" :aria-label="t('Fechar')" @click="infoDialog.close()"><UiIcon name="close" /></button><HeroBanner v-if="dialogContent.banner" class="dialog-hero" :banner="dialogContent.banner" :type="bannerType" /><img v-else-if="dialogContent.image" class="dialog-image" :src="asset(dialogContent.image)" alt="" /><span class="dialog-badge">{{ t('DEMONSTRAÇÃO') }}</span><h2 id="dialog-title">{{ dialogContent.title }}</h2><p id="dialog-description">{{ dialogContent.description }}</p><button class="primary-button dialog-confirm" autofocus @click="infoDialog.close()">{{ t('Entendi') }}</button></div>
    </dialog>
    <Transition name="toast"><div v-if="toast" class="toast-message" role="status"><UiIcon name="check" :size="18" />{{ toast }}</div></Transition>
  </div>
</template>
