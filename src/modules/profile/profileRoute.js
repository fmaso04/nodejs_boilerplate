const express = require('express')
const multer = require('multer')

const auth = require('../../middlewares/authMiddleware')
const ProfileController = require('./profileController')

const router = express.Router()
const upload = multer({ dest: './temp/user' })

router.route('/get/:id').get(auth.authorization('Profile', 'GET_PROFILE'), ProfileController.get)
router.route('/getToken').get(auth.authorization('Profile', 'GET_TOKEN_PROFILE'), ProfileController.getToken)
router.route('/update/:id').put(auth.authorization('Profile', 'UPDATE_PROFILE'), ProfileController.update)
router.route('/updateAvatar/:id').post(auth.authorization('Profile', 'UPDATE_PROFILE'), upload.single('avatar'), ProfileController.updateAvatar)
router.route('/updatePassword').put(auth.authorization('Profile', 'UPDATE_PASSWORD_PROFILE'), ProfileController.updatePassword)
module.exports = router
