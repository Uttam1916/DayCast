const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'email+password required' })
  try {
    const existing = await User.findOne({ email })
    if (existing) return res.status(400).json({ error: 'email in use' })
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    const user = new User({ name, email, passwordHash: hash })
    await user.save()
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET)
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } })
  } catch (e) { res.status(500).json({ error: e.message }) }
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'email+password required' })
  try {
    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ error: 'invalid credentials' })
    const ok = await bcrypt.compare(password, user.passwordHash)
    if (!ok) return res.status(400).json({ error: 'invalid credentials' })
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET)
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } })
  } catch (e) { res.status(500).json({ error: e.message }) }
})

module.exports = router
