const express = require('express')
const router = express.Router()
const dohController = require('../controllers/dohController')
const middleware = require('../services/middleware');

router.get('/:id', dohController.addNotification)
module.exports = router;

