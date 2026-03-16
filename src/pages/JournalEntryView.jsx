import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { PROMPT_CATEGORIES } from '../data/prompts'
import { formatDateLong, formatDate } from '../utils/helpers'
import Button from '../components/ui/Button'

const MOOD_EMOJIS = ['', '😔', '😕', '😐', '🙂', '😊']
const MOOD_LABELS = ['', 'Low', 'Meh', 'Okay', 'Good', 'Great']

export default function JournalEntryView() {
  const { id } = useParams()
  const { state, dispatch } = useApp()
  const navigate = useNavigate()
  const entry = state.journalEntries.find(e => e.id === id)

  if (!entry) {
    return (
      <div className="min-h-screen pb-24 px-4 pt-12 max-w-lg mx-auto text-center">
        <p className="text-slate-400 mt-20">Entry not found.</p>
        <button className="mt-4 text-sm text-violet-400" onClick={() => navigate('/journal')}>
          Back to journal
        </button>
      </div>
    )
  }

  const isFav = state.journalSettings.favoritePromptTexts.includes(entry.prompt?.text)
  const categoryLabel = entry.prompt?.category
    ? PROMPT_CATEGORIES[entry.prompt.category]?.label
    : null

  function toggleFav() {
    if (entry.prompt?.text) {
      dispatch({ type: 'TOGGLE_FAVORITE_PROMPT', payload: { text: entry.prompt.text } })
    }
  }

  function exportEntry() {
    const lines = [
      `# Journal Entry — ${formatDateLong(entry.date)}`,
      '',
      entry.prompt && !entry.isFreeWrite ? `> ${entry.prompt.text}` : '> Free write',
      '',
      entry.response,
      '',
      `Mood: ${MOOD_LABELS[entry.moodScore] || '—'}`,
    ]
    const blob = new Blob([lines.join('\n')], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `journal-${entry.date}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen pb-24 px-4 pt-12 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          className="text-sm text-slate-400 hover:text-slate-200 transition-colors"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
        <button
          className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
          onClick={exportEntry}
        >
          Export
        </button>
      </div>

      {/* Date & mood */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">{MOOD_EMOJIS[entry.moodScore] || ''}</span>
        <div>
          <p className="text-white font-medium">{formatDateLong(entry.date)}</p>
          <p className="text-xs text-slate-500">
            {entry.moodScore ? `Feeling ${MOOD_LABELS[entry.moodScore].toLowerCase()}` : ''}
            {categoryLabel ? ` · ${categoryLabel}` : ''}
          </p>
        </div>
      </div>

      {/* Prompt */}
      {!entry.isFreeWrite && entry.prompt && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4">
          <p className="text-sm text-slate-400 italic leading-relaxed">"{entry.prompt.text}"</p>
          {entry.prompt.text && (
            <button
              className={`mt-2 text-xs transition-colors ${isFav ? 'text-amber-400' : 'text-slate-500 hover:text-amber-400'}`}
              onClick={toggleFav}
            >
              {isFav ? '★ Saved prompt' : '☆ Save this prompt'}
            </button>
          )}
        </div>
      )}
      {entry.isFreeWrite && (
        <p className="text-xs text-slate-500 mb-4 italic">Free write</p>
      )}

      {/* Response */}
      <div className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">
        {entry.response}
      </div>

      {/* On this day */}
      <OnThisDay currentId={entry.id} date={entry.date} entries={state.journalEntries} />
    </div>
  )
}

function OnThisDay({ currentId, date, entries }) {
  const [m, d] = date.slice(5).split('-') // MM-DD
  const pastEntries = entries.filter(e => {
    if (e.id === currentId) return false
    const emd = e.date.slice(5)
    return emd === `${m}-${d}`
  })
  if (pastEntries.length === 0) return null

  return (
    <div className="mt-10 border-t border-white/10 pt-6">
      <p className="text-xs text-slate-500 mb-3 uppercase tracking-widest">On this day</p>
      <div className="space-y-3">
        {pastEntries.map(e => (
          <div key={e.id} className="text-sm">
            <p className="text-slate-500 mb-1">{formatDate(e.date)}</p>

            <p className="text-slate-400 line-clamp-2">{e.response}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

