const moment = require('moment/moment')
const bcrypt = require('bcrypt')

const userModel = require('../user/userModel')
const tokenModel = require('../user/token/tokenModel')
const validateParams = require('../../helpers/validateParams')
const createToken = require('../../helpers/functions').createToken
const { userValidator } = require('../user/userValidator')
const mailer = require('../../helpers/sendEmail')
const { emailValidator, passwordValidator } = require('../../helpers/defaultValidators')

const serverConfig = require('../../../config/config').server
const tokenConfig = require('../../../config/config').token
const companyConfig = require('../../../config/config').company

const login = async (req, res) => {
  /*
  *   #swagger.tags = ['Authentication']
  *   #swagger.description = 'User login'
  *   #swagger.consumes = ['application/x-www-form-urlencoded']
  *   #swagger.parameters['email'] = { in: 'formData', description: 'Email of the user', required: true, default: 'admin@ferranmaso.com' }
  *   #swagger.parameters['password'] = { in: 'formData', description: 'Password of the user', required: true, type: 'string', format: 'password', default: '12341234' }
  */

  const loginResult = await userModel.login(req.body.email, req.body.password)
  if (loginResult.error) return res.status(400).json({ error: loginResult.error })

  const user = loginResult.result
  const token = createToken(user.id)
  const tokenResult = await tokenModel.create({
    token,
    name: 'login',
    expiration: moment(new Date()).add(tokenConfig.expirationToken, tokenConfig.expirationUnitLong).format(),
    userId: user.id
  })

  if (tokenResult.error) return res.status(400).json({ error: tokenResult.error })
  user.token = tokenResult.result.token

  res.setHeader('Content-Type', 'application/json')
  res.status(200).json({ data: user, error: null })
}

const fastRegister = async (req, res) => {
  /*
  *   #swagger.tags = ['Authentication']
  *   #swagger.description = 'Fast register for users and sends verification email'
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
  *   #swagger.description = 'Fast register for users and sends verification email'
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

  dataParsed.password = await bcrypt.hash(dataParsed.password, 10)

  const userResult = await userModel.create(dataParsed)
  if (userResult.error) return res.status(400).json({ error: userResult.error })
  const user = userResult.result

  const token = createToken(user.id)
  const tokenResult = await tokenModel.create({
    token,
    name: 'emailVerification',
    expiration: moment(new Date()).add(tokenConfig.expirationToken, tokenConfig.expirationUnitLong).format(),
    userId: user.id
  })
  if (tokenResult.error) return res.status(400).json({ error: tokenResult.error })
  user.token = tokenResult.result.token

  const mailResult = await sendVerifyMail(user)
  if (mailResult.error) return res.status(400).json({ error: mailResult.error })

  res.setHeader('Content-Type', 'application/json')
  return res.status(200).json({ data: user, error: null })
}

const verifyEmail = async (req, res) => {
/*
  *   #swagger.tags = ['Authentication']
  *   #swagger.description = 'Sends a verification email to the user, used if the email has not arrived'
  *   #swagger.consumes = ['application/x-www-form-urlencoded']
  *
  *   #swagger.responses[200] = { description: 'User found' }
  *   #swagger.responses[400] = { description: 'User not found' }
  *   #swagger.responses[500] = { description: 'Internal error' }
  */

  const userId = req.userData.id || null
  const userResult = await userModel.get(userId)
  if (userResult.error) return res.status(400).json({ error: userResult.error })
  const user = userResult.result

  const mailResult = await sendVerifyMail(user)
  if (mailResult.error) return res.status(400).json({ error: mailResult.error })

  res.setHeader('Content-Type', 'application/json')
  return res.status(200).json({ data: user, error: null })
}

const sendVerifyMail = async (user) => {
  const token = createToken(user.id)
  const tokenResult = await tokenModel.create({
    token,
    name: 'emailVerification',
    expiration: moment(new Date()).add(tokenConfig.expirationRecoverEmailToken, tokenConfig.expirationRecoverEmailTokenUnit).format(),
    userId: user.id
  })

  if (tokenResult.error) return { result: null, error: tokenResult.error }

  const mailResult = await mailer.sendEmailFromTemplate({
    to: user.email,
    subject: 'Email verification',
    template: 'emailVerification',
    context: {
      name: user.name,
      url: `${serverConfig.frontendUrl}/email-verification/${token}`,
      company: companyConfig
    }
  })

  console.log(mailResult)

  if (mailResult.error) return { result: null, error: mailResult.error }
  return { result: tokenResult, error: null }
}

const verifyEmailToken = async (req, res) => {
  /*
  *   #swagger.tags = ['Authentication']
  *   #swagger.description = 'Verify email by token'
  *   #swagger.consumes = ['application/x-www-form-urlencoded']
  *   #swagger.parameters['token'] = { in: 'path', description: 'Token to verify', required: true, default: '123456789' }
  *
  *   #swagger.responses[200] = { description: 'User found' }
  *   #swagger.responses[400] = { description: 'User not found' }
  *   #swagger.responses[500] = { description: 'Internal error' }
  */

  const { token } = req.params

  const tokenResult = await tokenModel.getByParams({ token, name: 'emailVerification' })
  if (tokenResult.error) return res.status(400).json({ error: tokenResult.error })
  const tokenData = tokenResult.result

  if (!tokenData.active) return res.status(400).json({ error: 'TOKEN_NOT_ACTIVE' })
  if (tokenData.expiration < moment().format('YYYY-MM-DD HH:mm:ss')) return res.status(401).json({ error: 'TOKEN_EXPIRED' })

  const userResult = await userModel.get(tokenData.userId)
  if (userResult.error) return res.status(400).json({ error: userResult.error })
  const user = userResult.result

  const userUpdateResult = await userModel.update(user.id, { verified: true })
  if (userUpdateResult.error) return res.status(400).json({ error: userUpdateResult.error })

  const tokenUpdateResult = await tokenModel.update(tokenData.id, { active: false })
  if (tokenUpdateResult.error) return res.status(400).json({ error: tokenUpdateResult.error })

  user.verified = true

  res.setHeader('Content-Type', 'application/json')
  return res.status(200).json({ data: user, error: null })
}

const recoverPassword = async (req, res) => {
  /*
  *   #swagger.tags = ['Authentication']
  *   #swagger.description = 'Recover password'
  *   #swagger.consumes = ['application/x-www-form-urlencoded']
  *   #swagger.parameters['email'] = { in: 'path', description: 'Email of the user', required: true, default: 'test@ferranmaso.com' }
  *
  *   #swagger.responses[200] = { description: 'User found' }
  *   #swagger.responses[400] = { description: 'User not found' }
  *   #swagger.responses[500] = { description: 'Internal error' }
  */

  const { email } = req.params

  const { dataParsed, validationErrors } = await validateParams({ email }, emailValidator)
  if (validationErrors) return res.status(400).json({ error: validationErrors })

  const userResult = await userModel.getByParams({ email: dataParsed.email })
  if (userResult.error) return res.status(400).json({ error: userResult.error })

  const user = userResult.result

  const token = createToken(user.id)
  const tokenResult = await tokenModel.create({
    token,
    name: 'recoverPassword',
    expiration: moment(new Date()).add(tokenConfig.expirationRecoverEmailToken, tokenConfig.expirationRecoverEmailTokenUnit).format(),
    userId: user.id
  })

  if (tokenResult.error) return res.status(400).json({ error: tokenResult.error })

  const mailResult = await mailer.sendEmailFromTemplate({
    to: user.email,
    subject: 'Recover password',
    template: 'emailRecoverPassword',
    context: {
      name: user.name,
      url: `${serverConfig.frontendUrl}/recover-password/${token}`,
      company: companyConfig
    }
  })

  if (mailResult.error) return res.status(400).json({ error: mailResult.error })
  res.setHeader('Content-Type', 'application/json')
  return res.status(200).json({ data: 'EMAIL_SEND_CORRECT', error: null })
}

const recoverPasswordChange = async (req, res) => {
  /*
  *   #swagger.tags = ['Authentication']
  *   #swagger.description = 'Recover password change using token provided by email'
  *   #swagger.consumes = ['application/x-www-form-urlencoded']
  *   #swagger.parameters['token'] = { in: 'path', description: 'Token of the user', required: true, default: '5f9f9f9f9f9f9f9f9f9f9f9f' }
  *   #swagger.parameters['password'] = { in: 'formData', description: 'Password of the user', required: true, type: 'string', format: 'password', default: '123412341234' }
  *   #swagger.parameters['passwordConfirmation'] = { in: 'formData', description: 'Password confirmation of the user', required: true, type: 'string', format: 'password', default: '12341234' }
  *
  *   #swagger.responses[200] = { description: 'User found' }
  *   #swagger.responses[400] = { description: 'User not found' }
  *   #swagger.responses[500] = { description: 'Internal error' }
  */

  const { token } = req.params
  const { password } = req.body

  const { dataParsed, validationErrors } = await validateParams({ password }, passwordValidator)
  if (validationErrors) return res.status(400).json({ error: validationErrors })

  const tokenResult = await tokenModel.getByParams({ token, name: 'recoverPassword' })
  if (tokenResult.error) return res.status(400).json({ error: tokenResult.error })
  const tokenData = tokenResult.result

  if (!tokenData.active) return res.status(400).json({ error: 'TOKEN_NOT_ACTIVE' })
  if (tokenData.expiration < moment().format('YYYY-MM-DD HH:mm:ss')) return res.status(401).json({ error: 'TOKEN_EXPIRED' })

  const userResult = await userModel.getByParams({ id: tokenData.userId })
  if (userResult.error) return res.status(400).json({ error: userResult.error })

  const user = userResult.result
  const passwordHash = await bcrypt.hash(dataParsed.password, 10)
  const userUpdateResult = await userModel.update(user.id, { password: passwordHash })
  if (userUpdateResult.error) return res.status(400).json({ error: userUpdateResult.error })

  /* const tokenDeleteResult = await tokenModel.remove(tokenData.id)
  if (tokenDeleteResult.error) return res.status(400).json({ error: tokenDeleteResult.error }) */

  const tokenUpdateResult = await tokenModel.update(tokenData.id, { active: false })
  if (tokenUpdateResult.error) return res.status(400).json({ error: tokenUpdateResult.error })

  res.setHeader('Content-Type', 'application/json')
  return res.status(200).json({ data: 'PASSWORD_CHANGED_CORRECT', error: null })
}

module.exports = { login, fastRegister, longRegister, verifyEmail, verifyEmailToken, recoverPassword, recoverPasswordChange }
