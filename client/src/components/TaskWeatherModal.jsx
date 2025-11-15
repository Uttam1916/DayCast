import React, { useEffect, useState } from 'react'
import { getWeatherForecast, evaluateTaskOnServer } from '../api/tasks'

export default function TaskWeatherModal({ task, onClose }) {
  const [weather, setWeather] = useState(null)
  const [evaluation, setEvaluation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadWeatherAndEval() {
      if (!task.outdoor || !task.location?.lat || !task.location?.lon) {
        setLoading(false)
        setError('This is not an outdoor task or location is missing')
        return
      }

      try {
        // Fetch weather for task date/location
        const weatherResp = await getWeatherForecast(
          task.location.lat,
          task.location.lon,
          Math.floor(new Date(task.date).getTime() / 1000)
        )

        if (weatherResp.success) {
          setWeather(weatherResp.data)
        }

        // Trigger evaluation on server (will use cached result if available)
        const evalResp = await evaluateTaskOnServer(task.id)
        if (evalResp.success) {
          setEvaluation(evalResp.data?.aiSuitability)
        }
      } catch (e) {
        console.error('Failed to load weather/eval:', e)
        setError('Failed to load weather data')
      } finally {
        setLoading(false)
      }
    }

    loadWeatherAndEval()
  }, [task])

  const point = weather?.point || null
  const weatherMain = point?.weather?.[0]?.main || 'Unknown'
  const temp = point?.temp ?? 'N/A'
  const windSpeed = point?.wind_speed ?? 'N/A'
  const pop = ((point?.pop ?? 0) * 100).toFixed(0)

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal weather-modal" onClick={e => e.stopPropagation()}>
        <h3>{task.title}</h3>
        <div className="modal-section">
          <h4>Location & Date</h4>
          <p>📍 {task.location?.name || 'Unknown'}</p>
          <p>📅 {new Date(task.date).toLocaleString()}</p>
        </div>

        {loading && <p className="loading">Loading weather data...</p>}

        {error && <p className="error-message">{error}</p>}

        {!loading && !weather && (
          <p className="error-message">⚠️ Weather data unavailable. Check that the server has a valid OWM_KEY in .env</p>
        )}

        {!loading && point && (
          <div className="modal-section">
            <h4>Current Weather</h4>
            <div className="weather-grid">
              <div className="weather-item">
                <span className="label">Condition</span>
                <span className="value">{weatherMain}</span>
              </div>
              <div className="weather-item">
                <span className="label">Temperature</span>
                <span className="value">{temp}°C</span>
              </div>
              <div className="weather-item">
                <span className="label">Wind Speed</span>
                <span className="value">{(windSpeed * 3.6).toFixed(1)} km/h</span>
              </div>
              <div className="weather-item">
                <span className="label">Precipitation</span>
                <span className="value">{pop}%</span>
              </div>
            </div>
          </div>
        )}

        {evaluation && (
          <div className="modal-section">
            <h4>AI Suitability Evaluation</h4>
            <div className={`suitability-large ${evaluation.decision}`}>
              {evaluation.decision.toUpperCase()}
            </div>
            {evaluation.score !== undefined && (
              <p className="score">Score: <strong>{evaluation.score}</strong></p>
            )}
            {evaluation.explanation && (
              <p className="explanation">{evaluation.explanation}</p>
            )}
          </div>
        )}

        <div className="modal-actions">
          <button type="button" className="btn ghost" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
