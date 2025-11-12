export async function askNotificationPermission() {
  if ('Notification' in window && Notification.permission === 'default') {
    try { await Notification.requestPermission() } catch (e) { /* ignore */ }
  }
}

export function scheduleReminderForTask(task) {
  if (!('Notification' in window)) return
  if (Notification.permission !== 'granted') return
  const when = new Date(task.date).getTime() - (task.reminderMinutesBefore || 60) * 60000
  const delay = when - Date.now()
  if (delay <= 0) return
  setTimeout(() => {
    new Notification(task.title, { body: task.description || 'Reminder' })
  }, delay)
}
