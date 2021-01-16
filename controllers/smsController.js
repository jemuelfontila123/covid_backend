const config = require('../services/config')
const client = require('twilio')(config.SID, config.AUTH_TOKEN);
const phoneToken = require('generate-sms-verification-code')
const bcrypt = require('bcrypt')
require('express-async-errors');

exports.sendVerificationCode = async (request, response) => {
        const generatedToken = phoneToken(6, {type: 'string'})
        console.log(request.body.contactNumber)
        const sendMessage = await client.messages
            .create({
                body:`Your verification code is: ${generatedToken}`,
                from: "+12055909323",
                to: `+${request.body.contactNumber}`
            })
       const hashedToken = await bcrypt.hash(generatedToken, 10);
       config.verificationCode = hashedToken;
       response.status(200).end()
       if(!sendMessage)
        response.status(400).end()
}

