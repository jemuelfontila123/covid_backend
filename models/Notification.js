const mongoose = require('mongoose')
const { Schema } = mongoose;

const notificationSchema = new Schema({
    message:{
        type: String
    },
    email: {
        type: String
    },
    severity: ['success','warning'],
    establishment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Establishment'
    }
})

notificationSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
    }
})
const Notification = mongoose.model('Notification', notificationSchema);
module.exports = {notificationSchema, Notification}