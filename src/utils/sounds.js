import { Howl } from 'howler'

// Use freely-available CDN audio URLs as placeholders.
// In production these would be bundled local assets.
const SOUND_URLS = {
  'singing-bowl': 'https://cdn.freesound.org/previews/411/411090_5121236-lq.mp3',
  'bell': 'https://cdn.freesound.org/previews/411/411090_5121236-lq.mp3',
}

const cache = {}

function getSound(name) {
  if (!name || name === 'none') return null
  if (!cache[name]) {
    const url = SOUND_URLS[name] || SOUND_URLS['bell']
    cache[name] = new Howl({ src: [url], volume: 0.6, html5: true })
  }
  return cache[name]
}

export function playBell(soundName = 'singing-bowl') {
  try {
    getSound(soundName)?.play()
  } catch {
    // Audio might be blocked before user interaction — silently skip
  }
}
