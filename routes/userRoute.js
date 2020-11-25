const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
router.route('/')
    .get(userController.getUsers)
    .post(userController.userLogin)

router.post('/register', userController.userRegister)




module.exports = router;