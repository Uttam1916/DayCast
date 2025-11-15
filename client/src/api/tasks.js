import axios from 'axios'

const API_BASE = '/api'

function normalizeServerTask(t) {
  if (!t) return null
  const id = t.id || t._id || (t._doc && t._doc._id) || null
  return {
    id: id ? String(id) : `local-${Date.now()}-${Math.floor(Math.random()*10000)}`,
    title: t.title || '',
    description: t.description || '',
    date: (t.date || t._doc?.date) ? new Date(t.date || t._doc?.date).toISOString() : new Date().toISOString(),
    outdoor: !!(t.outdoor || t._doc?.outdoor),
    location: t.location || t._doc?.location || null,
    preferences: t.preferences || t._doc?.preferences || {},
    aiSuitability: t.aiSuitability || t._doc?.aiSuitability || null,
    reminderMinutesBefore: t.reminderMinutesBefore || t._doc?.reminderMinutesBefore || 60,
    createdAt: t.createdAt || t._doc?.createdAt || new Date().toISOString(),
    synced: true
  }
}

export async function createTask(task) {
  try {
    const resp = await axios.post(`${API_BASE}/tasks`, {
      title: task.title,
      description: task.description,
      date: task.date,
      outdoor: task.outdoor,
      location: task.location,
      reminderMinutesBefore: task.reminderMinutesBefore,
      preferences: task.preferences || {}
    })
    return { success: true, data: normalizeServerTask(resp.data) }
  } catch (error) {
    const message = error.response?.data?.error || error.message || 'Failed to create task'
    return { success: false, error: message }
  }
}

export async function syncUnsyncedTasks(tasks) {
  const unsynced = tasks.filter(t => !t.synced)
  if (!unsynced.length) return null

  const results = []
  const failed = []

  for (const t of unsynced) {
    try {
      const response = await createTask(t)
      if (response.success) {
        results.push(response.data)
      } else {
        failed.push(t.id)
      }
    } catch (e) {
      console.warn('sync task failed', t.id, e.message)
      failed.push(t.id)
    }
  }

  return { synced: results, failed }
}

export async function fetchTasks() {
  try {
    const r = await axios.get(`${API_BASE}/tasks`)
    const data = Array.isArray(r.data) ? r.data.map(normalizeServerTask) : []
    return { success: true, data }
  } catch (error) {
    const message = error.response?.data?.error || error.message || 'Failed to fetch tasks'
    return { success: false, error: message }
  }
}

export async function getWeatherForecast(lat, lon, dt) {
  try {
    const params = new URLSearchParams({ lat, lon })
    if (dt) params.append('dt', dt)
    const r = await axios.get(`${API_BASE}/weather?${params}`)
    return { success: true, data: r.data }
  } catch (error) {
    const message = error.response?.data?.error || error.message || 'Failed to fetch weather'
    return { success: false, error: message }
  }
}

export async function evaluateTaskOnServer(id) {
  try {
    const r = await axios.post(`${API_BASE}/tasks/${id}/evaluate`)
    return { success: true, data: normalizeServerTask(r.data) }
  } catch (error) {
    const message = error.response?.data?.error || error.message || 'Failed to evaluate task'
    return { success: false, error: message }
  }
}

export async function deleteTask(id) {
  try {
    const r = await axios.delete(`${API_BASE}/tasks/${id}`)
    return { success: true, message: r.data?.message || 'Task deleted' }
  } catch (error) {
    const message = error.response?.data?.error || error.message || 'Failed to delete task'
    return { success: false, error: message }
  }
}
