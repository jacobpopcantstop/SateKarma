export default function TimerRing({ progress, secondsLeft, size = 280 }) {
  const stroke = 6
  const glowStroke = 18
  const r = (size - glowStroke) / 2
  const circumference = 2 * Math.PI * r
  const offset = circumference * (1 - progress)

  // Leading dot position
  const angle = progress * 2 * Math.PI - Math.PI / 2
  const dotX = size / 2 + r * Math.cos(angle)
  const dotY = size / 2 + r * Math.sin(angle)

  const minutes = Math.floor(secondsLeft / 60)
  const seconds = secondsLeft % 60
  const isNearEnd = secondsLeft > 0 && secondsLeft <= 60

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {/* Outer ambient glow when running */}
      {progress > 0 && (
        <div
          className="absolute inset-0 rounded-full transition-opacity duration-1000"
          style={{
            background: 'radial-gradient(circle, rgba(109,40,217,0.12) 30%, transparent 70%)',
            animation: 'breath-pulse 4s ease-in-out infinite',
          }}
        />
      )}

      <svg width={size} height={size} className="-rotate-90" style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="50%" stopColor="#6d28d9" />
            <stop offset="100%" stopColor="#14b8a6" />
          </linearGradient>
          <linearGradient id="ringGradientEnd" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f43f5e" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
          <filter id="ringGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={stroke}
        />

        {/* Glow layer (blurred duplicate) */}
        {progress > 0 && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={isNearEnd ? 'url(#ringGradientEnd)' : 'url(#ringGradient)'}
            strokeWidth={glowStroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            opacity="0.2"
            filter="url(#ringGlow)"
            style={{ transition: 'stroke-dashoffset 0.9s ease, stroke 1s ease' }}
          />
        )}

        {/* Progress arc */}
        {progress > 0 && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={isNearEnd ? 'url(#ringGradientEnd)' : 'url(#ringGradient)'}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.9s ease, stroke 1s ease' }}
          />
        )}

        {/* Leading dot */}
        {progress > 0.01 && progress < 1 && (
          <circle
            cx={dotX}
            cy={dotY}
            r={stroke - 1}
            fill={isNearEnd ? '#f43f5e' : '#a78bfa'}
            style={{ filter: 'drop-shadow(0 0 4px rgba(167,139,250,0.9))' }}
          />
        )}
      </svg>

      {/* Centre content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
        <span
          className={`font-light tabular-nums tracking-tight transition-colors duration-1000 ${
            isNearEnd ? 'text-rose-300' : 'text-white'
          }`}
          style={{ fontSize: size * 0.17 }}
        >
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </span>
        <span className="text-xs text-white/30 tracking-widest uppercase">remaining</span>
      </div>
    </div>
  )
}
