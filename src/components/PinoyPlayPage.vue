<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import BannerTypeSwitch from './BannerTypeSwitch.vue'
import GameBrightnessControl from './GameBrightnessControl.vue'
import PinoyIcon from './PinoyIcon.vue'
import PinoyBanner from './PinoyBanner.vue'
import { useGameBrightness } from '../gameBrightness'
import data from '../data/pinoyplay.json'
import { pinoyBannerSlides, welcomeBonus, weeklyCashback, payday, firstThreeDeposits, royalArrival } from '../data/pinoyPromotions'
import '../styles/pinoyplay.css'

const baseUrl = import.meta.env.BASE_URL
const asset = path => `${baseUrl}${path}`
const formatAmount = value => value.toLocaleString('en-US')
const { gameBrightness } = useGameBrightness()
const currentBanner = ref(0)
const activeBanner = computed(() => pinoyBannerSlides[currentBanner.value])
const rotationPaused = ref(false)
const carouselHovered = ref(false)
const carouselFocused = ref(false)
const registrationPreview = ref(false)
const dialog = ref(null)
const modal = ref({ title: '', kind: '' })
const search = ref('')
const selectedProvider = ref('All')
const filteredGames = computed(() => data.groups.filter(group => selectedProvider.value === 'All' || group.name === selectedProvider.value).flatMap(group => group.games.map(game => ({ ...game, provider: group.name }))).filter(game => game.name.toLowerCase().includes(search.value.toLowerCase())))
const shortcuts = [
  { name: 'Rewards', icon: 'gift', badge: String(pinoyBannerSlides.length), kind: 'rewards' },
  { name: 'Rebate', icon: 'rebate', badge: '1.5%', kind: 'rebate' },
  { name: 'Cashback', icon: 'cashback', badge: '10%', kind: 'weekly-cashback', title: weeklyCashback.title },
  { name: 'Wheel', icon: 'wheel', dot: true, kind: 'wheel' },
  { name: 'Payday', icon: 'calendar', kind: 'payday' },
  { name: 'Redeem', icon: 'bag', kind: 'redeem' },
]
const nav = [{ name: 'Home', icon: 'home' }, { name: 'Promo', icon: 'gift' }, { name: 'Wallet', icon: 'wallet' }, { name: 'Affiliate', icon: 'people' }, { name: 'Profile', icon: 'profile' }]
const modalDescriptions = {
  wheel: 'Check Rewards for the latest Lucky Wheel offers.',
  redeem: 'Redeem eligible rewards and promotion codes in your account.',
  login: 'Account sign-in is not connected in this homepage preview.',
  wallet: 'Deposits, withdrawals and balances are not connected in this homepage preview.',
  affiliate: 'Your affiliate dashboard will be available when account services are connected.',
  profile: 'Your account and preferences will be available after sign-in.',
}
let previousOverflow = ''
let returnFocus = null
let rotationTimer, motionPreference
const updateRotationPreference = () => { rotationPaused.value = motionPreference.matches }
onMounted(() => {
  motionPreference = matchMedia('(prefers-reduced-motion: reduce)')
  updateRotationPreference()
  motionPreference.addEventListener('change', updateRotationPreference)
  rotationTimer = window.setInterval(() => {
    if (!rotationPaused.value && !carouselHovered.value && !carouselFocused.value && !document.hidden && !dialog.value?.open) {
      currentBanner.value = (currentBanner.value + 1) % pinoyBannerSlides.length
    }
  }, 8000)
})
async function openModal(kind, title, extra = {}) {
  if (!dialog.value.open) {
    previousOverflow = document.body.style.overflow
    returnFocus = document.activeElement
  }
  modal.value = { kind, title, ...extra }
  if (kind === 'register') registrationPreview.value = false
  if (kind === 'catalog') { search.value = ''; selectedProvider.value = extra.provider || 'All' }
  await nextTick()
  if (!dialog.value.open) dialog.value.showModal()
  else dialog.value.querySelector('.pinoy-dialog-heading button').focus()
  document.body.style.overflow = 'hidden'
}
function closeModal() { dialog.value.close() }
function onClose() {
  document.body.style.overflow = previousOverflow
  if (returnFocus?.isConnected) returnFocus.focus()
}
function navigate(item) {
  if (item.name === 'Home') window.scrollTo({ top: 0, behavior: 'smooth' })
  else openModal(item.name === 'Promo' ? 'promotions' : item.name.toLowerCase(), item.name === 'Promo' ? 'Promotions' : item.name)
}
onUnmounted(() => {
  window.clearInterval(rotationTimer)
  motionPreference?.removeEventListener('change', updateRotationPreference)
  if (dialog.value?.open) document.body.style.overflow = previousOverflow
})
</script>

<template>
  <div class="pinoy-page" :style="{ '--game-brightness': gameBrightness / 100 }">
    <a class="skip-link" href="#pinoy-games">Skip to games</a>
    <aside class="desktop-design-tools pinoy-tools" aria-label="Design controls">
      <a class="portal-return" :href="baseUrl"><PinoyIcon name="left" :size="14" /><span>專案入口</span></a>
      <BannerTypeSwitch compact /><GameBrightnessControl compact />
    </aside>

    <div class="pinoy-shell">
      <header class="pinoy-header">
        <a :href="`${baseUrl}?page=pinoyplay`" aria-label="PinoyPlay home"><img class="pinoy-logo" :src="asset('assets/pinoyplay/logo.webp')" alt="PinoyPlay — Play more together" width="350" height="75" /></a>
        <div class="pinoy-header-actions">
          <button class="pinoy-login" @click="openModal('login', 'Log In')">Log In</button>
          <button class="pinoy-register" @click="openModal('register', 'Create your account')"><span class="pinoy-bonus">Get ₱20</span>Register</button>
          <button class="pinoy-menu" aria-label="Open menu" @click="openModal('menu', 'Menu')"><PinoyIcon name="menu" :size="22" /></button>
        </div>
      </header>

      <main>
        <h1 class="sr-only">PinoyPlay game lobby</h1>
        <section class="pinoy-carousel" aria-label="Featured promotions" aria-roledescription="carousel" @mouseenter="carouselHovered = true" @mouseleave="carouselHovered = false" @focusin="carouselFocused = true" @focusout="event => { carouselFocused = event.currentTarget.contains(event.relatedTarget) }">
          <button class="pinoy-hero-button" :aria-label="`View ${activeBanner.label}`" @click="openModal(activeBanner.kind, activeBanner.title)"><PinoyBanner :key="activeBanner.id" :bonus="activeBanner.id === 'welcome-bonus'" :weekly="activeBanner.id === 'weekly-cashback'" :payday="activeBanner.id === 'payday'" :deposits="activeBanner.id === 'first-three-deposits'" :royal="activeBanner.id === 'royal-arrival'" /></button>
          <button class="pinoy-carousel-pause" :aria-label="rotationPaused ? 'Resume banner rotation' : 'Pause banner rotation'" @click="rotationPaused = !rotationPaused"><svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor" aria-hidden="true"><path v-if="rotationPaused" d="M4 2l9 6-9 6Z" /><path v-else d="M3 2h3v12H3zM10 2h3v12h-3z" /></svg></button>
          <div class="pinoy-dots" aria-label="Select banner"><button v-for="(slide, index) in pinoyBannerSlides" :key="slide.id" :aria-label="`Show ${slide.label} banner`" :aria-pressed="currentBanner === index" @click="currentBanner = index"><span /></button></div>
        </section>

        <nav class="pinoy-shortcuts" aria-label="Promotions">
          <button v-for="(item, index) in shortcuts" :key="item.name" :class="{ featured: index === 0 }" @click="openModal(item.kind, item.title || (item.name === 'Rebate' ? 'Slot Daily Rebate' : item.name))">
            <span v-if="item.badge" class="pinoy-shortcut-badge" :class="{ round: index === 0 }">{{ item.badge }}</span><span v-if="item.dot" class="pinoy-shortcut-dot" />
            <PinoyIcon :name="item.icon" :size="29" /><span>{{ item.name }}</span>
          </button>
        </nav>

        <div id="pinoy-games" class="pinoy-catalog">
          <section v-for="(group, groupIndex) in data.groups" :key="group.name" class="pinoy-game-section" :aria-labelledby="`provider-${group.name}`">
            <div class="pinoy-section-heading"><div class="pinoy-provider"><PinoyIcon name="gamepad" :size="22" /><h2 :id="`provider-${group.name}`">{{ group.name }}<small>{{ group.count }} GAMES</small></h2></div><button :aria-label="`View all ${group.name} games`" @click="openModal('catalog', `${group.name} games`, { provider: group.name })">View all <PinoyIcon name="right" :size="14" /></button></div>
            <div class="pinoy-game-grid">
              <button v-for="(game, gameIndex) in group.games" :key="game.image" class="pinoy-game-card" :aria-label="`View ${game.name}`" @click="openModal('game', game.name, { game, provider: group.name })">
                <img :src="asset(game.image)" alt="" width="320" height="320" :loading="groupIndex === 0 && gameIndex < 3 ? 'eager' : 'lazy'" decoding="async" /><span>{{ game.name }}<PinoyIcon name="right" :size="11" /></span>
              </button>
            </div>
          </section>
        </div>

        <section class="pinoy-discover"><small>PLAY MORE TOGETHER</small><h2>A little curiosity.<br><em>A lot of fun.</em></h2><p>Your next favorite is one tap away.</p><button class="pinoy-primary" @click="openModal('catalog', 'Explore games')">Explore more games <PinoyIcon name="arrow" :size="17" /></button></section>
        <section class="pinoy-help" aria-label="Help and information">
          <details><summary>Game Guide <PinoyIcon name="right" :size="16" /></summary><p>Browse games by provider or use “View all” to search the featured collection. Select a game to see its preview.</p></details>
          <details><summary>FAQ <PinoyIcon name="right" :size="16" /></summary><p>Daily Slot Rebate is available at 9:00 AM the next day. Eligible rewards must be claimed manually in Rewards within 7 days of unlocking.</p></details>
          <details><summary>About PinoyPlay <PinoyIcon name="right" :size="16" /></summary><p>Good games. Brighter days. Discover your favorite games and daily promotions, together at PinoyPlay.</p></details>
        </section>
        <footer class="pinoy-footer"><img :src="asset('assets/pinoyplay/logo.webp')" alt="PinoyPlay" width="175" height="38" loading="lazy" /><p>Good games. Brighter days.</p><small>© 2026 PinoyPlay. All rights reserved.</small><span>18+ · Play responsibly</span></footer>
      </main>

      <nav class="pinoy-bottom-nav" aria-label="Main navigation"><button v-for="item in nav" :key="item.name" :class="{ active: item.name === 'Home', 'pinoy-wallet': item.name === 'Wallet' }" :aria-current="item.name === 'Home' ? 'page' : undefined" @click="navigate(item)"><span class="pinoy-nav-icon"><PinoyIcon :name="item.icon" :size="23" /></span><span>{{ item.name }}</span></button></nav>
    </div>

    <dialog ref="dialog" class="pinoy-dialog" :class="{ 'pinoy-dialog--catalog': modal.kind === 'catalog' }" aria-labelledby="pinoy-dialog-title" @click="event => { if (event.target === dialog) closeModal() }" @close="onClose">
      <div class="pinoy-dialog-heading"><h2 id="pinoy-dialog-title">{{ modal.title }}</h2><button aria-label="Close dialog" autofocus @click="closeModal"><PinoyIcon name="close" /></button></div>
      <div class="pinoy-dialog-content">
        <template v-if="modal.kind === 'welcome-bonus'">
          <PinoyBanner bonus />
          <p class="pinoy-modal-lead">A little welcome, on us. Receive <strong>₱20 automatically</strong> after registering a new account and logging in.</p>
          <div class="pinoy-bonus-steps" aria-label="Welcome bonus requirements"><div><span>01</span><strong>Register</strong><small>Get ₱20</small></div><div><span>02</span><strong>Make a deposit</strong><small>Before playing</small></div><div><span>03</span><strong>Wager ₱100</strong><small>Slots · 5× bonus</small></div></div>
          <h3 class="pinoy-rules-title">Activity Rules</h3>
          <ol class="pinoy-rules"><li v-for="rule in welcomeBonus.rules" :key="rule">{{ rule }}</li></ol>
          <button class="pinoy-primary pinoy-full-width" @click="openModal('register', 'Create your account')">Register & get ₱20 <PinoyIcon name="arrow" :size="17" /></button>
          <button class="pinoy-text-link" @click="openModal('promotions', 'Promotions')">View all promotions</button>
        </template>
        <template v-else-if="modal.kind === 'register'">
          <div class="pinoy-register-offer"><span class="pinoy-register-gift"><PinoyIcon name="gift" :size="34" /></span><div><small>NEW PLAYER EXCLUSIVE</small><strong>Your ₱20 welcome bonus</strong><p>Automatically credited after registration and login.</p></div></div>
          <form class="pinoy-register-form" @submit.prevent="registrationPreview = true">
            <label>Mobile number<span class="pinoy-phone-field"><span>+63</span><input type="tel" name="phone" inputmode="numeric" autocomplete="tel-national" placeholder="9123456789" pattern="[0-9]{10}" maxlength="10" title="Enter your 10-digit mobile number without +63." required /></span></label>
            <label>Password<input type="password" name="password" autocomplete="new-password" minlength="8" placeholder="At least 8 characters" required /></label>
            <p class="pinoy-register-conditions">Complete at least one deposit to play. Before withdrawing, wager the bonus 5× in Slots (₱100 in valid bets).</p>
            <button type="button" class="pinoy-text-link" @click="openModal('welcome-bonus', welcomeBonus.title)">Welcome Bonus rules <PinoyIcon name="right" :size="13" /></button>
            <button type="submit" class="pinoy-primary pinoy-create-account"><span class="pinoy-create-bubble">₱20 Welcome Bonus</span>Create Account <PinoyIcon name="arrow" :size="17" /></button>
            <p v-if="registrationPreview" class="pinoy-form-status" role="status">This is a design preview. No account has been created.</p>
            <p class="pinoy-preview-note">Design preview only. Registration and bonus crediting are not connected.</p>
          </form>
          <p class="pinoy-register-login">Already have an account? <button class="pinoy-text-link" @click="openModal('login', 'Log In')">Log In</button></p>
        </template>
        <template v-else-if="modal.kind === 'rebate'">
          <PinoyBanner /><p class="pinoy-modal-lead">Up to <strong>1.5%</strong> back on eligible Slot bets.</p>
          <table class="pinoy-rebate-table"><thead><tr><th>Player</th><th>Rebate</th><th>Daily cap</th><th>Wagering</th></tr></thead><tbody><tr><td>Regular</td><td>1%</td><td>₱5,000</td><td>3×</td></tr><tr><td>New</td><td>1.5%</td><td>₱5,000</td><td>3×</td></tr><tr><td>VIP</td><td>1.5%</td><td>Unlimited</td><td>3×</td></tr></tbody></table>
          <ul class="pinoy-rules"><li>Daily settlement: 00:00–23:59:59. Rewards unlock at 9:00 AM the next day.</li><li>Check Upcoming rewards in Rewards after settlement, then claim manually when the countdown ends.</li><li>New-player status runs from the first deposit day through the following 6 calendar days.</li><li>Bets placed while your account has unfinished wagering requirements do not count.</li><li>Claim within 7 days of unlocking. Rebate rewards require 3× wagering.</li></ul>
        </template>
        <template v-else-if="modal.kind === 'weekly-cashback'">
          <PinoyBanner weekly />
          <p class="pinoy-modal-lead">{{ weeklyCashback.summary }}</p>
          <div class="pinoy-bonus-steps" aria-label="Weekly cashback benefits and requirements"><div><span>10%</span><strong>Weekly cashback</strong><small>Eligible Slot net losses</small></div><div><span>∞</span><strong>No reward cap</strong><small>Unlimited cashback</small></div><div><span>10×</span><strong>Slot wagering</strong><small>Before withdrawal</small></div></div>
          <h3 class="pinoy-rules-title">Activity Rules</h3>
          <ol class="pinoy-rules"><li v-for="rule in weeklyCashback.rules" :key="rule">{{ rule }}</li></ol>
          <button class="pinoy-primary pinoy-full-width" @click="openModal('rewards', 'Rewards')">View Rewards <PinoyIcon name="arrow" :size="17" /></button>
          <button class="pinoy-text-link" @click="openModal('promotions', 'Promotions')">View all promotions</button>
        </template>
        <template v-else-if="modal.kind === 'payday'">
          <PinoyBanner payday />
          <p class="pinoy-modal-lead">{{ payday.summary }}</p>
          <div class="pinoy-payday-periods" aria-label="Payday calculation periods"><div><small>PERIOD 01</small><strong>5th – 19th</strong><span>00:00 – 23:59:59</span></div><div><small>PERIOD 02</small><strong>20th – next month's 4th</strong><span>00:00 – 23:59:59</span></div></div>
          <h3 id="pinoy-payday-tiers" class="pinoy-rules-title">Reward tiers</h3>
          <p class="pinoy-payday-table-note">All amounts are in Philippine pesos (₱). Meet both the deposit and wagering thresholds for your tier.</p>
          <div class="pinoy-payday-table-wrap" role="region" aria-labelledby="pinoy-payday-tiers" tabindex="0"><table class="pinoy-rebate-table pinoy-payday-table"><caption class="sr-only">Payday deposit and wagering thresholds, reward amounts and withdrawal wagering requirements</caption><thead><tr><th scope="col">Tier</th><th scope="col">Total<br />deposits</th><th scope="col">Total<br />wagers</th><th scope="col">Reward</th><th scope="col">Wagering</th></tr></thead><tbody><tr v-for="tier in payday.tiers" :key="tier.level"><th scope="row">{{ tier.level }}</th><td>{{ formatAmount(tier.deposits) }}</td><td>{{ formatAmount(tier.wagers) }}</td><td class="pinoy-payday-reward">{{ formatAmount(tier.reward) }}</td><td>{{ tier.wagering }}×</td></tr></tbody></table></div>
          <h3 class="pinoy-rules-title">Activity Rules</h3>
          <ol class="pinoy-rules"><li v-for="rule in payday.rules" :key="rule">{{ rule }}</li></ol>
          <button class="pinoy-primary pinoy-full-width" @click="openModal('rewards', 'Rewards')">View Rewards <PinoyIcon name="arrow" :size="17" /></button>
          <button class="pinoy-text-link" @click="openModal('promotions', 'Promotions')">View all promotions</button>
        </template>
        <template v-else-if="modal.kind === 'first-three-deposits'">
          <PinoyBanner deposits />
          <p class="pinoy-modal-lead">{{ firstThreeDeposits.summary }}</p>
          <div class="pinoy-deposit-tiers" aria-label="First three deposit bonus rates and caps">
            <article v-for="tier in firstThreeDeposits.tiers" :key="tier.stage" class="pinoy-deposit-tier"><div class="pinoy-deposit-rate"><small>{{ tier.stage }}</small><strong>{{ tier.rate }}%<span>bonus</span></strong></div><dl><div><dt>Bonus cap</dt><dd>₱{{ formatAmount(tier.cap) }}</dd></div><div><dt>Wagering</dt><dd>{{ tier.wagering }}×</dd></div></dl><p>At the maximum bonus: ₱{{ formatAmount(tier.maxWagering) }} wagering required.</p></article>
          </div>
          <h3 class="pinoy-rules-title">Activity Rules</h3>
          <ol class="pinoy-rules"><li v-for="rule in firstThreeDeposits.rules" :key="rule">{{ rule }}</li></ol>
          <button class="pinoy-primary pinoy-full-width" @click="openModal('rewards', 'Rewards')">View Rewards <PinoyIcon name="arrow" :size="17" /></button>
          <button class="pinoy-text-link" @click="openModal('promotions', 'Promotions')">View all promotions</button>
        </template>
        <template v-else-if="modal.kind === 'royal-arrival'">
          <PinoyBanner royal />
          <p class="pinoy-modal-lead">{{ royalArrival.summary }}</p>
          <div class="pinoy-bonus-steps" aria-label="New Player Carnival reward overview"><div><span>28</span><strong>Reward tasks</strong><small>Wagering + free rewards</small></div><div><span>₱{{ formatAmount(royalArrival.totalRewards) }}</span><strong>Total rewards</strong><small>Across all listed tasks</small></div><div><span>1×</span><strong>Wagering</strong><small>Every task reward</small></div></div>
          <h3 id="pinoy-royal-tasks" class="pinoy-rules-title">Reward tasks</h3>
          <p class="pinoy-payday-table-note">All targets and rewards are in Philippine pesos (₱). Task amounts are listed individually below.</p>
          <div class="pinoy-payday-table-wrap" role="region" aria-labelledby="pinoy-royal-tasks" tabindex="0"><table class="pinoy-rebate-table pinoy-payday-table pinoy-royal-table"><caption class="sr-only">New Player Carnival task types, targets, rewards and wagering requirements</caption><thead><tr><th scope="col">No.</th><th scope="col">Task type</th><th scope="col">Target</th><th scope="col">Reward</th><th scope="col">Wagering</th></tr></thead><tbody><tr v-for="task in royalArrival.tasks" :key="task.id" :class="{ 'pinoy-royal-free': task.type === 'free' }"><th scope="row">{{ task.id }}</th><td>{{ task.type === 'free' ? 'Free reward' : 'Total wagers' }}</td><td>{{ formatAmount(task.target) }}</td><td class="pinoy-payday-reward">{{ formatAmount(task.reward) }}</td><td>{{ task.wagering }}×</td></tr></tbody></table></div>
          <button class="pinoy-primary pinoy-full-width" @click="openModal('rewards', 'Rewards')">View Rewards <PinoyIcon name="arrow" :size="17" /></button>
          <button class="pinoy-text-link" @click="openModal('promotions', 'Promotions')">View all promotions</button>
        </template>
        <template v-else-if="modal.kind === 'promotions'">
          <p class="pinoy-promo-intro">Discover your welcome, deposit, task and recurring rewards.</p>
          <div class="pinoy-promotion-list">
            <button class="pinoy-promotion-card" @click="openModal('welcome-bonus', welcomeBonus.title)"><PinoyBanner bonus /><span class="pinoy-promotion-info"><span><small>NEW PLAYERS</small><strong>₱20 Welcome Bonus</strong><span>Register · Automatic bonus credit</span></span><PinoyIcon name="right" :size="20" /></span></button>
            <button class="pinoy-promotion-card" @click="openModal('rebate', 'Slot Daily Rebate')"><PinoyBanner /><span class="pinoy-promotion-info"><span><small>EVERY DAY</small><strong>Slot Daily Rebate</strong><span>Up to 1.5% · All Slot games</span></span><PinoyIcon name="right" :size="20" /></span></button>
            <button class="pinoy-promotion-card" @click="openModal('weekly-cashback', weeklyCashback.title)"><PinoyBanner weekly /><span class="pinoy-promotion-info"><span><small>EVERY WEEK</small><strong>10% Weekly Cashback</strong><span>Eligible Slot net losses · No reward cap</span></span><PinoyIcon name="right" :size="20" /></span></button>
            <button class="pinoy-promotion-card" @click="openModal('payday', payday.title)"><PinoyBanner payday /><span class="pinoy-promotion-info"><span><small>TWO PERIODS EACH MONTH</small><strong>Payday</strong><span>Up to ₱5,000 · 8 reward tiers</span></span><PinoyIcon name="right" :size="20" /></span></button>
            <button class="pinoy-promotion-card" @click="openModal('first-three-deposits', firstThreeDeposits.title)"><PinoyBanner deposits /><span class="pinoy-promotion-info"><span><small>NEW PLAYER DEPOSIT BONUSES</small><strong>First 3 Deposits</strong><span>100% + 80% + 50% · Up to ₱17,000 total</span></span><PinoyIcon name="right" :size="20" /></span></button>
            <button class="pinoy-promotion-card" @click="openModal('royal-arrival', royalArrival.title)"><PinoyBanner royal /><span class="pinoy-promotion-info"><span><small>28 REWARD TASKS</small><strong>{{ royalArrival.title }}</strong><span>Approximately ₱16,000 total · 1× wagering</span></span><PinoyIcon name="right" :size="20" /></span></button>
          </div>
        </template>
        <template v-else-if="modal.kind === 'rewards'"><p class="pinoy-modal-lead">Your rewards, in one place.</p><button class="pinoy-reward-item" @click="openModal('welcome-bonus', welcomeBonus.title)"><PinoyIcon name="gift" :size="32" /><span><strong>₱20 Welcome Bonus</strong><small>New players · Credited automatically</small></span><PinoyIcon name="right" :size="18" /></button><button class="pinoy-reward-item" @click="openModal('rebate', 'Slot Daily Rebate')"><PinoyIcon name="rebate" :size="32" /><span><strong>Slot Daily Rebate</strong><small>Up to 1.5% · All Slot games</small></span><PinoyIcon name="right" :size="18" /></button><button class="pinoy-reward-item" @click="openModal('weekly-cashback', weeklyCashback.title)"><PinoyIcon name="cashback" :size="32" /><span><strong>10% Weekly Cashback</strong><small>Mondays at 9:00 AM · Claim within 7 days</small></span><PinoyIcon name="right" :size="18" /></button><button class="pinoy-reward-item" @click="openModal('payday', payday.title)"><PinoyIcon name="calendar" :size="32" /><span><strong>Payday</strong><small>Up to ₱5,000 · Claim within 7 days</small></span><PinoyIcon name="right" :size="18" /></button><button class="pinoy-reward-item" @click="openModal('first-three-deposits', firstThreeDeposits.title)"><PinoyIcon name="wallet" :size="32" /><span><strong>First 3 Deposits</strong><small>100% + 80% + 50% · Up to ₱17,000 total</small></span><PinoyIcon name="right" :size="18" /></button><button class="pinoy-reward-item" @click="openModal('royal-arrival', royalArrival.title)"><PinoyIcon name="gift" :size="32" /><span><strong>{{ royalArrival.title }}</strong><small>28 reward tasks · 1× wagering</small></span><PinoyIcon name="right" :size="18" /></button><p class="pinoy-preview-note">Sign in to see eligible and upcoming rewards.</p></template>
        <template v-else-if="modal.kind === 'catalog'"><label class="pinoy-search"><PinoyIcon name="search" :size="19" /><input v-model="search" type="search" aria-label="Search games" placeholder="Search games" /></label><div class="pinoy-provider-filters" aria-label="Filter by provider"><button v-for="provider in ['All', ...data.groups.map(group => group.name)]" :key="provider" :aria-pressed="selectedProvider === provider" @click="selectedProvider = provider">{{ provider }}</button></div><p class="pinoy-results">{{ filteredGames.length }} featured games</p><div v-if="filteredGames.length" class="pinoy-game-grid"><button v-for="game in filteredGames" :key="game.image" class="pinoy-game-card" :aria-label="`View ${game.name}`" @click="openModal('game', game.name, { game, provider: game.provider })"><img :src="asset(game.image)" alt="" width="320" height="320" loading="lazy" /><span>{{ game.name }}</span></button></div><p v-else class="pinoy-empty">No games found. Try another name or provider.</p></template>
        <template v-else-if="modal.kind === 'game'"><img class="pinoy-game-preview" :src="asset(modal.game.image)" :alt="modal.game.name" width="320" height="320" /><p class="pinoy-modal-lead">{{ modal.provider }} · {{ modal.game.name }}</p><p class="pinoy-preview-note">Game preview only. Playing is not available in this static homepage.</p><button class="pinoy-primary" @click="openModal('catalog', 'Explore games', { provider: modal.provider })">Browse games</button></template>
        <template v-else-if="modal.kind === 'menu'"><img class="pinoy-menu-logo" :src="asset('assets/pinoyplay/logo.webp')" alt="PinoyPlay" /><div class="pinoy-menu-links"><button @click="openModal('catalog', 'Explore games')"><PinoyIcon name="gamepad" />All games<PinoyIcon name="right" :size="16" /></button><button @click="openModal('promotions', 'Promotions')"><PinoyIcon name="gift" />Promotions<PinoyIcon name="right" :size="16" /></button><button @click="openModal('rewards', 'Rewards')"><PinoyIcon name="gift" />Rewards<PinoyIcon name="right" :size="16" /></button><button @click="openModal('rebate', 'Slot Daily Rebate')"><PinoyIcon name="rebate" />Slot Daily Rebate<PinoyIcon name="right" :size="16" /></button></div><div class="pinoy-mobile-controls"><BannerTypeSwitch compact /><GameBrightnessControl compact /></div></template>
        <template v-else><div class="pinoy-modal-symbol"><PinoyIcon :name="modal.kind === 'login' || modal.kind === 'register' ? 'profile' : modal.kind" :size="40" /></div><p class="pinoy-modal-lead">{{ modalDescriptions[modal.kind] }}</p><button class="pinoy-primary" @click="closeModal">Back to homepage</button></template>
      </div>
    </dialog>
  </div>
</template>
