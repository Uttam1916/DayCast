import React, { useEffect } from 'react'
import Dashboard from './pages/Dashboard'
import { askNotificationPermission } from './utils/notify'

export default function App() {
  useEffect(() => {
    askNotificationPermission()
  }, [])

  return (
    <div className="app">
      <header className="app-header">
        <h1>Daily Planner — Weather Aware</h1>
      </header>
      <main className="app-main">
        <Dashboard />
      </main>
      <footer className="app-footer">Local-first. Syncs to /api when available.</footer>
    </div>
  )
}
