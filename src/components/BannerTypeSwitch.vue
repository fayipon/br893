<script setup>
import { useId } from 'vue'
import { useBannerType } from '../bannerType'

defineProps({ compact: Boolean })
const { bannerType, setBannerType } = useBannerType()
const labelId = useId()
const descriptionId = useId()
</script>

<template>
  <div class="banner-type-control" :class="{ compact }">
    <div class="banner-type-copy"><span :id="labelId">Banner type switch</span><small :id="descriptionId">{{ bannerType === 'layered' ? 'Artwork + motion' : 'Original image' }}</small></div>
    <button type="button" role="switch" class="banner-type-toggle" :aria-labelledby="labelId" :aria-describedby="descriptionId" :aria-checked="bannerType === 'layered'" @click="setBannerType(bannerType === 'layered' ? 'image' : 'layered')"><span /></button>
  </div>
</template>

<style scoped>
.banner-type-control { display: flex; align-items: center; justify-content: space-between; gap: 24px; min-width: 0; padding: 18px 22px; border: 1px solid var(--panel-border); border-radius: 13px; background: var(--panel-surface); }
.banner-type-copy { display: flex; flex-direction: column; gap: 2px; }
.banner-type-copy > span { color: var(--text-primary); font-size: 16px; font-weight: 600; }
.banner-type-copy > small { color: var(--text-secondary); font-size: 12px; }
.banner-type-toggle { position: relative; flex: 0 0 48px; width: 48px; height: 44px; border-radius: 22px; }
.banner-type-toggle::before { content: ''; position: absolute; inset: 8px 0; border: 1px solid rgb(218 195 237 / 25%); border-radius: 20px; background: var(--surface-raised); }
.banner-type-toggle > span { position: absolute; left: 4px; width: 20px; height: 20px; border-radius: 50%; background: #f7f2fa; box-shadow: 0 1px 4px rgb(0 0 0 / 25%); transition: transform .2s ease; }
.banner-type-toggle[aria-checked='true']::before { background: var(--pink-action-gradient); border-color: #dba1bf; }
.banner-type-toggle[aria-checked='true'] > span { transform: translateX(20px); }
.compact { width: 100%; padding: 12px; gap: 10px; background: rgb(50 35 63 / 76%); backdrop-filter: blur(12px); }
.compact .banner-type-copy > span { font-size: 12px; }
.compact .banner-type-copy > small { font-size: 10px; }
@media (prefers-reduced-motion: reduce) { .banner-type-toggle > span { transition: none; } }
</style>
