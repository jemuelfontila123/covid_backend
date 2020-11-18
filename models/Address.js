const mongoose = require('mongoose')
const { Schema } = mongoose;

const addressSchema = new Schema({
    province: String,
    city: String,
    barangay: String,
    zipcode: String,
    street: String
})


addressSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
})

exports.module = mongoose.model('Address', addressSchema);