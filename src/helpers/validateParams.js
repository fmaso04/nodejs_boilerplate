const Validator = require('validatorjs')
const parse = ['boolean', 'numeric', 'integer', 'date']

const validateParams = async (params, validators) => {
  parseRegisters(validators)
  parseParams(params, validators)
  const validation = new Validator(params, validators)
  const result = await new Promise((resolve) => {
    validation.checkAsync(
      () => { resolve(true) },
      () => { resolve(false) }
    )
  })

  if (!result) { return { dataParsed: null, validationErrors: await validation.errors.all() } }
  return { dataParsed: params, validationErrors: null }
}

const parseRegisters = (validators) => {
  if (!validators.registers) return validators
  for (const register of validators.registers) {
    if (register.field) {
      validators[register.field] += validators[register.field] ? '|' : ''
      validators[register.field] += register.name

      Validator.registerAsync(register.name, function (data, attribute, req, passes) {
        register.func(data).then((result) => {
          passes(result)
        })
      }, register.message)
    }
  }
  delete validators.registers
}

const parseParams = (params, validators) => {
  for (const index in params) {
    const rule = validators[index]
    if (!rule) break
    const parseRule = parse.find((item) => rule.includes(item))
    if (parseRule) {
      params[index] = parseValue(params[index], parseRule)
    }
  }
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
      return value
  }
}

module.exports = validateParams
