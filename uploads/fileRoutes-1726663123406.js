const express = require('express')
const router = express.Router()
const fileController = require('../controllers/fileController')
const { authenticate, authorizeFileAccess } = require('../middleware/auth')
const upload = require('../config/upload')

router.post('/upload', authenticate, upload.single('file'), fileController.uploadFile)

router.get('/list', authenticate, fileController.listFiles)

router.get('/download/id/:id', authenticate, authorizeFileAccess, fileController.downloadFile)

router.get('/download/token/:token', authenticate, fileController.downloadFile)

router.delete('/delete/:id', authenticate, authorizeFileAccess, fileController.deleteFile)

router.post('/share/link/:id', authenticate, authorizeFileAccess, fileController.generateShareableLink)

router.post('/share/user/:id', authenticate, authorizeFileAccess, fileController.shareWithUsers)

module.exports = router