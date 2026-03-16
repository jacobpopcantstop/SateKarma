const DURATIONS = [1, 3, 5, 10, 15, 20, 30]

export default function TimerSettings({ duration, onDurationChange, disabled }) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {DURATIONS.map(d => (
        <button
          key={d}
          disabled={disabled}
          onClick={() => onDurationChange(d)}
          className={`px-4 py-2 rounded-2xl text-sm font-medium transition-all duration-200 disabled:opacity-30 ${
            duration === d
              ? 'bg-violet-600/80 text-white shadow-lg shadow-violet-900/50'
              : 'glass text-white/40 hover:text-white/70'
          }`}
        >
          {d}m
        </button>
      ))}
    </div>
  )
}
