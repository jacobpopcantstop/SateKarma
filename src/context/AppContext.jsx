import { createContext, useContext, useReducer, useEffect } from 'react'

const STORAGE_KEY = 'satekarma'

const defaultState = {
  settings: {
    defaultDuration: 10,
    reminderTime: null,
    bellSound: 'singing-bowl',
    intervalBell: null,
    breathingPattern: 'box',
  },
  sessions: [],
  journalEntries: [],
  journalSettings: {
    customPrompts: [],
    favoritePromptTexts: [],
    lastUsedPrompts: {},
  },
  streak: {
    current: 0,
    best: 0,
    lastSessionDate: null,
    freezeUsed: false,
  },
  stats: {
    totalSessions: 0,
    totalMinutes: 0,
  },
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState
    const saved = JSON.parse(raw)
    // Deep merge saved over defaults so new fields always exist
    return {
      ...defaultState,
      ...saved,
      settings: { ...defaultState.settings, ...saved.settings },
      streak: { ...defaultState.streak, ...saved.streak },
      stats: { ...defaultState.stats, ...saved.stats },
      journalSettings: { ...defaultState.journalSettings, ...saved.journalSettings },
    }
  } catch {
    return defaultState
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // localStorage full or unavailable — silently skip
  }
}

function computeStreak(sessions, currentStreak) {
  const today = new Date().toISOString().slice(0, 10)
  const yesterday = new Date(Date.now() - 864e5).toISOString().slice(0, 10)
  const { lastSessionDate, current, best, freezeUsed } = currentStreak

  if (lastSessionDate === today) return currentStreak

  let newCurrent = current
  let newFreezeUsed = false

  if (lastSessionDate === yesterday) {
    newCurrent = current + 1
  } else if (lastSessionDate === null) {
    newCurrent = 1
  } else {
    // Missed a day — check if freeze can save the streak
    const twoDaysAgo = new Date(Date.now() - 2 * 864e5).toISOString().slice(0, 10)
    if (!freezeUsed && lastSessionDate === twoDaysAgo) {
      newCurrent = current + 1
      newFreezeUsed = true  // mark freeze as consumed
    } else {
      newCurrent = 1
    }
  }

  return {
    current: newCurrent,
    best: Math.max(best, newCurrent),
    lastSessionDate: today,
    freezeUsed: newFreezeUsed,
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_SESSION': {
      const session = action.payload
      const newStreak = computeStreak(state.sessions, state.streak)
      const minutesAdded = Math.floor(session.duration / 60)
      return {
        ...state,
        sessions: [session, ...state.sessions],
        streak: newStreak,
        stats: {
          totalSessions: state.stats.totalSessions + 1,
          totalMinutes: state.stats.totalMinutes + minutesAdded,
        },
      }
    }

    case 'ADD_JOURNAL_ENTRY':
      return {
        ...state,
        journalEntries: [action.payload, ...state.journalEntries],
        journalSettings: {
          ...state.journalSettings,
          lastUsedPrompts: {
            ...state.journalSettings.lastUsedPrompts,
            [action.payload.prompt?.text]: action.payload.date,
          },
        },
      }

    case 'UPDATE_JOURNAL_ENTRY':
      return {
        ...state,
        journalEntries: state.journalEntries.map(e =>
          e.id === action.payload.id ? { ...e, ...action.payload } : e
        ),
      }

    case 'TOGGLE_FAVORITE_PROMPT': {
      const { text } = action.payload
      const favs = state.journalSettings.favoritePromptTexts
      const newFavs = favs.includes(text)
        ? favs.filter(t => t !== text)
        : [...favs, text]
      return {
        ...state,
        journalSettings: { ...state.journalSettings, favoritePromptTexts: newFavs },
      }
    }

    case 'ADD_CUSTOM_PROMPT':
      return {
        ...state,
        journalSettings: {
          ...state.journalSettings,
          customPrompts: [...state.journalSettings.customPrompts, action.payload],
        },
      }

    case 'DELETE_CUSTOM_PROMPT':
      return {
        ...state,
        journalSettings: {
          ...state.journalSettings,
          customPrompts: state.journalSettings.customPrompts.filter(
            p => p.text !== action.payload.text
          ),
        },
      }

    case 'DELETE_JOURNAL_ENTRY':
      return {
        ...state,
        journalEntries: state.journalEntries.filter(e => e.id !== action.payload.id),
      }

    case 'DELETE_SESSION': {
      const deleted = state.sessions.find(s => s.id === action.payload.id)
      const minutesRemoved = deleted ? Math.floor(deleted.duration / 60) : 0
      return {
        ...state,
        sessions: state.sessions.filter(s => s.id !== action.payload.id),
        stats: {
          totalSessions: Math.max(0, state.stats.totalSessions - 1),
          totalMinutes: Math.max(0, state.stats.totalMinutes - minutesRemoved),
        },
      }
    }

    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.payload } }

    default:
      return state
  }
}

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState)

  useEffect(() => {
    saveState(state)
  }, [state])

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
