const express = require('express')
const router = express.Router()
const UserController = require('../controllers/userController')
const auth = require('../middlewares/authMiddleware')
const multer = require('multer')

const upload = multer({ dest: './temp/user' })

router.route('/getAll').get(auth.authorization(['superuser', 'GetAll']), UserController.getAll)
router.route('/get/:id').get(auth.authorization(['superuser', 'Get']), UserController.get)
router.route('/create').post(auth.authorization(['superuser', 'Create']), UserController.create)
router.route('/createWithAvatar').post(auth.authorization(['superuser', 'CreateWithAvatar']), upload.single('avatar'), UserController.createWithAvatar)
router.route('/update/:id').put(auth.authorization(['superuser', 'Update']), UserController.update)
router.route('/updateAvatar/:id').post(auth.authorization(['superuser', 'UpdateAvatar']), upload.single('avatar'), UserController.updateAvatar)
router.route('/delete/:id').delete(auth.authorization(['superuser', 'Delete']), UserController.remove)
module.exports = router
