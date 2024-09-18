const File = require('../models/File')
const path = require('path')
const fs = require('fs')
const crypto = require('crypto')

exports.uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' })
        }

        const token = crypto.randomBytes(16).toString('hex')

        const file = new File({
            filename: req.file.filename,
            filepath: req.file.path,
            filesize: req.file.size,
            uploadedBy: req.user._id,
            token
        })

        await file.save()

        res.status(201).json({ message: 'File uploaded successfully', file })
    } catch (error) {
        res.status(500).json({ message: 'Error uploading file', error })
    }
}

exports.listFiles = async (req, res) => {
    try {
        const files = await File.find({ uploadedBy: req.user.id })
        res.status(200).json(files)
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving files', error })
    }
}

exports.downloadFile = async (req, res) => {
    try {
        let file;

        if (req.params.token) {
            file = await File.findOne({ token: req.params.token })
        } else {
            file = await File.findById(req.params.id)
        }

        if (!file) {
            return res.status(404).json({ message: 'File not found' })
        }

        if (file.uploadedBy.toString() !== req.user.id && !file.sharedWith.includes(req.user.id)) {
            return res.status(403).json({ message: 'Not authorized to access this file' })
        }

        res.download(file.filepath, file.filename)
    } catch (error) {
        res.status(500).json({ message: 'Error downloading file', error })
    }
}

exports.deleteFile = async (req, res) => {
    try {
        const file = await File.findById(req.params.id)

        if (!file) {
            return res.status(404).json({ message: 'File not found' })
        }

        if (file.uploadedBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this file' })
        }

        fs.unlinkSync(file.filepath)

        await File.findByIdAndDelete(req.params.id)

        res.status(200).json({ message: 'File deleted successfully' })
    } catch (error) {
        res.status(500).json({ message: 'Error deleting file', error })
    }
}

exports.generateShareableLink = async (req, res) => {
    try {
        const file = await File.findById(req.params.id)

        if (!file) {
            return res.status(404).json({ message: 'File not found' })
        }

        if (file.uploadedBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to generate link for this file' })
        }

        if (!file.token) {
            file.token = crypto.randomBytes(16).toString('hex')
            file.expiresAt = Date.now() + 24 * 60 * 60 * 1000
            await file.save()
        }

        const shareableLink = `${req.protocol}://${req.get('host')}/files/download/token/${file.token}`
        res.status(200).json({ link: shareableLink })
    } catch (error) {
        res.status(500).json({ message: 'Error generating shareable link', error })
    }
}

exports.shareWithUsers = async (req, res) => {
    try {
        const { userIds } = req.body

        if (!Array.isArray(userIds)) {
            return res.status(400).json({ message: 'Invalid user IDs' })
        }

        const file = await File.findById(req.params.id)

        if (!file) {
            return res.status(404).json({ message: 'File not found' })
        }

        if (file.uploadedBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to share this file' })
        }

        file.sharedWith.push(...userIds)
        await file.save()

        res.status(200).json({ message: 'File shared with users successfully' })
    } catch (error) {
        res.status(500).json({ message: 'Error sharing file with users', error })
    }
}