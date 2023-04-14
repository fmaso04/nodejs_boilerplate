const express = require('express')
const multer = require('multer')

const PlaygroundController = require('./playgroundController')

const router = express.Router()
const upload = multer({ dest: './temp' })

router.get('/test-get', PlaygroundController.get)
router.get('/test-get/:id', PlaygroundController.getById)
router.post('/test-post-json', PlaygroundController.saveJson)
router.post('/test-post-formData', upload.single('file'), PlaygroundController.saveFormData)
router.post('/test-post-x-www-form-urlencoded', PlaygroundController.saveXWwwFormUrlencoded)
router.put('/test-put/:id', PlaygroundController.update)
router.delete('/test-delete/:id', PlaygroundController.remove)
router.get('/test-fail', PlaygroundController.failPetition)

module.exports = router
