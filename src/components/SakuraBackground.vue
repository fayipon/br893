<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const canvas = ref(null)
const ink = '225, 225, 225'
const tau = Math.PI * 2
// A cropped, sweeping tree frames the left edge, with open air to the right.
const limbs = [
  [[-80, 1040, 190, 935, -80, 755, 28, 550], 72, 30],
  [[28, 550, -5, 405, 112, 300, 35, 85], 34, 5],
  [[24, 550, 142, 465, 280, 470, 482, 310], 31, 1],
  [[32, 642, 220, 605, 316, 660, 540, 480], 30, 1],
  [[20, 778, 190, 727, 270, 790, 465, 660], 22, 1],
  [[60, 280, 188, 186, 317, 191, 470, 75], 20, 1],
  [[54, 390, 190, 334, 278, 322, 366, 218], 17, 1],
  [[60, 936, 137, 870, 253, 939, 383, 845], 21, 1],
  [[130, 502, 148, 418, 175, 393, 150, 330], 10, .7],
  [[254, 445, 284, 370, 287, 316, 265, 276], 9, .7],
  [[357, 390, 427, 376, 489, 406, 551, 362], 8, .7],
  [[150, 624, 178, 562, 195, 536, 228, 514], 9, .7],
  [[331, 602, 381, 541, 362, 500, 402, 452], 8, .7],
  [[130, 749, 165, 688, 152, 658, 180, 628], 8, .7],
  [[309, 732, 348, 693, 357, 660, 355, 615], 7, .7],
  [[189, 201, 210, 150, 187, 108, 226, 61], 8, .7],
  [[302, 155, 355, 135, 414, 167, 463, 139], 7, .7],
]
const crowns = [
  [-25, 25, 85, 75], [67, 35, 98, 56], [156, 92, 98, 65],
  [248, 67, 70, 48], [339, 128, 106, 57], [459, 81, 77, 48],
  [67, 196, 90, 60], [192, 203, 84, 65], [329, 225, 75, 55],
  [37, 328, 116, 68], [151, 330, 95, 63], [263, 281, 68, 54],
  [295, 377, 120, 72], [449, 316, 102, 62], [548, 367, 62, 44],
  [50, 456, 112, 82], [184, 486, 92, 70], [311, 497, 93, 65],
  [416, 463, 66, 47], [519, 482, 66, 49], [9, 598, 87, 77],
  [156, 633, 86, 66], [270, 661, 97, 62], [414, 655, 98, 60],
  [477, 700, 64, 44], [260, 759, 75, 51], [24, 856, 95, 50],
  [133, 896, 100, 58], [286, 875, 94, 52], [377, 852, 61, 43],
]

let context, treeTexture, motionPreference
let frame = 0, resizeFrame = 0, previousTime = 0, time = 0
let width = 0, height = 0, gutter = 0, disposed = false
let treeDots = [], livingDots = [], emissionPoints = [], flakes = []

function randomSource() {
  let seed = 893
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0
    return seed / 4294967296
  }
}

function curvePoint(curve, t) {
  const u = 1 - t
  return {
    x: u ** 3 * curve[0] + 3 * u * u * t * curve[2] + 3 * u * t * t * curve[4] + t ** 3 * curve[6],
    y: u ** 3 * curve[1] + 3 * u * u * t * curve[3] + 3 * u * t * t * curve[5] + t ** 3 * curve[7],
  }
}

function buildTreeDots() {
  const random = randomSource()
  const dots = []
  limbs.forEach(([curve, startWidth, endWidth]) => {
    const length = Math.hypot(curve[6] - curve[0], curve[7] - curve[1])
    const count = Math.ceil(length * (startWidth + endWidth) * .15)
    for (let i = 0; i < count; i++) {
      const t = random()
      const point = curvePoint(curve, t)
      const tangent = curvePoint(curve, Math.min(1, t + .002))
      const angle = Math.atan2(tangent.y - point.y, tangent.x - point.x) + Math.PI / 2
      const breadth = endWidth + (startWidth - endWidth) * (1 - t) ** 1.25
      const offset = (random() + random() - 1) * breadth * .6
      dots.push({
        x: point.x + Math.cos(angle) * offset,
        y: point.y + Math.sin(angle) * offset,
        radius: .55 + random() * 1.1, opacity: .12 + random() * .24, bloom: false,
      })
    }
  })
  crowns.forEach(([x, y, rx, ry]) => {
    // Uneven blossom clouds break the outline into airy groups of round points.
    for (let cluster = 0; cluster < 15; cluster++) {
      const a = random() * tau
      const r = Math.sqrt(random())
      const cx = x + Math.cos(a) * rx * r
      const cy = y + Math.sin(a) * ry * r
      const spread = 12 + random() * 22
      for (let i = 0; i < 19; i++) {
        const angle = random() * tau
        const radius = Math.sqrt(random()) * spread
        dots.push({
          x: cx + Math.cos(angle) * radius,
          y: cy + Math.sin(angle) * radius * .7,
          radius: .7 + random() ** 2 * 2.2,
          opacity: .15 + random() * .46, bloom: true,
          phase: random() * tau,
        })
      }
    }
  })
  return dots
}

function dot(ctx, x, y, radius, opacity) {
  ctx.fillStyle = 'rgba(' + ink + ', ' + opacity + ')'
  ctx.beginPath()
  ctx.arc(x, y, radius, 0, tau)
  ctx.fill()
}

function composeTree(ratio) {
  treeTexture = document.createElement('canvas')
  treeTexture.width = Math.ceil(gutter * ratio)
  treeTexture.height = Math.ceil(height * ratio)
  const ctx = treeTexture.getContext('2d')
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
  const scale = height / 1000
  const spread = Math.max(340, Math.min(gutter + 90, height * .72)) / 620
  const xOffset = -Math.max(30, (620 * spread - gutter) * .27)
  livingDots = []
  emissionPoints = []
  treeDots.forEach((point, index) => {
    const x = point.x * spread + xOffset
    const y = point.y * scale
    if (x < -5 || x > gutter + 5 || y < -5 || y > height + 5) return
    const radius = point.radius * Math.min(1.25, Math.max(.9, scale))
    const edge = Math.min(1, Math.max(0, (gutter - x) / 28))
    if (point.bloom && index % 8 === 0) {
      livingDots.push({ x, y, radius, opacity: point.opacity * edge, phase: point.phase })
    } else dot(ctx, x, y, radius, point.opacity * edge)
    if (point.bloom && index % 12 === 0 && x > 10 && x < gutter - 12) emissionPoints.push({ x, y })
  })
}

function newFlake(initial = false, side) {
  side ??= Math.random() < .45 ? 'left' : 'right'
  const depth = Math.random()
  const near = depth > .82
  const origin = emissionPoints[Math.floor(Math.random() * emissionPoints.length)]
  const fromBranch = !initial && side === 'left' && origin && Math.random() < .7
  const fromEdge = !initial && !fromBranch && Math.random() < .6
  return {
    side,
    x: fromBranch ? origin.x : fromEdge ? -24 : Math.random() * gutter,
    y: initial ? Math.random() * height : fromBranch ? origin.y : fromEdge ? Math.random() * height * .8 : -24,
    radius: near ? 5 + Math.random() * 4 : 1.7 + depth * 3.6,
    fall: 16 + depth * 28,
    drift: 14 + depth * 28,
    sway: 12 + depth * 26,
    phase: Math.random() * tau,
    opacity: near ? .3 + Math.random() * .18 : .23 + Math.random() * .4,
    near, age: initial ? 4 : 0,
  }
}

function render(delta = 0) {
  context.clearRect(0, 0, width, height)
  context.save()
  context.beginPath()
  context.rect(0, 0, gutter, height)
  context.rect(width - gutter, 0, gutter, height)
  context.clip()
  context.drawImage(treeTexture, 0, 0, gutter, height)
  livingDots.forEach(point => {
    const sway = Math.sin(time * .5 + point.phase) * 2.5
    const breath = .72 + Math.sin(time * .65 + point.phase) * .18
    dot(context, point.x + sway, point.y + Math.cos(time * .35 + point.phase) * 1.8, point.radius, point.opacity * breath)
  })
  const gust = 1 + Math.sin(time * .23) * .36
  flakes.forEach((particle, index) => {
    particle.age += delta
    particle.x += (particle.drift * gust + Math.cos(time * .8 + particle.phase) * 7) * delta
    particle.y += (particle.fall + Math.sin(time * .6 + particle.phase) * 8) * delta
    if (particle.x > gutter + 55 || particle.y > height + 40) {
      particle = flakes[index] = newFlake(false, particle.side)
    }
    const x = particle.x + Math.sin(time * .75 + particle.phase) * particle.sway
    const y = particle.y + Math.cos(time * .48 + particle.phase) * 13
    const origin = particle.side === 'right' ? width - gutter : 0
    const edge = Math.min(1, Math.max(0, (gutter - x) / 22), Math.max(0, (x + 28) / 28))
    const opacity = particle.opacity * Math.min(1, particle.age / 2) * edge
    if (particle.near) {
      dot(context, origin + x, y, particle.radius * 1.85, opacity * .07)
      dot(context, origin + x, y, particle.radius * 1.35, opacity * .15)
    }
    dot(context, origin + x, y, particle.radius, opacity)
  })
  context.restore()
}

function animate(timestamp) {
  if (disposed) return
  frame = requestAnimationFrame(animate)
  if (!previousTime) previousTime = timestamp
  const elapsed = timestamp - previousTime
  if (elapsed < 1000 / 30) return
  const delta = Math.min(elapsed / 1000, .1)
  previousTime = timestamp
  time += delta
  render(delta)
}

function syncMotion() {
  cancelAnimationFrame(frame)
  frame = 0
  previousTime = 0
  if (!context || gutter <= 0 || document.hidden || disposed) return
  render()
  if (!motionPreference.matches) frame = requestAnimationFrame(animate)
}

function resize() {
  if (disposed || !context) return
  width = document.documentElement.clientWidth
  height = window.innerHeight
  const mobileWidth = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--mobile-max-width')) || 520
  gutter = Math.max(0, (width - mobileWidth) / 2)
  if (!gutter) {
    syncMotion()
    context.clearRect(0, 0, canvas.value.width, canvas.value.height)
    return
  }
  const ratio = Math.min(window.devicePixelRatio || 1, 1.5)
  canvas.value.width = Math.round(width * ratio)
  canvas.value.height = Math.round(height * ratio)
  context.setTransform(ratio, 0, 0, ratio, 0, 0)
  composeTree(ratio)
  const count = Math.min(105, Math.max(46, Math.round(gutter * height / 8000)))
  flakes = Array.from({ length: count }, () => newFlake(true))
  syncMotion()
}

function scheduleResize() {
  cancelAnimationFrame(resizeFrame)
  resizeFrame = requestAnimationFrame(resize)
}

onMounted(() => {
  context = canvas.value.getContext('2d')
  if (!context) return
  motionPreference = matchMedia('(prefers-reduced-motion: reduce)')
  treeDots = buildTreeDots()
  resize()
  window.addEventListener('resize', scheduleResize, { passive: true })
  document.addEventListener('visibilitychange', syncMotion)
  motionPreference.addEventListener('change', syncMotion)
})

onUnmounted(() => {
  disposed = true
  cancelAnimationFrame(frame)
  cancelAnimationFrame(resizeFrame)
  window.removeEventListener('resize', scheduleResize)
  document.removeEventListener('visibilitychange', syncMotion)
  motionPreference?.removeEventListener('change', syncMotion)
})
</script>

<template>
  <canvas ref="canvas" class="sakura-background" aria-hidden="true" />
</template>

<style scoped>
.sakura-background { position: fixed; inset: 0; z-index: 0; width: 100%; height: 100dvh; pointer-events: none; }
@media (max-width: 520px) { .sakura-background { display: none; } }
</style>
