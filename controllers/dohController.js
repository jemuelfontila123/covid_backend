require('express-async-errors');
const Establishment = require('../models/Establishment').Establishment


exports.addNotification  = async (request, response) => {
    // const decodedToken =   jwt.verify(request.token, config.SECRET)
    // request.credentials = { role: decodedToken.role }
    const establishment = await Establishment.findById(request.params.id)
        .populate('visitors')
    console.log(establishment.visitors.length)
    response.json(establishment)
}