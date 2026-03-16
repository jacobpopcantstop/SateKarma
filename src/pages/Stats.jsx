import { useApp } from '../context/AppContext'
import Card from '../components/ui/Card'

const LEVELS = [
  { name: 'Seed', emoji: '🌱', min: 0, max: 30 },
  { name: 'Sprout', emoji: '🌿', min: 30, max: 120 },
  { name: 'Sapling', emoji: '🌳', min: 120, max: 300 },
  { name: 'Tree', emoji: '🌲', min: 300, max: 600 },
  { name: 'Forest', emoji: '🌲🌲', min: 600, max: Infinity },
]

function currentLevel(minutes) {
  return LEVELS.find(l => minutes >= l.min && minutes < l.max) || LEVELS[LEVELS.length - 1]
}

function getLast7Days() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(Date.now() - (6 - i) * 864e5)
    return d.toISOString().slice(0, 10)
  })
}

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function Stats() {
  const { state } = useApp()
  const { streak, stats, sessions } = state

  const lvl = currentLevel(stats.totalMinutes)
  const progressPct = lvl.max === Infinity
    ? 100
    : Math.min(((stats.totalMinutes - lvl.min) / (lvl.max - lvl.min)) * 100, 100)

  const days = getLast7Days()
  const minutesByDay = days.map(date => {
    const mins = sessions
      .filter(s => s.date === date)
      .reduce((sum, s) => sum + Math.floor(s.duration / 60), 0)
    return { date, mins }
  })
  const maxMins = Math.max(...minutesByDay.map(d => d.mins), 1)
  const today = new Date().toISOString().slice(0, 10)

  return (
    <div className="min-h-screen pb-36 px-4 pt-12 max-w-lg mx-auto fade-up">
      <h1 className="text-2xl font-light text-white mb-8 tracking-tight">Progress</h1>

      {/* Streak pair */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <Card className="p-5 text-center" glow={streak.current > 0 ? 'violet' : undefined}>
          <div className="text-4xl font-light text-amber-300 mb-1 tracking-tight">{streak.current}</div>
          <div className="text-[11px] text-white/30 uppercase tracking-widest">Current streak</div>
          {streak.current > 0 && <div className="text-lg mt-1">🔥</div>}
        </Card>
        <Card className="p-5 text-center">
          <div className="text-4xl font-light text-violet-300 mb-1 tracking-tight">{streak.best}</div>
          <div className="text-[11px] text-white/30 uppercase tracking-widest">Best streak</div>
          {streak.best > 0 && <div className="text-lg mt-1">🏆</div>}
        </Card>
      </div>

      {/* All-time stats */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <Card className="p-5 text-center">
          <div className="text-4xl font-light text-teal-300 mb-1 tracking-tight">{stats.totalSessions}</div>
          <div className="text-[11px] text-white/30 uppercase tracking-widest">Sessions</div>
        </Card>
        <Card className="p-5 text-center">
          <div className="text-4xl font-light text-teal-300 mb-1 tracking-tight">{stats.totalMinutes}</div>
          <div className="text-[11px] text-white/30 uppercase tracking-widest">Minutes</div>
        </Card>
      </div>

      {/* Level card */}
      <Card className="p-6 mb-3">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[11px] text-white/30 uppercase tracking-widest mb-1">Level</p>
            <p className="text-2xl font-light text-white">{lvl.emoji} {lvl.name}</p>
          </div>
          {lvl.max !== Infinity && (
            <p className="text-xs text-white/25">
              {lvl.max - stats.totalMinutes} min left
            </p>
          )}
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-teal-400 transition-all duration-700"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <div className="flex justify-between mt-2">
          {LEVELS.filter(l => l.max !== Infinity || stats.totalMinutes >= l.min)
            .slice(0, 5)
            .map(l => (
              <span
                key={l.name}
                className={`text-[9px] uppercase tracking-wide ${
                  l.name === lvl.name ? 'text-violet-400' : 'text-white/15'
                }`}
              >
                {l.name}
              </span>
            ))}
        </div>
      </Card>

      {/* Weekly chart */}
      <Card className="p-6">
        <p className="text-[11px] text-white/30 uppercase tracking-widest mb-5">Last 7 days</p>
        <div className="flex items-end gap-2" style={{ height: '88px' }}>
          {minutesByDay.map(({ date, mins }) => {
            const dayName = DAY_LABELS[new Date(date + 'T12:00:00').getDay()]
            const isToday = date === today
            const heightPct = (mins / maxMins) * 100
            return (
              <div key={date} className="flex-1 flex flex-col items-center gap-1.5">
                <div className="w-full flex items-end" style={{ height: '68px' }}>
                  <div
                    className="w-full rounded-t-lg transition-all duration-700"
                    style={{
                      height: `${heightPct}%`,
                      minHeight: mins > 0 ? '4px' : '0',
                      background: isToday
                        ? 'linear-gradient(to top, #7c3aed, #a78bfa)'
                        : mins > 0
                        ? 'rgba(139,92,246,0.3)'
                        : 'rgba(255,255,255,0.04)',
                      boxShadow: isToday && mins > 0
                        ? '0 0 12px rgba(139,92,246,0.5)'
                        : 'none',
                    }}
                  />
                </div>
                <span className={`text-[9px] uppercase tracking-wide ${isToday ? 'text-violet-400' : 'text-white/20'}`}>
                  {dayName}
                </span>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
