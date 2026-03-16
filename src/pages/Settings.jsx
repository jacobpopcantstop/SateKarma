import { useState } from 'react'
import { useApp } from '../context/AppContext'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

export default function Settings() {
  const { state, dispatch } = useApp()
  const { settings, journalSettings } = state
  const [customPrompt, setCustomPrompt] = useState('')
  const [saved, setSaved] = useState(false)

  function update(key, value) {
    dispatch({ type: 'UPDATE_SETTINGS', payload: { [key]: value } })
  }

  function saveAndNotify() {
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  function addCustomPrompt() {
    const text = customPrompt.trim()
    if (!text) return
    dispatch({ type: 'ADD_CUSTOM_PROMPT', payload: { text, category: 'custom' } })
    setCustomPrompt('')
  }

  return (
    <div className="min-h-screen pb-24 px-4 pt-12 max-w-lg mx-auto">
      <h1 className="text-2xl font-semibold text-white mb-6">Settings</h1>

      {/* Default session */}
      <Card className="p-5 mb-4">
        <p className="text-sm font-medium text-slate-300 mb-4">Session defaults</p>
        <label className="block mb-3">
          <span className="text-xs text-slate-400 block mb-1">Default duration (minutes)</span>
          <select
            className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
            value={settings.defaultDuration}
            onChange={e => update('defaultDuration', Number(e.target.value))}
          >
            {[1, 3, 5, 10, 15, 20, 30].map(m => (
              <option key={m} value={m}>{m} min</option>
            ))}
          </select>
        </label>

        <label className="block mb-3">
          <span className="text-xs text-slate-400 block mb-1">Bell sound</span>
          <select
            className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
            value={settings.bellSound}
            onChange={e => update('bellSound', e.target.value)}
          >
            <option value="singing-bowl">Singing Bowl</option>
            <option value="bell">Bell</option>
            <option value="none">None</option>
          </select>
        </label>

        <label className="block">
          <span className="text-xs text-slate-400 block mb-1">Default breathing pattern</span>
          <select
            className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
            value={settings.breathingPattern}
            onChange={e => update('breathingPattern', e.target.value)}
          >
            <option value="box">Box Breathing (4-4-4-4)</option>
            <option value="478">4-7-8 Relaxing</option>
            <option value="simple">Simple (4-4)</option>
          </select>
        </label>
      </Card>

      {/* Reminders */}
      <Card className="p-5 mb-4">
        <p className="text-sm font-medium text-slate-300 mb-4">Daily reminder</p>
        <label className="flex items-center justify-between mb-3">
          <span className="text-sm text-slate-400">Enable reminder</span>
          <input
            type="checkbox"
            checked={!!settings.reminderTime}
            onChange={e => update('reminderTime', e.target.checked ? '07:00' : null)}
            className="w-4 h-4 accent-violet-500"
          />
        </label>
        {settings.reminderTime && (
          <label className="block">
            <span className="text-xs text-slate-400 block mb-1">Reminder time</span>
            <input
              type="time"
              className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
              value={settings.reminderTime}
              onChange={e => update('reminderTime', e.target.value)}
            />
          </label>
        )}
      </Card>

      {/* Custom journal prompts */}
      <Card className="p-5 mb-4">
        <p className="text-sm font-medium text-slate-300 mb-4">Custom journal prompts</p>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            placeholder="Add your own prompt..."
            className="flex-1 bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-400"
            value={customPrompt}
            onChange={e => setCustomPrompt(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addCustomPrompt()}
          />
          <Button variant="secondary" size="sm" onClick={addCustomPrompt}>Add</Button>
        </div>
        {journalSettings.customPrompts.length > 0 ? (
          <ul className="space-y-2">
            {journalSettings.customPrompts.map(p => (
              <li key={p.text} className="flex items-start justify-between gap-2 text-sm text-slate-300 bg-white/5 rounded-lg px-3 py-2">
                <span>{p.text}</span>
                <button
                  className="text-slate-500 hover:text-red-400 transition-colors shrink-0"
                  onClick={() => dispatch({ type: 'DELETE_CUSTOM_PROMPT', payload: p })}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-slate-500">No custom prompts yet.</p>
        )}
      </Card>
    </div>
  )
}
