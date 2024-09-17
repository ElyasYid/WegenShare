const express = require('express')
const router = express.Router()
const fileController = require('../controllers/fileController')
const { authenticate, authorizeFileAccess } = require('../middleware/auth')

router.post('/upload', authenticate, fileController.uploadFile)

router.get('/list', authenticate, fileController.listFiles)

router.get('/download/:id', authenticate, authorizeFileAccess, fileController.downloadFile)

router.delete('/delete/:id', authenticate, authorizeFileAccess, fileController.deleteFile)

module.exports = router
