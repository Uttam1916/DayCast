import React from 'react'

export default function TaskCard({ task, onDelete }) {
  const suit = task.aiSuitability?.decision || (task.outdoor ? 'unknown' : 'n/a')
  const score = task.aiSuitability?.score
  const explanation = task.aiSuitability?.explanation

  return (
    <div className="task-card">
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
        <button className="btn small ghost" onClick={onDelete}>Delete</button>
      </div>
    </div>
  )
}
