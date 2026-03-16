import { ALL_PROMPTS, MOOD_AFFINITY, PROMPT_CATEGORIES } from '../data/prompts'

const TWO_WEEKS_MS = 14 * 24 * 60 * 60 * 1000

/**
 * Pick a prompt that:
 * 1. Hasn't been used in the last 2 weeks
 * 2. Is context-sensitive to the user's mood score (1–5)
 * 3. Won't repeat the last 3 used prompts
 *
 * @param {object} lastUsedPrompts - { "prompt text": "YYYY-MM-DD" }
 * @param {number|null} moodScore - 1 through 5, or null
 * @param {Array} customPrompts - user-added prompts
 * @param {Array} favoritePromptTexts - bookmarked prompt texts
 * @returns {{ text, category }}
 */
export function pickPrompt(lastUsedPrompts = {}, moodScore = null, customPrompts = [], favoritePromptTexts = []) {
  const now = Date.now()

  // Combine built-in + custom prompts
  const customMapped = customPrompts.map(p => ({ text: p.text, category: 'custom' }))
  const allPrompts = [...ALL_PROMPTS, ...customMapped]

  // Filter out recently used
  const available = allPrompts.filter(p => {
    const lastUsed = lastUsedPrompts[p.text]
    if (!lastUsed) return true
    return now - new Date(lastUsed).getTime() > TWO_WEEKS_MS
  })

  if (available.length === 0) return allPrompts[Math.floor(Math.random() * allPrompts.length)]

  // Apply mood-based category affinity
  let candidates = available
  if (moodScore && MOOD_AFFINITY[moodScore]) {
    const preferredCategories = MOOD_AFFINITY[moodScore]
    const moodFiltered = available.filter(p => preferredCategories.includes(p.category))
    if (moodFiltered.length >= 2) candidates = moodFiltered
  }

  // Occasionally surface a favorite (25% chance if favorites exist)
  if (favoritePromptTexts.length > 0 && Math.random() < 0.25) {
    const favCandidates = candidates.filter(p => favoritePromptTexts.includes(p.text))
    if (favCandidates.length > 0) {
      return favCandidates[Math.floor(Math.random() * favCandidates.length)]
    }
  }

  return candidates[Math.floor(Math.random() * candidates.length)]
}

/**
 * Pick a prompt from a specific category, excluding recently used.
 */
export function pickFromCategory(category, lastUsedPrompts = {}) {
  const now = Date.now()
  const prompts = (PROMPT_CATEGORIES[category]?.prompts || []).map(text => ({ text, category }))
  const available = prompts.filter(p => {
    const lastUsed = lastUsedPrompts[p.text]
    if (!lastUsed) return true
    return now - new Date(lastUsed).getTime() > TWO_WEEKS_MS
  })
  const pool = available.length > 0 ? available : prompts
  return pool[Math.floor(Math.random() * pool.length)]
}
