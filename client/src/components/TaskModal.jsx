import React, { useState } from 'react'
import { formatISO } from 'date-fns'

export default function TaskModal({ onClose, onSave, initialDate }) {
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [date, setDate] = useState(formatISO(initialDate).slice(0,16))
  const [outdoor, setOutdoor] = useState(false)
  const [location, setLocation] = useState('')
  const [reminder, setReminder] = useState(60)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  function parseLocation(locStr) {
    if (!locStr) return null
    // Check if it's lat,lon format
    const parts = locStr.split(',').map(p => p.trim())
    if (parts.length === 2) {
      const lat = parseFloat(parts[0])
      const lon = parseFloat(parts[1])
      if (!isNaN(lat) && !isNaN(lon)) {
        return { lat, lon }
      }
    }
    // Otherwise treat as place name
    return { name: locStr }
  }

  function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    if (!title.trim()) {
      setError('Title is required')
      return
    }

    if (outdoor && !location.trim()) {
      setError('Location is required for outdoor tasks')
      return
    }

    const parsedLocation = outdoor ? parseLocation(location) : null
    const task = {
      id: 'local-' + Date.now(),
      title: title.trim(),
      description: desc.trim(),
      date: new Date(date).toISOString(),
      outdoor,
      location: parsedLocation,
      reminderMinutesBefore: Number(reminder) || 60,
      preferences: {
        avoidPrecipitation: true,
        minTempC: 5,
        maxTempC: 30
      },
      synced: false
    }
    
    onSave(task)
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h3>New Task</h3>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <label>Title *<input 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            placeholder="Enter task title"
            required 
          /></label>
          
          <label>Description<textarea 
            value={desc} 
            onChange={e => setDesc(e.target.value)} 
            placeholder="Optional task description"
            rows="3"
          /></label>
          
          <label>Date & time *<input 
            type="datetime-local" 
            value={date} 
            onChange={e => setDate(e.target.value)} 
            required 
          /></label>
          
          <label className="checkbox">
            <input 
              type="checkbox" 
              checked={outdoor} 
              onChange={e => setOutdoor(!outdoor)} 
            />
            Outdoor activity?
          </label>
          
          {outdoor && (
            <label>Location *<input 
              value={location} 
              onChange={e => setLocation(e.target.value)} 
              placeholder="Enter city name or lat,lon (e.g., '40.7128,-74.0060')"
              required={outdoor}
            /></label>
          )}
          
          <label>Reminder (minutes before)<input 
            type="number" 
            min="0"
            value={reminder} 
            onChange={e => setReminder(e.target.value)} 
          /></label>
          
          <div className="modal-actions">
            <button type="submit" className="btn" disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button type="button" className="btn ghost" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}
