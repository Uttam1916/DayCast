const OpenAI = require('openai')
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
const { evaluateHeuristic } = require('../utils/evaluate')

async function aiEvaluate(weatherPoint, task) {
  // fallback to heuristic if no API key
  if (!process.env.OPENAI_API_KEY) {
    return evaluateHeuristic(weatherPoint, task)
  }

  const features = {
    activity: task.title,
    outdoor: task.outdoor,
    tempC: weatherPoint?.temp,
    wind_m_s: weatherPoint?.wind_speed,
    pop: weatherPoint?.pop ?? 0,
    condition: weatherPoint?.weather?.[0]?.main,
    preferences: task.preferences || {}
  }

  const system = "You are a weather advisor. Given input JSON, return only a JSON object with keys: decision ('good'|'bad'|'maybe'), score (0-100), explanation (short)."
  const user = `Input: ${JSON.stringify(features)}\nRespond with JSON only.`

  const resp = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: system },
      { role: "user", content: user }
    ],
    max_tokens: 300
  })

  const text = resp.choices?.[0]?.message?.content || ''
  try {
    const parsed = JSON.parse(text)
    // normalize
    parsed.score = typeof parsed.score === 'number' ? parsed.score : 50
    return parsed
  } catch (e) {
    // fallback to heuristic
    return evaluateHeuristic(weatherPoint, task)
  }
}

module.exports = { aiEvaluate }
