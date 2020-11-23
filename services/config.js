require('dotenv').config()

exports.URI = process.env.URI
exports.PORT = process.env.PORT;
exports.gmailTransport = {
    host : process.env.GMAIL_SERVICE_HOST,
    port: process.env.GMAIL_SERVICE_PORT,
    secure: process.env.GMAIL_SERVICE_SECURE,
    auth:{
        user: process.env.GMAIL_USER_NAME,
        pass: process.env.GMAIL_USER_PASSWORD
    }
}
exports.options = {
    viewEngine: {
        partialsDir: __dirname + "/views/partials",
        layoutsDir: __dirname + "/views/layouts",
        extname: ".hbs"
      },
      extName: ".hbs",
      viewPath: "views"
}
