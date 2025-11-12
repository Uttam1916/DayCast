function evaluateHeuristic(weather, task) {
  // weather: OpenWeather hourly object
  if (!weather) return { decision: 'maybe', score: 0, explanation: 'no weather data' }
  const temp = weather.temp
  const wind = weather.wind_speed
  const pop = weather.pop ?? 0
  let score = 0

  const prefs = task.preferences || {}
  const minT = (typeof prefs.minTempC === 'number') ? prefs.minTempC : -10
  const maxT = (typeof prefs.maxTempC === 'number') ? prefs.maxTempC : 40
  const maxWind = (typeof prefs.maxWindKph === 'number') ? prefs.maxWindKph/3.6 : 10/3.6

  if (temp >= minT && temp <= maxT) score += 30
  else score -= 20

  if (task.preferences?.avoidPrecipitation && pop > 0.3) score -= 40
  else score += 20

  if (wind > maxWind) score -= 20
  else score += 10

  const main = weather.weather?.[0]?.main || ''
  if (['Thunderstorm','Tornado','Squall'].includes(main)) score -= 50

  const finalScore = Math.max(-100, Math.min(100, score))
  const decision = finalScore >= 20 ? 'good' : finalScore <= -20 ? 'bad' : 'maybe'
  const explanation = `temp:${temp}C wind:${(wind*3.6).toFixed(1)}kph pop:${(pop*100).toFixed(0)}%`
  return { decision, score: finalScore, explanation }
}

module.exports = { evaluateHeuristic }
