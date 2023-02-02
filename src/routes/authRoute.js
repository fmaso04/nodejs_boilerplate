const express = require('express')
const router = express.Router()
const AuthController = require('../controllers/authController')

router.post('/login', AuthController.login)
router.post('/fast-register', AuthController.fastRegister)
router.post('/register', AuthController.longRegister)

module.exports = router
