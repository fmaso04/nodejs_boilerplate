const permissionModel = require('./permissionModel')
const rolePermissionModel = require('./rolePermissionModel')
const userPermissionModel = require('./userPermissionModel')
const validateParams = require('../../../helpers/validateParams')
const { permissionValidator, permissionValidatorUpdate, rolePermissionValidator, userPermissionValidator } = require('./permissionValidator')

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

const addPermissionToRole = async (req, res) => {
  /*
  *   #swagger.tags = ['Security - Permission']
  *   #swagger.description = 'Add permission to role petition'
  *   #swagger.security = [{ "apiKeyAuth": [] }]
  *   #swagger.parameters['roleId'] = { in: 'path', description: 'Id of the role', required: true, type: 'string', default: '265edb78-4628-441a-91d2-7e3b02d4cae4' }
  *   #swagger.parameters['permissionId'] = { in: 'path', description: 'Id of the permission', required: true, type: 'string', default: '5f9f9f9f9f9f9f9f9f9f9f9f' }
  *   #swagger.parameters['allowed'] = { in: 'formData', description: 'Allowed to use permission: 0-Default, 1-Allowed, 2-Denied', type: 'int', default: 0, enum: [0, 1, 2] }
  */

  const data = req.body || {}
  data.roleId = req.params.roleId || null
  data.permissionId = req.params.permissionId || null

  const { dataParsed, validationErrors } = await validateParams(data, rolePermissionValidator)
  if (validationErrors) return res.status(400).json({ data: null, error: validationErrors })

  const roleId = dataParsed.roleId || null
  const permissionId = dataParsed.permissionId || null
  delete dataParsed.roleId
  delete dataParsed.permissionId

  const { result, error } = await rolePermissionModel.createOrUpdate(roleId, permissionId, dataParsed)
  if (error) return res.status(500).json({ data: null, error })

  res.setHeader('Content-Type', 'application/json')
  return res.status(200).json({ data: result, error: null })
}

const addPermissionToUser = async (req, res) => {
  /*
  *   #swagger.tags = ['Security - Permission']
  *   #swagger.description = 'Add permission to user petition'
  *   #swagger.security = [{ "apiKeyAuth": [] }]
  *   #swagger.parameters['userId'] = { in: 'path', description: 'Id of the user', required: true, type: 'string', default: '5f9f9f9f9f9f9f9f9f9f9f9f' }
  *   #swagger.parameters['permissionId'] = { in: 'path', description: 'Id of the permission', required: true, type: 'string', default: '439dbdea-7297-48c0-83c8-6a4f38e436b3' }
  *   #swagger.parameters['allowed'] = { in: 'formData', description: 'Allowed to use permission', required: false, type: 'boolean', default: true
  */

  const data = req.body || {}
  data.userId = req.params.userId || null
  data.permissionId = req.params.permissionId || null

  const { dataParsed, validationErrors } = await validateParams(data, userPermissionValidator)
  if (validationErrors) return res.status(400).json({ data: null, error: validationErrors })

  const userId = dataParsed.userId || null
  const permissionId = dataParsed.permissionId || null
  delete dataParsed.userId
  delete dataParsed.permissionId

  const { result, error } = await userPermissionModel.createOrUpdate(userId, permissionId, dataParsed)
  if (error) return res.status(500).json({ data: null, error })

  res.setHeader('Content-Type', 'application/json')
  return res.status(200).json({ data: result, error: null })
}

const getPermissionsByRole = async (req, res) => {
  /*
  *   #swagger.tags = ['Security - Permission']
  *   #swagger.description = 'Get permissions by role petition'
  *  #swagger.security = [{ "apiKeyAuth": [] }]
  *  #swagger.parameters['roleId'] = { in: 'path', description: 'Id of the role', required: true, type: 'string', default: '265edb78-4628-441a-91d2-7e3b02d4cae4' }
  */

  const roleId = req.params.roleId || null
  if (!roleId) return res.status(400).json({ data: null, error: 'MISSING_ID' })

  const { result, error } = await rolePermissionModel.getPermissionsByRole(roleId)
  if (error) return res.status(500).json({ data: null, error })

  res.setHeader('Content-Type', 'application/json')
  return res.status(200).json({ data: result, error: null })
}

const getPermissionsByUser = async (req, res) => {
  /*
  *   #swagger.tags = ['Security - Permission']
  *   #swagger.description = 'Get permissions by user petition'
  *   #swagger.security = [{ "apiKeyAuth": [] }]
  *   #swagger.parameters['userId'] = { in: 'path', description: 'Id of the user', required: true, type: 'string', default: '5f9f9f9f9f9f9f9f9f9f9f9f' }
  */

  const userId = req.params.userId || null
  if (!userId) return res.status(400).json({ data: null, error: 'MISSING_ID' })

  const { result, error } = await userPermissionModel.getPermissionsByUser(userId)
  if (error) return res.status(500).json({ data: null, error })

  res.setHeader('Content-Type', 'application/json')
  return res.status(200).json({ data: result, error: null })
}

module.exports = { getAll, get, create, update, remove, addPermissionToRole, addPermissionToUser, getPermissionsByRole, getPermissionsByUser }
