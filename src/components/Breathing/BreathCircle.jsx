export default function BreathCircle({ expanded, held, currentPhase, phaseSecond }) {
  const countDown = currentPhase.duration - phaseSecond
  const isExhale = currentPhase.name === 'Breathe out'
  const isHold = currentPhase.name === 'Hold'
  const dur = `${currentPhase.duration * 0.88}s`

  // Colour shifts: violet on inhale, teal on exhale, lavender on hold
  const coreColor = isExhale
    ? 'from-teal-500/50 to-teal-400/30'
    : isHold
    ? 'from-violet-400/40 to-indigo-400/20'
    : 'from-violet-500/60 to-indigo-500/30'

  const ringColor = isExhale
    ? 'border-teal-400/20'
    : isHold
    ? 'border-violet-400/15'
    : 'border-violet-500/25'

  // Ring sizes: outer → inner
  const rings = [
    { scale: expanded ? 'w-64 h-64' : 'w-20 h-20', opacity: 'opacity-10', delay: '0s' },
    { scale: expanded ? 'w-56 h-56' : 'w-18 h-18', opacity: 'opacity-15', delay: '0.05s' },
    { scale: expanded ? 'w-48 h-48' : 'w-16 h-16', opacity: 'opacity-20', delay: '0.1s' },
  ]

  return (
    <div className="flex flex-col items-center gap-10">
      <div className="relative flex items-center justify-center" style={{ width: 280, height: 280 }}>

        {/* Ambient background glow */}
        <div
          className={`absolute rounded-full transition-all ease-in-out ${
            expanded ? 'w-72 h-72 opacity-30' : 'w-24 h-24 opacity-0'
          } ${isExhale ? 'bg-teal-500/10' : 'bg-violet-500/10'}`}
          style={{ transitionDuration: dur, filter: 'blur(20px)' }}
        />

        {/* Concentric glow rings */}
        {rings.map((ring, i) => (
          <div
            key={i}
            className={`absolute rounded-full border transition-all ease-in-out ${ring.scale} ${ring.opacity} ${ringColor}`}
            style={{ transitionDuration: dur, transitionDelay: ring.delay }}
          />
        ))}

        {/* Core circle */}
        <div
          className={`relative rounded-full bg-gradient-to-br ${coreColor} border border-white/10 transition-all ease-in-out flex items-center justify-center ${
            expanded ? 'w-44 h-44' : 'w-20 h-20'
          }`}
          style={{
            transitionDuration: dur,
            boxShadow: expanded
              ? isExhale
                ? '0 0 40px rgba(20,184,166,0.3), 0 0 80px rgba(20,184,166,0.1)'
                : '0 0 40px rgba(109,40,217,0.35), 0 0 80px rgba(109,40,217,0.12)'
              : 'none',
          }}
        >
          <span
            className="font-light text-white tabular-nums transition-all duration-300"
            style={{ fontSize: expanded ? '2.5rem' : '1.25rem', textShadow: '0 0 20px rgba(255,255,255,0.5)' }}
          >
            {countDown}
          </span>
        </div>
      </div>

      {/* Phase label */}
      <div className="text-center">
        <p
          className={`text-xl font-light tracking-[0.2em] uppercase transition-colors duration-700 ${
            isExhale ? 'text-teal-300' : isHold ? 'text-violet-300' : 'text-white'
          }`}
        >
          {currentPhase.name}
        </p>
      </div>
    </div>
  )
}
