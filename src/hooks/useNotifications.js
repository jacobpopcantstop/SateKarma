import { useEffect } from 'react'

export function useNotifications(reminderTime) {
  useEffect(() => {
    if (!reminderTime || !('Notification' in window)) return

    let permissionGranted = Notification.permission === 'granted'

    async function requestAndSchedule() {
      if (!permissionGranted) {
        const result = await Notification.requestPermission()
        permissionGranted = result === 'granted'
      }
      if (!permissionGranted) return

      // Check if we should fire now (within 1 minute of reminder time)
      const now = new Date()
      const [h, m] = reminderTime.split(':').map(Number)
      const target = new Date()
      target.setHours(h, m, 0, 0)

      const diff = Math.abs(now - target)
      const alreadyFiredKey = `satekarma_notif_${now.toISOString().slice(0, 10)}`

      if (diff < 60000 && !sessionStorage.getItem(alreadyFiredKey)) {
        sessionStorage.setItem(alreadyFiredKey, '1')
        new Notification('SateKarma', {
          body: "Time for your meditation session. Take a few minutes for yourself.",
          icon: '/favicon.ico',
        })
      }
    }

    requestAndSchedule()
    const interval = setInterval(requestAndSchedule, 30000)
    return () => clearInterval(interval)
  }, [reminderTime])
}
