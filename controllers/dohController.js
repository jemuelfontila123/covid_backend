require('express-async-errors');
const Establishment = require('../models/Establishment').Establishment


exports.addNotification  = async (request, response) => {
    const establishment = await Establishment.findById(request.params.id)
        .populate('visitors')
    const visitors = establishment.visitors;
    const removeDuplicates = [... new Map(visitors.map(visitor => ['main', visitor])).values()]
    
}