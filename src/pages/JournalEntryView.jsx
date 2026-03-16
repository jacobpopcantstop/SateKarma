import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { PROMPT_CATEGORIES } from '../data/prompts'
import { formatDateLong, formatDate, MOOD_EMOJIS, MOOD_LABELS } from '../utils/helpers'
import Button from '../components/ui/Button'

export default function JournalEntryView() {
  const { id } = useParams()
  const { state, dispatch } = useApp()
  const navigate = useNavigate()
  const entry = state.journalEntries.find(e => e.id === id)

  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)

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

  function startEdit() {
    setEditText(entry.response)
    setIsEditing(true)
  }

  function saveEdit() {
    if (!editText.trim()) return
    dispatch({ type: 'UPDATE_JOURNAL_ENTRY', payload: { id: entry.id, response: editText.trim() } })
    setIsEditing(false)
  }

  function handleDelete() {
    dispatch({ type: 'DELETE_JOURNAL_ENTRY', payload: { id: entry.id } })
    navigate('/journal', { replace: true })
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
        <div className="flex items-center gap-3">
          {!isEditing && (
            <>
              <button
                className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
                onClick={startEdit}
              >
                Edit
              </button>
              <button
                className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
                onClick={exportEntry}
              >
                Export
              </button>
            </>
          )}
        </div>
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

      {/* Response / Edit */}
      {isEditing ? (
        <div className="flex flex-col gap-3">
          <textarea
            className="w-full bg-white/5 border border-violet-400/40 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-violet-400/70 resize-none leading-relaxed"
            rows={10}
            value={editText}
            onChange={e => setEditText(e.target.value)}
            autoFocus
          />
          <p className="text-xs text-slate-600 text-right">
            {editText.trim().split(/\s+/).filter(Boolean).length} words
          </p>
          <div className="flex gap-2">
            <Button variant="primary" size="md" className="flex-1" onClick={saveEdit} disabled={!editText.trim()}>
              Save changes
            </Button>
            <Button variant="ghost" size="md" className="flex-1" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">
          {entry.response}
        </div>
      )}

      {/* Delete */}
      {!isEditing && (
        <div className="mt-10 border-t border-white/10 pt-6">
          {confirmDelete ? (
            <div className="flex items-center gap-3">
              <p className="text-xs text-slate-400 flex-1">Delete this entry permanently?</p>
              <button
                className="text-xs text-rose-400 hover:text-rose-300 transition-colors"
                onClick={handleDelete}
              >
                Delete
              </button>
              <button
                className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
                onClick={() => setConfirmDelete(false)}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              className="text-xs text-slate-600 hover:text-slate-400 transition-colors"
              onClick={() => setConfirmDelete(true)}
            >
              Delete entry
            </button>
          )}
        </div>
      )}

      {/* On this day */}
      {!isEditing && (
        <OnThisDay currentId={entry.id} date={entry.date} entries={state.journalEntries} />
      )}
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
