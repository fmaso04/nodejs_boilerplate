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
      message: 'Name already exists'
    }
  ]
}

const roleValidatorUpdate = {
  id: 'required',
  name: 'required|min:3|max:20',
  registers: [
    {
      field: 'id',
      name: 'id_available',
      func: (id) => {
        return roleModel.existsRole({ id }).then((data) => {
          return data.result
        })
      },
      message: 'Id not exists'
    }
  ]
}

module.exports = { roleValidator, roleValidatorUpdate }
