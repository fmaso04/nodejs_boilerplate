const express = require('express')

const AuthController = require('./authController')

const router = express.Router()

router.post('/login', AuthController.login)
router.post('/fast-register', AuthController.fastRegister)
router.post('/register', AuthController.longRegister)

module.exports = router
