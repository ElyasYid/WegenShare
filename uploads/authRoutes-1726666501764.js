const express = require('express')
const router = express.Router()
const { registerUser, loginUser, logoutUser, deleteAccount } = require('../controllers/authController')
const { authenticate } = require('../middleware/auth')

router.post('/register', registerUser)

router.post('/login', loginUser)

router.post('/logout', authenticate, logoutUser)

router.delete('/delete', authenticate, deleteAccount)

module.exports = router