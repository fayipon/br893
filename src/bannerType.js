import { onMounted, onUnmounted, ref } from 'vue'

const storageKey = 'br893.banner-type'
const normalize = value => value === 'image' ? 'image' : 'layered'
const bannerType = ref('layered')

function readPreference() {
  try { return normalize(localStorage.getItem(storageKey)) } catch { return bannerType.value }
}

export function useBannerType() {
  const syncPreference = event => {
    if (!event || event.key === storageKey || event.key === null) bannerType.value = readPreference()
  }
  const setBannerType = value => {
    bannerType.value = normalize(value)
    try { localStorage.setItem(storageKey, bannerType.value) } catch { /* The switch still works without storage. */ }
  }
  onMounted(() => {
    syncPreference()
    window.addEventListener('storage', syncPreference)
  })
  onUnmounted(() => window.removeEventListener('storage', syncPreference))
  return { bannerType, setBannerType }
}
