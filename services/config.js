require('dotenv').config()
const nodemailer = require("nodemailer");
const multer = require('multer');

exports.storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        let addName = new Date().toISOString()
        cb(null, addName.split(':').join('') + file.originalname );
    }
})
exports.fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype==='image/jpg'){
        cb(null, true);
    }
    else cb(null,false);
}

exports.transporter = nodemailer.createTransport({
    host : process.env.GMAIL_SERVICE_HOST,
    port: process.env.GMAIL_SERVICE_PORT,
    secure: false,
    auth:{
        user: process.env.GMAIL_USER_NAME,
        pass: process.env.GMAIL_USER_PASSWORD
    }
})

exports.mail = {
    from: 'jamofontila@gmail.com',
    to: 'jyfontila2018@plm.edu.ph',
    subject: 'Test',
    template: 'main',
    subject: "Verification Code",
    text: "Hello World",
    html : "<b> Hello World </b>",
}
exports.URI = process.env.URI
exports.SID = process.env.SID;
exports.AUTH_TOKEN = process.env.AUTH_TOKEN;
exports.PORT = process.env.PORT;
exports.SECRET = process.env.SECRET;
exports.options = {
    viewEngine: {
        partialsDir: __dirname + "/views/partials",
        layoutsDir: __dirname + "/views/layouts",
        extname: ".hbs"
      },
      extName: ".hbs",
      viewPath: "views"
}
exports.verificationCode = process.env.VERIFICATION_CODE
exports.contactNumber = process.env.CONTACT_NUMBER
exports.messageSid = process.env.MESSAGE_SID