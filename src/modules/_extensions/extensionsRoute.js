const express = require('express')
const auth = require('../../middlewares/authMiddleware.js')

const router = express.Router()

// router.route('/test').get(auth.authorization('Test', 'GET_TEST'), TestController.getAll)

module.exports = router
