require('express-async-errors');
const Establishment = require('../models/Establishment').Establishment
const Notification = require('../models/Notification').Notification
const jwt = require('jsonwebtoken')
const config = require('../services/config')
const alreadyNotified = (visitor, notifications) => {
    const found = notifications.find(notification => notification.email === visitor.email)
    return found;
}
let today = new Date();
const dd = String(today.getDate()).padStart(2, '0');
const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
const yyyy = today.getFullYear();
today = mm + '/' + dd + '/' + yyyy;
const dateToday = `${yyyy}-${mm}-${dd}`


exports.addNotification  = async (request, response) => {
    const decodedToken =   jwt.verify(request.token, config.SECRET)
    request.credentials = { role: decodedToken.role}
    const establishment = await Establishment.findById(decodedToken.id)
        .populate('visitors')
        .populate({path:'notifications'})
    const visitors = establishment.visitors;
    const notifications = establishment.notifications
    const visitorsUnique  = [... new Map(visitors.map(visitor => ['main', visitor])).values()]
    if(visitorsUnique){
        const index = Math.floor(Math.random() * visitorsUnique.length)
        const randomVisitor = visitorsUnique[index]
        if(!alreadyNotified(randomVisitor, notifications)){
            const newNotification = new Notification({
                message:`${randomVisitor.firstName} ${randomVisitor.lastName} was found positive on ${dateToday}`,
                email: randomVisitor.email,
                severity: 'warning',
                establishment: establishment.id
            })
            const savedNotification = await newNotification.save();
            establishment.notifications = establishment.notifications.concat(savedNotification)
            await establishment.save()
            response.json(establishment)
        }
    }
    response.status(200).end()
}   