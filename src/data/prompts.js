export const PROMPT_CATEGORIES = {
  'self-awareness': {
    label: 'Self-Awareness',
    color: 'violet',
    prompts: [
      'What emotion kept coming up during your session?',
      "What's one thing you're avoiding thinking about?",
      'Describe your mental state right now in three words.',
      'What story are you telling yourself today?',
      'What part of your body is holding tension? What might it be saying?',
      'What need of yours is going unmet right now?',
      'When did you feel most like yourself this week?',
      'What are you afraid to admit to yourself?',
    ],
  },
  'gratitude': {
    label: 'Gratitude & Presence',
    color: 'amber',
    prompts: [
      "Name three things you noticed today that you usually overlook.",
      "What's something small that brought you comfort recently?",
      'Who made your life a little easier this week?',
      'What moment today would you like to remember?',
      'What are you taking for granted right now?',
      'What is working well in your life that deserves acknowledgment?',
      'Describe a sound, smell, or texture you noticed today.',
    ],
  },
  'growth': {
    label: 'Patterns & Growth',
    color: 'teal',
    prompts: [
      'What reaction of yours recently surprised you?',
      'What would you tell yourself from a year ago?',
      'What pattern do you keep repeating? How does it serve you?',
      "What's one belief you've outgrown?",
      'What is one thing you did this week that took courage?',
      'What mistake taught you something valuable?',
      'What would you do differently if you knew you could not fail?',
      'What version of yourself are you growing into?',
    ],
  },
  'letting-go': {
    label: 'Letting Go',
    color: 'rose',
    prompts: [
      'What are you holding onto that no longer serves you?',
      'What would change if you stopped trying to control this situation?',
      'Write down something you need to forgive yourself for.',
      'What expectation is making you unhappy?',
      'If you could let go of one worry right now, what would it be?',
      'What would it feel like to accept this situation exactly as it is?',
      'What are you resisting that might be worth surrendering to?',
    ],
  },
  'intentions': {
    label: 'Intentions',
    color: 'emerald',
    prompts: [
      'What do you want to carry with you from this session into the day?',
      "What's one kind thing you can do for yourself today?",
      'How do you want to show up for others today?',
      "What would 'enough' look like today?",
      'What is one small thing you can do today that your future self will thank you for?',
      'What boundary do you need to set or honor today?',
      'What does your body need right now?',
    ],
  },
}

export const ALL_PROMPTS = Object.entries(PROMPT_CATEGORIES).flatMap(([category, { prompts }]) =>
  prompts.map(text => ({ text, category }))
)

// Mood-to-category affinity: lower mood scores → these categories preferred
export const MOOD_AFFINITY = {
  1: ['letting-go', 'gratitude'],
  2: ['letting-go', 'gratitude', 'self-awareness'],
  3: ['self-awareness', 'growth', 'gratitude'],
  4: ['growth', 'intentions', 'gratitude'],
  5: ['intentions', 'growth'],
}
