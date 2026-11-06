<script setup>
import { useBannerType } from '../bannerType'
import PinoyRebateBanner from './PinoyRebateBanner.vue'
import PinoyWelcomeBanner from './PinoyWelcomeBanner.vue'
import PinoyRoosterBanner from './PinoyRoosterBanner.vue'
defineProps({ bonus: Boolean, weekly: Boolean, payday: Boolean, deposits: Boolean, royal: Boolean })
const { bannerType } = useBannerType()
const carnivalArtwork = `${import.meta.env.BASE_URL}assets/pinoyplay/new-player-carnival-v1.png`
</script>

<template>
  <div class="pinoy-banner" :class="{ 'pinoy-banner--motion': bannerType === 'layered' }">
    <img v-if="royal" :src="carnivalArtwork" alt="New Player Carnival — approximately ₱16,000 in total rewards" width="1882" height="836" />
    <PinoyRoosterBanner v-else-if="deposits" campaign="deposits" :type="bannerType" />
    <PinoyRoosterBanner v-else-if="payday" campaign="payday" :type="bannerType" />
    <PinoyRoosterBanner v-else-if="weekly" campaign="weekly" :type="bannerType" />
    <PinoyWelcomeBanner v-else-if="bonus" :type="bannerType" />
    <PinoyRebateBanner v-else :type="bannerType" />
    <span v-if="bonus" class="pinoy-banner-shine" aria-hidden="true" />
  </div>
</template>
