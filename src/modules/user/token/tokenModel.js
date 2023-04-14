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

module.exports = { create, validateTokenByIdUser }
