const express = require('express')

const RoleController = require('./role/roleController.js')
const PermissionController = require('./permission/permissionController.js')
const ModuleController = require('./module/moduleController.js')
const auth = require('../../middlewares/authMiddleware.js')

const router = express.Router()

router.route('/getModules').get(auth.authorization('Security', 'GET_MODULES'), ModuleController.getAll)
router.route('/getModule/:id').get(auth.authorization('Security', 'GET_MODULE'), ModuleController.get)
router.route('/createModule').post(auth.authorization('Security', 'CREATE_MODULE'), ModuleController.create)
router.route('/updateModule/:id').put(auth.authorization('Security', 'UPDATE_MODULE'), ModuleController.update)
router.route('/deleteModule/:id').delete(auth.authorization('Security', 'DELETE_MODULE'), ModuleController.remove)

router.route('/getRoles').get(auth.authorization('Security', 'GET_ROLES'), RoleController.getAll)
router.route('/getRole/:id').get(auth.authorization('Security', 'GET_ROLE'), RoleController.get)
router.route('/createRole').post(auth.authorization('Security', 'CREATE_ROLE'), RoleController.create)
router.route('/updateRole/:id').put(auth.authorization('Security', 'UPDATE_ROLE'), RoleController.update)
router.route('/deleteRole/:id').delete(auth.authorization('Security', 'DELETE_ROLE'), RoleController.remove)

router.route('/getPermissions').get(auth.authorization('Security', 'GET_PERMISSIONS'), PermissionController.getAll)
router.route('/getPermission/:id').get(auth.authorization('Security', 'GET_PERMISSION'), PermissionController.get)
router.route('/createPermission').post(auth.authorization('Security', 'CREATE_PERMISSION'), PermissionController.create)
router.route('/updatePermission/:id').put(auth.authorization('Security', 'UPDATE_PERMISSION'), PermissionController.update)
router.route('/deletePermission/:id').delete(auth.authorization('Security', 'DELETE_PERMISSION'), PermissionController.remove)

router.route('/getPermissionsByRole/:roleId').get(auth.authorization(['Security', 'GET_PERMISSIONS_BY_ROLE']), PermissionController.getPermissionsByRole)
router.route('/addPermissionToRole/:roleId/:permissionId').post(auth.authorization('Security', 'ADD_PERMISSION_TO_ROLE'), PermissionController.addPermissionToRole)
router.route('/getPermissionsByUser/:userId').get(auth.authorization(['Security', 'GET_PERMISSIONS_BY_USER']), PermissionController.getPermissionsByUser)
router.route('/addPermissionToUser/:userId/:permissionId').post(auth.authorization('Security', 'ADD_PERMISSION_TO_USER'), PermissionController.addPermissionToUser)

module.exports = router
