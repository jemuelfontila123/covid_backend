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
        // .populate('visitors',{firstName:1, lastName:1, email:1, contactNumber:1, timeStamp:1, temperature:1, status:1,})
        .populate({path:'visitors', options:{sort:{ timeStamp: -1}}})
        .populate({path:'notifications'})
        .populate('employees', {firstName:1,lastName:1,  email:1, role:1, contactNumber:1})
    if(!establishment) {throw Error('access invalid')}
    response.json(establishment)
}
exports.getUsers = async(request, response) => {
    const decodedToken = jwt.verify(request.token, config.SECRET)
    const establishment = await Establishment.findById(request.body.id).populate('visitors',{firstName:1, lastName:1, timeStamp:1, temperature:1, status:1})
    if(decodedToken.id !== establishment.id){ throw Error('access invalid')}
    const visitors = establishment.visitors;
    response.status(200).end()
}

exports.addUser = async(request, response) => {
    const decodedToken =   jwt.verify(request.token, config.SECRET)
    request.credentials = { role: decodedToken.role }
    const establishment = await Establishment.findById(decodedToken.id)
    const {firstName, lastName, email, contactNumber, status, temperature, userId} = request.body;
    const user = await User.findById(userId)
    if(!user) { throw Error('user invalid')}
    const userInstance = new UserInstances({
        firstName,
        lastName,
        email,
        contactNumber,
        temperature,
        main: userId,
        status
    })
    const savedUserInstance = await userInstance.save()
    establishment.visitors = establishment.visitors.concat(savedUserInstance)
    user.instances = user.instances.concat(savedUserInstance)
    await establishment.save();
    await user.save();
    response.json(savedUserInstance)
}
exports.deleteUser = async (request, response) => {
    const decodedToken =   jwt.verify(request.token, config.SECRET)
    request.credentials = {role: decodedToken.role}
    const establishment = await Establishment.findById(decodedToken.id)
    const userInstance = await UserInstances.findById(request.params.id)
    establishment.visitors = establishment.visitors.filter(visitor => visitor != userInstance.id)

    await establishment.save(); 
    response.json(establishment);
}
exports.addEmployee = async(request, response) => {
    const decodedToken =   jwt.verify(request.token, config.SECRET)
    request.credentials = { role: decodedToken.role}
    const { firstName, lastName , email, password} = request.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const establishment = await Establishment.findById(decodedToken.id);
    const newEmployee = new Establishment({
        firstName,
        lastName,
        passwordHash,
        role: 'employee',
        email,
        verified: true 
    });
    const savedEmployee =  await newEmployee.save();
    establishment.employees = establishment.employees.concat(savedEmployee)
    await establishment.save();
    response.json(savedEmployee)
}
exports.deleteEmployee = async(request, response) => {
    const decodedToken =   jwt.verify(request.token, config.SECRET)
    request.credentials = { role: decodedToken.role}
    const establishment = await Establishment.findById(decodedToken.id)
    const employee = await Establishment.findById(request.params.id)
    // Still needs to add this error on middleware handleError
    // if(!employee){throw Error('employee not existing')}
    establishment.employees = establishment.employees.filter(emp => emp != employee.id)
    await establishment.save();
    await Establishment.findOneAndDelete(request.params.id);
    response.json(establishment)
}
exports.update = [
    // Sanitization
   body('*').trim().escape(),
   body('email').normalizeEmail(),
   //Validation
   body('email').isEmail().withMessage('must be a valid email')
   ,async (request, response) => {
    const decodedToken =   jwt.verify(request.token, config.SECRET)
    const {email, password} = request.body;
    const establishment = await Establishment.findOne({email})
    if(decodedToken.id !== establishment.id){ throw Error('access invalid')}
    const comparePassword = await bcrypt.compare(password, establishment.passwordHash)
    if(!comparePassword) { throw Error('invalid password')}
    const establishmentUpdate = await Establishment.findOneAndUpdate({email}, request.body)
    response.json(establishmentUpdate)
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
        const { contactPerson, name, password, email} = request.body;
        const passwordHash = await bcrypt.hash(password, 10);
        const newAdmin = new Establishment({
            name,
            contactPerson,
            passwordHash,
            role: 'admin',
            email,
            // default should be false
            verified: true 
        });
        const savedAdmin = await newAdmin.save();
        response.json(savedAdmin);
        }
]

