require('express-async-errors');
const Establishment = require('../models/Establishment')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt')
const config = require('../services/config')
const jwt = require('jsonwebtoken')
const transporter = require('../services/config').transporter;
const client = require('twilio')(config.SID, config.AUTH_TOKEN);

exports.register = [
    body('*').trim().escape(),
    body('email').normalizeEmail(),
    //Validation
    body('email').isEmail().withMessage('must be a valid email')

    ,async (request, response) => {
        const errors = validationResult(request)
        if(!errors.isEmpty()){ throw (errors) }
        const { contactPerson, name, contactNumber } = request.body;
        const newEstablishment = new Establishment({
            name,
            contactPerson,
            contactPerson,
            role: 'admin',
        });
        const savedEstablishment = await newEstablishment.save();
        response.json(savedEstablishment);
        }
]
exports.getAll = async(request, response) => {
    const establishments = await Establishment.find({})
    response.json(establishments)
}
exports.login = [
    body('*').trim().escape(),
    body('email').normalizeEmail(),
    //Validation
    body('email').isEmail().withMessage('must be a valid email')
    ,async(request, response) => {
        const { email, password }  = request.body;
        const establishment  = await Establishment.findOne({email})
        if(!establishment) {throw Error('invalid email or password')}
        const comparePassword = await bcrypt.compare(password, establishment.passwordHash)
        if(!comparePassword) {throw Error('invalid email or password')}
        const establishmentToken = {
            email: establishment.email,
            id: establishment.id
        }
        const token = jwt.sign(establishmentToken, config.SECRET);
        response.json({establishment, token})
    }
]

