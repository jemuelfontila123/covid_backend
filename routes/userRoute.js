const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
router.route('/')
    .get(userController.getAll)

router.get('/instances', userController.getInstances)
router.post('/register', userController.register)

router.post('/update',userController.update)

router.post('/getqr',userController.getQR)



module.exports = router;