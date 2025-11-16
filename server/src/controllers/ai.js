const { evaluateHeuristic } = require('../utils/evaluate')

let openai = null
try {
  if (process.env.OPENAI_API_KEY) {
    const OpenAI = require('openai')
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  }
} catch (e) {
  console.warn('OpenAI client init failed, will use heuristic only:', e.message)
}

async function aiEvaluate(weatherPoint, task) {
  // fallback to heuristic if no API key or weatherPoint missing or openai init failed
  if (!openai || !weatherPoint) {
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

  try {
    const resp = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: system },
        { role: "user", content: user }
      ],
      max_tokens: 300
    })

    const text = resp.choices?.[0]?.message?.content || ''
    const parsed = JSON.parse(text)
    // normalize
    parsed.score = typeof parsed.score === 'number' ? parsed.score : 50
    return parsed
  } catch (e) {
    // fallback to heuristic on any error (API quota, network, parse, etc.)
    console.warn('AI evaluation failed, using heuristic:', e.message)
    return evaluateHeuristic(weatherPoint, task)
  }
}

module.exports = { aiEvaluate }
