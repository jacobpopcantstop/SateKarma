import { useNavigate } from 'react-router-dom'
import { PROMPT_CATEGORIES } from '../../data/prompts'

const MOOD_EMOJIS = ['', '😔', '😕', '😐', '🙂', '😊']

const CATEGORY_COLORS = {
  'self-awareness': 'text-violet-400',
  'gratitude': 'text-amber-400',
  'growth': 'text-teal-400',
  'letting-go': 'text-rose-400',
  'intentions': 'text-emerald-400',
  'custom': 'text-slate-400',
}

export default function JournalEntry({ entry }) {
  const navigate = useNavigate()
  const categoryLabel = entry.prompt?.category
    ? PROMPT_CATEGORIES[entry.prompt.category]?.label
    : null
  const colorClass = CATEGORY_COLORS[entry.prompt?.category] || 'text-slate-400'

  return (
    <div
      className="bg-white/5 border border-white/10 rounded-2xl p-4 cursor-pointer hover:bg-white/8 transition-colors"
      onClick={() => navigate(`/journal/${entry.id}`)}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{MOOD_EMOJIS[entry.moodScore] || ''}</span>
          <span className="text-xs text-slate-400">{formatDate(entry.date)}</span>
        </div>
        {categoryLabel && (
          <span className={`text-xs font-medium ${colorClass}`}>{categoryLabel}</span>
        )}
      </div>
      {entry.prompt && !entry.isFreeWrite && (
        <p className="text-xs text-slate-500 mb-2 italic">"{entry.prompt.text}"</p>
      )}
      {entry.isFreeWrite && (
        <p className="text-xs text-slate-500 mb-2 italic">Free write</p>
      )}
      <p className="text-sm text-slate-300 line-clamp-3 leading-relaxed">{entry.response}</p>
    </div>
  )
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
