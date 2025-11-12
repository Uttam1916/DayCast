// server/src/index.js — weather-aware daily planner backend
const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const path = require('path')

dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())

// import routes
const authRoutes = require('./routes/auth')
const taskRoutes = require('./routes/tasks')
const weatherRoutes = require('./routes/weather')

// simple Task model inline to avoid require errors while debugging
const TaskSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: Date,
  outdoor: Boolean,
  location: { name: String, lat: Number, lon: Number },
  aiSuitability: Object,
  reminderMinutesBefore: Number,
  createdAt: { type: Date, default: Date.now }
})
const Task = mongoose.models.Task || mongoose.model('Task', TaskSchema)

// connect DB
async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/calorietrack'
  await mongoose.connect(uri)
  console.log('Connected to MongoDB:', uri)
}
connectDB().catch(err => {
  console.error('DB connect error', err)
  process.exit(1)
})

// health
app.get('/', (req, res) => res.json({ ok: true, msg: 'DayCast - Weather-aware Daily Planner' }))

// mount routes
app.use('/api/auth', authRoutes)
app.use('/api/tasks', taskRoutes)
app.use('/api/weather', weatherRoutes)

// echo test route
app.post('/api/echo', (req, res) => {
  console.log('POST /api/echo', req.body)
  res.json({ ok: true, received: req.body })
})

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`🌤️  DayCast server listening on port ${PORT}`))
