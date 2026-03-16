/** Shared utilities used across multiple files */

export const MOOD_EMOJIS = ['', '😔', '😕', '😐', '🙂', '😊']
export const MOOD_LABELS = ['', 'Low', 'Meh', 'Okay', 'Good', 'Great']

const ONE_DAY_MS = 864e5
export { ONE_DAY_MS }

export function generateId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export function formatDate(dateStr, options) {
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('en-US', options ?? {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

export function formatDateLong(dateStr) {
  return formatDate(dateStr, {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  })
}
