const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')
const prisma = new PrismaClient()
const { saveFile, deleteFile } = require('../../helpers/fileManager')

const getAll = async () => {
  try {
    const users = await prisma.user.findMany()
    delete users.password
    return { result: users, error: null }
  } catch (err) {
    console.error(err)
    return { result: null, error: 'ERROR_GETTING_USERS' }
  }
}

const get = async (id) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { config: true, role: true }
    })
    if (!user) return { result: null, error: 'USER_NOT_FOUND' }
    delete user.password
    return { result: user, error: null }
  } catch (err) {
    console.error(err)
    return { result: null, error: 'ERROR_GETTING_USER' }
  }
}

const create = async (data) => {
  try {
    const user = await prisma.user.create({ data })
    if (!user) return { result: null, error: 'USER_NOT_CREATED' }
    delete user.password
    return { result: user, error: null }
  } catch (error) {
    console.error(error)
    return { result: null, error: 'ERROR_CREATING_USER' }
  }
}

const createWithAvatar = async (data, avatar) => {
  try {
    const user = await prisma.user.create({ data })
    if (!user) return { result: null, error: 'USER_NOT_CREATED' }
    delete user.password

    const { result, error } = await updateAvatar(user.id, avatar)
    if (!result) return { result: null, error }
    user.avatar = result

    return { result: user, error: null }
  } catch (error) {
    console.error(error)
    return { result: null, error: 'ERROR_CREATING_USER' }
  }
}

const update = async (id, data) => {
  try {
    const user = await prisma.user.update({
      where: { id },
      data
    })
    if (!user) return { result: null, error: 'USER_NOT_UPDATED' }
    delete user.password
    return { result: user, error: null }
  } catch (err) {
    console.error(err)
    return { result: null, error: 'ERROR_UPDATING_USER' }
  }
}

const updateAvatar = async (id, avatar) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id }
    })

    if (!user) return { result: null, error: 'USER_NOT_FOUND' }
    if (user.avatar) {
      const path = user.avatar
      deleteFile(path)
    }

    const filename = saveFile(avatar, user.id, 'avatar')
    if (!filename) return { result: null, error: 'ERROR_SAVING_AVATAR' }
    await prisma.user.update({
      where: {
        id
      },
      data: {
        avatar: filename
      }
    })
    return { result: filename, error: null }
  } catch (err) {
    console.error(err)
    return { result: null, error: 'ERROR_UPDATING_AVATAR' }
  }
}

const remove = async (id) => {
  try {
    const user = await prisma.user.delete({
      where: { id }
    })
    if (!user) return { result: null, error: 'USER_NOT_DELETED' }
    delete user.password
    return { result: user, error: null }
  } catch (err) {
    console.error(err)
    return { result: null, error: 'ERROR_DELETING_USER' }
  }
}

const checkPassword = async (idUser, password) => {
  const user = await prisma.user.findUnique({
    where: { id: idUser }
  })
  if (!user) return { result: null, error: 'USER_NOT_FOUND' }
  const validPassword = await bcrypt.compare(password, user.password)
  if (!validPassword) return { result: null, error: 'INCORRECT_PASSWORD' }
  return { result: user, error: null }
}

const login = async (email, password) => {
  const user = await prisma.user.findUnique({
    where: { email }
  })
  if (!user) return { result: null, error: 'EMAIL_NOT_FOUND' }
  const validPassword = await bcrypt.compare(password, user.password)
  if (!validPassword) return { result: null, error: 'INVALID_PASSWORD' }
  delete user.password
  return { result: user, error: null }
}

const getByParams = async (data) => {
  try {
    const user = await prisma.user.findUnique({
      where: data,
      include: { config: true, role: true }
    })
    if (!user) return { result: null, error: 'USER_NOT_FOUND' }
    delete user.password
    return { result: user, error: null }
  } catch (err) {
    console.error(err)
    return { result: null, error: 'ERROR_GETTING_USER' }
  }
}

const existsUser = async (data) => {
  try {
    const user = await prisma.user.findMany({
      where: data
    })
    if (!user || user.length === 0) return { result: false, error: null }
    return { result: true, error: null }
  } catch (err) {
    console.error(err)
    return { result: null, error: 'ERROR_GETTING_USER' }
  }
}

const updatePassword = async (id, password) => {
  try {
    const user = await prisma.user.update({
      where: { id },
      data: { password }
    })
    if (!user) return { result: null, error: 'USER_NOT_UPDATED' }
    delete user.password
    return { result: user, error: null }
  } catch (err) {
    console.error(err)
    return { result: null, error: 'ERROR_UPDATING_USER' }
  }
}

module.exports = { getAll, get, create, createWithAvatar, update, updateAvatar, remove, checkPassword, login, getByParams, existsUser, updatePassword }
