const userModel = require('../user/userModel')

const avatarValidator = {
  required: false,
  maxSize: '15mb',
  extensions: 'jpg|jpeg|png|gif|svg|webp',
  mimeTypes: 'image/jpeg|image/png|image/gif|image/svg+xml|image/webp'
}

const profileValidatorUpdate = {
  id: 'required',
  email: 'email',
  username: 'min:3|max:20',
  newsletter: 'boolean',
  conditions: 'boolean',
  name: 'max:50',
  bio: 'max:500',
  birthday: 'date',
  phone: 'max:20',
  address: 'max:100',
  city: 'max:50',
  country: 'max:50',
  postalCode: 'max:10',
  registers: [
    {
      field: 'id',
      name: 'id_available',
      func: (id) => {
        return userModel.existsUser({ id }).then((data) => {
          return data.result
        })
      },
      message: 'ID_NOT_EXISTS'
    },
    {
      field: 'email',
      name: 'email_available_or_same',
      params: ['id'],
      func: (email, params) => {
        const id = params.find((item) => item.id).id
        return userModel.existsUser({ AND: [{ email }, { NOT: { id: { equals: id } } }] }).then((data) => {
          return !data.result
        })
      },
      message: 'EMAIL_ALREADY_EXISTS'
    },
    {
      field: 'username',
      name: 'username_available_or_same',
      params: ['id'],
      func: (username, params) => {
        const id = params.find((item) => item.id).id
        return userModel.existsUser({ AND: [{ username }, { NOT: { id: { equals: id } } }] }).then((data) => {
          return !data.result
        })
      },
      message: 'USERNAME_ALREADY_EXISTS'
    },
    {
      field: 'conditions',
      name: 'conditions_accepted',
      func: (conditions) => {
        return new Promise((resolve) => {
          resolve(conditions)
        })
      },
      message: 'CONDITIONS_NOT_ACCEPTED'
    }
  ]
}

module.exports = { profileValidatorUpdate, avatarValidator }
