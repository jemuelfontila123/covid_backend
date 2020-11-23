const User = require('../models/User')
const Address = require('../models/Address')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt')
require('express-async-errors');
const config = require('../services/config')
const nodemailer = require("nodemailer");
const hbs = require('nodemailer-express-handlebars')
let transporter = nodemailer.createTransport(config.gmailTransport)
const options = {
    viewEngine: {
        partialsDir: __dirname + "/views/partials",
        layoutsDir: __dirname + "/views/layouts",
        extname: ".hbs"
      },
      extName: ".hbs",
      viewPath: "views"
}
transporter.use('compile', hbs(options));
const mail = {
    from: 'jemuelfontila123@gmail.com',
    to: 'jyfontila2018@plm.edu.ph',
    subject: 'Test',
    template: 'main',
    context: {
        name: 'Name',
        address:"Sta.Rosa",
        email:"jemuelfontila123@gmail.com"
    }
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
    ,async(request, response) => {
    const sendMail = await transporter.sendMail(mail);
    const errors = validationResult(request)
    // const sendEmail = await transporter.sendEmail(mail);
    if(!errors.isEmpty()){ throw (errors) }
    const {email, password} = request.body
    const user = await User.findOne({email: email})
    if(user){
        const isValid = await bcrypt.compare(password, user.passwordHash)
        if(isValid)
            response.json(user)
    }
    throw Error('invalid email or password');
    }
]
// It checks the sign up form and validate it
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
        contactNumber,
        email
    });
    const savedUser = await newUser.save();
    response.json(savedUser)
    }
]
// Updates Profile
exports.userUpdate = [
    
]

// Get History

// Get QR Code


// Forgot Password