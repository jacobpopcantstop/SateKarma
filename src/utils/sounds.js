/**
 * Generates meditation bells using the Web Audio API.
 * No CDN dependency — works fully offline.
 *
 * singing-bowl: warm 432 Hz tone with slow attack, long resonant decay (~4s)
 * bell:         bright 880 Hz with instant attack, shorter decay (~2s)
 */

let ctx = null

function getCtx() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)()
  // Resume if suspended (browser autoplay policy)
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

function playTone({ frequency, harmonics = [], attackTime, decayTime, volume = 0.4 }) {
  try {
    const ac = getCtx()
    const now = ac.currentTime

    const master = ac.createGain()
    master.gain.setValueAtTime(0, now)
    master.gain.linearRampToValueAtTime(volume, now + attackTime)
    master.gain.exponentialRampToValueAtTime(0.0001, now + attackTime + decayTime)
    master.connect(ac.destination)

    // Fundamental
    const osc = ac.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = frequency
    osc.connect(master)
    osc.start(now)
    osc.stop(now + attackTime + decayTime)

    // Harmonics (partial overtones for richness)
    harmonics.forEach(({ mult, gain: hGain }) => {
      const h = ac.createOscillator()
      const hVol = ac.createGain()
      h.type = 'sine'
      h.frequency.value = frequency * mult
      hVol.gain.value = hGain
      h.connect(hVol)
      hVol.connect(master)
      h.start(now)
      h.stop(now + attackTime + decayTime)
    })
  } catch {
    // Audio blocked or unsupported — silently skip
  }
}

const SOUNDS = {
  'singing-bowl': () => playTone({
    frequency: 432,
    harmonics: [
      { mult: 2.756, gain: 0.25 },  // slightly inharmonic overtone (bowl-like)
      { mult: 5.404, gain: 0.1 },
    ],
    attackTime: 0.08,
    decayTime: 4.0,
    volume: 0.35,
  }),
  'bell': () => playTone({
    frequency: 880,
    harmonics: [
      { mult: 2.0, gain: 0.3 },
      { mult: 3.0, gain: 0.1 },
    ],
    attackTime: 0.005,
    decayTime: 2.0,
    volume: 0.4,
  }),
}

export function playBell(soundName = 'singing-bowl') {
  if (!soundName || soundName === 'none') return
  const play = SOUNDS[soundName] || SOUNDS['singing-bowl']
  play()
}
