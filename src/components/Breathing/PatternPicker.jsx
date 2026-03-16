import { PATTERNS } from '../../hooks/useBreathing'

export default function PatternPicker({ value, onChange, disabled }) {
  return (
    <div className="flex gap-2 flex-wrap justify-center">
      {Object.entries(PATTERNS).map(([key, p]) => (
        <button
          key={key}
          disabled={disabled}
          onClick={() => onChange(key)}
          className={`px-4 py-2.5 rounded-2xl text-sm transition-all duration-200 disabled:opacity-30 ${
            value === key
              ? 'bg-teal-600/70 text-white shadow-lg shadow-teal-900/40'
              : 'glass text-white/40 hover:text-white/70'
          }`}
        >
          <span className="font-medium">{p.label}</span>
          <span className="text-xs opacity-50 ml-1.5">{p.description}</span>
        </button>
      ))}
    </div>
  )
}
