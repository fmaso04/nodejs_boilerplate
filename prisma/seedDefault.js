const bcrypt = require('bcrypt')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const seedRoles = async () => {
  console.log('Seeding roles...')
  const res = await prisma.role.createMany({
    data: [
      { id: '50584c04-8d54-4fe0-bb25-93486c5aaaeb', name: 'admin', priorityOrder: 1 },
      { id: '7d2c7154-132d-4d4d-b8f0-0701d55a4026', name: 'superuser', priorityOrder: 2 },
      { id: '265edb78-4628-441a-91d2-7e3b02d4cae4', name: 'user', priorityOrder: 3 }
    ]
  })

  if (!res) console.error('Error seeding roles', res)
  else console.log('Roles seeded: ', res)
}

const seedUsers = async () => {
  console.log('Seeding users...')
  const res = await prisma.user.createMany({
    data: [
      {
        name: 'Admin',
        email: 'admin@ferranmaso.com',
        password: await bcrypt.hash('12341234', 10),
        roleId: '50584c04-8d54-4fe0-bb25-93486c5aaaeb',
        username: 'admin'
      }
    ]
  })
  if (!res) console.error('Error seeding users', res)
  console.log('Users seeded: ', res)
}

const seedModules = async () => {
  console.log('Seeding modules...')
  const res = await prisma.module.createMany({
    data: [
      {
        id: '1dca2c88-37a3-46cc-a4e4-2ca7b25d93a7',
        name: 'Security'
      },
      {
        id: '439dbdea-7297-48c0-83c8-6a4f38e436b3',
        name: 'User'
      },
      {
        id: 'c74a181a-43dc-4ef1-bbc6-b93b3b25b8ad',
        name: 'Playground'
      },
      {
        id: '589fe6b0-0519-4eb3-a055-2e34947e3d4a',
        name: 'Dashboard'
      },
      {
        id: 'c2b0b0a0-0b0b-4b0b-8b0b-0b0b0b0b0b0b',
        name: 'Profile'
      }
    ]
  })
  if (!res) console.error('Error seeding users', res)
  console.log('Modules seeded: ', res)
}

const seedPermissions = async () => {
  console.log('Seeding permissions...')
  const res = await prisma.permission.createMany({
    data: [
      {
        code: 'LIST_USERS',
        description: 'List users',
        moduleId: '439dbdea-7297-48c0-83c8-6a4f38e436b3'
      },
      {
        code: 'CREATE_USER',
        description: 'Create user',
        moduleId: '439dbdea-7297-48c0-83c8-6a4f38e436b3'
      },
      {
        code: 'GET_USER',
        description: 'Get user',
        moduleId: '439dbdea-7297-48c0-83c8-6a4f38e436b3'
      },
      {
        code: 'UPDATE_USER',
        description: 'Update user',
        moduleId: '439dbdea-7297-48c0-83c8-6a4f38e436b3'
      },
      {
        code: 'DELETE_USER',
        description: 'Delete user',
        moduleId: '439dbdea-7297-48c0-83c8-6a4f38e436b3'
      }
    ]
  })
  if (!res) console.error('Error seeding users', res)
  console.log('Permissions seeded: ', res)
}

const seedDefault = async () => {
  await seedRoles()
  await seedUsers()
  await seedModules()
  await seedPermissions()
}

module.exports = seedDefault
