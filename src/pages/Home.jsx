import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'

const LEVELS = [
  { name: 'Seed', emoji: '🌱', min: 0, max: 30 },
  { name: 'Sprout', emoji: '🌿', min: 30, max: 120 },
  { name: 'Sapling', emoji: '🌳', min: 120, max: 300 },
  { name: 'Tree', emoji: '🌲', min: 300, max: 600 },
  { name: 'Forest', emoji: '🌲🌲', min: 600, max: Infinity },
]

function getLevel(mins) {
  return LEVELS.find(l => mins >= l.min && mins < l.max) || LEVELS[LEVELS.length - 1]
}

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
}

export default function Home() {
  const { state } = useApp()
  const navigate = useNavigate()
  const { streak, stats } = state

  const today = new Date().toISOString().slice(0, 10)
  const meditatedToday = state.sessions.some(s => s.date === today)
  const journaledToday = state.journalEntries.some(e => e.date === today)

  const lvl = getLevel(stats.totalMinutes)
  const progressPct = lvl.max === Infinity
    ? 100
    : Math.round(((stats.totalMinutes - lvl.min) / (lvl.max - lvl.min)) * 100)

  return (
    <div className="min-h-screen pb-24 px-4 pt-10 max-w-lg mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-slate-500 text-xs uppercase tracking-widest">Good {greeting()}</p>
          <h1 className="text-2xl font-semibold text-white mt-0.5">SateKarma</h1>
        </div>
        <button
          onClick={() => navigate('/stats')}
          className="text-xs text-slate-400 hover:text-violet-400 transition-colors"
        >
          {lvl.emoji} {lvl.name}
        </button>
      </div>

      {/* Streak hero */}
      {streak.current > 0 ? (
        <Card className="p-5 mb-4 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 flex items-center justify-center shrink-0">
            <span className="text-2xl">🔥</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-3xl font-bold text-amber-400 leading-none">
              {streak.current}
              <span className="text-base font-normal text-slate-400 ml-1">day streak</span>
            </p>
            {streak.best > streak.current && (
              <p className="text-xs text-slate-500 mt-1">Best: {streak.best} days</p>
            )}
            {streak.best <= streak.current && streak.current > 1 && (
              <p className="text-xs text-teal-400 mt-1">Personal best! 🎉</p>
            )}
            {streak.freezeUsed && (
              <p className="text-xs text-blue-400 mt-1">❄️ Streak freeze used yesterday</p>
            )}
            {!streak.freezeUsed && streak.current > 0 && (
              <p className="text-xs text-slate-600 mt-1">❄️ Freeze available</p>
            )}
          </div>
        </Card>
      ) : (
        <Card className="p-5 mb-4 border-dashed border-white/10">
          <p className="text-sm text-slate-400">Start a session today to begin your streak 🔥</p>
        </Card>
      )}

      {/* Quick start */}
      <Card className="p-5 mb-4">
        <Button
          variant="primary"
          size="lg"
          className="w-full"
          onClick={() => navigate('/timer')}
        >
          {meditatedToday ? 'Meditate again' : 'Start Meditation'}
        </Button>
        <div className="flex gap-4 justify-center mt-3">
          <button
            className="text-sm text-slate-500 hover:text-teal-400 transition-colors"
            onClick={() => navigate('/breathe')}
          >
            Just breathe →
          </button>
          {meditatedToday && !journaledToday && (
            <button
              className="text-sm text-slate-500 hover:text-violet-400 transition-colors"
              onClick={() => navigate('/journal/write')}
            >
              Write in journal →
            </button>
          )}
        </div>
      </Card>

      {/* Today's checklist */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <Card
          className="p-4 cursor-pointer"
          onClick={() => !meditatedToday && navigate('/timer')}
        >
          <div className={`w-7 h-7 rounded-full flex items-center justify-center mb-2 ${meditatedToday ? 'bg-teal-500/20' : 'bg-white/5'}`}>
            <span className="text-sm">{meditatedToday ? '✓' : '○'}</span>
          </div>
          <p className="text-xs text-slate-400">Meditate</p>
          <p className={`text-sm font-medium mt-0.5 ${meditatedToday ? 'text-teal-400' : 'text-slate-500'}`}>
            {meditatedToday ? 'Done' : 'Not yet'}
          </p>
        </Card>
        <Card
          className="p-4 cursor-pointer"
          onClick={() => !journaledToday && navigate('/journal/write')}
        >
          <div className={`w-7 h-7 rounded-full flex items-center justify-center mb-2 ${journaledToday ? 'bg-violet-500/20' : 'bg-white/5'}`}>
            <span className="text-sm">{journaledToday ? '✓' : '○'}</span>
          </div>
          <p className="text-xs text-slate-400">Journal</p>
          <p className={`text-sm font-medium mt-0.5 ${journaledToday ? 'text-violet-400' : 'text-slate-500'}`}>
            {journaledToday ? 'Done' : 'Not yet'}
          </p>
        </Card>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-violet-400">{stats.totalSessions}</p>
          <p className="text-xs text-slate-400 mt-0.5">Total sessions</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-teal-400">{stats.totalMinutes}</p>
          <p className="text-xs text-slate-400 mt-0.5">Minutes meditated</p>
        </Card>
      </div>

      {/* Level progress */}
      {lvl.max !== Infinity && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-300 font-medium">{lvl.emoji} {lvl.name}</span>
            <span className="text-xs text-slate-500">
              {lvl.max - stats.totalMinutes} min to {LEVELS[LEVELS.indexOf(lvl) + 1]?.name}
            </span>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-violet-500 to-teal-400 rounded-full transition-all duration-700"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </Card>
      )}

      {/* Post-session journal nudge */}
      {meditatedToday && !journaledToday && (
        <Card
          className="mt-4 p-4 border-violet-500/30 cursor-pointer hover:border-violet-400/50 transition-colors"
          onClick={() => navigate('/journal/write')}
        >
          <p className="text-sm text-slate-300">
            <span className="text-violet-400 font-medium">Nice session.</span>{' '}
            Take 2 minutes to reflect?
          </p>
          <p className="text-xs text-slate-500 mt-1">A prompt is waiting for you →</p>
        </Card>
      )}
    </div>
  )
}
