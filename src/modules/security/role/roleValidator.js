const roleModel = require('./roleModel')

const roleValidator = {
  name: 'required|min:3|max:20',
  registers: [
    {
      field: 'name',
      name: 'name_available',
      func: (name) => {
        return roleModel.existsRole({ name }).then((data) => {
          return !data.result
        })
      },
      message: 'NAME_ALREADY_EXISTS'
    }
  ]
}

const roleValidatorUpdate = {
  id: 'required',
  name: 'required|min:3|max:20',
  registers: [
    {
      field: 'id',
      name: 'id_exists',
      func: (id) => {
        return roleModel.existsRole({ id }).then((data) => {
          return data.result
        })
      },
      message: 'ID_NOT_EXISTS'
    },
    {
      field: 'name',
      name: 'name_available_or_same',
      params: ['id'],
      func: (name, params) => {
        const id = params.find((item) => item.id).id
        return roleModel.existsRole({ AND: [{ name }, { NOT: { id: { equals: id } } }] }).then((data) => {
          return !data.result
        })
      },
      message: 'NAME_ALREADY_EXISTS'
    }
  ]
}

module.exports = { roleValidator, roleValidatorUpdate }
