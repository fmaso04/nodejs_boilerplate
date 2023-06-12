const express = require('express')

const AuthController = require('./authController')

const auth = require('../../middlewares/authMiddleware')

const router = express.Router()

router.post('/login', AuthController.login)

router.post('/fast-register', AuthController.fastRegister)
router.post('/register', AuthController.longRegister)

router.route('/verify-email').get(auth.authorization('', ''), AuthController.verifyEmail)
router.get('/verify-email/:token', AuthController.verifyEmailToken)

router.get('/recover-password/:email', AuthController.recoverPassword)
router.post('/recover-password-change/:token', AuthController.recoverPasswordChange)

module.exports = router
