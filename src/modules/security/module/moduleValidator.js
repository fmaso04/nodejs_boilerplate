const moduleModel = require('./moduleModel')

const moduleValidator = {
  name: 'required|min:3|max:20',
  registers: [
    {
      field: 'name',
      name: 'name_available',
      func: (name) => {
        return moduleModel.existsModule({ name }).then((data) => {
          return !data.result
        })
      },
      message: 'NAME_ALREADY_EXISTS'
    }
  ]
}

const moduleValidatorUpdate = {
  id: 'required',
  name: 'required|min:3|max:20',
  registers: [
    {
      field: 'id',
      name: 'id_available',
      func: (id) => {
        return moduleModel.existsModule({ id }).then((data) => {
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
        return moduleModel.existsModule({ AND: [{ name }, { NOT: { id: { equals: id } } }] }).then((data) => {
          return !data.result
        })
      },
      message: 'NAME_ALREADY_EXISTS'
    }
  ]
}

module.exports = { moduleValidator, moduleValidatorUpdate }
