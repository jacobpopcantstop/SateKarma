import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useTimer } from '../hooks/useTimer'
import { playBell } from '../utils/sounds'
import TimerRing from '../components/Timer/TimerRing'
import TimerControls from '../components/Timer/TimerControls'
import TimerSettings from '../components/Timer/TimerSettings'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'

function generateId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export default function MeditateTimer() {
  const { state, dispatch } = useApp()
  const navigate = useNavigate()
  const [duration, setDuration] = useState(state.settings.defaultDuration)
  const [startTime, setStartTime] = useState(null)
  const [sessionComplete, setSessionComplete] = useState(false)
  const [completedSession, setCompletedSession] = useState(null)

  function handleComplete() {
    playBell(state.settings.bellSound)
    const session = {
      id: generateId(),
      date: new Date().toISOString().slice(0, 10),
      startedAt: startTime,
      duration: duration * 60,
      targetDuration: duration * 60,
      breathingIntro: false,
    }
    dispatch({ type: 'ADD_SESSION', payload: session })
    setCompletedSession(session)
    setSessionComplete(true)
  }

  const durationSeconds = duration * 60
  const { secondsLeft, progress, status, start, pause, resume, stop } = useTimer(
    durationSeconds,
    handleComplete
  )

  function handleStart() {
    setStartTime(new Date().toISOString())
    start()
  }

  function handleStop() {
    const elapsed = durationSeconds - secondsLeft
    if (elapsed >= 30) {
      // Save partial session if at least 30 seconds elapsed
      const session = {
        id: generateId(),
        date: new Date().toISOString().slice(0, 10),
        startedAt: startTime,
        duration: elapsed,
        targetDuration: duration * 60,
        breathingIntro: false,
      }
      dispatch({ type: 'ADD_SESSION', payload: session })
      setCompletedSession(session)
      setSessionComplete(true)
    }
    stop()
  }

  if (sessionComplete && completedSession) {
    return (
      <div className="min-h-screen pb-24 px-4 pt-12 max-w-lg mx-auto flex flex-col items-center justify-center text-center">
        <div className="text-5xl mb-4">🔔</div>
        <h2 className="text-2xl font-semibold text-white mb-1">Session complete</h2>
        <p className="text-slate-400 text-sm mb-8">
          {Math.floor(completedSession.duration / 60)} minutes of stillness. Well done.
        </p>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onClick={() => navigate('/journal/write', { state: { sessionId: completedSession.id } })}
          >
            Reflect & journal
          </Button>
          <Button
            variant="secondary"
            size="lg"
            className="w-full"
            onClick={() => {
              setSessionComplete(false)
              setCompletedSession(null)
            }}
          >
            Meditate again
          </Button>
          <Button variant="ghost" size="md" onClick={() => navigate('/')}>
            Go home
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-24 px-4 pt-12 max-w-lg mx-auto flex flex-col items-center">
      <h1 className="text-xl font-medium text-slate-300 mb-8">Meditation</h1>

      {/* Duration picker — only shown when idle */}
      <div className="mb-8 w-full">
        <TimerSettings
          duration={duration}
          onDurationChange={setDuration}
          disabled={status !== 'idle'}
        />
      </div>

      {/* Timer ring */}
      <TimerRing progress={progress} secondsLeft={secondsLeft} />

      {/* Status label */}
      <p className="text-sm text-slate-400 mt-4 h-5">
        {status === 'idle' && 'Choose a duration and begin'}
        {status === 'running' && 'Breathe. You\'re doing great.'}
        {status === 'paused' && 'Paused — resume when ready'}
        {status === 'done' && 'Complete'}
      </p>

      {/* Controls */}
      <TimerControls
        status={status}
        onStart={handleStart}
        onPause={pause}
        onResume={resume}
        onStop={handleStop}
      />

      {/* Quick-link to breathing */}
      {status === 'idle' && (
        <button
          className="mt-8 text-sm text-slate-500 hover:text-teal-400 transition-colors"
          onClick={() => navigate('/breathe')}
        >
          Breathe first →
        </button>
      )}
    </div>
  )
}
