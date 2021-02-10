const mongoose = require('mongoose')
const { Schema } = mongoose;
const uniqueValidator = require('mongoose-unique-validator')

const establishmentSchema = new Schema({
    name: {
        type: String,
        min:1,
    },
    contactPerson: {
        type: String,
        min: 1,
    },
    passwordHash: {
        type: String,
        min:8
    },
    role: ['admin','employee'],
    visitors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:'UserInstances'
    }],
    employees: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Establishment'
    }],
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
    verified: {
        type: Boolean,
        default: false
    }
})

establishmentSchema.plugin(uniqueValidator)
establishmentSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.password;
    }
})
const Establishment = mongoose.model('Establishment', establishmentSchema);
module.exports = {establishmentSchema, Establishment}