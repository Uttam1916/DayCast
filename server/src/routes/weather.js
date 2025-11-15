const express = require('express')
const router = express.Router()
const { getForecast, findClosestHourly } = require('../utils/weather')

// GET /api/weather?lat=..&lon=..&dt=unix_ts (optional)
router.get('/', async (req, res) => {
  try {
    const { lat, lon, dt } = req.query
    if (!lat || !lon) return res.status(400).json({ error: 'lat and lon required' })
    
    try {
      const fc = await getForecast(Number(lat), Number(lon))
      
      if (dt) {
        const point = findClosestHourly(fc.hourly || [], Number(dt))
        return res.json({ 
          success: true,
          point, 
          raw: fc 
        })
      }
      
      res.json({ 
        success: true,
        data: fc 
      })
    } catch (weatherError) {
      // If weather API fails (401, rate limit, etc.), return degraded response
      console.warn('Weather API failed, returning empty data:', weatherError.message)
      res.json({ 
        success: false,
        data: null,
        message: 'Weather API unavailable (check OWM_KEY in .env)',
        error: weatherError.message
      })
    }
  } catch (e) {
    console.error('Weather route error:', e.message)
    res.status(500).json({ success: false, error: e.message })
  }
})

module.exports = router
