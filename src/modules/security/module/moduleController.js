const moduleModel = require('./moduleModel')
const validateParams = require('../../../helpers/validateParams')
const { moduleValidator, moduleValidatorUpdate } = require('./moduleValidator')

const getAll = async (req, res) => {
  /*
  *   #swagger.tags = ['Security - Module']
  *   #swagger.description = 'Get modules petition'
  *   #swagger.security = [{ "apiKeyAuth": [] }]
  */

  const { result, error } = await moduleModel.getAll()
  if (error) return res.status(500).json({ data: null, error })
  res.setHeader('Content-Type', 'application/json')
  res.status(200).json({ data: result, error: null })
}

const get = async (req, res) => {
  /*
  *   #swagger.tags = ['Security - Module']
  *   #swagger.description = 'Get module petition'
  *   #swagger.security = [{ "apiKeyAuth": [] }]
  *   #swagger.parameters['id'] = { in: 'path', description: 'Id of the module', required: true, type: 'string', default: '5f9f9f9f9f9f9f9f9f9f9f9f' }
  */

  const id = req.params.id || null
  if (!id) return res.status(400).json({ data: null, error: 'MISSING_ID' })

  const { result, error } = await moduleModel.get(id)
  if (error) return res.status(500).json({ data: null, error })

  res.setHeader('Content-Type', 'application/json')
  res.status(200).json({ data: result, error: null })
}

const create = async (req, res) => {
  /*
  *   #swagger.tags = ['Security - Module']
  *   #swagger.description = 'Create module petition'
  *   #swagger.consumes = ['application/x-www-form-urlencoded']
  *   #swagger.security = [{ 'apiKeyAuth': [] }]
  *   #swagger.parameters['name'] = { in: 'formData', description: 'Name of the module', required: true, type: 'string', default: 'Module 1' }
  */

  const data = req.body || null

  const { dataParsed, validationErrors } = await validateParams(data, moduleValidator)
  if (validationErrors) return res.status(400).json({ data: null, error: validationErrors })

  const { result, error } = await moduleModel.create(dataParsed)
  if (error) return res.status(500).json({ data: null, error })

  res.setHeader('Content-Type', 'application/json')
  res.status(200).json({ data: result, error: null })
}

const update = async (req, res) => {
  /*
  *   #swagger.tags = ['Security - Module']
  *   #swagger.description = 'Update module petition'
  *   #swagger.consumes = ['application/x-www-form-urlencoded']
  *   #swagger.security = [{ 'apiKeyAuth': [] }]
  *   #swagger.parameters['id'] = { in: 'path', description: 'Id of the module', required: true, type: 'string', default: '5f9f9f9f9f9f9f9f9f9f9f9f' }
  *   #swagger.parameters['name'] = { in: 'formData', description: 'Name of the module', required: true, type: 'string', default: 'Module 1' }
  */

  const data = req.body || null
  data.id = req.params.id || null

  const { dataParsed, validationErrors } = await validateParams(data, moduleValidatorUpdate)
  if (validationErrors) return res.status(400).json({ data: null, error: validationErrors })

  const id = dataParsed.id || null
  delete dataParsed.id

  const { result, error } = await moduleModel.update(id, dataParsed)
  if (error) return res.status(500).json({ data: null, error })

  res.setHeader('Content-Type', 'application/json')
  res.status(200).json({ data: result, error: null })
}

const remove = async (req, res) => {
  /*
  *   #swagger.tags = ['Security - Module']
  *   #swagger.description = 'Remove module petition'
  *   #swagger.security = [{ "apiKeyAuth": [] }]
  *   #swagger.parameters['id'] = { in: 'path', description: 'Id of the module', required: true, type: 'string', default: '5f9f9f9f9f9f9f9f9f9f9f9f' }
  */

  const id = req.params.id || null
  if (!id) return res.status(400).json({ data: null, error: 'MISSING_ID' })

  const { result, error } = await moduleModel.remove(id)
  if (error) return res.status(500).json({ data: null, error })

  res.setHeader('Content-Type', 'application/json')
  res.status(200).json({ data: result, error: null })
}

module.exports = { getAll, get, create, update, remove }
