const packageJson = require('../../package.json')
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('../../swagger/swagger-output.json')
const express = require('express')
const config = require('../../config/config')
const bodyParser = require('body-parser')
const { corsProtection } = require('./corsProtection')

/* Routes */
const router = require('../routes/routes')
const consoleColors = require('../const/consoleColors')

exports.start = () => {
  const app = express()
  // support json encoded bodies
  app.use(bodyParser.json())

  // support encoded bodies
  app.use(bodyParser.urlencoded({ extended: true }))

  // support raw encoded bodies
  app.use(bodyParser.raw())

  app.use(corsProtection)

  app.use(router)
  if (config.swagger.active) {
    app.use(`/${config.swagger.url}`, swaggerUi.serve, swaggerUi.setup(swaggerFile))
  }

  app.listen(config.server.port, () => {
    console.log('')
    console.log(consoleColors.Reset, consoleColors.FgBlack, consoleColors.BgBlue,
      '======================================', consoleColors.Reset, '\n', consoleColors.FgBlack, consoleColors.BgBlue,
      `=== Server is running at port ${config.server.port} ===`, consoleColors.Reset, '\n', consoleColors.FgBlack, consoleColors.BgBlue,
      '======================================', consoleColors.Reset, '\n')
    console.log(consoleColors.FgYellow, 'Version:         ', consoleColors.FgGreen, packageJson.version, consoleColors.Reset)
    console.log(consoleColors.FgYellow, 'Environment:     ', consoleColors.FgGreen, config.environment, consoleColors.Reset)
    console.log(consoleColors.FgYellow, `API:               ${config.server.protocol}://${config.server.externalUrl}`, consoleColors.Reset)
    if (config.swagger.active) {
      console.log(consoleColors.FgYellow, `API documentation: ${config.server.protocol}://${config.server.externalUrl}/${config.swagger.url}`, consoleColors.Reset)
    }
    console.log('')
  })
}
