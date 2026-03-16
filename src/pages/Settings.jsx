import { useState } from 'react'
import { useApp } from '../context/AppContext'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

export default function Settings() {
  const { state, dispatch } = useApp()
  const { settings, journalSettings } = state
  const [customPrompt, setCustomPrompt] = useState('')
  const [toast, setToast] = useState(null)
  const [confirmDeleteText, setConfirmDeleteText] = useState(null)

  function update(key, value) {
    dispatch({ type: 'UPDATE_SETTINGS', payload: { [key]: value } })
    showToast('Saved')
  }

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(null), 2000)
  }

  function addCustomPrompt() {
    const text = customPrompt.trim()
    if (!text) return
    dispatch({ type: 'ADD_CUSTOM_PROMPT', payload: { text, category: 'custom' } })
    setCustomPrompt('')
    showToast('Prompt added')
  }

  function deletePrompt(p) {
    dispatch({ type: 'DELETE_CUSTOM_PROMPT', payload: p })
    setConfirmDeleteText(null)
    showToast('Prompt deleted')
  }

  return (
    <div className="min-h-screen pb-24 px-4 pt-12 max-w-lg mx-auto">
      <h1 className="text-2xl font-semibold text-white mb-6">Settings</h1>

      {/* Toast */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-violet-600 text-white text-sm px-4 py-2 rounded-full shadow-lg transition-all">
          {toast}
        </div>
      )}

      {/* Session defaults */}
      <Card className="p-5 mb-4">
        <p className="text-sm font-medium text-slate-300 mb-4">Session defaults</p>

        <label className="block mb-3">
          <span className="text-xs text-slate-400 block mb-1">Default duration</span>
          <select
            className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
            value={settings.defaultDuration}
            onChange={e => update('defaultDuration', Number(e.target.value))}
          >
            {[1, 3, 5, 10, 15, 20, 30].map(m => (
              <option key={m} value={m}>{m} minutes</option>
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

        <label className="block mb-3">
          <span className="text-xs text-slate-400 block mb-1">Interval bell</span>
          <select
            className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
            value={settings.intervalBell ?? ''}
            onChange={e => update('intervalBell', e.target.value ? Number(e.target.value) : null)}
          >
            <option value="">Off</option>
            <option value="5">Every 5 minutes</option>
            <option value="10">Every 10 minutes</option>
            <option value="15">Every 15 minutes</option>
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
              <li key={p.text} className="bg-white/5 rounded-lg px-3 py-2">
                {confirmDeleteText === p.text ? (
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-slate-400">Delete this prompt?</span>
                    <div className="flex gap-2">
                      <button
                        className="text-xs text-red-400 hover:text-red-300 font-medium"
                        onClick={() => deletePrompt(p)}
                      >
                        Delete
                      </button>
                      <button
                        className="text-xs text-slate-500 hover:text-slate-300"
                        onClick={() => setConfirmDeleteText(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-sm text-slate-300">{p.text}</span>
                    <button
                      className="text-slate-500 hover:text-red-400 transition-colors shrink-0 mt-0.5"
                      onClick={() => setConfirmDeleteText(p.text)}
                    >
                      ✕
                    </button>
                  </div>
                )}
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
