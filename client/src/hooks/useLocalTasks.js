import { useState, useEffect } from 'react'
const KEY = 'planner_tasks_v1'

function genId() { return 'local-' + Date.now() + '-' + Math.floor(Math.random()*10000) }

export default function useLocalTasks() {
  const [tasks, setTasks] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY)) || [] } catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(tasks))
  }, [tasks])

  // helper to add id if missing
  function addTask(t) {
    const task = { ...t, id: t.id || genId(), synced: !!t.synced }
    setTasks(prev => [...prev, task])
    return task
  }

  return [tasks, setterWithHelpers(setTasks, addTask)]
}

function setterWithHelpers(setTasks, addTask) {
  return function updater(arg) {
    if (typeof arg === 'function') return setTasks(prev => arg(prev))
    // if array replace
    if (Array.isArray(arg)) return setTasks(arg)
    // if single task - add
    return addTask(arg)
  }
}
