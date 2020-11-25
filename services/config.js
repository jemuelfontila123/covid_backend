require('dotenv').config()
const nodemailer = require("nodemailer");
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
exports.messageSid = process.env.MESSAGE_SID