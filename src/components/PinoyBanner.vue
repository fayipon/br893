<script setup>
import { useBannerType } from '../bannerType'
import PinoyRebateBanner from './PinoyRebateBanner.vue'
import PinoyWelcomeBanner from './PinoyWelcomeBanner.vue'
import PinoyCampaignBanner from './PinoyCampaignBanner.vue'
defineProps({ bonus: Boolean, weekly: Boolean, payday: Boolean, deposits: Boolean, royal: Boolean })
const { bannerType } = useBannerType()
</script>

<template>
  <div class="pinoy-banner" :class="{ 'pinoy-banner--motion': bannerType === 'layered' }">
    <PinoyCampaignBanner v-if="royal" campaign="carnival" :type="bannerType" />
    <PinoyCampaignBanner v-else-if="deposits" campaign="deposits" :type="bannerType" />
    <PinoyCampaignBanner v-else-if="payday" campaign="payday" :type="bannerType" />
    <PinoyCampaignBanner v-else-if="weekly" campaign="weekly" :type="bannerType" />
    <PinoyWelcomeBanner v-else-if="bonus" :type="bannerType" />
    <PinoyRebateBanner v-else :type="bannerType" />
    <span v-if="bonus" class="pinoy-banner-shine" aria-hidden="true" />
  </div>
</template>
