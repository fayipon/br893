export const FEEDING_SPEED_MULTIPLIER = 2.6
const FALL_DURATION = .55
const TAU = Math.PI * 2

function angleDelta(from, to) {
  return ((to - from + Math.PI) % TAU + TAU) % TAU - Math.PI
}

export function createFeedingState() {
  return { food: null, swimmers: [], nextId: 0 }
}

export function dropFood(state, x, y, side) {
  if (state.food) return false
  state.food = { id: ++state.nextId, x, y, side, age: 0, fallDuration: FALL_DURATION }
  return true
}

export function foodPosition(food) {
  const floatingTime = Math.max(0, food.age - food.fallDuration)
  return {
    x: food.x + Math.sin(floatingTime * 1.4) * 3,
    y: food.y + Math.sin(floatingTime * 2.2) * 1.7,
  }
}

export function isFeedingActive(state) {
  return Boolean(state.food) || state.swimmers.some(swimmer => swimmer.mode !== 'cruise')
}

// Canvas-independent movement allows feeding/locking/recovery to be verified without a browser.
export function stepFeeding(state, delta, cruises) {
  const events = []
  if (state.food) {
    const previousAge = state.food.age
    state.food.age += delta
    if (previousAge < FALL_DURATION && state.food.age >= FALL_DURATION) {
      events.push({ type: 'landed', ...foodPosition(state.food) })
    }
  }

  const poses = cruises.map((cruise, index) => {
    const swimmer = state.swimmers[index] ||= {
      pose: { ...cruise.pose }, mode: 'cruise', boost: 1, swimClock: 0,
    }
    const food = state.food?.side === cruise.side ? state.food : null
    const targetBoost = food ? FEEDING_SPEED_MULTIPLIER : 1
    swimmer.boost += (targetBoost - swimmer.boost) * (1 - Math.exp(-delta * 5))
    swimmer.swimClock += delta * swimmer.boost

    if (food) {
      swimmer.mode = 'feeding'
      const target = foodPosition(food)
      const nose = cruise.size * .48
      const desiredAngle = Math.atan2(target.y - swimmer.pose.y, target.x - swimmer.pose.x)
      const turn = angleDelta(swimmer.pose.angle, desiredAngle)
      const angle = swimmer.pose.angle + Math.max(-delta * 2.5, Math.min(delta * 2.5, turn))
      // Turn around the body, then approach a point that places the mouth over the pellet.
      const dx = target.x - Math.cos(angle) * nose - swimmer.pose.x
      const dy = target.y - Math.sin(angle) * nose - swimmer.pose.y
      const distance = Math.hypot(dx, dy)
      const step = Math.min(distance, cruise.speed * swimmer.boost * delta)
      const fraction = distance ? step / distance : 0
      swimmer.pose = {
        x: swimmer.pose.x + dx * fraction,
        y: swimmer.pose.y + dy * fraction,
        angle,
      }
      // Keep the pellet afloat briefly even if a fish was already directly below it.
      if (food.age >= FALL_DURATION + .7 && distance - step <= 8) {
        events.push({ type: 'eaten', fishIndex: index, ...target })
        state.food = null
      }
    } else if (swimmer.mode !== 'cruise') {
      if (swimmer.mode === 'feeding') {
        swimmer.mode = 'returning'
        swimmer.returnAge = 0
        swimmer.offset = {
          x: swimmer.pose.x - cruise.pose.x,
          y: swimmer.pose.y - cruise.pose.y,
          angle: angleDelta(cruise.pose.angle, swimmer.pose.angle),
        }
      }
      swimmer.returnAge = Math.min(3, swimmer.returnAge + delta)
      const progress = swimmer.returnAge / 3
      const blend = 1 - progress * progress * (3 - 2 * progress)
      swimmer.pose = {
        x: cruise.pose.x + swimmer.offset.x * blend,
        y: cruise.pose.y + swimmer.offset.y * blend,
        angle: cruise.pose.angle + swimmer.offset.angle * blend,
      }
      if (progress === 1) { swimmer.mode = 'cruise'; swimmer.boost = 1 }
    } else {
      swimmer.pose = { ...cruise.pose }
    }
    return swimmer.pose
  })
  return { poses, events }
}
