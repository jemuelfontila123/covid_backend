const mongoose = require('mongoose')
const { Schema } = mongoose;
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new Schema({
    firstName: String,
    lastName: String,
    passwordHash: {
        type: String,
        min:8
    },
    role: ['user','admin'],
    contactNumber: {
        type: String,
        min:12,
        max:12,
        // unique: true
    },
    email: {
        type:String,
        max: 254,
        unique: true
    },
    history: [
        {   
            timeStamp:Date
        }
    ],
    user: [ 
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    establishment: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Establishment'
        }
    ],
    verified: {
        type: Boolean,
        default: false
    }
})
userSchema.plugin(uniqueValidator)
userSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.passwordHash;
    }
})
module.exports = mongoose.model('User',userSchema)