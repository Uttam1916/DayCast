import React from 'react'
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, format, isSameDay } from 'date-fns'

function buildCalendar(date) {
  const start = startOfWeek(startOfMonth(date))
  const end = endOfWeek(endOfMonth(date))
  const weeks = []
  let cursor = start
  while (cursor <= end) {
    const week = []
    for (let i=0;i<7;i++) {
      week.push(new Date(cursor))
      cursor = addDays(cursor,1)
    }
    weeks.push(week)
  }
  return weeks
}

export default function Calendar({ tasks=[], onDateClick }) {
  const weeks = buildCalendar(new Date())
  function tasksOn(d) {
    return tasks.filter(t => new Date(t.date).toDateString() === d.toDateString())
  }

  return (
    <div className="calendar">
      {weeks.map((week, i) => (
        <div className="week" key={i}>
          {week.map(d => (
            <div key={d.toISOString()} className="day" onClick={() => onDateClick(new Date(d))}>
              <div className="date">{format(d,'d')}</div>
              <div className="badges">
                {tasksOn(d).slice(0,3).map(t => <span key={t.id} className="badge">{t.title}</span>)}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
