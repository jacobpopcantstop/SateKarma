export default function JournalEditor({ value, onChange, placeholder }) {
  return (
    <textarea
      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-slate-200 placeholder:text-slate-600 text-sm leading-relaxed resize-none focus:outline-none focus:border-violet-400/60 transition-colors"
      rows={8}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder || 'Write freely...'}
      autoFocus
    />
  )
}
