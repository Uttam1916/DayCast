import React, { useEffect, useState } from 'react'
import useLocalTasks from '../hooks/useLocalTasks'
import Calendar from '../components/Calendar'
import TaskModal from '../components/TaskModal'
import TaskList from '../components/TaskList'
import { syncUnsyncedTasks, createTask as apiCreateTask, fetchTasks as apiFetchTasks, evaluateTaskOnServer } from '../api/tasks'
import { scheduleReminderForTask } from '../utils/notify'

export default function Dashboard() {
  const [tasks, setTasks] = useLocalTasks()
  const [showModal, setShowModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [syncStatus, setSyncStatus] = useState(null)
  const [loading, setLoading] = useState(false)

  // schedule reminders whenever tasks change
  useEffect(() => {
    tasks.forEach(t => scheduleReminderForTask(t))
  }, [tasks])

  // fetch server tasks on mount and merge with local tasks
  useEffect(() => {
    let mounted = true
    async function loadServerTasks() {
      if (!navigator.onLine) return
      const resp = await apiFetchTasks()
      if (!mounted) return
      if (resp.success && Array.isArray(resp.data)) {
        setTasks(prev => {
          const map = Object.fromEntries(prev.map(p => [p.id, p]))
          // merge server tasks (they are normalized and marked synced)
          resp.data.forEach(s => { map[s.id] = { ...map[s.id], ...s, synced: true } })
          return Object.values(map)
        })
        // trigger evaluation for tasks missing aiSuitability (server may not have run it)
        resp.data.forEach(async s => {
          if (s.outdoor && s.location?.lat && s.location?.lon && !s.aiSuitability) {
            const ev = await evaluateTaskOnServer(s.id)
            if (ev.success) {
              setTasks(prev => prev.map(p => p.id === s.id ? { ...p, ...ev.data, synced: true } : p))
            }
          }
        })
      }
    }
    loadServerTasks()
    window.addEventListener('online', loadServerTasks)
    return () => { mounted = false; window.removeEventListener('online', loadServerTasks) }
  }, [setTasks])

  useEffect(() => {
    // try syncing unsynced tasks when online
    async function trySync() {
      if (navigator.onLine && tasks.some(t => !t.synced)) {
        setSyncStatus('syncing...')
        const result = await syncUnsyncedTasks(tasks)
        if (result) {
          const updated = result.synced
          setTasks(prev => {
            // replace by id with synced flag
            const map = Object.fromEntries(prev.map(p => [p.id, p]))
            updated.forEach(u => { map[u.id] = { ...u, synced: true } })
            return Object.values(map)
          })
          setSyncStatus(result.failed.length > 0 ? 'sync partial' : 'synced')
        }
      }
    }
    
    window.addEventListener('online', trySync)
    trySync()
    return () => window.removeEventListener('online', trySync)
  }, [tasks, setTasks])

  async function handleSave(task) {
    setLoading(true)
    try {
      // local-first
      setTasks(prev => [...prev, task])
      scheduleReminderForTask(task)
      
      // try save to backend
      const response = await apiCreateTask(task)
      if (response.success) {
        // replace local task with saved version
        setTasks(prev => prev.map(p => p.id === task.id ? { ...response.data, synced: true } : p))
        setSyncStatus(null)
      } else {
        // mark as unsynced for later retry
        console.warn('Save failed, will retry later:', response.error)
        setSyncStatus('offline')
      }
    } catch (e) {
      console.error('Save error:', e)
      setSyncStatus('error')
    } finally {
      setLoading(false)
      setShowModal(false)
    }
  }

  return (
    <div className="dashboard">
      <div className="left">
        <div className="controls">
          <button className="btn" onClick={() => setShowModal(true)} disabled={loading}>
            + New Task
          </button>
          {syncStatus && <div className="sync-status">{syncStatus}</div>}
        </div>
        <Calendar tasks={tasks} onDateClick={d => setSelectedDate(d)} />
      </div>
      <div className="right">
        <h2>Tasks on {selectedDate.toDateString()}</h2>
        <TaskList date={selectedDate} tasks={tasks} setTasks={setTasks} />
      </div>

      {showModal && <TaskModal onClose={() => setShowModal(false)} onSave={handleSave} initialDate={selectedDate} />}
    </div>
  )
}
