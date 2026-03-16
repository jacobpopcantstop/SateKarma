import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'

function level(totalMinutes) {
  if (totalMinutes < 30) return { name: 'Seed', next: 30 }
  if (totalMinutes < 120) return { name: 'Sprout', next: 120 }
  if (totalMinutes < 300) return { name: 'Sapling', next: 300 }
  if (totalMinutes < 600) return { name: 'Tree', next: 600 }
  return { name: 'Forest', next: null }
}

export default function Home() {
  const { state } = useApp()
  const navigate = useNavigate()
  const { streak, stats } = state
  const { name: levelName, next } = level(stats.totalMinutes)

  const today = new Date().toISOString().slice(0, 10)
  const meditatedToday = state.sessions.some(s => s.date === today)
  const journaledToday = state.journalEntries.some(e => e.date === today)

  return (
    <div className="min-h-screen pb-24 px-4 pt-12 max-w-lg mx-auto">
      {/* Greeting */}
      <div className="mb-8">
        <p className="text-slate-400 text-sm">Good {greeting()}</p>
        <h1 className="text-2xl font-semibold text-white mt-0.5">SateKarma</h1>
      </div>

      {/* Quick start */}
      <Card className="p-6 mb-4 text-center">
        <p className="text-slate-400 text-sm mb-1">Ready to sit?</p>
        <Button
          variant="primary"
          size="xl"
          className="w-full mt-3"
          onClick={() => navigate('/timer')}
        >
          Start Meditation
        </Button>
        <button
          className="mt-3 text-sm text-slate-400 hover:text-teal-400 transition-colors"
          onClick={() => navigate('/breathe')}
        >
          Just breathe first →
        </button>
      </Card>

      {/* Today's status */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <Card className="p-4 flex flex-col gap-1">
          <span className="text-xs text-slate-400">Meditated</span>
          <span className={`text-lg font-semibold ${meditatedToday ? 'text-teal-400' : 'text-slate-500'}`}>
            {meditatedToday ? 'Done ✓' : 'Not yet'}
          </span>
        </Card>
        <Card className="p-4 flex flex-col gap-1">
          <span className="text-xs text-slate-400">Journaled</span>
          <span className={`text-lg font-semibold ${journaledToday ? 'text-violet-400' : 'text-slate-500'}`}>
            {journaledToday ? 'Done ✓' : 'Not yet'}
          </span>
        </Card>
      </div>

      {/* Streak & stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-amber-400">{streak.current}</div>
          <div className="text-xs text-slate-400 mt-0.5">Day streak</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-violet-400">{stats.totalSessions}</div>
          <div className="text-xs text-slate-400 mt-0.5">Sessions</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-teal-400">{stats.totalMinutes}</div>
          <div className="text-xs text-slate-400 mt-0.5">Minutes</div>
        </Card>
      </div>

      {/* Level */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-white">Level: {levelName}</span>
          {next && <span className="text-xs text-slate-400">{next - stats.totalMinutes} min to {nextLevel(levelName)}</span>}
        </div>
        {next && (
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-violet-500 to-teal-400 rounded-full transition-all duration-500"
              style={{ width: `${Math.min((stats.totalMinutes / next) * 100, 100)}%` }}
            />
          </div>
        )}
      </Card>

      {/* Journal nudge */}
      {meditatedToday && !journaledToday && (
        <Card
          className="mt-4 p-4 border-violet-500/30 cursor-pointer hover:border-violet-400/50 transition-colors"
          onClick={() => navigate('/journal/write')}
        >
          <p className="text-sm text-slate-300">
            <span className="text-violet-400 font-medium">Nice session.</span> Take 2 minutes to reflect?
          </p>
          <p className="text-xs text-slate-500 mt-1">A prompt is waiting for you →</p>
        </Card>
      )}
    </div>
  )
}

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
}

function nextLevel(current) {
  const map = { Seed: 'Sprout', Sprout: 'Sapling', Sapling: 'Tree', Tree: 'Forest' }
  return map[current] || ''
}
