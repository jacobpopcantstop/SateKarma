import { useApp } from '../../context/AppContext'
import { pickPrompt } from '../../utils/promptPicker'
import { PROMPT_CATEGORIES } from '../../data/prompts'

const CATEGORY_COLORS = {
  'self-awareness': 'text-violet-400 bg-violet-500/10',
  'gratitude': 'text-amber-400 bg-amber-500/10',
  'growth': 'text-teal-400 bg-teal-500/10',
  'letting-go': 'text-rose-400 bg-rose-500/10',
  'intentions': 'text-emerald-400 bg-emerald-500/10',
  'custom': 'text-slate-300 bg-white/10',
}

export default function PromptCard({ prompt, onSwap, onSkip, moodScore }) {
  const { state, dispatch } = useApp()
  const isFav = state.journalSettings.favoritePromptTexts.includes(prompt?.text)

  function handleSwap() {
    const next = pickPrompt(
      state.journalSettings.lastUsedPrompts,
      moodScore,
      state.journalSettings.customPrompts,
      state.journalSettings.favoritePromptTexts
    )
    onSwap(next)
  }

  function toggleFav() {
    dispatch({ type: 'TOGGLE_FAVORITE_PROMPT', payload: { text: prompt.text } })
  }

  if (!prompt) return null

  const colorClass = CATEGORY_COLORS[prompt.category] || CATEGORY_COLORS['custom']
  const categoryLabel = PROMPT_CATEGORIES[prompt.category]?.label || 'Custom'

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
      {/* Category badge */}
      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${colorClass}`}>
        {categoryLabel}
      </span>

      {/* Prompt text */}
      <p className="text-lg font-light text-white mt-3 leading-relaxed">{prompt.text}</p>

      {/* Actions */}
      <div className="flex items-center gap-3 mt-4">
        <button
          className={`text-sm transition-colors ${isFav ? 'text-amber-400' : 'text-slate-500 hover:text-amber-400'}`}
          onClick={toggleFav}
          title={isFav ? 'Unfavorite' : 'Bookmark this prompt'}
        >
          {isFav ? '★ Saved' : '☆ Save'}
        </button>
        <button
          className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
          onClick={handleSwap}
        >
          ↻ Different prompt
        </button>
        <button
          className="text-sm text-slate-500 hover:text-slate-300 transition-colors ml-auto"
          onClick={onSkip}
        >
          Free write instead
        </button>
      </div>
    </div>
  )
}
