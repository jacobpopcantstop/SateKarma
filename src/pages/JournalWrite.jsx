import { useState, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { pickPrompt } from '../utils/promptPicker'
import MoodPicker from '../components/Journal/MoodPicker'
import PromptCard from '../components/Journal/PromptCard'
import JournalEditor from '../components/Journal/JournalEditor'
import Button from '../components/ui/Button'

function generateId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export default function JournalWrite() {
  const { state, dispatch } = useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const sessionId = location.state?.sessionId || null

  const [step, setStep] = useState('mood') // mood | prompt | done
  const [moodScore, setMoodScore] = useState(null)
  const [isFreeWrite, setIsFreeWrite] = useState(false)

  const initialPrompt = useMemo(() =>
    pickPrompt(
      state.journalSettings.lastUsedPrompts,
      null,
      state.journalSettings.customPrompts,
      state.journalSettings.favoritePromptTexts
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const [activePrompt, setActivePrompt] = useState(initialPrompt)
  const [response, setResponse] = useState('')

  function handleMoodNext() {
    if (!moodScore) return
    // Update prompt to be mood-aware
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
        <h1 className="text-xl font-medium text-slate-300 mb-10 text-center">Check in</h1>
        <div className="flex-1 flex flex-col items-center justify-center gap-10">
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
      <h1 className="text-xl font-medium text-slate-300 text-center">Reflect</h1>

      {/* Prompt */}
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

      {/* Editor */}
      <JournalEditor
        value={response}
        onChange={setResponse}
        placeholder={
          isFreeWrite
            ? "Write whatever's on your mind..."
            : `${activePrompt?.text || 'Write freely...'}`
        }
      />

      {/* Word count */}
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
