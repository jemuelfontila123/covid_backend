const express = require('express')
const router = express.Router()
const establishmentController = require('../controllers/establishmentController')

router.route('/')
    .get(establishmentController.getAll)
    .post(establishmentController.addUser)
    
router.post('/register', establishmentController.register)

router.post('/getusers', establishmentController.getUsers)
module.exports = router;