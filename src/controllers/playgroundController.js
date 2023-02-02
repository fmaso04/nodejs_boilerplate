
const get = async (req, res) => {
  /*
  *   #swagger.tags = ['Playground']
  *   #swagger.description = 'Test get petition'
  */

  res.setHeader('Content-Type', 'application/json')
  return res.status(200).send({ msg: 'TEST GET PETITION!', values: [1, 2, 3, 4, 5] })
}

const getById = async (req, res) => {
  /*
  *   #swagger.tags = ['Playground']
  *   #swagger.description = 'Test get petition by id'
  */

  res.setHeader('Content-Type', 'application/json')
  return res.status(200).send({ msg: 'TEST GET PETITION!', id: req.params.id, values: [1, 2, 3, 4, 5] })
}

const saveJson = async (req, res) => {
  /*
  *   #swagger.tags = ['Playground']
  *   #swagger.description = 'Test save petition, returns the body content'
  *   #swagger.consume = 'application/json'
  *   #swagger.parameters['data'] = { in: 'body', description: 'Test data.', required: true, schema: { $ref: "#/definitions/AddTest" } }
  */

  const tools = req.body || {}
  return res.status(201).send(tools)
}

const saveFormData = async (req, res) => {
  /*
  *   #swagger.tags = ['Playground']
  *   #swagger.description = 'Test save petition, returns the body content and the name of the file'
  *   #swagger.consumes = ['multipart/form-data']
  *   #swagger.parameters['Name'] = { in: 'formData', description: 'Test data name.', required: true }
  *   #swagger.parameters['Description'] = { in: 'formData', description: 'Test data description.', required: true }
  *   #swagger.parameters['AnyNumber'] = { in: 'formData', description: 'Test data number.', required: true, type: 'number' }
  *   #swagger.parameters['AnyBoolean'] = { in: 'formData', description: 'Test data boolean.', required: true, type: 'boolean' }
  *   #swagger.parameters['file'] = { in: 'formData', description: 'Test data file.', required: false, type: 'file' }
  */

  const data = req.body || {}
  data.file = req.file.originalname
  return res.status(201).send(data)
}

const saveXWwwFormUrlencoded = async (req, res) => {
  /*
  *   #swagger.tags = ['Playground']
  *   #swagger.description = 'Test save petition, returns the body content'
  *   #swagger.consumes = ['application/x-www-form-urlencoded']
  *   #swagger.parameters['Name'] = { in: 'formData', description: 'Test data name.', required: true }
  *   #swagger.parameters['Description'] = { in: 'formData', description: 'Test data description.', required: true }
  *   #swagger.parameters['AnyNumber'] = { in: 'formData', description: 'Test data number.', required: true, type: 'number' }
  *   #swagger.parameters['AnyBoolean'] = { in: 'formData', description: 'Test data boolean.', required: true, type: 'boolean' }
  */

  const data = req.body || {}
  return res.status(201).send(data)
}

const update = async (req, res) => {
  /*
  *   #swagger.tags = ['Playground']
  *   #swagger.description = 'Test save petition, returns the body content and the name of the file'
  *   #swagger.consumes = ['application/x-www-form-urlencoded']
  *   #swagger.parameters['Name'] = { in: 'formData', description: 'Test data name.', required: true }
  *   #swagger.parameters['Description'] = { in: 'formData', description: 'Test data description.', required: true }
  *   #swagger.parameters['AnyNumber'] = { in: 'formData', description: 'Test data number.', required: true, type: 'number' }
  *   #swagger.parameters['AnyBoolean'] = { in: 'formData', description: 'Test data boolean.', required: true, type: 'boolean' }
  */

  const data = req.body || {}
  data.id = req.params.id
  return res.status(200).send(data)
}

const remove = async (req, res) => {
  /*
  *   #swagger.tags = ['Playground']
  *   #swagger.description = 'Test delete petition'
  */

  return res.status(200).send({ msg: `DELETE ROW: ${req.params.id}` })
}

const failPetition = async (req, res) => {
  /*
  *   #swagger.tags = ['Playground']
  *   #swagger.description = 'Test fail petition'
  */

  return res.status(500).send({ msg: 'FAIL PETITION' })
}

module.exports = { get, getById, saveJson, saveFormData, saveXWwwFormUrlencoded, update, remove, failPetition }
