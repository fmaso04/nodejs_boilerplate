const permissionModel = require('./permissionModel')
const moduleModel = require('../module/moduleModel')

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

module.exports = { permissionValidator, permissionValidatorUpdate }
