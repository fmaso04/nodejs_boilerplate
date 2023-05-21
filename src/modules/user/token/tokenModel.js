const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const create = async (data) => {
  try {
    const token = await prisma.token.create({ data })
    if (!token) return { result: null, error: 'TOKEN_NOT_CREATED' }
    return { result: token, error: null }
  } catch (error) {
    console.error(error)
    return { result: null, error: 'ERROR_CREATING_TOKEN' }
  }
}

const getByParams = async (params) => {
  try {
    const token = await prisma.token.findFirst({ where: params })
    if (!token) return { result: null, error: 'TOKEN_NOT_FOUND' }
    return { result: token, error: null }
  } catch (error) {
    console.error(error)
    return { result: null, error: 'ERROR_GETTING_TOKEN' }
  }
}

const update = async (id, data) => {
  try {
    const token = await prisma.token.update({
      where: { id },
      data
    })
    if (!token) return { result: null, error: 'TOKEN_NOT_UPDATED' }
    return { result: token, error: null }
  } catch (err) {
    console.error(err)
    return { result: null, error: 'ERROR_UPDATING_TOKEN' }
  }
}

const remove = async (id) => {
  try {
    const token = await prisma.token.delete({ where: { id } })
    console.log(token)
    if (!token) return { result: null, error: 'TOKEN_NOT_DELETED' }
    return { result: token, error: null }
  } catch (err) {
    console.error(err)
    return { result: null, error: 'ERROR_DELETING_TOKEN' }
  }
}

const validateTokenByIdUser = async (tokenStr, userId) => {
  try {
    // prisma get token by token and userId
    const token = await prisma.token.findFirst({
      where: {
        token: tokenStr,
        userId
      },
      include: {
        user: {
          include: {
            role: true
          }
        }
      }
    })
    if (!token) return { result: null, error: 'TOKEN_NOT_FOUND' }
    return { result: token, error: null }
  } catch (error) {
    console.error(error)
    return { result: null, error: 'ERROR_VALIDATING_TOKEN' }
  }
}

module.exports = { create, getByParams, update, remove, validateTokenByIdUser }
