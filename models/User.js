const mongoose = require('mongoose')
const { Schema } = mongoose;

const userSchema = new Schema({
    firstName: String,
    middleName: String,
    lastName: String,
    password: {
        type: String,
        min:8,
        max:16
    },
    address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address'
    },
    contactNumber: {
        type: String,
        min:11,
        max:11
    },
    email: String,
    imageUrl: String,
})

userSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.password;
    }
})
exports.module = mongoose.model('User',userSchema)