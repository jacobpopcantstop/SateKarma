# SateKarma — Meditation App Plan

A personal meditation web app built with React. All data stays in the browser (localStorage). Designed to be simple, calming, and something you'll actually open every day.

---

## Tech Stack

| Layer        | Choice                     | Why                                      |
|-------------|----------------------------|------------------------------------------|
| Framework   | React (Vite)               | Fast setup, great DX                     |
| Styling     | Tailwind CSS               | Utility-first, easy to build calm UIs    |
| State       | React Context + useReducer | Simple, no extra dependencies            |
| Storage     | localStorage               | No backend, data stays on your device    |
| Notifications | Web Notifications API    | Browser-native daily reminders           |
| Audio       | Howler.js                  | Reliable audio playback for bells/sounds |
| Routing     | React Router               | Simple page navigation                   |

---

## Core Features

### 1. Meditation Timer
- Configurable duration (1, 3, 5, 10, 15, 20, 30 min or custom)
- Start / pause / stop controls
- Visual circular progress ring
- Interval bells (optional chime every N minutes)
- Ending bell sound
- Session summary screen when complete

### 2. Breathing Guide
- Animated circle that expands/contracts to guide breath
- Preset patterns:
  - **Box Breathing**: 4s in, 4s hold, 4s out, 4s hold
  - **4-7-8 Relaxing**: 4s in, 7s hold, 8s out
  - **Simple**: 4s in, 4s out
- Can run standalone or as a 1-2 min intro before a timed session
- Haptic-style visual pulse with count labels ("Breathe in... 3, 2, 1")

### 3. Mood Journal
- Pre-session check-in: "How are you feeling?" (5-point emoji scale + optional text)
- Post-session check-in: same scale
- View past entries in a simple list/calendar view
- See mood trends over time (before vs. after meditation)

### 4. Streak & Stats Tracking
- Daily streak counter (with "freeze" grace period of 1 day)
- Total sessions, total minutes
- Weekly bar chart of minutes meditated
- Personal best streak badge
- Simple "level" system based on total minutes (Seed, Sprout, Sapling, Tree, Forest)

### 5. Daily Reminders
- Set preferred meditation time
- Browser push notification at that time
- Gentle "You haven't meditated today" nudge if app is opened late in the day

---

## Pages / Screens

```
/                → Home (quick-start session + today's status)
/breathe         → Standalone breathing exercise
/timer           → Full meditation timer with settings
/journal         → Mood journal entries & trends
/stats           → Streaks, charts, levels
/settings        → Reminder time, sounds, defaults
```

---

## Data Model (localStorage)

```js
// All stored under key "satekarma"
{
  settings: {
    defaultDuration: 10,         // minutes
    reminderTime: "07:30",       // HH:MM or null
    bellSound: "singing-bowl",   // sound preset name
    intervalBell: null,          // minutes or null
    breathingPattern: "box",     // "box" | "478" | "simple"
  },
  sessions: [
    {
      id: "uuid",
      date: "2026-03-16",
      startedAt: "2026-03-16T07:30:00Z",
      duration: 600,             // seconds completed
      targetDuration: 600,       // seconds intended
      breathingIntro: true,
      moodBefore: { score: 2, note: "anxious morning" },
      moodAfter:  { score: 4, note: "much calmer" },
    }
  ],
  streak: {
    current: 5,
    best: 12,
    lastSessionDate: "2026-03-16",
    freezeUsed: false,
  },
  stats: {
    totalSessions: 42,
    totalMinutes: 380,
    level: "Sapling",            // derived from totalMinutes
  }
}
```

---

## Project Structure

```
src/
├── main.jsx                  # Entry point
├── App.jsx                   # Router + layout
├── index.css                 # Tailwind imports + custom calm theme
│
├── components/
│   ├── Timer/
│   │   ├── TimerRing.jsx     # Circular SVG progress
│   │   ├── TimerControls.jsx # Play/pause/stop buttons
│   │   └── TimerSettings.jsx # Duration & bell picker
│   ├── Breathing/
│   │   ├── BreathCircle.jsx  # Animated breathing circle
│   │   └── PatternPicker.jsx # Choose breathing pattern
│   ├── Journal/
│   │   ├── MoodPicker.jsx    # Emoji scale input
│   │   ├── JournalEntry.jsx  # Single entry card
│   │   └── MoodChart.jsx     # Trend line chart
│   ├── Stats/
│   │   ├── StreakBadge.jsx   # Current streak display
│   │   ├── WeeklyChart.jsx   # Bar chart of weekly mins
│   │   └── LevelBadge.jsx   # Current level + progress
│   └── ui/
│       ├── Button.jsx
│       ├── Card.jsx
│       └── NavBar.jsx
│
├── pages/
│   ├── Home.jsx
│   ├── Breathe.jsx
│   ├── MeditateTimer.jsx
│   ├── Journal.jsx
│   ├── Stats.jsx
│   └── Settings.jsx
│
├── context/
│   └── AppContext.jsx        # Global state + localStorage sync
│
├── hooks/
│   ├── useTimer.js           # Timer countdown logic
│   ├── useBreathing.js       # Breathing animation cycle
│   ├── useNotifications.js   # Web Notifications API
│   └── useLocalStorage.js    # Read/write localStorage
│
├── utils/
│   ├── streaks.js            # Streak calculation logic
│   ├── levels.js             # Level thresholds
│   └── sounds.js             # Audio playback helpers
│
└── assets/
    └── sounds/
        ├── singing-bowl.mp3
        ├── bell.mp3
        └── rain-ambient.mp3
```

---

## Build Order (Suggested Phases)

### Phase 1 — Foundation
1. Scaffold project with Vite + React + Tailwind
2. Set up routing (React Router)
3. Build AppContext with localStorage persistence
4. Create NavBar and basic page shells

### Phase 2 — Timer (Core Loop)
5. Build `useTimer` hook (countdown, pause, resume)
6. Build TimerRing (SVG circular progress)
7. Build TimerControls and TimerSettings
8. Wire up the MeditateTimer page
9. Add bell sounds on complete (Howler.js)

### Phase 3 — Breathing Guide
10. Build `useBreathing` hook (phase cycling)
11. Build BreathCircle animation (CSS scale + opacity)
12. Build PatternPicker
13. Wire up the Breathe page
14. Add optional breathing intro to timer flow

### Phase 4 — Journaling
15. Build MoodPicker (emoji scale + text input)
16. Add pre/post mood check-in to session flow
17. Build Journal page with entry list
18. Build simple MoodChart (before vs after trends)

### Phase 5 — Stats & Streaks
19. Implement streak logic (with freeze/grace)
20. Build StreakBadge and LevelBadge
21. Build WeeklyChart
22. Wire up Stats page
23. Show streak + quick stats on Home page

### Phase 6 — Reminders & Polish
24. Implement `useNotifications` hook
25. Build Settings page (reminder time, sound prefs)
26. Add "haven't meditated today" nudge on Home
27. Add subtle animations and transitions
28. Dark/calm color theme polish
29. PWA manifest (installable, works offline)

---

## Design Direction

- **Color palette**: Deep indigo/navy background, soft lavender/teal accents, warm amber for highlights
- **Typography**: Clean sans-serif (Inter or similar), generous spacing
- **Feel**: Minimal, spacious, no clutter — the UI itself should feel calming
- **Animations**: Slow, smooth transitions (200-400ms). Nothing jarring.
- **Sounds**: Optional. Always respect user's choice to mute.

---

## What Makes This One Stick

- **Zero friction start**: Open the app → one tap → meditating
- **No account required**: Everything is local, private, instant
- **Visible progress**: Streaks and levels give just enough motivation without gamification overload
- **Mood tracking**: Seeing that meditation actually shifts your mood is the best motivator
- **Breathing guide**: Helps beginners who don't know "how" to meditate yet
