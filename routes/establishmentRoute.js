const express = require('express')
const router = express.Router()
const establishmentController = require('../controllers/establishmentController')
const middleware = require('../services/middleware')
router.route('/')
    .get(establishmentController.getAll)
    .post(middleware.authenticate(['admin','employee']),establishmentController.addUser)
    .delete(middleware.authenticate(['admin']), establishmentController.deleteUser)


router.post('/register', establishmentController.register)
router.get('/:id', middleware.authenticate(['admin']), establishmentController.getEstablishmentById)
router.post('/getusers', middleware.authenticate(['admin']),establishmentController.getUsers)
module.exports = router;