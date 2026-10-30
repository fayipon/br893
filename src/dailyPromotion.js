export const luckyWheelDismissalKey = 'jito.lucky-wheel.hidden-date'

// Use the visitor's local calendar day, not UTC or a rolling 24-hour timeout.
export function localDay(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export function isLuckyWheelHiddenToday(storage, date = new Date()) {
  try { return storage?.getItem(luckyWheelDismissalKey) === localDay(date) } catch { return false }
}

export function rememberLuckyWheelForToday(hidden, storage, date = new Date()) {
  try {
    if (hidden) storage?.setItem(luckyWheelDismissalKey, localDay(date))
    else storage?.removeItem(luckyWheelDismissalKey)
  } catch { /* The popup remains usable when the browser blocks storage. */ }
}
