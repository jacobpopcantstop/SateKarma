import { PATTERNS } from '../../hooks/useBreathing'

export default function PatternPicker({ value, onChange, disabled }) {
  return (
    <div className="flex gap-2 flex-wrap justify-center">
      {Object.entries(PATTERNS).map(([key, p]) => (
        <button
          key={key}
          disabled={disabled}
          onClick={() => onChange(key)}
          className={`px-4 py-2 rounded-xl text-sm transition-all duration-150 disabled:opacity-40 ${
            value === key
              ? 'bg-teal-600 text-white font-medium'
              : 'bg-white/10 text-slate-300 hover:bg-white/20'
          }`}
        >
          <span className="font-medium">{p.label}</span>
          <span className="text-xs opacity-70 ml-1">({p.description})</span>
        </button>
      ))}
    </div>
  )
}
