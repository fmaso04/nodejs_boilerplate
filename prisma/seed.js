const seedDefault = require('./seedDefault')
const seedPermissions = require('./seedPermissions')

const seedRoles = async () => {
  await seedDefault()
  await seedPermissions()
}

seedRoles()
