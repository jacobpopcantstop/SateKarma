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
  const [confirmStop, setConfirmStop] = useState(false)

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

  const durationSeconds = duration * 60
  const { secondsLeft, progress, status, start, pause, resume, stop } = useTimer(
    durationSeconds,
    handleComplete,
    intervalSecs,
    () => playBell(state.settings.bellSound),
  )

  function handleStart() {
    setStartTime(new Date().toISOString())
    start()
  }

  function handleStop() {
    const elapsed = durationSeconds - secondsLeft
    if (elapsed < 30) {
      // Too short to save — confirm before discarding
      setConfirmStop(true)
      return
    }
    commitStop(elapsed)
  }

  function commitStop(elapsed) {
    if (elapsed === undefined) elapsed = durationSeconds - secondsLeft
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
    setConfirmStop(false)
  }

  if (sessionComplete && completedSession) {
    const mins = Math.floor(completedSession.duration / 60)
    const secs = completedSession.duration % 60
    const timeStr = secs > 0 ? `${mins}m ${secs}s` : `${mins} minute${mins !== 1 ? 's' : ''}`
    return (
      <div className="min-h-screen pb-36 flex flex-col items-center justify-center px-6 text-center fade-up">
        {/* Completion glow */}
        <div className="relative mb-8">
          <div className="absolute inset-0 rounded-full bg-violet-500/20 blur-2xl scale-150" />
          <div className="relative w-24 h-24 rounded-full glass flex items-center justify-center glow-violet">
            <span className="text-4xl">🔔</span>
          </div>
        </div>

        <h2 className="text-3xl font-light text-white mb-2 tracking-tight">Session complete</h2>
        <p className="text-white/40 mb-10 text-sm tracking-wide">{timeStr} of stillness</p>

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
            onClick={() => { setSessionComplete(false); setCompletedSession(null) }}
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

  const isRunning = status === 'running'

  return (
    <div className="min-h-screen pb-36 flex flex-col items-center px-4 pt-12">
      {/* Title — fades out while running */}
      <h1
        className={`text-sm font-medium tracking-[0.25em] uppercase text-white/40 mb-10 transition-opacity duration-500 ${
          isRunning ? 'opacity-0' : 'opacity-100'
        }`}
      >
        Meditation
      </h1>

      {/* Duration picker */}
      <div
        className={`mb-10 w-full max-w-sm transition-all duration-500 ${
          status !== 'idle' ? 'opacity-0 pointer-events-none h-0 mb-0 overflow-hidden' : 'opacity-100'
        }`}
      >
        <TimerSettings
          duration={duration}
          onDurationChange={setDuration}
          disabled={status !== 'idle'}
        />
      </div>

      {/* Ring */}
      <div className={`transition-all duration-700 ${isRunning ? 'mt-8' : ''}`}>
        <TimerRing progress={progress} secondsLeft={secondsLeft} />
      </div>

      {/* Status hint */}
      <p className="text-sm text-white/25 mt-6 h-5 tracking-widest uppercase text-center">
        {status === 'idle' && 'choose a duration'}
        {status === 'running' && ''}
        {status === 'paused' && 'paused'}
        {status === 'done' && 'complete'}
      </p>

      <TimerControls
        status={status}
        onStart={handleStart}
        onPause={pause}
        onResume={resume}
        onStop={handleStop}
      />

      {/* Confirm discard short session */}
      {confirmStop && (
        <div className="fixed inset-0 z-50 flex items-end justify-center pb-12 px-6">
          <div className="glass rounded-2xl p-5 w-full max-w-xs text-center">
            <p className="text-sm text-slate-300 mb-1">End session?</p>
            <p className="text-xs text-slate-500 mb-5">Sessions under 30s won't be saved.</p>
            <div className="flex gap-3">
              <Button variant="ghost" size="md" className="flex-1" onClick={() => setConfirmStop(false)}>
                Keep going
              </Button>
              <Button variant="secondary" size="md" className="flex-1" onClick={() => { stop(); setConfirmStop(false) }}>
                End
              </Button>
            </div>
          </div>
        </div>
      )}

      {status === 'idle' && (
        <button
          className="mt-10 text-xs text-white/25 hover:text-teal-400/80 transition-colors tracking-widest uppercase"
          onClick={() => navigate('/breathe')}
        >
          Breathe first →
        </button>
      )}
    </div>
  )
}
