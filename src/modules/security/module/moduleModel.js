const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const getAll = async () => {
  try {
    const modules = await prisma.module.findMany()
    return { result: modules, error: null }
  } catch (err) {
    console.error(err)
    return { result: null, error: 'ERROR_GETTING_MODULES' }
  }
}

const get = async (id) => {
  try {
    const module = await prisma.module.findUnique({
      where: { id }
    })
    if (!module) return { result: null, error: 'MODULE_NOT_FOUND' }
    return { result: module, error: null }
  } catch (err) {
    console.error(err)
    return { result: null, error: 'ERROR_GETTING_MODULE' }
  }
}

const create = async (data) => {
  try {
    const module = await prisma.module.create({
      data
    })
    if (!module) return { result: null, error: 'MODULE_NOT_CREATED' }

    return { result: module, error: null }
  } catch (error) {
    console.error(error)
    return { result: null, error: 'ERROR_CREATING_MODULE' }
  }
}

const update = async (id, data) => {
  try {
    const moduleUpdated = await prisma.module.update({
      where: { id },
      data
    })
    if (!moduleUpdated) return { result: null, error: 'MODULE_NOT_UPDATED' }

    return { result: moduleUpdated, error: null }
  } catch (err) {
    console.error(err)
    return { result: null, error: 'ERROR_UPDATING_MODULE' }
  }
}

const remove = async (id) => {
  try {
    const module = await prisma.module.delete({
      where: { id }
    })
    if (!module) return { result: null, error: 'MODULE_NOT_DELETED' }
    return { result: module, error: null }
  } catch (err) {
    console.error(err)
    return { result: null, error: 'ERROR_DELETING_MODULE' }
  }
}

const existsModule = async (data) => {
  try {
    const module = await prisma.module.findMany({
      where: data
    })
    if (!module || module.length === 0) return { result: false, error: null }
    return { result: true, error: null }
  } catch (err) {
    console.error(err)
    return { result: null, error: 'ERROR_GETTING_MODULE' }
  }
}

module.exports = {
  getAll,
  get,
  create,
  update,
  remove,
  existsModule
}
