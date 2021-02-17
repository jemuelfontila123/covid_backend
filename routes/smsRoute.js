const express = require('express')
const router = express.Router()
const smsController = require('../controllers/smsController')


router.post('/verify', smsController.sendVerificationCode)
router.post('/message', smsController.sendMessage)


module.exports = router;