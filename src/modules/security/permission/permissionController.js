const permissionModel = require('./permissionModel')
const validateParams = require('../../../helpers/validateParams')
const { permissionValidator, permissionValidatorUpdate } = require('./permissionValidator')

const getAll = async (req, res) => {
  /*
  *   #swagger.tags = ['Security - Permission']
  *   #swagger.description = 'Get permissions petition'
  *   #swagger.security = [{ "apiKeyAuth": [] }]
  */

  const { result, error } = await permissionModel.getAll()
  if (error) return res.status(500).json({ data: null, error })
  res.setHeader('Content-Type', 'application/json')
  res.status(200).json({ data: result, error: null })
}

const get = async (req, res) => {
  /*
  *   #swagger.tags = ['Security - Permission']
  *   #swagger.description = 'Get permission petition'
  *   #swagger.security = [{ "apiKeyAuth": [] }]
  *   #swagger.parameters['id'] = { in: 'path', description: 'Id of the permission', required: true, type: 'string', default: '5f9f9f9f9f9f9f9f9f9f9f9f' }
  */

  const id = req.params.id || null
  if (!id) return res.status(400).json({ data: null, error: 'MISSING_ID' })

  const { result, error } = await permissionModel.get(id)
  if (error) return res.status(500).json({ data: null, error })

  res.setHeader('Content-Type', 'application/json')
  res.status(200).json({ data: result, error: null })
}

const create = async (req, res) => {
  /*
  *   #swagger.tags = ['Security - Permission']
  *   #swagger.description = 'Create permission petition'
  *   #swagger.consumes = ['application/x-www-form-urlencoded']
  *   #swagger.security = [{ "apiKeyAuth": [] }]
  *   #swagger.parameters['code'] = { in: 'formData', description: 'Code of the permission IN_MAYUS_WITH_UNDERSCORE', required: true, type: 'string', default: 'GET_ALL_USERS' }
  *   #swagger.parameters['description'] = { in: 'formData', description: 'Subscription to the newsletter', required: true, type: 'string', default: 'Get all users' }
  *   #swagger.parameters['moduleId'] = { in: 'formData', description: 'Id of the module', required: true, type: 'string', default: '5f9f9f9f9f9f9f9f9f9f9f9f' }
  */

  const data = req.body || null

  const { dataParsed, validationErrors } = await validateParams(data, permissionValidator)
  if (validationErrors) return res.status(400).json({ data: null, error: validationErrors })

  const { result, error } = await permissionModel.create(dataParsed)
  if (error) return res.status(500).json({ data: null, error })

  res.setHeader('Content-Type', 'application/json')
  res.status(200).json({ data: result, error: null })
}

const update = async (req, res) => {
  /*
  *   #swagger.tags = ['Security - Permission']
  *   #swagger.description = 'Update permission petition'
  *   #swagger.security = [{ "apiKeyAuth": [] }]
  *   #swagger.consumes = ['application/x-www-form-urlencoded']
  *   #swagger.parameters['id'] = { in: 'path', description: 'Id of the permission', required: true, type: 'string', default: '5f9f9f9f9f9f9f9f9f9f9f9f' }
  *   #swagger.parameters['code'] = { in: 'formData', description: 'Code of the permission IN_MAYUS_WITH_UNDERSCORE', required: true, type: 'string', default: 'GET_ALL_USERS' }
  *   #swagger.parameters['description'] = { in: 'formData', description: 'Subscription to the newsletter', required: true, type: 'string', default: 'Get all users' }
  *   #swagger.parameters['moduleId'] = { in: 'formData', description: 'Id of the module', required: true, type: 'string', default: '5f9f9f9f9f9f9f9f9f9f9f9f' }
  */

  const data = req.body || null
  data.id = req.params.id || null

  const { dataParsed, validationErrors } = await validateParams(data, permissionValidatorUpdate)
  if (validationErrors) return res.status(400).json({ data: null, error: validationErrors })

  const id = dataParsed.id || null
  delete dataParsed.id

  const { result, error } = await permissionModel.update(id, dataParsed)
  if (error) return res.status(500).json({ data: null, error })

  res.setHeader('Content-Type', 'application/json')
  res.status(200).json({ data: result, error: null })
}

const remove = async (req, res) => {
  /*
  *   #swagger.tags = ['Security - Permission']
  *   #swagger.description = 'Delete permission petition'
  *   #swagger.security = [{ "apiKeyAuth": [] }]
  *   #swagger.parameters['id'] = { in: 'path', description: 'Id of the permission', required: true, type: 'string', default: '5f9f9f9f9f9f9f9f9f9f9f9f' }
  */

  const id = req.params.id || null
  if (!id) return res.status(400).json({ data: null, error: 'MISSING_ID' })

  const { result, error } = await permissionModel.remove(id)
  if (error) return res.status(500).json({ data: null, error })

  res.setHeader('Content-Type', 'application/json')
  res.status(200).json({ data: result, error: null })
}

module.exports = { getAll, get, create, update, remove }
