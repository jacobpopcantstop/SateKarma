import { useState, useEffect, useRef, useCallback } from 'react'

/**
 * useTimer — countdown timer with pause/resume and interval callbacks.
 * @param {number} durationSeconds   - total session duration in seconds
 * @param {function} onComplete      - called when timer reaches 0
 * @param {number|null} intervalSecs - fire onInterval every N seconds (optional)
 * @param {function} onInterval      - called at each interval mark (optional)
 */
export function useTimer(durationSeconds, onComplete, intervalSecs = null, onInterval = null) {
  const [secondsLeft, setSecondsLeft] = useState(durationSeconds)
  const [status, setStatus] = useState('idle') // idle | running | paused | done
  const intervalRef = useRef(null)
  const elapsedRef = useRef(0)
  const onCompleteRef = useRef(onComplete)
  const onIntervalRef = useRef(onInterval)
  onCompleteRef.current = onComplete
  onIntervalRef.current = onInterval

  // Reset when duration changes
  useEffect(() => {
    setSecondsLeft(durationSeconds)
    setStatus('idle')
    elapsedRef.current = 0
    clearInterval(intervalRef.current)
  }, [durationSeconds])

  useEffect(() => {
    return () => clearInterval(intervalRef.current)
  }, [])

  const start = useCallback(() => {
    if (status === 'done') return
    setStatus('running')
    intervalRef.current = setInterval(() => {
      elapsedRef.current += 1
      // Fire interval bell if configured
      if (intervalSecs && elapsedRef.current % intervalSecs === 0) {
        onIntervalRef.current?.()
      }
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
  }, [status, intervalSecs])

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
    elapsedRef.current = 0
    setSecondsLeft(durationSeconds)
  }, [durationSeconds])

  const elapsed = durationSeconds - secondsLeft
  const progress = durationSeconds > 0 ? elapsed / durationSeconds : 0

  return { secondsLeft, elapsed, progress, status, start, pause, resume, stop }
}
