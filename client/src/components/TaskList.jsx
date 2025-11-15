import React from 'react'
import TaskCard from './TaskCard'
import { deleteTask as apiDeleteTask } from '../api/tasks'

export default function TaskList({ date, tasks, setTasks }) {
  const dayStr = date.toDateString()
  const dayTasks = tasks.filter(t => new Date(t.date).toDateString() === dayStr)
  if (!dayTasks.length) return <div>No tasks</div>

  async function deleteTask(id, isSynced) {
    // if synced (from server), try to delete from server first
    if (isSynced) {
      const resp = await apiDeleteTask(id)
      if (!resp.success) {
        alert('Failed to delete from server: ' + resp.error)
        return
      }
    }
    // remove from client state
    setTasks(prev => prev.filter(p => p.id !== id))
  }

  return (
    <div className="task-list">
      {dayTasks.map(t => <TaskCard key={t.id} task={t} onDelete={() => deleteTask(t.id, t.synced)} />)}
    </div>
  )
}
