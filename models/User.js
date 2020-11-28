const mongoose = require('mongoose')
const { Schema } = mongoose;
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new Schema({
    firstName: String,
    middleName: String,
    lastName: String,
    passwordHash: {
        type: String,
        min:8
    },
    address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address'
    },
    role: ['user', 'admin'],
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
    birthday: Date,  
    history: [
        {   
            timeStamp:Date
        },
        {
            location: String
        }
    ]
})
userSchema.plugin(uniqueValidator)
userSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.password;
    }
})
module.exports = mongoose.model('User',userSchema)