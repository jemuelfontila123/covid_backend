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
    contactNumber: {
        type: String,
        min:11,
        max:11,
        unique: true
    },
    email: {
        type:String,
        max: 254,
        unique: true
    },
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