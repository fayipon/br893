<script setup>
import { useId } from 'vue'
import { useGameBrightness } from '../gameBrightness'

defineProps({ compact: Boolean })
const { gameBrightness, setGameBrightness } = useGameBrightness()
const sliderId = useId()
</script>

<template>
  <div class="game-brightness-control" :class="{ compact }">
    <div class="game-brightness-heading"><label :for="sliderId">Game brightness</label><output :for="sliderId">{{ gameBrightness }}%</output></div>
    <input :id="sliderId" class="game-brightness-slider" type="range" min="0" max="100" step="1" :value="gameBrightness" :aria-valuetext="`${gameBrightness}%`" :style="{ '--slider-fill': `${gameBrightness}%` }" @input="setGameBrightness($event.target.valueAsNumber)" />
    <div class="game-brightness-limits" aria-hidden="true"><span>0%</span><span>100%</span></div>
  </div>
</template>

<style scoped>
.game-brightness-control { min-width: 0; padding: 18px 22px; border: 1px solid var(--panel-border); border-radius: 13px; background: var(--panel-surface); }
.game-brightness-heading { display: flex; align-items: center; justify-content: space-between; gap: 12px; color: var(--text-primary); font-size: 16px; font-weight: 600; }
.game-brightness-heading output { flex-shrink: 0; color: #e6a7c6; font-variant-numeric: tabular-nums; }
.game-brightness-slider { display: block; appearance: none; -webkit-appearance: none; width: 100%; height: 32px; margin: 4px 0 0; padding: 0; border: 0; border-radius: 5px; background: transparent; cursor: pointer; accent-color: #b05a85; }
.game-brightness-slider::-webkit-slider-runnable-track { height: 5px; border-radius: 5px; background: linear-gradient(to right, #b05a85 0 var(--slider-fill), #62506f var(--slider-fill) 100%); }
.game-brightness-slider::-webkit-slider-thumb { appearance: none; -webkit-appearance: none; width: 18px; height: 18px; margin-top: -6.5px; border: 2px solid #e5b9d0; border-radius: 50%; background: var(--pink-action-gradient); box-shadow: 0 2px 5px rgb(0 0 0 / 25%); }
.game-brightness-slider::-moz-range-track { height: 5px; border-radius: 5px; background: #62506f; }
.game-brightness-slider::-moz-range-progress { height: 5px; border-radius: 5px; background: #b05a85; }
.game-brightness-slider::-moz-range-thumb { box-sizing: border-box; width: 18px; height: 18px; border: 2px solid #e5b9d0; border-radius: 50%; background: var(--pink-action-gradient); box-shadow: 0 2px 5px rgb(0 0 0 / 25%); }
.game-brightness-limits { display: flex; justify-content: space-between; color: var(--text-muted); font-size: 11px; }
.compact { width: 100%; padding: 12px; background: rgb(50 35 63 / 76%); backdrop-filter: blur(12px); }
.compact .game-brightness-heading { font-size: 12px; }
.compact .game-brightness-limits { font-size: 10px; }
</style>
