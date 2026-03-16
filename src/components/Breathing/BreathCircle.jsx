/**
 * Animated breathing circle.
 * expanded: true = inhale (large), false = exhale (small)
 * held: true = no pulse animation
 */
export default function BreathCircle({ expanded, held, currentPhase, phaseSecond }) {
  const countDown = currentPhase.duration - phaseSecond

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Outer glow ring */}
      <div className="relative flex items-center justify-center" style={{ width: 240, height: 240 }}>
        <div
          className={`absolute rounded-full bg-violet-600/10 transition-all ease-in-out ${
            expanded ? 'w-56 h-56' : 'w-24 h-24'
          }`}
          style={{ transitionDuration: expanded ? `${currentPhase.duration * 0.9}s` : `${currentPhase.duration * 0.9}s` }}
        />
        {/* Main circle */}
        <div
          className={`relative rounded-full bg-gradient-to-br from-violet-500/60 to-teal-400/60 border border-white/20 shadow-2xl shadow-violet-900/50 transition-all ease-in-out flex items-center justify-center ${
            expanded ? 'w-44 h-44' : 'w-20 h-20'
          } ${held ? '' : ''}`}
          style={{ transitionDuration: `${currentPhase.duration * 0.9}s` }}
        >
          <span className="text-3xl font-light text-white tabular-nums">{countDown}</span>
        </div>
      </div>

      {/* Phase label */}
      <p className="text-lg font-light text-slate-200 tracking-wide">{currentPhase.name}</p>
    </div>
  )
}
