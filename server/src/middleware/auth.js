const jwt = require('jsonwebtoken')
module.exports = function (req, res, next) {
  const auth = req.headers.authorization
  if (!auth) return res.status(401).json({ error: 'No token' })
  const parts = auth.split(' ')
  const token = parts.length === 2 ? parts[1] : parts[0]
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.user = payload
    next()
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' })
  }
}
