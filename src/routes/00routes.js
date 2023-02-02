const express = require('express')
const router = express.Router()

const playground = require('./playgroundRoute')
const users = require('./userRoute')
const auth = require('./authRoute')

router.use('/playground', playground)
router.use('/user', users)
router.use('/auth', auth)

module.exports = router
