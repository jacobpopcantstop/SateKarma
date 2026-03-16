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

### 3. Reflective Journal
The journal is more than mood tracking — it's a tool for self-understanding. Each session pairs a mood check-in with a thoughtful writing prompt.

#### Mood Check-ins
- Pre-session: "How are you feeling?" (5-point emoji scale + optional text)
- Post-session: same scale
- See mood trends over time (before vs. after meditation)

#### Prompted Journaling
After each meditation, you're offered a reflective prompt to write about. You can skip it, swap for a different one, or free-write.

**Prompt Categories:**

- **Self-Awareness**
  - "What emotion kept coming up during your session?"
  - "What's one thing you're avoiding thinking about?"
  - "Describe your mental state right now in three words."
  - "What story are you telling yourself today?"
  - "What part of your body is holding tension? What might it be saying?"

- **Gratitude & Presence**
  - "Name three things you noticed today that you usually overlook."
  - "What's something small that brought you comfort recently?"
  - "Who made your life a little easier this week?"
  - "What moment today would you like to remember?"
  - "What are you taking for granted right now?"

- **Patterns & Growth**
  - "What's a reaction you had recently that surprised you?"
  - "What would you tell yourself from a year ago?"
  - "What pattern do you keep repeating? How does it serve you?"
  - "What's one belief you've outgrown?"
  - "When do you feel most like yourself?"

- **Letting Go**
  - "What are you holding onto that no longer serves you?"
  - "What would change if you stopped trying to control this situation?"
  - "Write down something you need to forgive yourself for."
  - "What expectation is making you unhappy?"
  - "If you could let go of one worry right now, what would it be?"

- **Intentions**
  - "What do you want to carry with you from this session into the day?"
  - "What's one kind thing you can do for yourself today?"
  - "How do you want to show up for others today?"
  - "What would 'enough' look like today?"
  - "What is one small thing you can do today that your future self will thank you for?"

#### Prompt Selection Logic
- **Smart rotation**: never repeat a prompt within 2 weeks
- **Category awareness**: rotate through categories so you don't get stuck in one theme
- **Context-sensitive**: if mood score is low (1-2), favor "Letting Go" and "Gratitude" prompts; if mood is high (4-5), favor "Intentions" and "Growth"
- **Favorites**: bookmark prompts you find especially meaningful — they'll resurface occasionally
- **Custom prompts**: add your own prompts to any category

#### Journal Entry View
- Calendar view with dots showing journaled days (color-coded by mood)
- Tap a day to read your full entry
- Search across all entries by keyword
- Filter by prompt category or mood range
- "On this day" — see what you wrote 1 week / 1 month / 1 year ago
- Export entries as text/markdown for personal backup

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
/journal         → Journal calendar + entry list + search
/journal/write   → Post-session prompted writing (or standalone)
/journal/:id     → Read a single journal entry
/stats           → Streaks, charts, levels
/settings        → Reminder time, sounds, custom prompts, defaults
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
  journalEntries: [
    {
      id: "uuid",
      date: "2026-03-16",
      sessionId: "uuid",           // links to session (optional, can journal without meditating)
      moodScore: 4,
      prompt: {
        text: "What emotion kept coming up during your session?",
        category: "self-awareness",
      },
      response: "I kept noticing impatience...",
      isFreeWrite: false,          // true if they skipped the prompt
      isFavoritePrompt: false,     // bookmarked this prompt
      tags: [],                    // optional user tags
      createdAt: "2026-03-16T07:45:00Z",
    }
  ],
  journalSettings: {
    customPrompts: [],             // user-added prompts
    favoritePromptTexts: [],       // bookmarked prompt texts
    lastUsedPrompts: {},           // { "prompt text": "2026-03-16" } for rotation
  },
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
│   │   ├── PromptCard.jsx    # Display prompt with swap/skip/freewrite
│   │   ├── JournalEditor.jsx # Text area for writing response
│   │   ├── JournalEntry.jsx  # Single entry card (read view)
│   │   ├── JournalCalendar.jsx # Calendar dots view
│   │   ├── OnThisDay.jsx     # Past entries from same date
│   │   ├── MoodChart.jsx     # Trend line chart
│   │   └── EntrySearch.jsx   # Search & filter journal entries
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
│   ├── Journal.jsx           # Calendar view + entry list
│   ├── JournalWrite.jsx      # Post-session writing screen
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
├── data/
│   └── prompts.js            # All prompt texts organized by category
│
├── utils/
│   ├── streaks.js            # Streak calculation logic
│   ├── levels.js             # Level thresholds
│   ├── sounds.js             # Audio playback helpers
│   └── promptPicker.js       # Smart prompt rotation & context logic
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

### Phase 4 — Reflective Journaling
15. Create `prompts.js` data file with all 25+ prompts across 5 categories
16. Build `promptPicker.js` (smart rotation, context-sensitive selection, favorites)
17. Build MoodPicker (emoji scale + optional text)
18. Build PromptCard (display prompt, swap for another, skip to freewrite)
19. Build JournalEditor (text area + save)
20. Wire up post-session flow: mood check-in → prompt → write → save
21. Build JournalCalendar (calendar dots, mood-colored)
22. Build Journal page (entry list, search, category/mood filters)
23. Build OnThisDay component (resurface past entries)
24. Build MoodChart (before vs after trends)
25. Add standalone journaling (write without meditating via /journal/new)
26. Add custom prompt management in Settings
27. Add journal export (download as markdown)

### Phase 5 — Stats & Streaks
28. Implement streak logic (with freeze/grace)
29. Build StreakBadge and LevelBadge
30. Build WeeklyChart
31. Wire up Stats page
32. Show streak + quick stats on Home page

### Phase 6 — Reminders & Polish
33. Implement `useNotifications` hook
34. Build Settings page (reminder time, sound prefs, custom prompts)
35. Add "haven't meditated today" nudge on Home
36. Add subtle animations and transitions
37. Dark/calm color theme polish
38. PWA manifest (installable, works offline)

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
- **Reflective prompts**: Turns meditation from "sitting quietly" into genuine self-discovery — you build a private archive of your inner life over time
- **"On this day"**: Looking back at what you wrote weeks or months ago creates powerful perspective shifts
