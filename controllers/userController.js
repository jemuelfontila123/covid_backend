const User = require('../models/User')
const Address = require('../models/Address')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt')
const config = require('../services/config')
const jwt = require('jsonwebtoken')
const transporter = require('../services/config').transporter;
const client = require('twilio')(config.SID, config.AUTH_TOKEN);
require('express-async-errors');
// Experimental 
exports.getMessage = async(request,response) => {
    const { id } = request.params;
    const message = await client.messages(`${config.messageSid}`)
        .fetch();
    if(message)
        response.json(message.body.substring('38'))
    response.status(200).end()
}
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
    body('email').isEmail(),
    body('verificationCode').isLength({max:6})
    ,async (request, response) => {
    const errors = validationResult(request)
    if(request.body.verificationCode !== config.verificationCode){
        throw Error('verification code invalid')
    }
    if(!errors.isEmpty()){ throw (errors) }
    const passwordHash = await bcrypt.hash(request.body.password, 10);
    const { firstName, middleName, lastName, contactNumber, email } = request.body;
    const { province, city, barangay } = request.body;
    const address = new Address({
        province,
        city,
        barangay
    });
    const newAddress = await address.save();
    const newUser = new User({
        firstName,
        middleName,
        lastName,
        passwordHash,
        address: newAddress._id,
        role: 'user',
        contactNumber,
        email
    });
    const savedUser = await newUser.save();
    response.json(savedUser)
    }
]
// Updates Profile
exports.userUpdate = [
     // Sanitization
    body('*').trim().escape(),
    //  Validation
    body('password').not().isEmpty()
    ,async (request, response) => {
    const compareToken = await jwt.verify(config.SECRET, request.token)
    const {firstName, middleName, lastName} = request.body;
    const { province, city, barangay } = request.body;
    if(!compareToken) { throw Error('unauthorized user')}
        const update = {
            
        }
    }
]

// Get History

// Get QR Code


// Forgot Password