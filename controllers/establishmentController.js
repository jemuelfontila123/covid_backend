require('express-async-errors');
const Establishment = require('../models/Establishment')
const User = require('../models/User')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt')
const config = require('../services/config')
const jwt = require('jsonwebtoken')
const transporter = require('../services/config').transporter;
const client = require('twilio')(config.SID, config.AUTH_TOKEN);

exports.getAll = async(request, response) => {
    const establishments = await Establishment.find({})
    response.json(establishments)
}

exports.getUsers = async(request, response) => {
    const decodedToken = jwt.verify(request.token, config.SECRET)
    const establishment = await Establishment.findById(request.body.id).populate('visitors',{firstName:1, lastName:1, contactNumber:1, email:1})
    if(decodedToken.id !== establishment.id){ throw Error('access invalid')}
    const visitors = establishment.visitors;
    response.json(visitors);
}

exports.addUser = async(request, response) => {
    const decodedToken = jwt.verify(request.token, config.SECRET)
    const establishment = await Establishment.findById(request.body.establishmentId)
    if(decodedToken.id !== establishment.id){ throw Error('access invalid')}
    const user = await User.findById(request.body.userId)
    establishment.visitors = establishment.visitors.concat(user.id)
    await establishment.save();
    response.json(establishment)
}
exports.addEmployee = [
    body('*').trim().escape(),
    body('email').normalizeEmail(),
    //Validation
    body('email').isEmail().withMessage('must be a valid email')
    , async(request, response) => {
        const errors = validationResult(request)
        if(!errors.isEmpty()){ throw (errors) }
        const { contactPerson, name, contactNumber, password, email} = request.body;
    }
]
exports.register = [
    body('*').trim().escape(),
    body('email').normalizeEmail(),
    //Validation
    body('email').isEmail().withMessage('must be a valid email')

    ,async (request, response) => {
        const errors = validationResult(request)
        if(!errors.isEmpty()){ throw (errors) }
        const { contactPerson, name, contactNumber, password, email} = request.body;
        const passwordHash = await bcrypt.hash(password, 10);
        const newEstablishment = new Establishment({
            name,
            contactPerson,
            passwordHash,
            role: 'admin',
            contactNumber,
            email,
            // default should be false
            verified: true 
        });
        const savedEstablishment = await newEstablishment.save();
        response.json(savedEstablishment);
        }
]

