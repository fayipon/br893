<script setup>
import { useBannerType } from '../bannerType'
import PinoyRebateBanner from './PinoyRebateBanner.vue'
import PinoyWelcomeBanner from './PinoyWelcomeBanner.vue'
defineProps({ bonus: Boolean, weekly: Boolean, payday: Boolean, deposits: Boolean, royal: Boolean })
const { bannerType } = useBannerType()
const weeklyArtwork = `${import.meta.env.BASE_URL}assets/pinoyplay/weekly-cashback-v4-rooster.png`
const paydayArtwork = `${import.meta.env.BASE_URL}assets/pinoyplay/payday-v2-rooster.png`
const depositsArtwork = `${import.meta.env.BASE_URL}assets/pinoyplay/first-three-deposits-v2-rooster.png`
const carnivalArtwork = `${import.meta.env.BASE_URL}assets/pinoyplay/new-player-carnival-v1.png`
</script>

<template>
  <div class="pinoy-banner" :class="{ 'pinoy-banner--motion': bannerType === 'layered' }">
    <img v-if="royal" :src="carnivalArtwork" alt="New Player Carnival — approximately ₱16,000 in total rewards" width="1882" height="836" />
    <img v-else-if="deposits" :src="depositsArtwork" alt="First 3 Deposits — total bonus up to ₱17,000" width="1882" height="836" />
    <img v-else-if="payday" :src="paydayArtwork" alt="Payday — up to ₱5,000 in tier rewards" width="1882" height="836" />
    <img v-else-if="weekly" :src="weeklyArtwork" alt="Weekly Cashback — 10% back on eligible weekly net losses from Slot games" width="1882" height="836" />
    <PinoyWelcomeBanner v-else-if="bonus" :type="bannerType" />
    <PinoyRebateBanner v-else :type="bannerType" />
    <span v-if="bonus" class="pinoy-banner-shine" aria-hidden="true" />
  </div>
</template>
