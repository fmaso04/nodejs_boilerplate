const express = require('express')
const multer = require('multer')

const auth = require('../../middlewares/authMiddleware')
const UserController = require('./userController')

const router = express.Router()
const upload = multer({ dest: './temp/user' })

router.route('/getAll').get(auth.authorization('User', 'GET_USERS'), UserController.getAll)
router.route('/get/:id').get(auth.authorization('User', 'GET_USER'), UserController.get)
router.route('/create').post(auth.authorization('User', 'CREATE_USER'), UserController.create)
router.route('/createWithAvatar').post(auth.authorization('User', 'CREATE_USER'), upload.single('avatar'), UserController.createWithAvatar)
router.route('/update/:id').put(auth.authorization('User', 'UPDATE_USER'), UserController.update)
router.route('/updateAvatar/:id').post(auth.authorization('User', 'UPDATE_USER'), upload.single('avatar'), UserController.updateAvatar)
router.route('/delete/:id').delete(auth.authorization('User', 'DELETE_USER'), UserController.remove)
module.exports = router
