const mongoose = require('mongoose')
const { Schema } = mongoose;
const uniqueValidator = require('mongoose-unique-validator')

const userInstancesSchema = new Schema({
    firstName: String,
    lastName: String,
    email: {
        type:String,
        max: 254,
    },
    contactNumber: {
        type: String,
        min:12,
        max:12,
    },
    timeStamp : {
        type: Date,
        default: Date.now
    },
    main: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: ['good','mild','severe']
})

userInstancesSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
})

const UserInstances = mongoose.model('UserInstances', userInstancesSchema);
module.exports = { userInstancesSchema, UserInstances}