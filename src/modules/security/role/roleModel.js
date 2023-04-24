const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const getAll = async () => {
  try {
    const roles = await prisma.role.findMany()
    return { result: roles, error: null }
  } catch (err) {
    console.error(err)
    return { result: null, error: 'ERROR_GETTING_ROLES' }
  }
}

const get = async (id) => {
  try {
    const role = await prisma.role.findUnique({
      where: { id }
    })
    if (!role) return { result: null, error: 'ROLE_NOT_FOUND' }
    return { result: role, error: null }
  } catch (err) {
    console.error(err)
    return { result: null, error: 'ERROR_GETTING_ROLE' }
  }
}

const create = async (data) => {
  try {
    const role = await prisma.role.create({
      data
    })
    if (!role) return { result: null, error: 'USER_NOT_CREATED' }

    return { result: role, error: null }
  } catch (error) {
    console.error(error)
    return { result: null, error: 'ERROR_CREATING_ROLE' }
  }
}

const update = async (id, data) => {
  try {
    const roleUpdated = await prisma.role.update({
      where: { id },
      data
    })
    if (!roleUpdated) return { result: null, error: 'ROLE_NOT_UPDATED' }

    return { result: roleUpdated, error: null }
  } catch (err) {
    console.error(err)
    return { result: null, error: 'ERROR_UPDATING_ROLE' }
  }
}

const remove = async (id) => {
  try {
    const role = await prisma.role.delete({
      where: { id }
    })
    if (!role) return { result: null, error: 'ROLE_NOT_DELETED' }
    return { result: role, error: null }
  } catch (err) {
    console.error(err)
    return { result: null, error: 'ERROR_DELETING_ROLE' }
  }
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
