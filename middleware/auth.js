const jwt = require('jsonwebtoken')
const User = require('../models/User')
const File = require('../models/File')
const Blacklist = require('../models/Blacklist')

const authenticate = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '')
    if (!token) return res.status(401).json({ message: 'No token provided' })

    try {
        const blacklistedToken = await Blacklist.findOne({ token })
        if (blacklistedToken) {
            return res.status(401).json({ message: 'Token is invalid' })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = await User.findById(decoded.id)
        if (!req.user) return res.status(401).json({ message: 'User not found' })
        next()
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' })
    }
}

const authorizeFileAccess = async (req, res, next) => {
    try {
        const file = await File.findById(req.params.id)
        if (!file) return res.status(404).json({ message: 'File not found' })

        if (file.uploadedBy.toString() !== req.user._id.toString() && !file.sharedWith.includes(req.user._id.toString())) {
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