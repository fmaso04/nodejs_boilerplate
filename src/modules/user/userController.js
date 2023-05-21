const bcrypt = require('bcrypt')

const userModel = require('./userModel')
const validateParams = require('../../helpers/validateParams')
const validateFile = require('../../helpers/validateFile')
const { avatarValidator, userValidator, userValidatorUpdate } = require('./userValidator')

const getAll = async (req, res) => {
  /*
  *   #swagger.tags = ['User']
  *   #swagger.description = 'User get petition'
  *   #swagger.security = [{ "apiKeyAuth": [] }]
  */

  const { result, error } = await userModel.getAll()
  if (error) return res.status(500).json({ data: null, error })
  res.setHeader('Content-Type', 'application/json')
  return res.status(200).json({ data: result, error: null })
}

const get = async (req, res) => {
  /*
  *   #swagger.tags = ['User']
  *   #swagger.description = 'User get by id'
  *   #swagger.parameters['id'] = { in: 'path', description: 'User id', required: true, type: 'integer' }
  */

  const { result, error } = await userModel.get(req.params.id)
  if (error) return res.status(500).json({ data: null, error })
  res.setHeader('Content-Type', 'application/json')
  return res.status(200).json({ data: result, error: null })
}

const create = async (req, res) => {
  /*
  *   #swagger.tags = ['User']
  *   #swagger.description = 'Create a user'
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

  const data = req.body || {}
  const { dataParsed, validationErrors } = await validateParams(data, userValidator)
  if (validationErrors) return res.status(400).json({ data: null, error: validationErrors })

  dataParsed.password = await bcrypt.hash(dataParsed.password, 10)

  const { result, error } = await userModel.create(dataParsed)
  if (error) return res.status(500).json({ data: null, error })
  res.setHeader('Content-Type', 'application/json')
  return res.status(200).json({ data: result, error: null })
}

const createWithAvatar = async (req, res) => {
  /*
  *   #swagger.tags = ['User']
  *   #swagger.description = 'Create a user with avatar'
  *   #swagger.consumes = ['multipart/form-data']
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
  *   #swagger.parameters['avatar'] = { in: 'formData', description: 'Avatar of the user', type: 'file' }
  */

  const data = req.body || {}
  const { dataParsed, validationErrors } = await validateParams(data, userValidator)
  const { file, fileErrors } = await validateFile(req.file, avatarValidator)

  const errors = validationErrors || {}
  if (fileErrors && Object.keys(fileErrors).length > 0) errors.avatar = fileErrors
  if (errors && Object.keys(errors).length > 0) return res.status(400).json({ data: null, error: errors })

  dataParsed.password = await bcrypt.hash(dataParsed.password, 10)

  const { result, error } = await userModel.createWithAvatar(dataParsed, file)
  if (error) return res.status(500).json({ data: null, error })

  res.setHeader('Content-Type', 'application/json')
  return res.status(200).json({ data: result, error: null })
}

const update = async (req, res) => {
  /*
  *   #swagger.tags = ['User']
  *   #swagger.description = 'Update a user'
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
  data.id = req.params.id || null

  const { dataParsed, validationErrors } = await validateParams(data, userValidatorUpdate)
  if (validationErrors) return res.status(400).json({ data: null, error: validationErrors })

  delete data.id

  const { result, error } = await userModel.update(req.params.id, dataParsed)
  if (error) return res.status(500).json({ data: null, error })

  res.setHeader('Content-Type', 'application/json')
  return res.status(200).json({ data: result, error: null })
}

const updateAvatar = async (req, res) => {
  /*
  *  #swagger.tags = ['User']
  *  #swagger.description = 'Update the avatar of a user'
  *  #swagger.consumes = ['multipart/form-data']
  *  #swagger.parameters['avatar'] = { in: 'formData', description: 'Avatar of the user', type: 'file' }
  *  #swagger.parameters['id'] = { in: 'path', description: 'Id of the user', required: true, type: 'string', default: '5f9f9f9f9f9f9f9f9f9f9f9f' }
  */

  const data = req.body || {}
  data.id = req.params.id || null

  const { file, fileErrors } = await validateFile(req.file, avatarValidator)
  if (fileErrors && Object.keys(fileErrors).length > 0) return res.status(400).json({ data: null, error: fileErrors })

  delete data.id

  const { result, error } = await userModel.updateAvatar(req.params.id, file)
  if (error) return res.status(500).json({ data: null, error })

  res.setHeader('Content-Type', 'application/json')
  return res.status(200).json({ data: result, error: null })
}

const remove = async (req, res) => {
  /*
  *   #swagger.tags = ['User']
  *   #swagger.description = 'Delete a user'
  *   #swagger.parameters['id'] = { in: 'path', description: 'ID of the user', required: true, type: 'string' }
  *
  */

  const id = req.params.id || null
  if (!id) return res.status(400).json({ data: null, error: 'MISSING_ID' })

  const { result, error } = await userModel.remove(id)
  if (error) return res.status(500).json({ data: null, error })

  res.setHeader('Content-Type', 'application/json')
  return res.status(200).json({ data: result, error: null })
}

module.exports = { getAll, get, create, createWithAvatar, update, updateAvatar, remove }
