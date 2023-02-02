exports.environment = 'production'

exports.server = {
  port: 3000,
  hostname: 'localhost',
  protocol: 'http',
  externalUrl: 'localhost:3000',
  uploadFolder: 'public/uploads/'
}

exports.token = {
  expirationToken: 365,
  expirationUnit: 'd', // d: days, h: hours, m: minutes, s: seconds
  expirationUnitLong: 'days' // days, hours, minutes, seconds
}

exports.swagger = {
  active: false
}
