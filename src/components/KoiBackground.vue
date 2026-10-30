<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { createFeedingState, dropFood, foodPosition, isFeedingActive, stepFeeding } from '../koiFeeding.js'

const canvas = ref(null)
const feeding = ref(false)
const feedAnnouncement = ref('')
const tau = Math.PI * 2
const frameInterval = 1000 / 30
const fishColors = [
  ['#f1dfc5', '#cb594b', '#f2c583', '#9a493c', '#fff1d5'],
  ['#e7cca0', '#ae3d43', '#dba962', '#825445', '#fff1d5'],
  ['#eee7d8', '#b65043', '#e3c78e', '#776860', '#fff8e7'],
  ['#d9b779', '#a74537', '#f1cc7e', '#816043', '#ffedc2'],
  ['#eadfd1', '#be6970', '#dfb89a', '#87646a', '#fff0e2'],
]
const fishScales = [1, .85, .68, .56, .43]
const lilyPads = [
  { side: 0, x: .16, y: .17, size: 60, angle: -.8 },
  { side: 0, x: .34, y: .25, size: 32, angle: .5 },
  { side: 1, x: .86, y: .73, size: 55, angle: 2.4 },
  { side: 1, x: .68, y: .84, size: 29, angle: -1.2 },
]

let context, motionPreference, pondTexture
let frame = 0, resizeFrame = 0, previousTime = 0, time = 0
let width = 0, height = 0, gutter = 0, bodyLength = 0
let active = false, disposed = false, wakeClock = 0
let dust = [], wakes = [], ripples = []
let feedingState = createFeedingState()
let feedingRipples = []
let seed = 89317

function random() {
  seed = (seed * 1664525 + 1013904223) >>> 0
  return seed / 4294967296
}

function breadth(s) {
  return (.17 * Math.sin(Math.PI * (s + .06) / 1.14) ** .65 * (1 - .65 * s) + .008)
}

function spine(s, koi) {
  return Math.sin(s * 7 - koi.swimClock * 3.1 + koi.phase) * .052 * s ** 1.8
}

function markings(s, v, index) {
  const patches = index === 0
    ? [[.12, -.1, .12, .8], [.43, .45, .15, .9], [.73, -.35, .11, .7]]
    : [[.2, .45, .12, .8], [.52, -.3, .18, .8], [.83, .1, .08, .8]]
  const red = patches.some(([x, y, rx, ry]) => ((s - x) / rx) ** 2 + ((v - y) / ry) ** 2 < 1 + .12 * Math.sin(s * 73 + v * 9))
  if (Math.abs(v) > .85) return 3
  if (red) return 1
  return random() < .15 ? 2 : random() < .18 ? 4 : 0
}

function makeFish(index) {
  const groups = fishColors[index].map(() => [])
  for (let i = 0; i < Math.round(1250 * fishScales[index]); i++) {
    const s = random(), v = random() * 2 - 1
    groups[markings(s, v, index)].push({ part: 'body', s, v, radius: .45 + random() * .7 })
  }
  for (let i = 0; i < Math.round(360 * fishScales[index]); i++) {
    groups[i % 4 === 0 ? 2 : 0].push({ part: 'tail', s: random(), v: random() * 2 - 1, radius: .35 + random() * .65 })
  }
  for (const side of [-1, 1]) {
    for (let i = 0; i < Math.round(180 * fishScales[index]); i++) {
      groups[i % 4 === 0 ? 2 : 0].push({ part: 'fin', s: random(), v: random(), side, radius: .35 + random() * .6 })
    }
  }
  return {
    index, groups, side: index % 2, scale: fishScales[index],
    phase: .4 + index * 1.9, orbit: [-1.2, .9, 1.8, 3.8, 4.5][index],
    speed: [.105, -.115, -.087, .095, .13][index],
    swimClock: 0,
  }
}

const fish = fishScales.map((_, index) => makeFish(index))
const leafSpecks = Array.from({ length: 420 }, () => {
  const angle = .09 + random() * (tau - .18)
  const radius = Math.sqrt(random())
  return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius, alpha: .08 + random() * .2, radius: .3 + random() * .4 }
})

function poseAt(koi, at) {
  const phase = koi.orbit + at * koi.speed
  const size = bodyLength * koi.scale
  const top = koi.side ? Math.min(340, height * .46) : 55
  const bottom = height - 45
  const centerY = (top + bottom) / 2
  const radiusY = Math.max(20, (bottom - top) / 2 - size * .48) * (1 - koi.index * .065)
  const radiusX = gutter * (.18 + koi.index * .035)
  const centerX = koi.side ? width - gutter / 2 : gutter / 2
  const angle = Math.atan2(-Math.sin(phase) * radiusY * koi.speed, Math.cos(phase) * radiusX * koi.speed)
  // Keep the whole fish in its pool as its long body turns across a narrow gutter.
  const c = Math.cos(angle), s = Math.sin(angle)
  const halfWidth = (Math.abs(c) * .71 + Math.abs(s) * .31) * size
  const halfHeight = (Math.abs(s) * .71 + Math.abs(c) * .31) * size
  const limitX = Math.max(0, gutter / 2 - halfWidth - 12)
  const limitY = Math.max(0, (bottom - top) / 2 - halfHeight)
  const x = centerX + Math.max(-limitX, Math.min(limitX, Math.sin(phase) * radiusX)) + .2 * size * c
  const y = centerY + Math.max(-limitY, Math.min(limitY, Math.cos(phase) * radiusY)) + .2 * size * s
  return { x, y, angle }
}

function dot(x, y, radius) {
  context.moveTo(x + radius, y)
  context.arc(x, y, radius, 0, tau)
}

function particlePosition(point, koi) {
  const { s, v } = point
  if (point.part === 'body') return { x: .48 - s, y: spine(s, koi) + v * breadth(s) }
  if (point.part === 'tail') {
    const sway = Math.sin(7 - koi.swimClock * 3.1 + koi.phase)
    return {
      x: -.52 - s * .38 + .1 * s * (1 - Math.abs(v)) ** 2,
      y: spine(1, koi) + sway * s * .09 + v * (.014 + .21 * s),
    }
  }
  const flutter = .85 + Math.sin(koi.swimClock * 2.2 + koi.phase + point.side) * .15
  return { x: .2 - s * .3, y: spine(.3, koi) + point.side * (.082 + Math.sin(Math.PI * s) * v * .19 * flutter) }
}

function drawFish(koi, pose) {
  context.save()
  context.translate(pose.x, pose.y)
  context.rotate(pose.angle)
  const size = bodyLength * koi.scale

  // A faint body wash joins the individual points without hiding their texture.
  context.beginPath()
  for (let i = 0; i <= 40; i++) {
    const s = i / 40
    const x = (.48 - s) * size, y = (spine(s, koi) + breadth(s)) * size
    if (i === 0) context.moveTo(x, y)
    else context.lineTo(x, y)
  }
  for (let i = 40; i >= 0; i--) {
    const s = i / 40
    context.lineTo((.48 - s) * size, (spine(s, koi) - breadth(s)) * size)
  }
  context.closePath()
  context.fillStyle = 'rgba(244, 219, 187, .07)'
  context.fill()

  koi.groups.forEach((group, color) => {
    context.beginPath()
    group.forEach(point => {
      const p = particlePosition(point, koi)
      dot(p.x * size, p.y * size, point.radius * Math.max(.65, size / 125))
    })
    context.globalAlpha = color === 3 ? .48 : .68
    context.fillStyle = fishColors[koi.index][color]
    context.fill()
  })

  // Fin rays follow the tail's sway; small paired eyes make the top view legible.
  context.globalAlpha = .22
  context.strokeStyle = '#edc98f'
  context.lineWidth = .6
  for (let ray = -3; ray <= 3; ray++) {
    const v = ray / 3
    const end = particlePosition({ part: 'tail', s: .96, v }, koi)
    context.beginPath()
    context.moveTo(-.5 * size, spine(1, koi) * size)
    context.quadraticCurveTo(-.66 * size, (spine(1, koi) + v * .07) * size, end.x * size, end.y * size)
    context.stroke()
  }
  context.globalAlpha = .85
  for (const side of [-1, 1]) {
    const eyeX = .39 * size, eyeY = (spine(.09, koi) + side * breadth(.09) * .72) * size
    context.fillStyle = '#e8c98f'
    context.beginPath()
    dot(eyeX, eyeY, Math.max(1.4, size * .014))
    context.fill()
    context.fillStyle = '#281317'
    context.beginPath()
    dot(eyeX + .4, eyeY, Math.max(.8, size * .008))
    context.fill()
    context.strokeStyle = 'rgba(242, 223, 197, .4)'
    context.beginPath()
    context.moveTo(.46 * size, side * .035 * size)
    context.quadraticCurveTo(.52 * size, side * .065 * size, .49 * size, side * .1 * size)
    context.stroke()
  }
  context.restore()
}

function emitWake(koi, pose) {
  const tail = particlePosition({ part: 'tail', s: .9, v: 0 }, koi)
  const size = bodyLength * koi.scale
  const c = Math.cos(pose.angle), s = Math.sin(pose.angle)
  wakes.push({
    x: pose.x + (tail.x * c - tail.y * s) * size,
    y: pose.y + (tail.x * s + tail.y * c) * size,
    vx: -c * (4 + random() * 5) + (random() - .5) * 7,
    vy: -s * (4 + random() * 5) + (random() - .5) * 7,
    age: 0, life: 2 + random() * 2, radius: .5 + random() * 1.2,
  })
}

function buildPondTexture(ratio) {
  // Cache the pond floor; gradients, grain and stones do not need redrawing each frame.
  pondTexture = undefined
  if (!active) return
  pondTexture = document.createElement('canvas')
  pondTexture.width = canvas.value.width
  pondTexture.height = canvas.value.height
  const bed = pondTexture.getContext('2d')
  if (!bed) { pondTexture = undefined; return }
  bed.scale(ratio, ratio)
  for (const side of [0, 1]) {
    const origin = side ? width - gutter : 0
    bed.save()
    bed.translate(origin, 0)
    bed.beginPath()
    bed.rect(0, 0, gutter, height)
    bed.clip()

    const water = bed.createRadialGradient(gutter * .5, height * .6, 0, gutter * .5, height * .6, height * .75)
    water.addColorStop(0, 'rgba(34, 48, 43, .24)')
    water.addColorStop(.55, 'rgba(24, 35, 31, .18)')
    water.addColorStop(1, 'rgba(24, 12, 19, .06)')
    bed.fillStyle = water
    bed.fillRect(0, 0, gutter, height)

    for (let i = 0; i < 420; i++) {
      bed.fillStyle = `rgba(179, 161, 119, ${.015 + random() * .035})`
      bed.beginPath()
      bed.ellipse(random() * gutter, random() * height, .4 + random() * 1.4, .4 + random(), 0, 0, tau)
      bed.fill()
    }

    // Pebbles gather along the outer bank and leave the middle open for the fish.
    for (let i = 0; i < 8; i++) {
      const edge = Math.min(gutter * .24, 100)
      const x = side ? gutter - random() * edge : random() * edge
      const y = height - 3 - random() * Math.min(height * .1, 85)
      const rx = 15 + random() * 29, ry = rx * (.5 + random() * .3)
      const angle = random() * Math.PI, phase = random() * tau
      bed.save()
      bed.translate(x, y)
      bed.rotate(angle)
      // Soft, irregular silhouettes with mineral specks instead of smooth oval stones.
      bed.fillStyle = 'rgba(39, 35, 32, .55)'
      bed.beginPath()
      for (let j = 0; j <= 80; j++) {
        const a = j / 80 * tau
        const rough = 1 + .1 * Math.sin(a * 3 + phase) + .055 * Math.cos(a * 5)
        const px = Math.cos(a) * rx * rough, py = Math.sin(a) * ry * rough
        if (j === 0) bed.moveTo(px, py)
        else bed.lineTo(px, py)
      }
      bed.closePath()
      bed.fill()
      for (let speck = 0; speck < 180; speck++) {
        const a = random() * tau, r = Math.sqrt(random())
        const rough = 1 + .1 * Math.sin(a * 3 + phase) + .055 * Math.cos(a * 5)
        const px = Math.cos(a) * rx * rough * r, py = Math.sin(a) * ry * rough * r
        bed.fillStyle = `rgba(177, 161, 127, ${(.02 + random() * .15) * (1 - py / ry)})`
        bed.beginPath()
        bed.arc(px, py, .3 + random() * .5, 0, tau)
        bed.fill()
      }
      bed.restore()
    }
    bed.restore()
  }
}

function drawWater() {
  context.save()
  for (const side of [0, 1]) {
    const origin = side ? width - gutter : 0
    // Broken, very soft reflections drift across the surface.
    for (let i = 0; i < 7; i++) {
      context.globalAlpha = .035 + .025 * Math.sin(time * .45 + i * 1.3)
      context.strokeStyle = i % 2 ? '#b9ad83' : '#6d9c87'
      context.lineWidth = i % 2 ? .8 : 1.4
      context.beginPath()
      const y = height * (.12 + i * .14) + Math.sin(time * .24 + i) * 13
      context.ellipse(origin + gutter * (.47 + .12 * Math.sin(i)), y, gutter * (.26 + i % 3 * .05), 22 + i * 7, -.2, .2 + i * .5, Math.PI + i * .5)
      context.stroke()
    }
  }
  context.restore()
}

function drawLily(pad, index) {
  const size = pad.size * Math.min(1.2, gutter / 380, height / 720)
  const origin = pad.side ? width - gutter : 0
  const x = origin + gutter * pad.x + Math.sin(time * .25 + index) * 2
  const y = height * pad.y + Math.cos(time * .28 + index) * 2.5
  context.save()
  context.translate(x, y)
  context.rotate(pad.angle + Math.sin(time * .2 + index) * .035)
  context.scale(1, .78)
  context.strokeStyle = 'rgba(175, 165, 128, .08)'
  context.lineWidth = .65
  context.beginPath()
  context.ellipse(0, 2, size * 1.17, size * 1.08, 0, .6, 5.6)
  context.stroke()

  // Irregular edges and stippled veins share the koi's light, particle-based drawing style.
  context.fillStyle = 'rgba(40, 53, 44, .2)'
  context.beginPath()
  context.moveTo(-size * .12, 0)
  for (let step = 0; step <= 120; step++) {
    const a = .09 + step / 120 * (tau - .18)
    const r = size * (1 + .04 * Math.sin(a * 5 + index) + .025 * Math.cos(a * 9))
    context.lineTo(Math.cos(a) * r, Math.sin(a) * r)
  }
  context.closePath()
  context.fill()
  context.fillStyle = '#b0b08a'
  for (let step = 0; step < 210; step++) {
    const a = .09 + step / 210 * (tau - .18)
    const r = size * (1 + .04 * Math.sin(a * 5 + index) + .025 * Math.cos(a * 9))
    context.globalAlpha = .12 + .13 * (1 + Math.sin(step * 2.3)) / 2
    context.beginPath()
    dot(Math.cos(a) * r, Math.sin(a) * r, .35 + .2 * (1 + Math.sin(step)))
    context.fill()
  }
  for (const speck of leafSpecks) {
    context.globalAlpha = speck.alpha
    context.beginPath()
    dot(speck.x * size, speck.y * size, speck.radius)
    context.fill()
  }
  for (let vein = 0; vein < 11; vein++) {
    const a = .2 + vein * (tau - .4) / 10
    for (let step = 1; step < 32; step++) {
      const r = step / 34
      const angle = a + (1 - r) * .16
      context.globalAlpha = .28 * (1 - r * .65)
      context.beginPath()
      dot(Math.cos(angle) * size * r - size * .12 * (1 - r), Math.sin(angle) * size * r, .45)
      context.fill()
    }
  }
  context.restore()

  if (index !== 0) return
  // One delicate outlined blossom, without a solid sticker-like fill.
  context.save()
  context.translate(x - size * .4, y - size * .45)
  const petalSize = size * .38
  for (let layer = 0; layer < 2; layer++) {
    for (let petal = 0; petal < 7; petal++) {
      context.save()
      context.rotate(petal * tau / 7 + layer * .45 + .2)
      context.scale(1 - layer * .3, 1 - layer * .3)
      context.fillStyle = 'rgba(137, 76, 89, .055)'
      context.strokeStyle = 'rgba(215, 159, 166, .25)'
      context.lineWidth = .65
      context.beginPath()
      context.moveTo(0, 3)
      context.bezierCurveTo(-petalSize * .65, -petalSize * .4, -petalSize * .3, -petalSize * 1.2, 0, -petalSize * 1.5)
      context.bezierCurveTo(petalSize * .3, -petalSize * 1.2, petalSize * .65, -petalSize * .4, 0, 3)
      context.fill()
      context.stroke()
      context.restore()
    }
  }
  context.fillStyle = 'rgba(224, 185, 127, .42)'
  for (let i = 0; i < 14; i++) {
    context.beginPath()
    dot(Math.cos(i * 2.4) * Math.sqrt(i) * .7, Math.sin(i * 2.4) * Math.sqrt(i) * .7, .55)
    context.fill()
  }
  context.restore()
}

function drawPlants() {
  context.save()
  for (const side of [0, 1]) {
    const origin = side ? width : 0
    const direction = side ? -1 : 1
    const plantScale = Math.min(1, gutter / 350, height / 700)
    for (let blade = 0; blade < 6; blade++) {
      const x = origin + direction * (12 + blade * 7) * plantScale
      const length = (90 + (Math.sin(blade * 2.8) + 1) * 55) * plantScale
      const lean = direction * (15 + blade * 9) * plantScale + Math.sin(time * .65 + blade * .45) * 5
      context.strokeStyle = 'rgba(151, 161, 119, .16)'
      context.lineWidth = .65
      context.beginPath()
      context.moveTo(x, height + 5)
      context.bezierCurveTo(x + lean * .25, height - length * .4, x + lean * .9, height - length * .8, x + lean, height - length)
      context.stroke()
      for (let leaf = 1; leaf <= 7; leaf++) {
        const t = leaf / 9
        const stemX = x + lean * t, stemY = height - length * t
        for (const branch of [-1, 1]) {
          const leafLength = (17 + 10 * Math.sin(leaf)) * plantScale * (1 - t * .35)
          context.beginPath()
          context.moveTo(stemX, stemY)
          context.quadraticCurveTo(stemX + leafLength * branch, stemY + 2, stemX + leafLength * branch, stemY - leafLength * .7)
          context.stroke()
          context.fillStyle = 'rgba(171, 178, 135, .28)'
          context.beginPath()
          dot(stemX + leafLength * branch, stemY - leafLength * .7, .65)
          context.fill()
        }
      }
    }
  }
  lilyPads.forEach(drawLily)
  context.restore()
}

function feedPond(event) {
  if (!active || event.button !== 0 || feedingState.food) return
  const x = event.clientX, y = event.clientY
  const side = x < gutter ? 0 : x > width - gutter ? 1 : -1
  if (side < 0) return
  const origin = side ? width - gutter : 0
  const foodX = Math.max(origin + 12, Math.min(origin + gutter - 12, x))
  const foodY = Math.max(16, Math.min(height - 16, y))
  if (!dropFood(feedingState, foodX, foodY, side)) return
  feedingState.food.u = (foodX - origin) / gutter
  feedingState.food.v = foodY / height
  feeding.value = true
  feedAnnouncement.value = '餌料已投下，等待錦鯉吃完後可再次投餌。'
  // User-triggered feeding can finish in reduced-motion mode while ambient motion stays paused.
  if (motionPreference.matches) feedingState.food.age = feedingState.food.fallDuration
  syncMotion()
}

function drawFeeding(delta) {
  context.save()
  feedingRipples = feedingRipples.filter(ripple => ripple.age < ripple.life)
  for (const ripple of feedingRipples) {
    ripple.age += delta
    for (let ring = 0; ring < 3; ring++) {
      const age = ripple.age - ring * .16
      if (age < 0) continue
      const progress = Math.min(1, age / ripple.life)
      const radius = 5 + progress * (ripple.eaten ? 38 : 78)
      context.globalAlpha = (1 - progress) ** 2 * (ripple.eaten ? .55 : .7)
      context.strokeStyle = ring % 2 ? '#fff0cd' : '#dfba86'
      context.lineWidth = 1 - progress * .5
      context.beginPath()
      context.ellipse(ripple.x, ripple.y, radius, radius * .6, -.15, 0, tau)
      context.stroke()
    }
    if (!ripple.eaten && ripple.age < .55) {
      context.fillStyle = '#f4dfb2'
      context.globalAlpha = (1 - ripple.age / .55) * .8
      for (let drop = 0; drop < 7; drop++) {
        const angle = drop / 7 * tau
        const distance = 5 + ripple.age * 26
        context.beginPath()
        dot(ripple.x + Math.cos(angle) * distance, ripple.y + Math.sin(angle) * distance * .5 - Math.sin(ripple.age / .55 * Math.PI) * 12, .9)
        context.fill()
      }
    }
  }
  const food = feedingState.food
  if (food) {
    const position = foodPosition(food)
    const fall = Math.min(1, food.age / food.fallDuration)
    const elevation = motionPreference.matches ? 0 : 70 * (1 - fall * fall)
    const foodY = position.y - elevation
    context.globalAlpha = .18 + fall * .15
    context.fillStyle = '#d5b47b'
    context.beginPath()
    context.ellipse(position.x, position.y + 2, 9 - fall * 4, 3 - fall, 0, 0, tau)
    context.fill()
    context.globalAlpha = 1
    const glow = context.createRadialGradient(position.x, foodY, 1, position.x, foodY, 17)
    glow.addColorStop(0, 'rgba(240, 184, 87, .24)')
    glow.addColorStop(1, 'rgba(240, 184, 87, 0)')
    context.fillStyle = glow
    context.fillRect(position.x - 17, foodY - 17, 34, 34)
    context.save()
    context.translate(position.x, foodY)
    context.rotate(-.25 + Math.sin(food.age * 1.7) * .15)
    context.fillStyle = '#b4783d'
    context.beginPath()
    context.ellipse(0, 1, 4.8, 3.7, 0, 0, tau)
    context.fill()
    context.fillStyle = '#edc77b'
    context.beginPath()
    context.ellipse(-.7, -.6, 3.7, 2.7, 0, 0, tau)
    context.fill()
    context.fillStyle = '#fff0bc'
    context.beginPath()
    dot(-1.8, -1.2, .85)
    context.fill()
    context.restore()
  }
  context.restore()
}

function render(delta = 0) {
  if (!context || !active) return
  const { poses, events } = stepFeeding(feedingState, delta, fish.map(koi => ({
    pose: poseAt(koi, time), side: koi.side, size: bodyLength * koi.scale,
    speed: 24 + koi.index * 3,
  })))
  fish.forEach((koi, index) => { koi.swimClock = feedingState.swimmers[index].swimClock })
  for (const event of events) {
    feedingRipples.push({ x: event.x, y: event.y, age: 0, life: event.type === 'eaten' ? 1.6 : 2.4, eaten: event.type === 'eaten' })
    if (event.type === 'landed') feedAnnouncement.value = '餌料正在水面漂浮，錦鯉正在靠近。'
    if (event.type === 'eaten') feedAnnouncement.value = '餌料已吃完，可以再次投餌。'
  }
  feeding.value = Boolean(feedingState.food)
  context.clearRect(0, 0, width, height)
  context.save()
  // The central page is never painted over, even when a wake reaches its edge.
  context.beginPath()
  context.rect(0, 0, gutter, height)
  context.rect(width - gutter, 0, gutter, height)
  context.clip()
  if (pondTexture) context.drawImage(pondTexture, 0, 0, width, height)
  drawWater()

  for (const mote of dust) {
    const localX = ((mote.x + Math.sin(time * .12 + mote.phase) * 12) % gutter + gutter) % gutter
    const y = ((mote.y - time * mote.speed) % height + height) % height
    const x = (mote.side ? width - gutter : 0) + localX
    const fade = Math.min(1, localX / 30, (gutter - localX) / 30)
    context.globalAlpha = (.12 + .08 * Math.sin(time * .7 + mote.phase)) * fade
    context.fillStyle = '#e4b57c'
    context.beginPath()
    dot(x, y, mote.radius)
    context.fill()
  }

  ripples = ripples.filter(ripple => ripple.age < ripple.life)
  for (const ripple of ripples) {
    ripple.age += delta
    const progress = ripple.age / ripple.life
    context.globalAlpha = Math.sin(progress * Math.PI) * .11
    context.strokeStyle = '#dca77e'
    context.lineWidth = .7
    context.beginPath()
    context.ellipse(ripple.x, ripple.y, 12 + progress * 55, 7 + progress * 35, -.3, 0, tau)
    context.stroke()
  }
  wakes = wakes.filter(particle => particle.age < particle.life)
  for (const particle of wakes) {
    particle.age += delta
    particle.x += particle.vx * delta
    particle.y += particle.vy * delta
    context.globalAlpha = (1 - particle.age / particle.life) * .3
    context.fillStyle = '#efc88d'
    context.beginPath()
    dot(particle.x, particle.y, particle.radius)
    context.fill()
  }
  context.globalAlpha = 1
  wakeClock += delta
  if (delta && wakeClock >= .1) {
    wakeClock %= .1
    fish.forEach((koi, index) => emitWake(koi, poses[index]))
  }
  if (delta && ripples.length < 4 && Math.floor(time / 2.8) > Math.floor((time - delta) / 2.8)) {
    const p = poses[Math.floor(time / 2.8) % fish.length]
    ripples.push({ x: p.x, y: p.y, age: 0, life: 6 })
  }
  fish.forEach((koi, index) => drawFish(koi, poses[index]))
  drawPlants()
  drawFeeding(delta)
  context.restore()
}

function animate(timestamp) {
  if (disposed || !active || document.hidden || (motionPreference.matches && !isFeedingActive(feedingState) && !feedingRipples.length)) { frame = 0; return }
  frame = requestAnimationFrame(animate)
  if (!previousTime) { previousTime = timestamp; return }
  const elapsed = timestamp - previousTime
  if (elapsed < frameInterval) return
  const delta = Math.min(elapsed / 1000, .08)
  previousTime = timestamp
  if (!motionPreference.matches) time += delta
  render(delta)
}

function syncMotion() {
  cancelAnimationFrame(frame)
  frame = 0
  previousTime = 0
  if (!context || !active || disposed || document.hidden) return
  render()
  if (!motionPreference.matches || isFeedingActive(feedingState) || feedingRipples.length) frame = requestAnimationFrame(animate)
}

function resize() {
  if (!context || disposed) return
  width = document.documentElement.clientWidth
  height = window.innerHeight
  const shellWidth = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--mobile-max-width')) || 520
  gutter = Math.max(0, (width - shellWidth) / 2)
  active = width > 760 && gutter >= 100 && height >= 360
  const ratio = Math.min(window.devicePixelRatio || 1, 1.5)
  canvas.value.width = active ? Math.round(width * ratio) : 1
  canvas.value.height = active ? Math.round(height * ratio) : 1
  context.setTransform(ratio, 0, 0, ratio, 0, 0)
  // Twice the original 150px body on desktop; fit smaller gutters without clipping.
  bodyLength = Math.min(300, (gutter - 24) / 1.45, height * .36)
  buildPondTexture(ratio)
  wakes = []
  ripples = []
  // Preserve the single outstanding pellet across viewport changes, including mobile hiding.
  if (feedingState.food) {
    const food = feedingState.food
    food.x = (food.side ? width - gutter : 0) + food.u * gutter
    food.y = food.v * height
  }
  feedingState.swimmers = []
  feedingRipples = []
  feeding.value = Boolean(feedingState.food)
  dust = Array.from({ length: active ? Math.min(90, Math.round(gutter * height / 6000)) : 0 }, (_, index) => ({
    side: index % 2, x: random() * gutter, y: random() * height,
    radius: .45 + random() * 1.1, speed: 1.5 + random() * 4, phase: random() * tau,
  }))
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
  <canvas
    ref="canvas"
    class="koi-background"
    :class="{ 'is-feeding': feeding }"
    :title="feeding ? '等待錦鯉吃完後可再次投餌' : '點擊水面投餌'"
    aria-hidden="true"
    @click="feedPond"
  />
  <span class="pond-status" role="status" aria-live="polite">{{ feedAnnouncement }}</span>
</template>

<style scoped>
.koi-background { position: fixed; inset: 0; z-index: 0; width: 100%; height: 100dvh; cursor: crosshair; }
.koi-background.is-feeding { cursor: default; }
.pond-status { position: fixed; width: 1px; height: 1px; padding: 0; overflow: hidden; clip-path: inset(50%); white-space: nowrap; pointer-events: none; }
@media (max-width: 760px) { .koi-background { display: none; } }
</style>
