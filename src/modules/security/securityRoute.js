const express = require('express')

const RoleController = require('./role/roleController.js')
const PermissionController = require('./permission/permissionController.js')
const ModuleController = require('./module/moduleController.js')
const auth = require('../../middlewares/authMiddleware.js')

const router = express.Router()

router.route('/getModules').get(auth.authorization(['superuser', 'GetModules']), ModuleController.getAll)
router.route('/getModule/:id').get(auth.authorization(['superuser', 'GetModules']), ModuleController.get)
router.route('/createModule').post(auth.authorization(['superuser', 'CreateModules']), ModuleController.create)
router.route('/updateModule/:id').put(auth.authorization(['superuser', 'UpdateModules']), ModuleController.update)
router.route('/deleteModule/:id').delete(auth.authorization(['superuser', 'DeleteModules']), ModuleController.remove)

router.route('/getRoles').get(auth.authorization(['superuser', 'GetRole']), RoleController.getAll)
router.route('/getRole/:id').get(auth.authorization(['superuser', 'GetRole']), RoleController.get)
router.route('/createRole').post(auth.authorization(['superuser', 'CreateRole']), RoleController.create)
router.route('/updateRole/:id').put(auth.authorization(['superuser', 'UpdateRole']), RoleController.update)
router.route('/deleteRole/:id').delete(auth.authorization(['superuser', 'DeleteRole']), RoleController.remove)

router.route('/getPermissions').get(auth.authorization(['superuser', 'GetPermission']), PermissionController.getAll)
router.route('/getPermission/:id').get(auth.authorization(['superuser', 'GetPermission']), PermissionController.get)
router.route('/createPermission').post(auth.authorization(['superuser', 'CreatePermission']), PermissionController.create)
router.route('/updatePermission/:id').put(auth.authorization(['superuser', 'UpdatePermission']), PermissionController.update)
router.route('/deletePermission/:id').delete(auth.authorization(['superuser', 'DeletePermission']), PermissionController.remove)

module.exports = router
