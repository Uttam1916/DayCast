const express = require('express')
const router = express.Router()
const Task = require('../models/Task')
const auth = require('../middleware/auth')
const { getForecast, findClosestHourly, geocodeLocation } = require('../utils/weather')
const { evaluateHeuristic } = require('../utils/evaluate')
const { aiEvaluate } = require('../controllers/ai')

// Create task (optional auth)
router.post('/', async (req, res) => {
  try {
    const body = req.body
    // simple duplicate detection: if a task with same title and exact date exists, return it
    try {
      if (body.title && body.date) {
        const maybeDate = new Date(body.date)
        const existing = await Task.findOne({ title: body.title, date: maybeDate })
        if (existing) {
          // return existing instead of creating duplicate
          return res.json(existing)
        }
      }
    } catch (e) {
      // ignore duplicate-check errors and proceed to create
      console.warn('duplicate check failed', e.message)
    }
    
    // Handle location string -> geocode if needed
    let location = body.location || {}
    if (body.location?.name && !body.location?.lat) {
      try {
        const coords = await geocodeLocation(body.location.name)
        if (coords) {
          location = { name: body.location.name, ...coords }
        }
      } catch (e) {
        console.warn('Geocoding failed for', body.location.name, e.message)
      }
    }

    // create minimal user-less task for MVP
    const task = new Task({
      title: body.title || 'untitled',
      description: body.description || '',
      date: new Date(body.date),
      outdoor: !!body.outdoor,
      location,
      preferences: body.preferences || {},
      reminderMinutesBefore: body.reminderMinutesBefore || 60
    })
    await task.save()

    res.json(task)
  } catch (e) { 
    console.error('POST /api/tasks error:', e.message)
    res.status(500).json({ error: e.message }) 
  }
})

// list tasks (simple)
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find({}).sort({ date: 1 }).limit(100)
    res.json(tasks)
  } catch (e) { res.status(500).json({ error: e.message }) }
})

// evaluate single task by id
router.post('/:id/evaluate', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
    if (!task) return res.status(404).json({ error: 'not found' })
    if (!task.location?.lat || !task.location?.lon) return res.status(400).json({ error: 'task missing lat/lon' })
    const fc = await getForecast(task.location.lat, task.location.lon)
    const ts = Math.floor(new Date(task.date).getTime() / 1000)
    const point = findClosestHourly(fc.hourly || [], ts)
    const result = await aiEvaluate(point, task)
    task.aiSuitability = result
    await task.save()
    res.json(task)
  } catch (e) { res.status(500).json({ error: e.message }) }
})

// delete task by id
router.delete('/:id', async (req, res) => {
  try {
    const result = await Task.findByIdAndDelete(req.params.id)
    if (!result) return res.status(404).json({ error: 'task not found' })
    res.json({ success: true, message: 'task deleted', id: req.params.id })
  } catch (e) { res.status(500).json({ error: e.message }) }
})

module.exports = router
