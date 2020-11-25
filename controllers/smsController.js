const config = require('../services/config')
const client = require('twilio')(config.SID, config.AUTH_TOKEN);
const phoneToken = require('generate-sms-verification-code')

exports.sendVerificationCode = async (request, response) => {
    try{
        const generatedToken = phoneToken(6, {type: 'string'})
        const sendMessage = await client.messages
            .create({
                body:`Your verification code is: ${generatedToken}`,
                from: "+12055909323",
                to: `+${request.body.contactNumber}`
            })
       config.verificationCode = generatedToken;
       response.status(200).end()
    }catch(exception){
        console.log(exception)
        response.status(400).end()
    }
}

