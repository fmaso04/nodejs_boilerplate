const userModel = require('../models/userModel')

const avatarValidator = {
  required: false,
  maxSize: '15mb',
  extensions: 'jpg|jpeg|png|gif|svg|webp',
  mimeTypes: 'image/jpeg|image/png|image/gif|image/svg+xml|image/webp'
}

const userValidator = {
  email: 'required|email',
  password: 'required|min:8|max:20',
  username: 'required|min:3|max:20',
  newsletter: 'required|boolean',
  conditions: 'required|boolean',
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
      field: 'username',
      name: 'username_available',
      func: (username) => {
        return userModel.existsUser({ username }).then((data) => {
          return !data.result
        })
      },
      message: 'Username already exists'
    },
    {
      field: 'email',
      name: 'email_available',
      func: (email) => {
        return userModel.existsUser({ email }).then((data) => {
          return !data.result
        })
      },
      message: 'Email already exists'
    }
  ]
}

const userValidatorUpdate = {
  id: 'required',
  newsletter: 'required|boolean',
  conditions: 'required|boolean',
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
      message: 'Id not exists'
    }
  ]
}

module.exports = { userValidator, userValidatorUpdate, avatarValidator }
