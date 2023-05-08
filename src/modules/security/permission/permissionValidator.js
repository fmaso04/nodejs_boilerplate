const permissionModel = require('./permissionModel')
const moduleModel = require('../module/moduleModel')
const roleModel = require('../role/roleModel')
const userModel = require('../../user/userModel')

const permissionValidator = {
  code: 'required|min:3|max:20',
  description: 'required|min:3|max:50',
  moduleId: 'required',
  registers: [
    {
      field: 'code',
      name: 'code_available',
      func: (code) => {
        return permissionModel.existsPermission({ code }).then((data) => {
          return !data.result
        })
      },
      message: 'CODE_ALREADY_EXISTS'
    },
    {
      field: 'moduleId',
      name: 'exists_id_module',
      func: (id) => {
        return moduleModel.existsModule({ id }).then((data) => {
          return data.result
        })
      },
      message: 'ID_MODULE_NOT_EXISTS'
    }
  ]
}

const permissionValidatorUpdate = {
  id: 'required',
  code: 'required|min:3|max:20',
  description: 'required|min:3|max:50',
  moduleId: '',
  registers: [
    {
      field: 'id',
      name: 'id_available',
      func: (id) => {
        return permissionModel.existsPermission({ id }).then((data) => {
          return data.result
        })
      },
      message: 'ID_NOT_EXISTS'
    },
    {
      field: 'code',
      name: 'code_available_or_same',
      params: ['id'],
      func: (code, params) => {
        const id = params.find((item) => item.id).id
        return permissionModel.existsPermission({ AND: [{ code }, { NOT: { id: { equals: id } } }] }).then((data) => {
          return !data.result
        })
      },
      message: 'CODE_ALREADY_EXISTS'
    },
    {
      field: 'moduleId',
      name: 'exists_id_module',
      func: (id) => {
        return moduleModel.existsModule({ id }).then((data) => {
          return data.result
        })
      },
      message: 'ID_MODULE_NOT_EXISTS'
    }
  ]
}

const rolePermissionValidator = {
  roleId: 'required',
  permissionId: 'required',
  allowed: 'boolean',
  registers: [
    {
      field: 'roleId',
      name: 'roleId_exists',
      func: (roleId) => {
        return roleModel.existsRole({ id: roleId }).then((data) => {
          return data.result
        })
      },
      message: 'ROLE_ID_NOT_EXISTS'
    },
    {
      field: 'permissionId',
      name: 'permissionId_exists',
      func: (permissionId) => {
        return permissionModel.existsPermission({ id: permissionId }).then((data) => {
          return data.result
        })
      },
      message: 'PERMISSION_ID_NOT_EXISTS'
    }
  ]
}

const userPermissionValidator = {
  userId: 'required',
  permissionId: 'required',
  allowed: 'boolean',
  registers: [
    {
      field: 'userId',
      name: 'userId_exists',
      func: (userId) => {
        return userModel.existsUser({ id: userId }).then((data) => {
          return data.result
        })
      },
      message: 'USER_ID_NOT_EXISTS'
    },
    {
      field: 'permissionId',
      name: 'permissionId_exists',
      func: (permissionId) => {
        return permissionModel.existsPermission({ id: permissionId }).then((data) => {
          return data.result
        })
      },
      message: 'PERMISSION_ID_NOT_EXISTS'
    }
  ]
}

module.exports = { permissionValidator, permissionValidatorUpdate, rolePermissionValidator, userPermissionValidator }
