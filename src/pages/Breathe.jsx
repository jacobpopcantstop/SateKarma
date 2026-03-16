import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useBreathing } from '../hooks/useBreathing'
import BreathCircle from '../components/Breathing/BreathCircle'
import PatternPicker from '../components/Breathing/PatternPicker'
import Button from '../components/ui/Button'

export default function Breathe() {
  const { state } = useApp()
  const navigate = useNavigate()
  const [pattern, setPattern] = useState(state.settings.breathingPattern)

  const { running, currentPhase, phaseSecond, expanded, held, cycles, start, stop } =
    useBreathing(pattern)

  return (
    <div className="min-h-screen pb-24 px-4 pt-12 max-w-lg mx-auto flex flex-col items-center">
      <h1 className="text-xl font-medium text-slate-300 mb-8">Breathing</h1>

      {/* Pattern picker — hidden while running */}
      {!running && (
        <div className="mb-10 w-full">
          <PatternPicker value={pattern} onChange={setPattern} disabled={running} />
        </div>
      )}

      {/* Breathing circle */}
      <div className="flex-1 flex items-center justify-center">
        {running ? (
          <BreathCircle
            expanded={expanded}
            held={held}
            currentPhase={currentPhase}
            phaseSecond={phaseSecond}
          />
        ) : (
          <div className="text-center text-slate-400">
            <p className="text-sm mb-2">Find a comfortable position</p>
            <p className="text-sm">Press start when you're ready</p>
          </div>
        )}
      </div>

      {/* Cycle count */}
      {running && (
        <p className="text-sm text-slate-500 mt-4">
          {cycles} {cycles === 1 ? 'cycle' : 'cycles'} complete
        </p>
      )}

      {/* Controls */}
      <div className="mt-8 flex flex-col gap-3 w-full max-w-xs items-center">
        {!running ? (
          <Button variant="teal" size="lg" className="w-full" onClick={start}>
            Start breathing
          </Button>
        ) : (
          <Button variant="secondary" size="lg" className="w-full" onClick={stop}>
            Stop
          </Button>
        )}
        {!running && (
          <button
            className="text-sm text-slate-500 hover:text-violet-400 transition-colors"
            onClick={() => navigate('/timer')}
          >
            Go to meditation timer →
          </button>
        )}
      </div>
    </div>
  )
}
