import { useApp } from '../context/AppContext'
import Card from '../components/ui/Card'

const LEVELS = [
  { name: 'Seed', min: 0, max: 30 },
  { name: 'Sprout', min: 30, max: 120 },
  { name: 'Sapling', min: 120, max: 300 },
  { name: 'Tree', min: 300, max: 600 },
  { name: 'Forest', min: 600, max: Infinity },
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

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className="min-h-screen pb-24 px-4 pt-12 max-w-lg mx-auto">
      <h1 className="text-2xl font-semibold text-white mb-6">Your Progress</h1>

      {/* Streak cards */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <Card className="p-4 text-center">
          <div className="text-3xl font-bold text-amber-400">{streak.current}</div>
          <div className="text-xs text-slate-400 mt-1">Current streak</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-3xl font-bold text-violet-400">{streak.best}</div>
          <div className="text-xs text-slate-400 mt-1">Best streak</div>
        </Card>
      </div>

      {/* All-time stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-teal-400">{stats.totalSessions}</div>
          <div className="text-xs text-slate-400 mt-1">Total sessions</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-teal-400">{stats.totalMinutes}</div>
          <div className="text-xs text-slate-400 mt-1">Total minutes</div>
        </Card>
      </div>

      {/* Level */}
      <Card className="p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-slate-400">Current level</p>
            <p className="text-xl font-bold text-white mt-0.5">{lvl.name}</p>
          </div>
          <div className="text-4xl">{levelEmoji(lvl.name)}</div>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-violet-500 to-teal-400 rounded-full transition-all duration-700"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        {lvl.max !== Infinity && (
          <p className="text-xs text-slate-500 mt-2">
            {stats.totalMinutes}/{lvl.max} minutes to next level
          </p>
        )}
      </Card>

      {/* Weekly chart */}
      <Card className="p-5">
        <p className="text-sm font-medium text-slate-300 mb-4">Last 7 days</p>
        <div className="flex items-end gap-2 h-24">
          {minutesByDay.map(({ date, mins }) => {
            const dayName = dayLabels[new Date(date + 'T12:00:00').getDay()]
            const today = new Date().toISOString().slice(0, 10)
            const isToday = date === today
            return (
              <div key={date} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex items-end" style={{ height: '80px' }}>
                  <div
                    className={`w-full rounded-t-md transition-all duration-500 ${
                      isToday ? 'bg-violet-500' : mins > 0 ? 'bg-violet-800' : 'bg-white/5'
                    }`}
                    style={{ height: `${(mins / maxMins) * 100}%`, minHeight: mins > 0 ? '4px' : '0' }}
                  />
                </div>
                <span className={`text-[10px] ${isToday ? 'text-violet-400' : 'text-slate-500'}`}>
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

function levelEmoji(name) {
  return { Seed: '🌱', Sprout: '🌿', Sapling: '🌳', Tree: '🌲', Forest: '🌲🌲' }[name] || '🌱'
}
