const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const getAll = async () => {
  try {
    const permissions = await prisma.permission.findMany()
    return { result: permissions, error: null }
  } catch (err) {
    console.error(err)
    return { result: null, error: 'ERROR_GETTING_PERMISSIONS' }
  }
}

const get = async (id) => {
  try {
    const permission = await prisma.permission.findUnique({
      where: { id }
    })
    if (!permission) return { result: null, error: 'PERMISSION_NOT_FOUND' }
    return { result: permission, error: null }
  } catch (err) {
    console.error(err)
    return { result: null, error: 'ERROR_GETTING_PERMISSION' }
  }
}

const create = async (data) => {
  try {
    const permission = await prisma.permission.create({
      data
    })
    if (!permission) return { result: null, error: 'PERMISSION_NOT_CREATED' }

    return { result: permission, error: null }
  } catch (error) {
    console.error(error)
    return { result: null, error: 'ERROR_CREATING_PERMISSION' }
  }
}

const update = async (id, data) => {
  try {
    const permissionUpdated = await prisma.permission.update({
      where: { id },
      data
    })
    if (!permissionUpdated) return { result: null, error: 'PERMISSION_NOT_UPDATED' }

    return { result: permissionUpdated, error: null }
  } catch (err) {
    console.error(err)
    return { result: null, error: 'ERROR_UPDATING_PERMISSION' }
  }
}

const remove = async (id) => {
  try {
    const permissionDeleted = await prisma.permission.delete({
      where: { id }
    })
    if (!permissionDeleted) return { result: null, error: 'PERMISSION_NOT_DELETED' }
    return { result: permissionDeleted, error: null }
  } catch (err) {
    console.error(err)
    return { result: null, error: 'ERROR_DELETING_PERMISSION' }
  }
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
