import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useTimer } from '../hooks/useTimer'
import { playBell } from '../utils/sounds'
import { generateId } from '../utils/helpers'
import TimerRing from '../components/Timer/TimerRing'
import TimerControls from '../components/Timer/TimerControls'
import TimerSettings from '../components/Timer/TimerSettings'
import Button from '../components/ui/Button'

export default function MeditateTimer() {
  const { state, dispatch } = useApp()
  const navigate = useNavigate()
  const [duration, setDuration] = useState(state.settings.defaultDuration)
  const [startTime, setStartTime] = useState(null)
  const [sessionComplete, setSessionComplete] = useState(false)
  const [completedSession, setCompletedSession] = useState(null)

  const intervalSecs = state.settings.intervalBell
    ? state.settings.intervalBell * 60
    : null

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

  function handleIntervalBell() {
    playBell(state.settings.bellSound)
  }

  const durationSeconds = duration * 60
  const { secondsLeft, progress, status, start, pause, resume, stop } = useTimer(
    durationSeconds,
    handleComplete,
    intervalSecs,
    handleIntervalBell,
  )

  function handleStart() {
    setStartTime(new Date().toISOString())
    start()
  }

  function handleStop() {
    const elapsed = durationSeconds - secondsLeft
    if (elapsed >= 30) {
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
    const mins = Math.floor(completedSession.duration / 60)
    const secs = completedSession.duration % 60
    const timeStr = secs > 0 ? `${mins}m ${secs}s` : `${mins} minute${mins !== 1 ? 's' : ''}`
    return (
      <div className="min-h-screen pb-24 px-4 pt-12 max-w-lg mx-auto flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 rounded-full bg-violet-500/20 flex items-center justify-center mb-6">
          <span className="text-4xl">🔔</span>
        </div>
        <h2 className="text-2xl font-semibold text-white mb-2">Session complete</h2>
        <p className="text-slate-400 text-sm mb-10">
          {timeStr} of stillness. Well done.
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

      <div className="mb-8 w-full">
        <TimerSettings
          duration={duration}
          onDurationChange={setDuration}
          disabled={status !== 'idle'}
        />
      </div>

      <TimerRing progress={progress} secondsLeft={secondsLeft} />

      <p className="text-sm text-slate-400 mt-4 h-5">
        {status === 'idle' && 'Choose a duration and begin'}
        {status === 'running' && "You're doing great."}
        {status === 'paused' && 'Paused — resume when ready'}
        {status === 'done' && 'Complete'}
      </p>

      <TimerControls
        status={status}
        onStart={handleStart}
        onPause={pause}
        onResume={resume}
        onStop={handleStop}
      />

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
