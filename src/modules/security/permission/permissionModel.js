const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const getAll = async () => {
  const permissions = await prisma.permission.findMany()
  return { result: permissions, error: null }
}

const get = async (id) => {
  const permission = await prisma.permission.findUnique({
    where: { id }
  })
  return { result: permission, error: null }
}

const create = async (data) => {
  const permissionCreated = await prisma.permission.create({ data })
  return { result: permissionCreated, error: null }
}

const update = async (id, data) => {
  const permissionUpdated = await prisma.permission.update({
    where: { id },
    data
  })
  return { result: permissionUpdated, error: null }
}

const remove = async (id) => {
  const permissionDeleted = await prisma.permission.delete({
    where: { id }
  })
  return { result: permissionDeleted, error: null }
}

const existsPermission = async (data) => {
  try {
    const permission = await prisma.permission.findMany({
      where: data
    })
    if (!permission || permission.length === 0) return { result: false, error: null }
    return { result: true, error: null }
  } catch (err) {
    console.error(err)
    return { result: null, error: 'ERROR_GETTING_PERMISSION' }
  }
}

module.exports = {
  getAll,
  get,
  create,
  update,
  remove,
  existsPermission
}
