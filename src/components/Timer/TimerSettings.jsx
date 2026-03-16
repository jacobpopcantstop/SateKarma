const DURATIONS = [1, 3, 5, 10, 15, 20, 30]

export default function TimerSettings({ duration, onDurationChange, disabled }) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {DURATIONS.map(d => (
        <button
          key={d}
          disabled={disabled}
          onClick={() => onDurationChange(d)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 disabled:opacity-40 ${
            duration === d
              ? 'bg-violet-600 text-white'
              : 'bg-white/10 text-slate-300 hover:bg-white/20'
          }`}
        >
          {d}m
        </button>
      ))}
    </div>
  )
}
