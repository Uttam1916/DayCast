import React from 'react'
import TaskCard from './TaskCard'

export default function TaskList({ date, tasks, setTasks }) {
  const dayStr = date.toDateString()
  const dayTasks = tasks.filter(t => new Date(t.date).toDateString() === dayStr)
  if (!dayTasks.length) return <div>No tasks</div>

  function deleteTask(id) {
    setTasks(prev => prev.filter(p => p.id !== id))
  }

  return (
    <div className="task-list">
      {dayTasks.map(t => <TaskCard key={t.id} task={t} onDelete={() => deleteTask(t.id)} />)}
    </div>
  )
}
