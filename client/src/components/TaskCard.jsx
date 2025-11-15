import React, { useState } from 'react'
import TaskWeatherModal from './TaskWeatherModal'

export default function TaskCard({ task, onDelete }) {
  const [showWeatherModal, setShowWeatherModal] = useState(false)
  const suit = task.aiSuitability?.decision || (task.outdoor ? 'unknown' : 'n/a')
  const score = task.aiSuitability?.score
  const explanation = task.aiSuitability?.explanation

  function handleDelete() {
    if (!confirm('Delete this task?')) return
    onDelete()
  }

  return (
    <>
      <div className="task-card" onClick={() => task.outdoor && setShowWeatherModal(true)}>
        <div className="task-main">
          <h4>{task.title}</h4>
          <div className="meta">
            {new Date(task.date).toLocaleString()}
            {task.location?.name && ` • ${task.location.name}`}
            {!task.synced && ' • (unsaved)'}
          </div>
          {explanation && <div className="explanation">{explanation}</div>}
        </div>
        <div className="task-side">
          <div className={`suitability ${suit}`}>
            {suit}
            {score !== undefined && <span className="score"> ({score})</span>}
          </div>
          <button className="btn small ghost" onClick={(e) => { e.stopPropagation(); handleDelete(); }}>
            Delete
          </button>
        </div>
      </div>

      {showWeatherModal && <TaskWeatherModal task={task} onClose={() => setShowWeatherModal(false)} />}
    </>
  )
}
