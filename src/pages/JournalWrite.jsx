import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { pickPrompt } from '../utils/promptPicker'
import { generateId } from '../utils/helpers'
import MoodPicker from '../components/Journal/MoodPicker'
import PromptCard from '../components/Journal/PromptCard'
import JournalEditor from '../components/Journal/JournalEditor'
import Button from '../components/ui/Button'

export default function JournalWrite() {
  const { state, dispatch } = useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const sessionId = location.state?.sessionId || null

  const [step, setStep] = useState('mood')
  const [moodScore, setMoodScore] = useState(null)
  const [isFreeWrite, setIsFreeWrite] = useState(false)
  const [activePrompt, setActivePrompt] = useState(null)
  const [response, setResponse] = useState('')

  function handleMoodNext() {
    if (!moodScore) return
    setActivePrompt(
      pickPrompt(
        state.journalSettings.lastUsedPrompts,
        moodScore,
        state.journalSettings.customPrompts,
        state.journalSettings.favoritePromptTexts
      )
    )
    setStep('prompt')
  }

  function handleSave() {
    if (!response.trim()) return
    const entry = {
      id: generateId(),
      date: new Date().toISOString().slice(0, 10),
      sessionId,
      moodScore,
      prompt: isFreeWrite ? null : activePrompt,
      response: response.trim(),
      isFreeWrite,
      isFavoritePrompt: state.journalSettings.favoritePromptTexts.includes(activePrompt?.text),
      createdAt: new Date().toISOString(),
    }
    dispatch({ type: 'ADD_JOURNAL_ENTRY', payload: entry })
    navigate(`/journal/${entry.id}`, { replace: true })
  }

  if (step === 'mood') {
    return (
      <div className="min-h-screen pb-24 px-4 pt-12 max-w-lg mx-auto flex flex-col">
        {/* Back */}
        <button
          className="self-start text-sm text-slate-400 hover:text-slate-200 transition-colors mb-8"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>

        <h1 className="text-xl font-medium text-slate-300 mb-2 text-center">How are you feeling?</h1>
        <p className="text-sm text-slate-500 text-center mb-10">Before we dive in</p>

        <div className="flex-1 flex flex-col items-center justify-center">
          <MoodPicker value={moodScore} onChange={setMoodScore} />
        </div>

        <Button
          variant="primary"
          size="lg"
          className="w-full"
          onClick={handleMoodNext}
          disabled={!moodScore}
        >
          Continue →
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-24 px-4 pt-12 max-w-lg mx-auto flex flex-col gap-4">
      {/* Back */}
      <button
        className="self-start text-sm text-slate-400 hover:text-slate-200 transition-colors"
        onClick={() => setStep('mood')}
      >
        ← Back
      </button>

      <h1 className="text-xl font-medium text-slate-300 text-center">Reflect</h1>

      {!isFreeWrite ? (
        <PromptCard
          prompt={activePrompt}
          moodScore={moodScore}
          onSwap={setActivePrompt}
          onSkip={() => setIsFreeWrite(true)}
        />
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
          <p className="text-sm text-slate-400 italic">Free write — no prompt</p>
          <button
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
            onClick={() => setIsFreeWrite(false)}
          >
            Use a prompt
          </button>
        </div>
      )}

      <JournalEditor
        value={response}
        onChange={setResponse}
        placeholder={
          isFreeWrite
            ? "Write whatever's on your mind..."
            : activePrompt?.text || 'Write freely...'
        }
      />

      <p className="text-xs text-slate-600 text-right">
        {response.trim().split(/\s+/).filter(Boolean).length} words
      </p>

      <Button
        variant="primary"
        size="lg"
        className="w-full"
        onClick={handleSave}
        disabled={!response.trim()}
      >
        Save entry
      </Button>
    </div>
  )
}
