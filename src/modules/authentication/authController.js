const moment = require('moment/moment')

const userModel = require('../user/userModel')
const tokenModel = require('../user/token/tokenModel')
const validateParams = require('../../helpers/validateParams')
const tokenConfig = require('../../../config/config').token
const createToken = require('../../helpers/functions').createToken
const { userValidator } = require('../user/userValidator')

const login = async (req, res) => {
  /*
  *   #swagger.tags = ['Authentication']
  *   #swagger.description = 'User login'
  *   #swagger.consumes = ['application/x-www-form-urlencoded']
  *   #swagger.parameters['email'] = { in: 'formData', description: 'Email of the user', required: true, default: 'admin@ferranmaso.com' }
  *   #swagger.parameters['password'] = { in: 'formData', description: 'Password of the user', required: true, type: 'string', format: 'password', default: '12341234' }
  */

  const loginResponse = await userModel.login(req.body.email, req.body.password)
  if (loginResponse.error) return res.status(400).json({ error: loginResponse.error })

  const user = loginResponse.result
  const token = createToken(user.id)
  const tokenResponse = await tokenModel.create({
    token,
    name: 'login',
    expiration: moment(new Date()).add(tokenConfig.expirationToken, tokenConfig.expirationUnitLong).format(),
    userId: user.id
  })

  if (tokenResponse.error) return res.status(400).json({ error: tokenResponse.error })
  user.token = tokenResponse.result.token

  res.setHeader('Content-Type', 'application/json')
  res.status(200).json({ data: user, error: null })
}

const fastRegister = async (req, res) => {
  /*
  *   #swagger.tags = ['Authentication']
  *   #swagger.description = 'Fast register for users'
  *   #swagger.consumes = ['application/x-www-form-urlencoded']
  *   #swagger.parameters['email'] = { in: 'formData', description: 'Email of the user', required: true, default: 'fm@ferranmaso.com' }
  *   #swagger.parameters['password'] = { in: 'formData', description: 'Password of the user', required: true, type: 'string', format: 'password', default: '12341234' }
  *   #swagger.parameters['username'] = { in: 'formData', description: 'Nickname of the user', required: true, default: 'fmaso' }
  *   #swagger.parameters['newsletter'] = { in: 'formData', description: 'Subscription to the newsletter', required: true, type: 'boolean', default: true }
  *   #swagger.parameters['conditions'] = { in: 'formData', description: 'Accept the conditions, should be true', required: true, type: 'boolean', default: true }
  */

  await register(req, res)
}

const longRegister = async (req, res) => {
  /*
  *   #swagger.tags = ['Authentication']
  *   #swagger.description = 'Fast register for users'
  *   #swagger.consumes = ['application/x-www-form-urlencoded']
  *   #swagger.parameters['email'] = { in: 'formData', description: 'Email of the user', required: true, default: 'fm@ferranmaso.com' }
  *   #swagger.parameters['password'] = { in: 'formData', description: 'Password of the user', required: true, type: 'string', format: 'password', default: '12341234' }
  *   #swagger.parameters['username'] = { in: 'formData', description: 'Nickname of the user', required: true, default: 'fmaso' }
  *   #swagger.parameters['newsletter'] = { in: 'formData', description: 'Subscription to the newsletter', required: true, type: 'boolean', default: true }
  *   #swagger.parameters['conditions'] = { in: 'formData', description: 'Accept the conditions, should be true', required: true, type: 'boolean', default: true }
  *   #swagger.parameters['name'] = { in: 'formData', description: 'Name of the user', default: 'Ferran Masó' }
  *   #swagger.parameters['bio'] = { in: 'formData', description: 'Biography of the user', default: 'This is my bio' }
  *   #swagger.parameters['phone'] = { in: 'formData', description: 'Phone of the user', default: '666666666' }
  *   #swagger.parameters['address'] = { in: 'formData', description: 'Address of the user', default: 'Carrer de la Pau, 1' }
  *   #swagger.parameters['city'] = { in: 'formData', description: 'City of the user', default: 'Barcelona' }
  *   #swagger.parameters['country'] = { in: 'formData', description: 'Country of the user', default: 'Spain' }
  *   #swagger.parameters['postalCode'] = { in: 'formData', description: 'Postal code of the user', default: '08001' }
  *   #swagger.parameters['birthday'] = { in: 'formData', description: 'Birthday', format: 'date', default: '1991-05-31' }
  */

  await register(req, res)
}

const register = async (req, res) => {
  const data = req.body || {}
  const { dataParsed, validationErrors } = await validateParams(data, userValidator)
  if (validationErrors) return res.status(400).json({ error: validationErrors })

  const userResponse = await userModel.create(dataParsed)
  if (userResponse.error) return res.status(400).json({ error: userResponse.error })
  const user = userResponse.result

  const token = createToken(user.id)
  const tokenResponse = await tokenModel.create({
    token,
    name: 'register',
    expiration: moment(new Date()).add(tokenConfig.expirationToken, tokenConfig.expirationUnitLong).format(),
    userId: user.id
  })
  if (tokenResponse.error) return res.status(400).json({ error: tokenResponse.error })
  user.token = tokenResponse.result.token

  res.setHeader('Content-Type', 'application/json')
  return res.status(200).json({ data: user, error: null })
}

module.exports = { login, fastRegister, longRegister }
