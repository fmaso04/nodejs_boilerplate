const path = require('path')
const fs = require('fs')
const config = require('../../config/config')

const saveFile = (file, id, type) => {
  const extension = file.originalname.split('.').pop()
  const fileName = `${id}.${extension}`
  const filePath = path.join(__dirname, `../../${config.server.uploadFolder}${type}`)
  if (!fs.existsSync(filePath)) {
    fs.mkdirSync(filePath, { recursive: true })
  }
  fs.renameSync(file.path, filePath + '/' + fileName)
  return `${config.server.uploadFolder}${type}/${fileName}`
}

const deleteFile = (file) => {
  const filePath = path.join(__dirname, `../../${file}`)
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath)
  }
}

module.exports = { saveFile, deleteFile }
