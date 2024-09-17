const File = require('../models/File')
const path = require('path')
const fs = require('fs')

exports.uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' })
        }

        const file = new File({
            filename: req.file.filename,
            filepath: req.file.path,
            filesize: req.file.size,
            uploadedBy: req.user._id,
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
        const file = await File.findById(req.params.id)

        if (!file) {
            return res.status(404).json({ message: 'File not found' })
        }

        if (file.uploadedBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to access this file' });
        }

        res.download(file.filepath, file.filename);
    } catch (error) {
        res.status(500).json({ message: 'Error downloading file', error });
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