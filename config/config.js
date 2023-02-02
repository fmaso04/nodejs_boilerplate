const env = 'development'

if (env === 'development') { module.exports = require('./config-dev') } else if (env === 'production') { module.exports = require('./config-prod') }
