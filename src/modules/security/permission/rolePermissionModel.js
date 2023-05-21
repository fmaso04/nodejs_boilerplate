const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const { authorizationTypes } = require('../../../const/authorizationTypes')

const getAll = async () => {
  try {
    const rolePermissions = await prisma.rolePermission.findMany()
    return { result: rolePermissions, error: null }
  } catch (err) {
    console.error(err)
    return { result: null, error: 'ERROR_GETTING_ROLE_PERMISSIONS' }
  }
}

const get = async (roleId, permissionId) => {
  try {
    const rolePermission = await prisma.rolePermission.findUnique({
      where: { rolePermissionIds: { roleId, permissionId } }
    })
    if (!rolePermission) return { result: null, error: 'ROLE_PERMISSION_NOT_FOUND' }
    return { result: rolePermission, error: null }
  } catch (err) {
    console.error(err)
    return { result: null, error: 'ERROR_GETTING_ROLE_PERMISSION' }
  }
}

const createOrUpdate = async (roleId, permissionId, data) => {
  const search = { rolePermissionIds: { roleId, permissionId } }
  const exists = await existsRolePermission(search)
  console.log(exists)
  if (exists.error) return { result: null, error: exists.error }
  if (exists.result) {
    return await update(roleId, permissionId, data)
  } else {
    data.roleId = roleId
    data.permissionId = permissionId
    return await create(data)
  }
}

const create = async (data) => {
  if (data.allowed === undefined) data.allowed = true
  try {
    const rolePermission = await prisma.rolePermission.create({
      data
    })
    if (!rolePermission) return { result: null, error: 'ROLE_PERMISSION_NOT_CREATED' }

    return { result: rolePermission, error: null }
  } catch (error) {
    console.error(error)
    return { result: null, error: 'ERROR_CREATING_ROLE_PERMISSION' }
  }
}

const update = async (roleId, permissionId, data) => {
  try {
    const rolePermissionUpdated = await prisma.rolePermission.update({
      where: { rolePermissionIds: { roleId, permissionId } },
      data
    })
    if (!rolePermissionUpdated) return { result: null, error: 'ROLE_PERMISSION_NOT_UPDATED' }

    return { result: rolePermissionUpdated, error: null }
  } catch (err) {
    console.error(err)
    return { result: null, error: 'ERROR_UPDATING_ROLE_PERMISSION' }
  }
}

const remove = async (roleId, permissionId) => {
  try {
    const rolePermission = await prisma.rolePermission.delete({
      where: { rolePermissionIds: { roleId, permissionId } }
    })
    if (!rolePermission) return { result: null, error: 'ROLE_PERMISSION_NOT_DELETED' }
    return { result: rolePermission, error: null }
  } catch (err) {
    console.error(err)
    return { result: null, error: 'ERROR_DELETING_ROLE_PERMISSION' }
  }
}

const existsRolePermission = async (data) => {
  try {
    const rolePermission = await prisma.rolePermission.findUnique({
      where: data
    })
    if (!rolePermission || rolePermission.length === 0) return { result: false, error: null }
    return { result: true, error: null }
  } catch (err) {
    console.error(err)
    return { result: null, error: 'ERROR_GETTING_ROLE_PERMISSION' }
  }
}

const checkRolePermission = async (roleId, permissionId) => {
  try {
    const exists = await existsRolePermission({ rolePermissionIds: { roleId, permissionId } })
    if (exists.error) return { result: null, error: exists.error }

    if (!exists.result) return { result: authorizationTypes.DEFAULT, error: null }

    const rolePermission = await get(roleId, permissionId)
    if (!rolePermission.result) return { result: null, error: rolePermission.error }
    return { result: rolePermission.result.allowed, error: null }
  } catch (err) {
    console.error(err)
    return { result: null, error: 'ERROR_CHECKING_ROLE_PERMISSION' }
  }
}

const getRolePermissionByRoleId = async (roleId) => {
  try {
    const rolePermissions = await prisma.rolePermission.findMany({
      where: { roleId }
    })
    if (!rolePermissions) return { result: null, error: 'ROLE_PERMISSION_NOT_FOUND' }
    return { result: rolePermissions, error: null }
  } catch (err) {
    console.error(err)
    return { result: null, error: 'ERROR_GETTING_ROLE_PERMISSION' }
  }
}

module.exports = {
  getAll,
  get,
  createOrUpdate,
  remove,
  existsRolePermission,
  checkRolePermission,
  getRolePermissionByRoleId
}
