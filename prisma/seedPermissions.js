const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const rolePermissions = `                                    admin | superuser |   user  
User#GET_USERS#List all users                              |  o    |     o     |     x
User#CREATE_USER#Create a user                             |  o    |     o     |     x
User#GET_USER#Get a user                                   |  o    |     o     |     x
User#UPDATE_USER#Update a user                             |  o    |     o     |     x
User#DELETE_USER#Delete a user                             |  o    |     o     |     x
Security#GET_MODULES#List modules                          |  o    |     o     |     x
Security#GET_MODULE#Get a module                           |  o    |     o     |     x
Security#CREATE_MODULE#Create a module                     |  o    |     x     |     x
Security#UPDATE_MODULE#Update a module                     |  o    |     x     |     x
Security#DELETE_MODULE#Delete a module                     |  o    |     x     |     x
Security#GET_ROLES#List roles                              |  o    |     o     |     x
Security#GET_ROLE#Get a role                               |  o    |     o     |     x
Security#CREATE_ROLE#Create a role                         |  o    |     x     |     x
Security#UPDATE_ROLE#Update a role                         |  o    |     x     |     x
Security#DELETE_ROLE#Delete a role                         |  o    |     x     |     x
Security#GET_PERMISSIONS#List permissions                  |  o    |     o     |     x
Security#GET_PERMISSION#Get a permission                   |  o    |     o     |     x
Security#CREATE_PERMISSION#Create a permission             |  o    |     x     |     x
Security#UPDATE_PERMISSION#Update a permission             |  o    |     x     |     x
Security#DELETE_PERMISSION#Delete a permission             |  o    |     x     |     x
Security#ADD_PERMISSION_TO_ROLE#Add a permission to a role |  o    |     x     |     x
Security#ADD_PERMISSION_TO_USER#Add a permission to a user |  o    |     x     |     x
Security#GET_PERMISSIONS_BY_ROLE#List permissions by role  |  o    |     x     |     x
Security#GET_PERMISSIONS_BY_USER#List permissions by user  |  o    |     x     |     x
Profile#GET_PROFILE#Get profile                            |  o    |     o     |     o
Profile#GET_TOKEN_PROFILE#Get token                        |  o    |     o     |     o
Profile#UPDATE_PROFILE#Update profile                      |  o    |     o     |     o
Profile#UPDATE_PASSWORD_PROFILE#Update password            |  o    |     o     |     o
Profile#UPDATE_AVATAR_PROFILE#Update avatar                |  o    |     o     |     o`

const processRolePermissions = async () => {
  const lines = rolePermissions.split('\n')
  const roles = lines[0].split('|').map(s => s.trim())
  const permissions = lines.slice(1).map(line => {
    const [permission, ...rest] = line.split('|').map(s => s.trim())
    const [module, permissionCode, permissionDescription] = permission.split('#')
    return { module, permissionCode, permissionDescription, permissions: rest }
  })
  const rolesParsed = []
  for (const key in roles) {
    const role = roles[key]
    const roleRes = await prisma.role.findUnique({ where: { name: role } })
    if (!roleRes) {
      console.error(`Role ${role} not found`)
      continue
    }

    rolesParsed[key] = { name: role, id: roleRes.id }
  }

  const modulesParsed = []
  for (const permission of permissions) {
    const { module, permissionCode, permissionDescription, permissions } = permission
    if (!modulesParsed[module]) {
      const moduleRes = await prisma.module.findUnique({ where: { name: module } })
      if (!moduleRes) {
        console.error(`Module ${module} not found`)
        continue
      }
      modulesParsed[module] = { name: module, id: moduleRes.id }
    }

    const moduleParsed = modulesParsed[module]

    let permissionRes = await prisma.permission.findUnique({ where: { code: permissionCode } })
    if (!permissionRes) {
      permissionRes = await prisma.permission.create({
        data: {
          code: permissionCode,
          description: permissionDescription,
          moduleId: moduleParsed.id
        }
      })
    }

    if (!permissionRes) {
      console.error(`Permission ${permissionCode} not found and could not be created`)
      continue
    }

    for (const key in permissions) {
      const permissionRole = permissions[key]
      const role = rolesParsed[key]
      const allowed = permissionRole ? (permissionRole === 'o' ? 1 : 2) : 0
      const rolePermissionRes = await prisma.rolePermission.findUnique({
        where: {
          rolePermissionIds: { roleId: role.id, permissionId: permissionRes.id }
        }
      })
      if (!rolePermissionRes) {
        await prisma.rolePermission.create({
          data: {
            roleId: role.id,
            permissionId: permissionRes.id,
            allowed
          }
        })
      } else {
        await prisma.rolePermission.update({
          where: {
            rolePermissionIds: { roleId: role.id, permissionId: permissionRes.id }
          },
          data: {
            allowed
          }
        })
      }
    }
  }

  console.log('roles', roles)
  console.log('permissions', permissions)
}

const seedPermissions = async () => {
  await processRolePermissions()
}

module.exports = seedPermissions
