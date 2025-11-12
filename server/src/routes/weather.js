const express = require('express')
const router = express.Router()
const { getForecast, findClosestHourly } = require('../utils/weather')

// GET /api/weather?lat=..&lon=..&dt=unix_ts (optional)
router.get('/', async (req, res) => {
  try {
    const { lat, lon, dt } = req.query
    if (!lat || !lon) return res.status(400).json({ error: 'lat and lon required' })
    
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
  } catch (e) {
    console.error('Weather API error:', e.message)
    res.status(500).json({ success: false, error: e.message })
  }
})

module.exports = router
