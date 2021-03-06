require('express-async-errors');
const User = require('../models/User').User
const UserInstances = require('../models/UserInstances')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt')
const config = require('../services/config')
const jwt = require('jsonwebtoken')
const transporter = require('../services/config').transporter;
const client = require('twilio')(config.SID, config.AUTH_TOKEN);
const qr = require('qrcode');   
const multer = require('multer')


exports.getAll = async(request, response) => {
    const users = await User.find({})
    response.json(users);
}
exports.getUserById = async(request, response) => {
    const decodedToken =   jwt.verify(request.token, config.SECRET)
    if(decodedToken.id !== request.params.id) { throw Error('access invalid')}
    const user = await User.findById(decodedToken.id)
    if(!user) {throw Error('access invalid')}
    response.json(user)
}
exports.getInstances = async(request, response) => {
    const userInstances = await UserInstances.find({})
    response.json(userInstances)
}
// It checks the sign up form and validate it
exports.register = [
    body('*').trim().escape(),
    body('email').normalizeEmail(),
    // Validation
    body('email').isEmail().withMessage('must be a valid email'),
    body('password').isLength({min: 8})
    ,async (request, response) => {
    const errors = validationResult(request)
    if(!errors.isEmpty()){ throw (errors) }
    const { firstName, lastName, email, password} = request.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({
        firstName,
        lastName,
        passwordHash,
        role: 'user',
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
    const {firstName, lastName, email, password} = request.body;
    const user = await User.findOne({email})
    const decodedToken = jwt.verify(request.token, config.SECRET)
    if(decodedToken.id !== user.id){ throw Error('access invalid')}
    const comparePassword = await bcrypt.compare(password, user.passwordHash)
    if(!comparePassword) { throw Error('invalid password')}
    let updatedUser;
    if(firstName !==''){
        if(lastName !='') {
            updatedUser = {
                firstName,
                lastName
            }
        }
        else 
            updatedUser = {firstName}
    }
    else if(lastName!==''){
        updatedUser = {lastName}
    }
    else{
        response.status(200).end()
    }
    const userUpdate = await User.findOneAndUpdate({email}, updatedUser)
    response.status(200).end()
    }
]
exports.uploadImage = [ 
     // Sanitization
     body('*').trim().escape()
     //  Validation
     ,async (request, response) => {
    const decodedToken = jwt.verify(request.token, config.SECRET)
    const user = await User.findById(request.body.id);
    if(decodedToken.id.toString() !== user._id.toString()){ throw Error('access invalid')}
    if(!decodedToken) { throw Error('unauthorized user')}
     const userUpdate = await User.findByIdAndUpdate(request.body.id, {$set: {img: request.file.path}})
     response.json({path: request.file.path})
     }
]

// Get History

// Get QR Code
exports.getQR = async(request, response) => {
    const decodedToken = jwt.verify(request.token, config.SECRET)
    const user = await User.findById(request.body.id);
    if(decodedToken.id !== user.id){ throw Error('access invalid')}
    const stringify = JSON.stringify(user)
    const sendQr = await qr.toDataURL(stringify);
    response.json(sendQr)
}
// Try the verification
exports.verifyCode = async(request, response) => {
    const {token, body} = request;
    const decodedToken = jwt.verify(token, config.SECRET)
    const user = await User.findById(body.id);
    if(decodedToken.id !== user.id){ throw Error('access invalid')}
    const compareCode = await bcrypt.compare(body.code, config.verificationCode)
    if(!compareCode)
        response.status(400).end()
    const userUpdate = await User.findByIdAndUpdate(body.id, {$set: {contactNumber: config.contactNumber, phone_verified: true}})
    response.status(200).end()
}
// Health check
exports.healthCheck = async(request, response) => {
    const {token, body} = request;
    const decodedToken = jwt.verify(token, config.SECRET)
    const user = await User.findById(body.id);
    if(decodedToken.id !== user.id){ throw Error('access invalid')}
    if(body.checked===0){
        const userUpdate = await User.findByIdAndUpdate(body.id, {$set: {status: 'good'}})
    }
    if(body.checked===1){
        const userUpdate = await User.findByIdAndUpdate(body.id, {$set: {status: 'mild'}})
    }
    if(body.checked===2){
        const userUpdate = await User.findByIdAndUpdate(body.id, {$set: {status: 'mild'}})
    }
    if(body.checked>2){
        const userUpdate = await User.findByIdAndUpdate(body.id, {$set: {status: 'severe'}})
    }
    response.status(200).end()
}
// Forgot Password