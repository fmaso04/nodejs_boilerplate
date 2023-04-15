const Validator = require('validatorjs')
const parse = ['boolean', 'numeric', 'integer', 'date']

const validateParams = async (params, validators) => {
  parseRegisters(params, validators)
  const parsedParams = parseParams(params, validators)
  const validation = new Validator(parsedParams, validators)
  const result = await new Promise((resolve) => {
    validation.checkAsync(
      () => { resolve(true) },
      () => { resolve(false) }
    )
  })

  if (!result) { return { dataParsed: null, validationErrors: await validation.errors.all() } }
  return { dataParsed: parsedParams, validationErrors: null }
}

const parseRegisters = (params, validators) => {
  if (!validators.registers) return validators
  for (const register of validators.registers) {
    if (register.field) {
      validators[register.field] += validators[register.field] ? '|' : ''
      validators[register.field] += register.name
      const registerParams = register.params
        ? register.params.map((param) => {
          return { [param]: params[param] }
        })
        : {}
      const registerFunc = (data, attribute, req, passes) => {
        if (registerParams.length > 0) {
          register.func(data, registerParams).then((result) => {
            passes(result)
          })
        } else {
          try {
            register.func(data).then((result) => {
              passes(result)
            })
          } catch (err) {
            console.error(err)
            console.error(`Error in register function ${register.name} in ${register.field} field`)
            console.error(err, data)
            passes(false)
          }
        }
      }

      Validator.registerAsync(register.name, registerFunc, register.message)
    }
  }
}

const parseParams = (params, validators) => {
  const parsedParams = {}
  for (const index in params) {
    const rule = validators[index]
    if (rule) {
      const parseRule = parse.find((item) => rule.includes(item))
      parsedParams[index] = parseValue(params[index], parseRule)
    }
  }
  return parsedParams
}

const parseValue = (value, type) => {
  switch (type) {
    case 'boolean':
      return value === true || value === 'true' || value === '1'
    case 'numeric' || 'integer':
      return +value
    case 'date':
      return new Date(value)
    default:
      return value + ''
  }
}

module.exports = validateParams
