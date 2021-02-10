require('express-async-errors');
const Establishment = require('../models/Establishment').Establishment
const User = require('../models/User').User
const UserInstances = require('../models/UserInstances').UserInstances
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
exports.getEstablishmentById = async(request, response) => {
    const decodedToken =   jwt.verify(request.token, config.SECRET)
    request.credentials = { role: decodedToken.role }
    if(decodedToken.id !== request.params.id) { throw Error('access invalid')}
    const establishment = await Establishment.findById(decodedToken.id)
        .populate('visitors',{firstName:1, lastName:1, contactNumber:1, email:1, timeStamp:1})
        .populate('employees', {contactPerson:1, email:1, contactNumber:1, verified:1})
    if(!establishment) {throw Error('access invalid')}
    response.json(establishment)
}
exports.getUsers = async(request, response) => {
    const decodedToken = jwt.verify(request.token, config.SECRET)
    const establishment = await Establishment.findById(request.body.id).populate('visitors',{firstName:1, lastName:1, contactNumber:1, email:1, timeStamp:1})
    if(decodedToken.id !== establishment.id){ throw Error('access invalid')}
    const visitors = establishment.visitors;
    response.json(visitors);
}

exports.addUser = async(request, response) => {
    const decodedToken =   jwt.verify(request.token, config.SECRET)
    request.credentials = { role: decodedToken.role }
    const establishment = await Establishment.findById(decodedToken.id)
    const {firstName, lastName, email, contactNumber, userId} = request.body;
    const user = await User.findById(userId)
    if(!user) { throw Error('user invalid')}
    const userInstance = new UserInstances({
        firstName,
        lastName,
        email,
        contactNumber
    })
    const savedUserInstance = await userInstance.save()
    establishment.visitors = establishment.visitors.concat(savedUserInstance)
    await establishment.save();
    response.json(establishment)
}
exports.deleteUser = async(request, response) => {
    const decodedToken =   jwt.verify(request.token, config.SECRET)
    request.credentials = {role: decodedToken.role}
    const establishment = await Establishment.findById(decodedToken.id)
    const userInstance = await UserInstance.findById(request.body.userId)
    console.log(establishment.visitors[1]==userInstance.id)
    establishment.visitors = establishment.visitors.filter(visitor => visitor != userInstance.id)
    await establishment.save(); 
    response.json(establishment);
}
exports.addEmployee = [
    body('*').trim().escape(),
    body('email').normalizeEmail(),
    //Validation
    body('email').isEmail().withMessage('must be a valid email')
    , async(request, response) => {
        const { contactPerson, name, contactNumber, password, email, id} = request.body;
        const errors = validationResult(request)
        const decodedToken = jwt.verify(request.token, config.SECRET)
        request.establishment = {
            role: decodedToken.establishment.role
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const establishment = await Establishment.findById(id);
        if(!errors.isEmpty()){ throw (errors) }
        if(decodedToken.id.toString() !== establishment.id.toString()){ throw Error('access invalid')}
        const newEmployee = new Establishment({
            name,
            contactPerson,
            passwordHash,
            role: 'employee',
            contactNumber,
            email,
            verified: true 
        });
        const savedEmployee =  await newEstablishment.save();
        establishment.employees = establishment.employees.concat(savedEmployee)
        await establishment.save();
        response.json(savedEmployee)
        response.status(200).end()
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
        const newAdmin = new Establishment({
            name,
            contactPerson,
            passwordHash,
            role: 'admin',
            contactNumber,
            email,
            // default should be false
            verified: true 
        });
        const savedAdmin = await newAdmin.save();
        response.json(savedAdmin);
        }
]

