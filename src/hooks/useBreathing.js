import { useState, useEffect, useRef, useCallback } from 'react'

export const PATTERNS = {
  box: {
    label: 'Box Breathing',
    description: '4-4-4-4',
    phases: [
      { name: 'Breathe in', duration: 4 },
      { name: 'Hold', duration: 4 },
      { name: 'Breathe out', duration: 4 },
      { name: 'Hold', duration: 4 },
    ],
  },
  '478': {
    label: '4-7-8 Relaxing',
    description: '4-7-8',
    phases: [
      { name: 'Breathe in', duration: 4 },
      { name: 'Hold', duration: 7 },
      { name: 'Breathe out', duration: 8 },
    ],
  },
  simple: {
    label: 'Simple',
    description: '4-4',
    phases: [
      { name: 'Breathe in', duration: 4 },
      { name: 'Breathe out', duration: 4 },
    ],
  },
}

export function useBreathing(patternKey = 'box') {
  const pattern = PATTERNS[patternKey] || PATTERNS.box
  const [running, setRunning] = useState(false)
  const [phaseIndex, setPhaseIndex] = useState(0)
  const [phaseSecond, setPhaseSecond] = useState(0)
  const [cycles, setCycles] = useState(0)
  const timerRef = useRef(null)

  const currentPhase = pattern.phases[phaseIndex]
  const expanded = currentPhase.name === 'Breathe in'
  const held = currentPhase.name === 'Hold'

  // Fraction through current phase (0–1), used for smooth animation
  const phaseFraction = phaseSecond / currentPhase.duration

  useEffect(() => {
    return () => clearInterval(timerRef.current)
  }, [])

  const start = useCallback(() => {
    setPhaseIndex(0)
    setPhaseSecond(0)
    setCycles(0)
    setRunning(true)

    timerRef.current = setInterval(() => {
      setPhaseSecond(prev => {
        const phase = pattern.phases[phaseIndex]
        if (prev + 1 >= phase.duration) {
          setPhaseIndex(pi => {
            const next = (pi + 1) % pattern.phases.length
            if (next === 0) setCycles(c => c + 1)
            return next
          })
          return 0
        }
        return prev + 1
      })
    }, 1000)
  }, [pattern, phaseIndex])

  const stop = useCallback(() => {
    clearInterval(timerRef.current)
    setRunning(false)
    setPhaseIndex(0)
    setPhaseSecond(0)
    setCycles(0)
  }, [])

  return {
    running,
    currentPhase,
    phaseSecond,
    phaseFraction,
    expanded,
    held,
    cycles,
    start,
    stop,
    pattern,
  }
}
