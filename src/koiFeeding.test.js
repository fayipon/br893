import test from 'node:test'
import assert from 'node:assert/strict'
import { createFeedingState, dropFood, foodPosition, isFeedingActive, stepFeeding } from './koiFeeding.js'

const delta = 1 / 30
const cruises = [
  { pose: { x: 120, y: 420, angle: Math.PI / 2 }, side: 0, size: 220, speed: 24 },
  { pose: { x: 1100, y: 400, angle: 0 }, side: 1, size: 185, speed: 27 },
  { pose: { x: 260, y: 480, angle: 1 }, side: 0, size: 150, speed: 30 },
]

test('one pellet locks the entire pond until consumption, including opposite-side clicks', () => {
  const state = createFeedingState()
  stepFeeding(state, 0, cruises)
  assert.equal(dropFood(state, 180, 180, 0), true)
  const original = state.food
  for (let i = 0; i < 20; i++) assert.equal(dropFood(state, 1100, 500, 1), false)
  assert.equal(state.food, original)
  const events = []
  for (let frame = 0; frame < 900 && state.food; frame++) {
    events.push(...stepFeeding(state, delta, cruises).events)
  }
  assert.equal(state.food, null, 'fish must reach and consume the pellet')
  assert.equal(events.filter(event => event.type === 'landed').length, 1)
  assert.equal(events.filter(event => event.type === 'eaten').length, 1)
  assert.equal(dropFood(state, 1100, 500, 1), true)
})

test('food falls, ripples once, and floats before a nearby fish can eat it', () => {
  const state = createFeedingState()
  const waiting = [{ pose: { x: 100, y: 100, angle: 0 }, side: 0, size: 100, speed: 24 }]
  stepFeeding(state, 0, waiting)
  dropFood(state, 148, 100, 0)
  const events = []
  for (let i = 0; i < 30; i++) events.push(...stepFeeding(state, delta, waiting).events)
  assert.ok(state.food, 'even a fish under the pellet must allow the landing/float effect')
  assert.equal(events.filter(event => event.type === 'landed').length, 1)
  assert.notDeepEqual(foodPosition(state.food), { x: 148, y: 100 })
  for (let i = 0; i < 60; i++) events.push(...stepFeeding(state, delta, waiting).events)
  assert.equal(state.food, null)
  assert.equal(events.filter(event => event.type === 'eaten').length, 1)
})

test('same-side fish accelerate 2–3 times, then smoothly return to cruising', () => {
  const state = createFeedingState()
  stepFeeding(state, 0, cruises)
  dropFood(state, 180, 40, 0)
  for (let i = 0; i < 30; i++) stepFeeding(state, delta, cruises)
  assert.ok(state.swimmers[0].boost > 2 && state.swimmers[0].boost < 3)
  assert.ok(state.swimmers[2].boost > 2 && state.swimmers[2].boost < 3)
  assert.equal(state.swimmers[1].boost, 1)
  assert.deepEqual(state.swimmers[1].pose, cruises[1].pose)
  for (let i = 0; i < 900 && state.food; i++) stepFeeding(state, delta, cruises)
  assert.equal(state.food, null)
  assert.equal(isFeedingActive(state), true, 'recovery continues after food disappears')
  const before = { ...state.swimmers[0].pose }
  stepFeeding(state, delta, cruises)
  assert.ok(Math.hypot(before.x - state.swimmers[0].pose.x, before.y - state.swimmers[0].pose.y) < 8)
  for (let i = 0; i < 100; i++) stepFeeding(state, delta, cruises)
  assert.equal(isFeedingActive(state), false)
  for (let i = 0; i < cruises.length; i++) {
    assert.equal(state.swimmers[i].boost, 1)
    assert.deepEqual(state.swimmers[i].pose, cruises[i].pose)
  }
})

test('a new pellet can interrupt recovery without stale consumption or movement jumps', () => {
  const state = createFeedingState()
  stepFeeding(state, 0, cruises)
  dropFood(state, 180, 250, 0)
  for (let i = 0; i < 900 && state.food; i++) stepFeeding(state, delta, cruises)
  assert.equal(state.food, null)
  assert.equal(dropFood(state, 210, 300, 0), true)
  const before = { ...state.swimmers[0].pose }
  stepFeeding(state, delta, cruises)
  assert.ok(Math.hypot(before.x - state.swimmers[0].pose.x, before.y - state.swimmers[0].pose.y) <= cruises[0].speed * 3 * delta)
  assert.ok(state.food)
  for (let i = 0; i < 900 && state.food; i++) stepFeeding(state, delta, cruises)
  assert.equal(state.food, null)
})
