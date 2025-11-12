const mongoose = require('mongoose')
const TaskSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: { type: String, required: true },
  description: String,
  date: { type: Date, required: true },
  location: {
    name: String,
    lat: Number,
    lon: Number
  },
  outdoor: { type: Boolean, default: false },
  preferences: {
    maxWindKph: Number,
    minTempC: Number,
    maxTempC: Number,
    avoidPrecipitation: { type: Boolean, default: true }
  },
  aiSuitability: {
    decision: String,
    score: Number,
    explanation: String
  },
  reminderMinutesBefore: { type: Number, default: 60 },
  createdAt: { type: Date, default: Date.now }
})
module.exports = mongoose.model('Task', TaskSchema)
