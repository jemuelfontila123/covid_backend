require('express-async-errors');
const User = require('../models/User')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt')
const config = require('../services/config')
const jwt = require('jsonwebtoken')
const transporter = require('../services/config').transporter;
const client = require('twilio')(config.SID, config.AUTH_TOKEN);
const qr = require('qrcode');   
exports.getAll = async(request, response) => {
    const users = await User.find({})
    response.json(users);
}

// It checks the sign up form and validate it
exports.register = [
    body('*').trim().escape(),
    body('email').normalizeEmail(),
    // Validation
    body('email').isEmail().withMessage('must be a valid email'),
    body('verificationCode').isLength({max:6}),
    body('password').isLength({min: 8})
    ,async (request, response) => {
    const errors = validationResult(request)
    if(!errors.isEmpty()){ throw (errors) }
    const { firstName, lastName, contactNumber, email, verificationCode, password} = request.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const compareVerificationCode = await bcrypt.compare(verificationCode, config.verificationCode)
    if(!compareVerificationCode) { throw Error('verification code invalid')}
    const newUser = new User({
        firstName,
        lastName,
        passwordHash,
        role: 'user',
        contactNumber,
        email
    });
    const savedUser = await newUser.save();
    response.json(savedUser)
    }
]
//Updates Profile
exports.update = [
     // Sanitization
    body('*').trim().escape()
    //  Validation
    ,async (request, response) => {
    const compareToken = jwt.verify(request.token, config.SECRET)
    const {firstName, lastName, email} = request.body;
    const user  = {
        firstName,
        lastName,
        email,
        verified: true
    }
    if(!compareToken) { throw Error('unauthorized user')}
    const userUpdate = await User.findOneAndUpdate({email}, user)
    response.status(200).end()
    }
]

// Get History

// Get QR Code
exports.getQR = async(request, response) => {
    const decodedToken = jwt.verify(request.token, config.SECRET)
    const user = await User.findById(request.body.id);
    const sendQr = await qr.toDataURL(user.id);
    response.json(sendQr)
}

// Forgot Password