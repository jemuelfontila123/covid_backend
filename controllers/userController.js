const User = require('../models/User')
const Address = require('../models/Address')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt')
require('express-async-errors');
exports.getUsers = async(request, response) => {
    const users = await User.find({})
    response.json(users);
}
exports.userRegister = [
    // Sanitization
    body('firstName').trim().escape(),
    body('middleName').trim().escape(),
    body('lastName').trim().escape(),
    body('password').trim().escape(),
    body('contactNumber').trim().escape(),
    body('email').isEmail().normalizeEmail()
    // Validation
    ,async (request, response) => {
    const errors = validationResult(request)
    if(!errors.isEmpty()){ response.status(400).json({errors: errors.array()}) }
    if(request.body.password){
        await body('passwordConfirmation')
            .equals(request.body.password).withMessage('passwords do not match')
            .run(request);
    }
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
        contactNumber,
        email
    });
    const savedUser = await newUser.save();
    response.json(savedUser)
    }
]