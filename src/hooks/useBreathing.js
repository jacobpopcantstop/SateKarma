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
  // Refs so the interval always reads current values without stale closures
  const phaseIndexRef = useRef(0)
  const phaseSecondRef = useRef(0)
  const patternRef = useRef(pattern)
  patternRef.current = pattern

  useEffect(() => {
    return () => clearInterval(timerRef.current)
  }, [])

  const start = useCallback(() => {
    phaseIndexRef.current = 0
    phaseSecondRef.current = 0
    setPhaseIndex(0)
    setPhaseSecond(0)
    setCycles(0)
    setRunning(true)

    timerRef.current = setInterval(() => {
      const phases = patternRef.current.phases
      const currentDuration = phases[phaseIndexRef.current].duration
      const nextSecond = phaseSecondRef.current + 1

      if (nextSecond >= currentDuration) {
        // Advance to the next phase
        const nextPhaseIndex = (phaseIndexRef.current + 1) % phases.length
        if (nextPhaseIndex === 0) setCycles(c => c + 1)
        phaseIndexRef.current = nextPhaseIndex
        phaseSecondRef.current = 0
        setPhaseIndex(nextPhaseIndex)
        setPhaseSecond(0)
      } else {
        phaseSecondRef.current = nextSecond
        setPhaseSecond(nextSecond)
      }
    }, 1000)
  }, [])

  const stop = useCallback(() => {
    clearInterval(timerRef.current)
    phaseIndexRef.current = 0
    phaseSecondRef.current = 0
    setRunning(false)
    setPhaseIndex(0)
    setPhaseSecond(0)
    setCycles(0)
  }, [])

  const currentPhase = pattern.phases[phaseIndex]
  const expanded = currentPhase.name === 'Breathe in'
  const held = currentPhase.name === 'Hold'
  const phaseFraction = phaseSecond / currentPhase.duration

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
