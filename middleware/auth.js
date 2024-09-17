// middleware/auth.js
const jwt = require('jsonwebtoken')
const File = require('../models/File')

const authenticate = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '')
    if (!token) return res.status(401).json({ message: 'No token provided' })

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' })
    }
}

const authorizeFileAccess = async (req, res, next) => {
    try {
        const file = await File.findById(req.params.id)
        if (!file) return res.status(404).json({ message: 'File not found' })

        if (file.uploadedBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to access this file' })
        }

        next()
    } catch (err) {
        res.status(500).json({ message: 'Error checking file access', error: err })
    }
}

module.exports = {
    authenticate,
    authorizeFileAccess
}