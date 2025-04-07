const express = require('express')
const router = express.Router()
const { getLogs, clearLogs } = require('../utils/logger')
const { authenticate } = require('../middleware/auth')

// Get logs (protected route, admin only)
router.get('/', authenticate, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin only.' })
    }

    const { limit = 100, level } = req.query
    const logs = await getLogs(parseInt(limit), level)

    res.json({ logs })
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve logs' })
  }
})

// Clear logs (protected route, admin only)
router.delete('/', authenticate, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin only.' })
    }

    const success = await clearLogs()

    if (success) {
      res.json({ message: 'Logs cleared successfully' })
    } else {
      res.status(500).json({ error: 'Failed to clear logs' })
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear logs' })
  }
})

module.exports = router
