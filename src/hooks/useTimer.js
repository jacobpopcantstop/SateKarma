import { useState, useEffect, useRef, useCallback } from 'react'

/**
 * useTimer — manages a countdown timer with pause/resume.
 * @param {number} durationSeconds - total session duration in seconds
 * @param {function} onComplete - called when timer reaches 0
 */
export function useTimer(durationSeconds, onComplete) {
  const [secondsLeft, setSecondsLeft] = useState(durationSeconds)
  const [status, setStatus] = useState('idle') // idle | running | paused | done
  const intervalRef = useRef(null)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  // Reset when duration changes
  useEffect(() => {
    setSecondsLeft(durationSeconds)
    setStatus('idle')
    clearInterval(intervalRef.current)
  }, [durationSeconds])

  useEffect(() => {
    return () => clearInterval(intervalRef.current)
  }, [])

  const start = useCallback(() => {
    if (status === 'done') return
    setStatus('running')
    intervalRef.current = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current)
          setStatus('done')
          onCompleteRef.current?.()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [status])

  const pause = useCallback(() => {
    clearInterval(intervalRef.current)
    setStatus('paused')
  }, [])

  const resume = useCallback(() => {
    if (status !== 'paused') return
    start()
  }, [status, start])

  const stop = useCallback(() => {
    clearInterval(intervalRef.current)
    setStatus('idle')
    setSecondsLeft(durationSeconds)
  }, [durationSeconds])

  const elapsed = durationSeconds - secondsLeft
  const progress = durationSeconds > 0 ? elapsed / durationSeconds : 0

  return { secondsLeft, elapsed, progress, status, start, pause, resume, stop }
}
