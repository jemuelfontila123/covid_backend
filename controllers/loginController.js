require('express-async-errors');
const Establishment = require('../models/Establishment')
const User = require('../models/User')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt')
const config = require('../services/config')
const jwt = require('jsonwebtoken')
// Checks the log in form and validate it
exports.login = [
    body('email').isEmail().normalizeEmail(),
    body('password').trim().escape().isLength({min:8})
    , async(request, response) => {
    const errors = validationResult(request)
    if(!errors.isEmpty()){ throw (errors) }
    const {email, password} = request.body
    console.log(`${email} ${password}`)
    const user = await User.findOne({email})
    let kind = 'User'
    let userToken = null;
    const establishment = await Establishment.findOne({email})
    if(user){
        const comparePassword = await bcrypt.compare(password, user.passwordHash)
        if(!comparePassword || !user) {throw Error('invalid email or password')}
        const userToken = {
            email: user.email,
            id: user.id,
            kind,
            role: user.role
        }
        const token = jwt.sign(userToken, config.SECRET)
        response.json({user, token})
    }
    else if(establishment){
        const comparePassword = await bcrypt.compare(password, establishment.passwordHash)
        if(!comparePassword || !establishment) {throw Error('invalid email or password')}
        kind = 'Establishment'
        const userToken = {
            email: establishment.email,
            id: establishment.id,
            kind,
            role: establishment.role
        }
        const token = jwt.sign(userToken, config.SECRET)
        response.json({establishment, token})
    }
    
    else { throw Error('invalid email or password') }
    }
]