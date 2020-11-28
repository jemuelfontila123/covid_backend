const mongoose = require('mongoose')
const { Schema } = mongoose;

const addressSchema = new Schema({
    region: String,
    province: String,
    city: String,
    barangay: String,   
    exact: String
})


addressSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
})

module.exports = mongoose.model('Address', addressSchema);