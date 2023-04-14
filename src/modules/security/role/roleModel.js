const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const getAll = async () => {
  const roles = await prisma.role.findMany()
  return { result: roles, error: null }
}

const get = async (id) => {
  const role = await prisma.role.findUnique({
    where: { id }
  })
  return { result: role, error: null }
}

const create = async (data) => {
  const roleCreated = await prisma.role.create({
    data
  })
  return { result: roleCreated, error: null }
}

const update = async (id, data) => {
  const roleUpdated = await prisma.role.update({
    where: { id },
    data
  })
  return { result: roleUpdated, error: null }
}

const remove = async (id) => {
  const roleDeleted = await prisma.role.delete({
    where: { id }
  })
  return { result: roleDeleted, error: null }
}

const existsRole = async (data) => {
  try {
    const role = await prisma.role.findMany({
      where: data
    })
    if (!role || role.length === 0) return { result: false, error: null }
    return { result: true, error: null }
  } catch (err) {
    console.error(err)
    return { result: null, error: 'ERROR_GETTING_ROLE' }
  }
}

module.exports = {
  getAll,
  get,
  create,
  update,
  remove,
  existsRole
}
