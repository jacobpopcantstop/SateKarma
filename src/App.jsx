import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext'
import { useNotifications } from './hooks/useNotifications'
import NavBar from './components/ui/NavBar'
import Home from './pages/Home'
import Breathe from './pages/Breathe'
import MeditateTimer from './pages/MeditateTimer'
import Journal from './pages/Journal'
import JournalWrite from './pages/JournalWrite'
import JournalEntryView from './pages/JournalEntryView'
import Stats from './pages/Stats'
import Settings from './pages/Settings'

function AppRoutes() {
  const { state } = useApp()
  useNotifications(state.settings.reminderTime)

  return (
    <div className="relative min-h-screen">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/breathe" element={<Breathe />} />
        <Route path="/timer" element={<MeditateTimer />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/journal/write" element={<JournalWrite />} />
        <Route path="/journal/:id" element={<JournalEntryView />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
      <NavBar />
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  )
}
