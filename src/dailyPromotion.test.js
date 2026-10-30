import test from 'node:test'
import assert from 'node:assert/strict'
import { isLuckyWheelHiddenToday, localDay, rememberLuckyWheelForToday } from './dailyPromotion.js'

const storage = () => {
  const values = new Map()
  return { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value), removeItem: key => values.delete(key) }
}

test('daily dismissal persists on refresh but expires at the next local midnight', () => {
  const browser = storage()
  const evening = new Date(2026, 9, 30, 23, 59)
  assert.equal(isLuckyWheelHiddenToday(browser, evening), false)
  rememberLuckyWheelForToday(true, browser, evening)
  assert.equal(isLuckyWheelHiddenToday(browser, new Date(2026, 9, 30, 23, 59, 59)), true)
  assert.equal(isLuckyWheelHiddenToday(browser, new Date(2026, 9, 31, 0, 0)), false)
})

test('unchecking restores automatic display for the same day', () => {
  const browser = storage()
  rememberLuckyWheelForToday(true, browser)
  rememberLuckyWheelForToday(false, browser)
  assert.equal(isLuckyWheelHiddenToday(browser), false)
})

test('date stamp uses the local calendar and expires across year boundaries', () => {
  const browser = storage()
  const yearEnd = new Date(2026, 11, 31, 23, 59)
  assert.equal(localDay(yearEnd), '2026-12-31')
  rememberLuckyWheelForToday(true, browser, yearEnd)
  assert.equal(isLuckyWheelHiddenToday(browser, new Date(2027, 0, 1)), false)
})

test('blocked or unavailable storage keeps the popup usable', () => {
  const blocked = { getItem() { throw new Error('blocked') }, setItem() { throw new Error('blocked') }, removeItem() { throw new Error('blocked') } }
  for (const browser of [blocked, null]) {
    assert.equal(isLuckyWheelHiddenToday(browser), false)
    assert.doesNotThrow(() => rememberLuckyWheelForToday(true, browser))
    assert.doesNotThrow(() => rememberLuckyWheelForToday(false, browser))
  }
})
