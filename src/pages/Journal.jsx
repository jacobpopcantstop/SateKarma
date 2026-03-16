import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import JournalEntry from '../components/Journal/JournalEntry'
import Button from '../components/ui/Button'
import { PROMPT_CATEGORIES } from '../data/prompts'

const MOOD_EMOJIS = ['', '😔', '😕', '😐', '🙂', '😊']

export default function Journal() {
  const { state } = useApp()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')

  const entries = useMemo(() => {
    let list = [...state.journalEntries]
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        e =>
          e.response?.toLowerCase().includes(q) ||
          e.prompt?.text?.toLowerCase().includes(q)
      )
    }
    if (filterCategory === 'freewrite') {
      list = list.filter(e => e.isFreeWrite)
    } else if (filterCategory !== 'all') {
      list = list.filter(e => e.prompt?.category === filterCategory)
    }
    return list
  }, [state.journalEntries, search, filterCategory])

  return (
    <div className="min-h-screen pb-24 px-4 pt-12 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-white">Journal</h1>
        <Button variant="primary" size="sm" onClick={() => navigate('/journal/write')}>
          + Write
        </Button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search entries..."
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-violet-400/60 mb-3"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-5 scrollbar-hide">
        <FilterChip label="All" active={filterCategory === 'all'} onClick={() => setFilterCategory('all')} />
        {Object.entries(PROMPT_CATEGORIES).map(([key, { label }]) => (
          <FilterChip key={key} label={label} active={filterCategory === key} onClick={() => setFilterCategory(key)} />
        ))}
        <FilterChip label="Free write" active={filterCategory === 'freewrite'} onClick={() => setFilterCategory('freewrite')} />
      </div>

      {/* Entry list */}
      {entries.length === 0 ? (
        <div className="text-center mt-20">
          <p className="text-slate-500 text-sm mb-4">
            {state.journalEntries.length === 0
              ? 'No entries yet. Start reflecting after your next session.'
              : 'No entries match your search.'}
          </p>
          {state.journalEntries.length === 0 && (
            <Button variant="secondary" size="md" onClick={() => navigate('/journal/write')}>
              Write your first entry
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map(entry => (
            <JournalEntry key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </div>
  )
}

function FilterChip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`whitespace-nowrap text-xs px-3 py-1.5 rounded-full transition-all ${
        active
          ? 'bg-violet-600 text-white'
          : 'bg-white/10 text-slate-400 hover:bg-white/20'
      }`}
    >
      {label}
    </button>
  )
}
