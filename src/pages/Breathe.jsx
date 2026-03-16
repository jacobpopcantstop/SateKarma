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
    <div className="min-h-screen pb-36 flex flex-col items-center px-4 pt-12">
      <h1
        className={`text-sm font-medium tracking-[0.25em] uppercase text-white/40 mb-10 transition-opacity duration-500 ${
          running ? 'opacity-0' : 'opacity-100'
        }`}
      >
        Breathing
      </h1>

      {/* Pattern picker */}
      <div
        className={`mb-10 w-full max-w-sm transition-all duration-500 ${
          running ? 'opacity-0 pointer-events-none h-0 mb-0 overflow-hidden' : 'opacity-100'
        }`}
      >
        <PatternPicker value={pattern} onChange={setPattern} disabled={running} />
      </div>

      {/* Circle or idle state */}
      <div className="flex-1 flex items-center justify-center w-full">
        {running ? (
          <BreathCircle
            expanded={expanded}
            held={held}
            currentPhase={currentPhase}
            phaseSecond={phaseSecond}
          />
        ) : (
          <div className="text-center fade-up">
            <div className="w-32 h-32 rounded-full glass mx-auto mb-8 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500/40 to-teal-400/30" />
            </div>
            <p className="text-white/40 text-sm tracking-wide">Find a comfortable position</p>
            <p className="text-white/20 text-xs mt-1">Press start when you're ready</p>
          </div>
        )}
      </div>

      {/* Cycle counter */}
      <div className="h-6 mt-4 mb-4">
        {running && cycles > 0 && (
          <p className="text-xs text-white/25 tracking-widest uppercase text-center">
            {cycles} {cycles === 1 ? 'cycle' : 'cycles'} complete
          </p>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-3 w-full max-w-xs items-center">
        {!running ? (
          <Button variant="teal" size="lg" className="w-full" onClick={start}>
            Begin
          </Button>
        ) : (
          <Button variant="secondary" size="lg" className="w-full" onClick={stop}>
            Stop
          </Button>
        )}
        {!running && (
          <button
            className="text-xs text-white/25 hover:text-violet-400/80 transition-colors tracking-widest uppercase mt-2"
            onClick={() => navigate('/timer')}
          >
            Go to timer →
          </button>
        )}
      </div>
    </div>
  )
}
