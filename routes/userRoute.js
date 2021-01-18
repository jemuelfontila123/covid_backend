const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
router.route('/')
    .get(userController.getAll)

router.post('/register', userController.register)

router.post('/update',userController.update)




module.exports = router;