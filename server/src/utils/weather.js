const axios = require('axios')
const OWM_KEY = process.env.OWM_KEY
if (!OWM_KEY) console.warn('OWM_KEY not set, weather calls will fail if used without key')

async function getForecast(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=minutely,alerts&appid=${OWM_KEY}`
  const r = await axios.get(url)
  return r.data
}

async function geocodeLocation(locationName) {
  // Simple geocoding using OpenWeatherMap Geo API
  if (!OWM_KEY) return null
  try {
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(locationName)}&limit=1&appid=${OWM_KEY}`
    const r = await axios.get(url)
    if (r.data && r.data.length > 0) {
      const { lat, lon, name, country } = r.data[0]
      return { lat, lon, name: `${name}, ${country}` }
    }
  } catch (e) {
    console.error('Geocoding error:', e.message)
  }
  return null
}

function findClosestHourly(hourly, ts) {
  if (!hourly || !hourly.length) return null
  let best = hourly[0]
  let minDiff = Math.abs(hourly[0].dt - ts)
  for (const h of hourly) {
    const diff = Math.abs(h.dt - ts)
    if (diff < minDiff) { minDiff = diff; best = h }
  }
  return best
}

module.exports = { getForecast, geocodeLocation, findClosestHourly }
