const MOODS = [
  { score: 1, emoji: '😔', label: 'Low' },
  { score: 2, emoji: '😕', label: 'Meh' },
  { score: 3, emoji: '😐', label: 'Okay' },
  { score: 4, emoji: '🙂', label: 'Good' },
  { score: 5, emoji: '😊', label: 'Great' },
]

export default function MoodPicker({ value, onChange, label = 'How are you feeling?' }) {
  return (
    <div>
      <p className="text-sm text-slate-400 mb-3">{label}</p>
      <div className="flex gap-3 justify-center">
        {MOODS.map(({ score, emoji, label: moodLabel }) => (
          <button
            key={score}
            onClick={() => onChange(score)}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-150 ${
              value === score
                ? 'bg-violet-600/30 ring-1 ring-violet-400 scale-110'
                : 'hover:bg-white/10'
            }`}
          >
            <span className="text-2xl">{emoji}</span>
            <span className="text-[10px] text-slate-400">{moodLabel}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
