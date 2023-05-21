const bcrypt = require('bcrypt')

const userModel = require('../user/userModel')
const validateParams = require('../../helpers/validateParams')
const validateFile = require('../../helpers/validateFile')
const { avatarValidator, profileValidatorUpdate } = require('./profileValidator')
const { passwordValidator } = require('../../helpers/defaultValidators')

const get = async (req, res) => {
  /*
  *   #swagger.tags = ['Profile']
  *   #swagger.description = 'User get by id'
  *   #swagger.parameters['id'] = { in: 'path', description: 'Id of the user', required: true, type: 'string', default: '5f9f9f9f9f9f9f9f9f9f9f9f' }
  */

  const { result, error } = await userModel.get(req.params.id)
  if (error) return res.status(500).json({ data: null, error })
  res.setHeader('Content-Type', 'application/json')
  return res.status(200).json({ data: result, error: null })
}

const getToken = async (req, res) => {
  /*
  *   #swagger.tags = ['Profile']
  *   #swagger.description = 'Get my profile'
  *   #swagger.parameters['Authorization'] = { in: 'header', description: 'Bearer token', required: true, type: 'string' }
  */

  const userId = req.userData.id || {}

  const { result, error } = await userModel.get(userId)
  if (error) return res.status(500).json({ data: null, error })
  res.setHeader('Content-Type', 'application/json')
  return res.status(200).json({ data: result, error: null })
}

const update = async (req, res) => {
  /*
  *   #swagger.tags = ['Profile']
  *   #swagger.description = 'Update profile'
  *   #swagger.consumes = ['application/x-www-form-urlencoded']
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

  const data = req.body || {}
  data.id = req.user.id || null

  const { dataParsed, validationErrors } = await validateParams(data, profileValidatorUpdate)
  if (validationErrors) return res.status(400).json({ data: null, error: validationErrors })

  delete data.id

  const { result, error } = await userModel.update(req.user.id, dataParsed)
  if (error) return res.status(500).json({ data: null, error })

  res.setHeader('Content-Type', 'application/json')
  return res.status(200).json({ data: result, error: null })
}

const updateAvatar = async (req, res) => {
  /*
  *  #swagger.tags = ['Profile']
  *  #swagger.description = 'Update the avatar of a profile'
  *  #swagger.consumes = ['multipart/form-data']
  *  #swagger.parameters['avatar'] = { in: 'formData', description: 'Avatar of the user', type: 'file' }
  *  #swagger.parameters['id'] = { in: 'path', description: 'Id of the user', required: true, type: 'string', default: '5f9f9f9f9f9f9f9f9f9f9f9f' }
  */

  const data = req.body || {}
  data.id = req.user.id || null

  const { file, fileErrors } = await validateFile(req.file, avatarValidator)
  if (fileErrors && Object.keys(fileErrors).length > 0) return res.status(400).json({ data: null, error: fileErrors })

  delete data.id

  const { result, error } = await userModel.updateAvatar(req.user.id, file)
  if (error) return res.status(500).json({ data: null, error })

  res.setHeader('Content-Type', 'application/json')
  return res.status(200).json({ data: result, error: null })
}

const updatePassword = async (req, res) => {
  /*
  *   #swagger.tags = ['Profile']
  *   #swagger.description = 'Update the password of a profile'
  *   #swagger.consumes = ['application/x-www-form-urlencoded']
  *   #swagger.parameters['password'] = { in: 'formData', description: 'Password of the user', required: true, type: 'string', default: '12341234' }
  *   #swagger.parameters['newPassword'] = { in: 'formData', description: 'New password of the user', required: true, type: 'string', default: '1234567' }
  *
  *   #swagger.responses[200] = { description: 'User updated successfully' }
  *   #swagger.responses[400] = { description: 'Validation errors' }
  *   #swagger.responses[500] = { description: 'Internal error' }
  *
  */

  const userId = req.userData.id || null
  const oldPassword = req.body.password || null
  const newPassword = req.body.newPassword || null

  // check old password
  const { error } = await userModel.checkPassword(userId, oldPassword)
  if (error) return res.status(500).json({ data: null, error })

  // validate new password
  const { dataParsed, validationErrors } = await validateParams({ password: newPassword }, passwordValidator)
  if (validationErrors) return res.status(400).json({ data: null, error: validationErrors })

  dataParsed.password = await bcrypt.hash(dataParsed.password, 10)

  const { result: resultUpdate, error: errorUpdate } = await userModel.updatePassword(userId, dataParsed.password)
  if (errorUpdate) return res.status(500).json({ data: null, error: errorUpdate })

  res.setHeader('Content-Type', 'application/json')
  return res.status(200).json({ data: resultUpdate, error: null })
}

module.exports = { get, getToken, update, updateAvatar, updatePassword }
