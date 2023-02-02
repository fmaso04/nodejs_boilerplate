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

(async function () {
  await seedRoles()
  await seedUsers()
}())
