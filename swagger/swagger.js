const swaggerAutogen = require('swagger-autogen')()
const config = require('../config/config').server
const packageJson = require('../package.json')

const doc = {
  info: {
    version: packageJson.version,
    title: packageJson.name,
    description: `${packageJson.description}
            Author: <b>${packageJson.author.name} - ${packageJson.author.email}</b>
            Repo(Github): <b>${packageJson.repository.url}</b>`
  },
  host: `${config.externalUrl}`,
  basePath: '/',
  schemes: [config.protocol],
  consumes: ['application/json'],
  produces: ['application/json'],
  tags: [
    {
      name: 'Authentication',
      description: 'Authentication petitions'
    },
    {
      name: 'User',
      description: 'User petitions'
    },
    {
      name: 'Playground',
      description: 'Petitions for testing your frontend'
    }
  ],
  securityDefinitions: {
    apiKeyAuth: {
      type: 'apiKey',
      in: 'header', // can be "header", "query" or "cookie"
      name: 'x-access-token', // name of the header, query parameter or cookie
      description: 'Api key for authentication'
    }
  },
  definitions: {
    Test: {
      name: 'Test',
      description: 'Test description',
      anyNumber: 99,
      anyBoolean: true,
      anyString: 'any string',
      anyArray: [1, 2, 3]
    },
    AddTest: {
      $name: 'Test add',
      $description: 'Test description adding',
      $anyNumber: 66,
      $anyBoolean: false,
      $anyString: 'any string',
      $anyArray: [4, 5, 6]
    }
  }
}

const outputFile = './swagger/swagger-output.json'
const endpointsFiles = ['./src/core/core.js']

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  require('../app.js') // Your project's root file
})
