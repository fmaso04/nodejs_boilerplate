const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const authorizationTypes = require('../../../const/authorizationTypes')

const getAll = async () => {
  try {
    const users = await prisma.userPermission.findMany()
    return { result: users, error: null }
  } catch (err) {
    console.error(err)
    return { result: null, error: 'ERROR_GETTING_USERS' }
  }
}

const get = async (id) => {
  try {
    const userPermission = await prisma.userPermission.findUnique({
      where: { id }
    })
    if (!userPermission) return { result: null, error: 'USER_NOT_FOUND' }
    return { result: userPermission, error: null }
  } catch (err) {
    console.error(err)
    return { result: null, error: 'ERROR_GETTING_USER' }
  }
}

const createOrUpdate = async (userId, permissionId, data) => {
  const search = { userPermissionIds: { userId, permissionId } }
  const exists = await existsUserPermission(search)
  console.log(exists)
  if (exists.error) return { result: null, error: exists.error }
  if (exists.result) {
    return await update(userId, permissionId, data)
  } else {
    data.userId = userId
    data.permissionId = permissionId
    return await create(data)
  }
}

const create = async (data) => {
  if (data.allowed === undefined) data.allowed = true
  try {
    const userPermission = await prisma.userPermission.create({
      data
    })
    if (!userPermission) return { result: null, error: 'USER_NOT_CREATED' }

    return { result: userPermission, error: null }
  } catch (error) {
    console.error(error)
    return { result: null, error: 'ERROR_CREATING_USER' }
  }
}

const update = async (userId, permissionId, data) => {
  try {
    const userPermissionUpdated = await prisma.userPermission.update({
      where: { userPermissionIds: { userId, permissionId } },
      data
    })
    if (!userPermissionUpdated) return { result: null, error: 'USER_PERMISSION_NOT_UPDATED' }

    return { result: userPermissionUpdated, error: null }
  } catch (err) {
    console.error(err)
    return { result: null, error: 'ERROR_UPDATING_USER' }
  }
}

const remove = async (userId, permissionId) => {
  try {
    const userPermission = await prisma.userPermission.delete({
      where: { userPermissionIds: { userId, permissionId } }
    })
    if (!userPermission) return { result: null, error: 'USER_PERMISSION_NOT_DELETED' }
    return { result: userPermission, error: null }
  } catch (err) {
    console.error(err)
    return { result: null, error: 'ERROR_DELETING_USER' }
  }
}

const existsUserPermission = async (data) => {
  try {
    console.log(data)
    const userPermission = await prisma.userPermission.findUnique({
      where: data
    })
    if (!userPermission || userPermission.length === 0) return { result: false, error: null }
    return { result: true, error: null }
  } catch (err) {
    console.error(err)
    return { result: null, error: 'ERROR_GETTING_USER_PERMISSION' }
  }
}

const checkUserPermission = async (userId, permissionId) => {
  try {
    const exists = await existsUserPermission({ userPermissionIds: { userId, permissionId } })
    if (exists.error) return { result: null, error: exists.error }
    console.log(authorizationTypes)
    if (!exists.result) return { result: authorizationTypes.DEFAULT, error: null }

    const userPermission = await get(userId, permissionId)
    if (!userPermission.result) return { result: null, error: userPermission.error }
    return { result: userPermission.result.allowed, error: null }
  } catch (err) {
    console.error(err)
    return { result: null, error: 'ERROR_CHECKING_ROLE_PERMISSION' }
  }
}

module.exports = {
  getAll,
  get,
  createOrUpdate,
  remove,
  existsUserPermission,
  checkUserPermission
}
