const mongoose = require('mongoose')
const { Schema } = mongoose;
const uniqueValidator = require('mongoose-unique-validator');
const { NumberContext } = require('twilio/lib/rest/pricing/v1/voice/number');

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
    temperature:{
        type:Number
    },
    main: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: ['good','mild','severe','infected','vaccinated']
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