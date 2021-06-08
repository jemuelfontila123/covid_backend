const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const storage = require('../services/config').storage;
const multer = require('multer')
const fileFilter = require('../services/config').fileFilter;
const upload = multer({storage: storage, fileFilter: fileFilter});
router.route('/')
    .get(userController.getAll)
router.get('/:id', userController.getUserById)
router.get('/instances', userController.getInstances)
router.post('/register', userController.register)
router.post('/update',userController.update)
router.post('/upload', upload.single('avatar'),userController.uploadImage)
router.post('/getqr',userController.getQR)
router.post('/verify',userController.verifyCode)
router.post('/healthcheck', userController.healthCheck)


module.exports = router;