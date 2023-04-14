const express = require('express')
const router = express.Router()

const playground = require('../modules/playground/playgroundRoute')
const users = require('../modules/user/userRoute')
const auth = require('../modules/authentication/authRoute')
const security = require('../modules/security/securityRoute')

router.use('/playground', playground)
router.use('/user', users)
router.use('/auth', auth)
router.use('/security', security)

module.exports = router