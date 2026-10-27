<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import UiIcon from './components/UiIcon.vue'
import SakuraBackground from './components/SakuraBackground.vue'
import data from './data/home.json'

const asset = path => `${import.meta.env.BASE_URL}${path}`
const originalBackground = ref(new URLSearchParams(location.search).get('background') === 'original')
const downloadVisible = ref(true)
const currentSlide = ref(0)
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

const noticeMessages = [
  { before: 'Bem-vindo à ', highlight: 'BR893', after: '! Confira nossos jogos e promoções.' },
  { before: 'Explore os jogos de ', highlight: 'PG, PP e JILI', after: '.' },
  { before: 'Confira as novidades em ', highlight: 'Promoção', after: '.' },
]
const activeNotice = computed(() => noticeMessages[currentNotice.value])

const activityNames = ['Roda da Sorte', 'Convide amigos', 'Mina Misteriosa']
const navItems = [
  { name: 'Início', icon: data.nav[0] },
  { name: 'Promoção', icon: data.nav[1] },
  { name: 'Depósito', icon: data.nav[2] },
  { name: 'Convidar', icon: data.nav[3] },
  { name: 'Perfil', icon: data.nav[4] },
]
const menuItems = [
  { name: 'Mina Misteriosa', icon: 'diamond' },
  { name: 'Bônus VIP', icon: 'crown' },
  { name: 'Agente', icon: 'people' },
  { name: 'Baixar App', icon: 'download' },
  { name: 'Check-in Diário', icon: 'calendar' },
]
const socialItems = ['X', 'Telegram', 'Facebook', 'Instagram', 'Whatsapp']
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

function showNotice(title, image = '') {
  menuDialog.value?.close()
  dialogContent.value = {
    title,
    image,
    description: 'Esta é uma prévia de design. Esta interação é apenas uma demonstração, sem cadastro, pagamentos ou jogos reais.',
  }
  infoDialog.value.showModal()
}

function showToast(message) {
  toast.value = message
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
    <SakuraBackground />
    <div class="mobile-shell">
      <a class="skip-link" href="#games-start">Ir para os jogos</a>

      <header class="site-header">
        <div v-if="downloadVisible" class="download-banner">
          <button class="download-close" aria-label="Ocultar dica de download" @click="downloadVisible = false"><UiIcon name="close" :size="13" /></button>
          <img class="app-icon" :src="asset(data.appIcon)" alt="BR893" width="44" height="44" />
          <span class="download-copy">Baixe Nosso APP<br />Ganhe Super Premios</span>
          <img class="money-image" :src="asset(data.money)" alt="" width="48" height="48" />
          <button class="primary-button install-button" @click="showNotice('Baixar App')"><UiIcon name="download" :size="18" /> Instalar</button>
        </div>
        <div class="header-main">
          <button class="menu-button" aria-label="Abrir menu" aria-haspopup="dialog" @click="menuDialog.showModal()"><img :src="asset(data.menu)" alt="" width="40" height="40" /></button>
          <img class="brand-logo" :src="asset(data.brand)" alt="BR893 Entretenimento" width="128" height="56" />
          <div class="auth-buttons">
            <button class="secondary-button" @click="showNotice('Entrar')">Entrar</button>
            <button class="primary-button register-button" @click="showNotice('Registro')">Registro</button>
          </div>
        </div>
      </header>

      <main class="home-content">
        <section class="hero" aria-label="Promoções em destaque" :aria-roledescription="data.banners.length > 1 ? 'carousel' : undefined" @mouseenter="carouselPaused = true" @mouseleave="carouselPaused = false" @focusin="carouselPaused = true" @focusout="carouselPaused = false">
          <Transition :name="slideDirection < 0 ? 'hero-backward' : 'hero-forward'">
            <button :key="currentSlide" class="hero-image-button" :aria-label="`Cashback semanal de 50% — ${currentSlide + 1} de ${data.banners.length}`" @click="showNotice('Cashback semanal', data.banners[currentSlide])">
              <img :src="asset(data.banners[currentSlide])" alt="Cashback semanal de 50% — BR893" width="1983" height="793" fetchpriority="high" />
            </button>
          </Transition>
          <button v-if="data.banners.length > 1" class="carousel-arrow previous" aria-label="Promoção anterior" @click="changeSlide(-1)"><UiIcon name="left" :size="17" /></button>
          <button v-if="data.banners.length > 1" class="carousel-arrow next" aria-label="Próxima promoção" @click="changeSlide(1)"><UiIcon name="right" :size="17" /></button>
          <div v-if="data.banners.length > 1" class="carousel-dots">
            <button v-for="(_, index) in data.banners" :key="index" :class="{ active: currentSlide === index }" :aria-label="`Mostrar promoção ${index + 1}`" :aria-current="currentSlide === index ? 'true' : undefined" @click="goToSlide(index)" />
          </div>
        </section>

        <section class="promotion-grid" aria-label="Ofertas e benefícios">
          <button v-for="(promotion, index) in data.promotions" :key="index" :aria-label="`Cashback semanal de 50% — oferta ${index + 1}`" @click="showNotice('Cashback semanal', promotion)">
            <img :src="asset(promotion)" alt="Cashback semanal de 50% — BR893" width="1983" height="793" />
          </button>
        </section>

        <div class="notice-search">
          <div class="notice-bar" role="region" aria-label="Avisos" tabindex="0" @mouseenter="noticePaused = true" @mouseleave="noticePaused = false" @focusin="noticePaused = true" @focusout="noticePaused = false">
            <img :src="asset(data.notice)" alt="" width="26" height="26" />
            <div class="notice-viewport" aria-live="off">
              <Transition name="notice-slide">
                <p :key="currentNotice" class="notice-message">{{ activeNotice.before }}<strong>{{ activeNotice.highlight }}</strong>{{ activeNotice.after }}</p>
              </Transition>
            </div>
          </div>
          <button class="search-toggle" aria-label="Buscar jogos" :aria-expanded="searchVisible" aria-controls="game-search" @click="toggleSearch"><img :src="asset(data.search)" alt="" width="34" height="34" /></button>
        </div>
        <form v-if="searchVisible" id="game-search" class="search-form" role="search" @submit.prevent="showToast(`${displayedGroups.reduce((count, group) => count + group.games.length, 0)} jogos encontrados`)">
          <label class="sr-only" for="search-input">Buscar jogos</label>
          <UiIcon name="search" :size="20" />
          <input id="search-input" ref="searchInput" v-model="searchQuery" type="search" placeholder="Buscar jogos" autocomplete="off" />
          <button type="button" aria-label="Fechar busca" @click="toggleSearch"><UiIcon name="close" :size="18" /></button>
        </form>

        <nav class="provider-list" aria-label="Provedores de jogos">
          <button type="button" class="provider-tab provider-hot" :class="{ active: activeProvider === 'Quente' }" :aria-pressed="activeProvider === 'Quente'" @click="selectProvider('Quente')">
            <span class="provider-icon"><img :src="asset(data.hot)" alt="" width="40" height="40" draggable="false" /></span>
            <span>Quente</span>
          </button>
          <div class="provider-scroll" :class="{ dragging: providerDragging }" @pointerdown="startProviderDrag" @pointermove="moveProviderDrag" @pointerup="endProviderDrag" @pointercancel="endProviderDrag" @lostpointercapture="endProviderDrag" @click.capture="handleProviderClick" @dragstart.prevent>
            <button v-for="provider in data.providers" :key="provider.name" type="button" class="provider-tab" :class="{ active: activeProvider === provider.name }" :aria-pressed="activeProvider === provider.name" @click="selectProvider(provider.name)">
              <span class="provider-icon"><img :src="asset(provider.image)" alt="" width="40" height="40" draggable="false" /></span>
              <span>{{ provider.name }}</span>
            </button>
          </div>
        </nav>

        <div id="games-start" class="game-sections">
          <section v-for="(group, groupIndex) in displayedGroups" :key="group.name" class="game-section" :aria-label="`${group.name} jogos`">
            <div class="section-heading">
              <h2><img :src="asset(group.image)" alt="" width="34" height="30" />{{ group.name }}</h2>
              <button class="view-all" :aria-label="`Ver tudo ${group.name}`" @click="viewProvider(group.name)">Ver tudo</button>
            </div>
            <div class="game-grid">
              <button v-for="game in group.games" :key="game.name" class="game-card" :aria-label="game.name" @click="showNotice(game.name, game.image)">
                <img :src="asset(game.image)" :alt="game.name" width="300" height="300" :loading="groupIndex === 0 ? 'eager' : 'lazy'" decoding="async" />
                <span class="game-hover"><span>{{ game.name }}</span><span class="play-mark">▶</span></span>
              </button>
            </div>
            <button class="load-more" :aria-label="`Carregar mais ${group.name}`" @click="showToast('Todos os jogos desta prévia já estão na tela.')"><span />Carregar Mais<UiIcon name="chevron" :size="14" /><span /></button>
          </section>
          <div v-if="!displayedGroups.length" class="empty-state"><UiIcon name="search" :size="36" /><h2>Nenhum jogo encontrado</h2><p>Tente outro nome ou provedor.</p><button class="secondary-button" @click="searchQuery = ''; activeProvider = 'Quente'">Limpar filtros</button></div>
        </div>

        <footer class="site-footer">
          <p><strong>BR893.COM</strong> irá responder todas as suas dúvidas.<br />Entre em contato usando a forma de contato abaixo.</p>
          <div class="partner-grid"><div v-for="brand in data.footer" :key="brand.name"><img :src="asset(brand.image)" :alt="brand.name" loading="lazy" /></div></div>
          <img class="footer-banner" :src="asset(data.footerBanner)" alt="18+. Jogue com responsabilidade." loading="lazy" />
          <p class="copyright">Direitos autorais © 2026 BR893.COM.<br />Todos os direitos reservados.</p>
          <p class="demo-note">Prévia de design · Interações simuladas</p>
        </footer>
      </main>

      <button class="support-float" aria-label="Atendimento ao cliente" @click="showNotice('Atendimento ao cliente')"><img :src="asset(data.activities[0].image)" alt="Suporte ao cliente" width="84" height="94" /></button>

      <aside v-show="!searchVisible" class="activity-dock" :class="{ expanded: activitiesExpanded, tucked: pageScrolling, dragging: activityDragging }" :style="activityDockTop === null ? undefined : { top: `${activityDockTop}px` }" aria-label="Atividades" @pointerdown="startActivityDrag" @pointermove="moveActivityDrag" @pointerup="endActivityDrag" @pointercancel="endActivityDrag" @lostpointercapture="endActivityDrag" @click.capture="handleActivityClick">
        <div class="activity-group">
          <div id="activity-items" class="activity-panel">
            <div class="activity-items">
              <button v-for="(activity, index) in data.activities.slice(1)" :key="activity.image" type="button" :aria-label="`${activityNames[index]} ${activity.amount}`" aria-haspopup="dialog" @click.stop="showNotice(activityNames[index], activity.image)">
                <img :src="asset(activity.image)" :class="`activity-motion-${activity.motion}`" alt="" draggable="false" />
                <span class="activity-amount" aria-hidden="true">{{ activity.amount }}</span>
                <span class="activity-label" aria-hidden="true">{{ activityNames[index] }}</span>
              </button>
            </div>
          </div>
          <button class="activity-toggle" type="button" :aria-label="activitiesExpanded ? 'Recolher entrada de atividades' : 'Expandir entrada de atividades'" :aria-expanded="activitiesExpanded" aria-controls="activity-items" @click.stop="toggleActivityDock">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <defs><linearGradient id="activity-toggle-gradient" x1="12" y1="0" x2="12" y2="24" gradientUnits="userSpaceOnUse"><stop stop-color="var(--control-highlight)" /><stop offset=".55" stop-color="var(--accent)" /><stop offset="1" stop-color="var(--control-shadow)" /></linearGradient></defs>
              <circle cx="12" cy="12" r="11.5" fill="url(#activity-toggle-gradient)" stroke="var(--control-highlight)" />
              <path :d="activitiesExpanded ? 'M6 14L11.5 9L17 14' : 'M17 10L11.5 15L6 10'" stroke="var(--on-accent)" stroke-width="2" stroke-linecap="round" />
              <circle cx="8" cy="7" r="2" fill="white" fill-opacity=".25" />
            </svg>
          </button>
        </div>
      </aside>

      <nav class="bottom-nav" aria-label="Navegação principal">
        <button v-for="(item, index) in navItems" :key="item.name" :class="{ active: index === 0, 'deposit-item': index === 2 }" :aria-current="index === 0 ? 'page' : undefined" @click="navigate(item.name)"><img :src="asset(item.icon)" alt="" /><span>{{ item.name }}</span></button>
      </nav>
    </div>

    <dialog ref="menuDialog" class="menu-dialog" aria-label="Menu principal" @click="dismissBackdrop">
      <div class="menu-content">
        <div class="drawer-heading"><button class="drawer-back" aria-label="Fechar menu" @click="menuDialog.close()"><UiIcon name="left" :size="18" /></button><img :src="asset(data.brand)" alt="BR893 Entretenimento" width="147" height="49" /></div>
        <div class="drawer-scroll">
          <div class="drawer-auth"><button class="secondary-button" @click="showNotice('Entrar')">Entrar</button><button class="primary-button register-button" @click="showNotice('Registro')">Registro</button></div>
          <section aria-labelledby="drawer-popular-title">
            <div class="drawer-section-heading"><h2 id="drawer-popular-title" class="drawer-title">Popular</h2><button class="drawer-view-all" @click="menuDialog.close(); viewProvider('Quente')">Ver tudo</button></div>
            <div class="drawer-games"><button v-for="game in data.groups[0].games.slice(0, 3)" :key="game.name" :aria-label="game.name" @click="showNotice(game.name, game.image)"><img :src="asset(game.image)" :alt="game.name" width="100" height="100" /></button></div>
          </section>
          <div class="drawer-links"><button v-for="item in menuItems" :key="item.name" @click="showNotice(item.name)"><img class="drawer-feature-icon" :src="asset(`assets/sidebar/${item.icon}.svg`)" alt="" width="24" height="24" /><span>{{ item.name }}</span><UiIcon class="drawer-link-arrow" name="right" :size="14" /></button></div>
          <div class="app-links"><button v-for="platform in ['iOS', 'Android']" :key="platform" @click="showNotice(`App ${platform}`)"><img :src="asset(`assets/sidebar/${platform.toLowerCase()}.svg`)" alt="" width="22" height="22" /><span>{{ platform }}</span></button></div>
          <nav class="drawer-socials" aria-label="Redes sociais"><button v-for="social in socialItems" :key="social" :aria-label="social" @click="showNotice(social)"><span class="drawer-social-icon"><img :src="asset(`assets/sidebar/${social.toLowerCase()}.svg`)" alt="" width="38" height="38" /></span><span class="drawer-social-name">{{ social }}</span></button></nav>
          <button class="drawer-support" @click="showNotice('Atendimento')"><img class="drawer-feature-icon" :src="asset('assets/sidebar/support.svg')" alt="" width="24" height="24" /><span>Atendimento</span><UiIcon class="drawer-link-arrow" name="right" :size="14" /></button>
          <p class="drawer-note">Versão: 1.9 (20261027.162948)</p>
        </div>
      </div>
    </dialog>

    <dialog ref="infoDialog" class="info-dialog" aria-labelledby="dialog-title" aria-describedby="dialog-description" @click="dismissBackdrop">
      <div class="info-content"><button class="dialog-close" aria-label="Fechar" @click="infoDialog.close()"><UiIcon name="close" /></button><img v-if="dialogContent.image" class="dialog-image" :src="asset(dialogContent.image)" alt="" /><span class="dialog-badge">DEMONSTRAÇÃO</span><h2 id="dialog-title">{{ dialogContent.title }}</h2><p id="dialog-description">{{ dialogContent.description }}</p><button class="primary-button dialog-confirm" autofocus @click="infoDialog.close()">Entendi</button></div>
    </dialog>
    <Transition name="toast"><div v-if="toast" class="toast-message" role="status"><UiIcon name="check" :size="18" />{{ toast }}</div></Transition>
  </div>
</template>
