const roleModel = require('./roleModel')
const validateParams = require('../../../helpers/validateParams')
const { roleValidator, roleValidatorUpdate } = require('./roleValidator')

const getAll = async (req, res) => {
  /*
  *   #swagger.tags = ['Security - Role']
  *   #swagger.description = 'Get roles petition'
  *   #swagger.security = [{ "apiKeyAuth": [] }]
  */

  const { result, error } = await roleModel.getAll()
  if (error) return res.status(500).json({ data: null, error })
  res.setHeader('Content-Type', 'application/json')
  res.status(200).json({ data: result, error: null })
}

const get = async (req, res) => {
  /*
  *   #swagger.tags = ['Security - Role']
  *   #swagger.description = 'Get role petition'
  *   #swagger.security = [{ "apiKeyAuth": [] }]
  *   #swagger.parameters['id'] = { in: 'path', description: 'Id of the role', required: true, type: 'string', default: '5f9f9f9f9f9f9f9f9f9f9f9f' }
  */

  const id = req.params.id || null
  if (!id) return res.status(400).json({ data: null, error: 'MISSING_ID' })

  const { result, error } = await roleModel.get(id)
  if (error) return res.status(500).json({ data: null, error })

  res.setHeader('Content-Type', 'application/json')
  res.status(200).json({ data: result, error: null })
}

const create = async (req, res) => {
  /*
  *   #swagger.tags = ['Security - Role']
  *   #swagger.description = 'Create role petition'
  *   #swagger.consumes = ['application/x-www-form-urlencoded']
  *   #swagger.security = [{ "apiKeyAuth": [] }]
  *   #swagger.parameters['name'] = { in: 'formData', description: 'Role to create', required: true, type: 'string', default: 'New role' }
  */

  const data = req.body || {}

  const { dataParsed, validationErrors } = await validateParams(data, roleValidator)
  if (validationErrors) return res.status(400).json({ data: null, error: validationErrors })

  const { result, error } = await roleModel.create(dataParsed)
  if (error) return res.status(500).json({ data: null, error })

  res.setHeader('Content-Type', 'application/json')
  return res.status(200).json({ data: result, error: null })
}

const update = async (req, res) => {
  /*
  *   #swagger.tags = ['Security - Role']
  *   #swagger.description = 'Update role petition'
  *   #swagger.security = [{ "apiKeyAuth": [] }]
  *   #swagger.consumes = ['application/x-www-form-urlencoded']
  *   #swagger.parameters['id'] = { in: 'path', description: 'Id of the role', required: true, type: 'string', default: '5f9f9f9f9f9f9f9f9f9f9f9f' }
  *   #swagger.parameters['name'] = { in: 'formData', description: 'Role to update', required: true, type: 'string', default: 'Edited role'}
  */

  const data = req.body || {}
  data.id = req.params.id || null

  const { dataParsed, validationErrors } = await validateParams(data, roleValidatorUpdate)
  if (validationErrors) return res.status(400).json({ data: null, error: validationErrors })

  const id = dataParsed.id || null
  delete dataParsed.id

  const { result, error } = await roleModel.update(id, dataParsed)
  if (error) return res.status(500).json({ data: null, error })

  res.setHeader('Content-Type', 'application/json')
  return res.status(200).json({ data: result, error: null })
}

const remove = async (req, res) => {
  /*
  *   #swagger.tags = ['Security - Role']
  *   #swagger.description = 'Delete role petition'
  *   #swagger.security = [{ "apiKeyAuth": [] }]
  *   #swagger.parameters['id'] = { in: 'path', description: 'Id of the role', required: true, type: 'string', default: '5f9f9f9f9f9f9f9f9f9f9f9f' }
  */

  const id = req.params.id || null
  if (!id) return res.status(400).json({ data: null, error: 'MISSING_ID' })

  const { result, error } = await roleModel.remove(id)
  if (error) return res.status(500).json({ data: null, error })

  res.setHeader('Content-Type', 'application/json')
  return res.status(200).json({ data: result, error: null })
}

module.exports = { getAll, get, create, update, remove }
