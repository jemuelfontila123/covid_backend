const mongoose = require('mongoose')
const { Schema } = mongoose;
const uniqueValidator = require('mongoose-unique-validator')

const userInstancesSchema = new Schema({
    firstName: String,
    lastName: String,
    contactNumber: {
        type: String,
        min:12,
        max:12,
    },
    email: {
        type:String,
        max: 254,
    },
    timeStamp : {
        type: Date,
        default: Date.now
    }
})

userInstancesSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
})
module.exports = mongoose.model('UserInstances',userInstancesSchema)