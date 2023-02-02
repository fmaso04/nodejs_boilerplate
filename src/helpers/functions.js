const jwt = require('jsonwebtoken')
const moment = require('moment/moment')
const { token: tokenConfig } = require('../../config/config-dev')

exports.exclude = (user, ...keys) => {
  for (const key of keys) {
    delete user[key]
  }
  return user
}

exports.createToken = (idUser) => {
  return jwt.sign(
    { id: idUser, creation: moment().valueOf() },
    process.env.JWT_KEY,
    { algorithm: 'HS256', expiresIn: `${tokenConfig.expirationToken}${tokenConfig.expirationUnit}` }
  )
}
