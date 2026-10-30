<script setup>
defineProps({ compact: Boolean })
const markUrl = `${import.meta.env.BASE_URL}assets/ipa/brand-mark-v1.png`
</script>

<template>
  <span class="ipa-brand" :class="{ 'ipa-brand--compact': compact }" role="img" aria-label="Jito Gaming">
    <img class="ipa-brand-mark" :src="markUrl" alt="" width="256" height="256" />
    <span v-if="!compact" class="ipa-brand-wordmark" aria-hidden="true"><span class="ipa-brand-name">Jito</span><span class="ipa-brand-gaming">Gaming</span></span>
  </span>
</template>

<style scoped>
.ipa-brand { display: inline-flex; align-items: center; justify-content: center; gap: 3px; flex-shrink: 0; width: max-content; height: auto; color: #fff0e9; font: 800 22px/1 'Baloo 2', sans-serif; letter-spacing: -.6px; }
.ipa-brand-mark { display: block; flex: 0 0 auto; width: 2.3em; height: 2.3em; object-fit: contain; }
.ipa-brand-wordmark { display: inline-flex; align-items: baseline; gap: .15em; white-space: nowrap; transform: translateY(2px) scaleY(1.45); transform-origin: center; filter: drop-shadow(0 1px 1px rgb(0 0 0 / 40%)); }
.ipa-brand-name { color: #ff7375; background: linear-gradient(#ffafb0 10%, #ee414d 65%, #bc172f); background-clip: text; -webkit-text-fill-color: transparent; }
.ipa-brand-gaming { color: #f7d68d; background: linear-gradient(#fff5d7 10%, #f0c470 66%, #bf862e); background-clip: text; -webkit-text-fill-color: transparent; }
.ipa-brand--compact { width: 44px; height: 44px; gap: 0; border: 1px solid rgb(237 113 136 / 36%); border-radius: 11px; background: linear-gradient(145deg, #7d3546, #321720); }
.ipa-brand--compact .ipa-brand-mark { width: 100%; height: 100%; }
@media (forced-colors: active) { .ipa-brand-name, .ipa-brand-gaming { background: none; -webkit-text-fill-color: currentColor; } }
</style>
