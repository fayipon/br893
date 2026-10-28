import { onMounted, onUnmounted, ref } from 'vue'

const storageKey = 'br893.game-brightness'
const defaultBrightness = 70
const gameBrightness = ref(defaultBrightness)
const normalize = value => {
  if (value == null || String(value).trim() === '') return defaultBrightness
  const number = Number(value)
  return Number.isFinite(number) ? Math.min(100, Math.max(0, Math.round(number))) : defaultBrightness
}

function readPreference() {
  try { return normalize(localStorage.getItem(storageKey)) } catch { return gameBrightness.value }
}

export function useGameBrightness() {
  const syncPreference = event => {
    if (!event || event.key === storageKey || event.key === null) gameBrightness.value = readPreference()
  }
  const setGameBrightness = value => {
    gameBrightness.value = normalize(value)
    try { localStorage.setItem(storageKey, String(gameBrightness.value)) } catch { /* Keep the slider usable without storage. */ }
  }
  onMounted(() => {
    syncPreference()
    window.addEventListener('storage', syncPreference)
  })
  onUnmounted(() => window.removeEventListener('storage', syncPreference))
  return { gameBrightness, setGameBrightness }
}
