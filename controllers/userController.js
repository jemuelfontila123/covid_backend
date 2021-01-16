require('express-async-errors');
const User = require('../models/User')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt')
const config = require('../services/config')
const jwt = require('jsonwebtoken')
const transporter = require('../services/config').transporter;
const client = require('twilio')(config.SID, config.AUTH_TOKEN);

exports.getUsers = async(request, response) => {
    const users = await User.find({})
    response.json(users);
}
// Checks the log in form and validate it
exports.userLogin = [
    // Sanitize
    body('email').isEmail().normalizeEmail(),
    body('password').trim().escape()
    , async(request, response) => {
    const errors = validationResult(request)
    if(!errors.isEmpty()){ throw (errors) }
    const {email, password} = request.body
    const user = await User.findOne({email: email})
    if(!user) {throw Error('invalid email or password')}
    const comparePassword = await bcrypt.compare(password, user.passwordHash)
    if(!comparePassword || !user) {throw Error('invalid email or password')}
    const userToken = {
        email: user.email,
        id: user.id
    }
    const token = jwt.sign(userToken, config.SECRET)
    response.json({user, token})
    }
]
// It checks the sign up form and validate it
exports.userRegister = [
    body('*').trim().escape(),
    body('email').normalizeEmail(),
    // Validation
    body('email').isEmail().withMessage('must be a valid email'),
    body('verificationCode').isLength({max:6})
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
// Updates Profile
// exports.userUpdate = [
//      // Sanitization
//     body('*').trim().escape(),
//     //  Validation
//     body('password').not().isEmpty()
//     ,async (request, response) => {
//     const compareToken = await jwt.verify(config.SECRET, request.token)
//     const {firstName, middleName, lastName} = request.body;
//     const { province, city, barangay } = request.body;
//     if(!compareToken) { throw Error('unauthorized user')}
//         const update = {
            
//         }
//     }
// ]

// Get History

// Get QR Code


// Forgot Password