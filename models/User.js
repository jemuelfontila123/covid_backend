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
        unique: true
    },
    email: {
        type:String,
        max: 254,
        unique: true
    },
    instances: [ 
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'UserInstances'
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
    },
    img: {
        type:String,
        default : 'default.jpg'
    },
    status: ['good','mild','severe']
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

const User = mongoose.model('User', userSchema)
module.exports = {userSchema, User}


// module.exports = User;