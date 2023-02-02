
const defaultValidatorImage = {
  required: false,
  maxSize: '1mb',
  extensions: 'jpg|jpeg|png|gif|svg|webp',
  mimeTypes: 'image/jpeg|image/png|image/gif'
}
const validateFile = async (file, validators = null) => {
  if (!validators) validators = defaultValidatorImage

  const mimetypes = validators.mimeTypes.split('|')
  const extensions = validators.extensions.split('|')
  const maxSize = validators.maxSize ? parseSize(validators.maxSize) : null
  const required = validators.required || false

  const fileErrors = {}
  if (!file && required) {
    fileErrors.file = 'File is required'
    return { file: null, fileErrors }
  }

  if (!file) return { file: null, fileErrors: null }

  if (mimetypes > 0 && !mimetypes.includes(file.mimetype)) {
    fileErrors.mimeType = 'Invalid mimetype'
  }
  if (extensions > 0 && !extensions.includes(file.originalname.split('.').pop())) {
    fileErrors.extension = 'Invalid extension'
  }
  if (maxSize && file.size > maxSize) {
    fileErrors.size = 'File is too big'
  }

  if (Object.keys(fileErrors).length > 0) return { file: null, fileErrors }
  else return { file, fileErrors: null }
}

function parseSize (size) {
  const unit = size.slice(-2)
  const value = size.slice(0, -2)
  switch (unit) {
    case 'mb':
      return value * 1024 * 1024
    case 'kb':
      return value * 1024
    default:
      return value
  }
}

module.exports = validateFile
