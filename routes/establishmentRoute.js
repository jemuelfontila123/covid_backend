const express = require('express')
const router = express.Router()
const establishmentController = require('../controllers/establishmentController')

router.route('/')
    .post(establishmentController.login)
    .get(establishmentController.getAll)
router.post('/register', establishmentController.register)
module.exports = router;