const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()

module.exports = async function connectDB() {
  try {
    const uri = process.env.MONGODB_URI
    if (!uri) throw new Error('MONGODB_URI not set in .env')
    await mongoose.connect(uri, { autoIndex: true })
    console.log('MongoDB connected')
  } catch (err) {
    console.error('MongoDB connection error:', err.message)
    process.exit(1)
  }
}
