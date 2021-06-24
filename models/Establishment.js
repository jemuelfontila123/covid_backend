const mongoose = require('mongoose')
const { Schema } = mongoose;
const uniqueValidator = require('mongoose-unique-validator')
const Notification = require('./Notification').Notification;
const establishmentSchema = new Schema({
    name: {
        type: String,
        min:1,
    },
    firstName:{
        type: String,
        min:1
    },
    lastName: {
        type: String,
        min:1
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
    notifications:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: Notification
    }],
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
    },
    email: {
        type:String,
        max: 254,
        unique: true
    },
})

establishmentSchema.plugin(uniqueValidator)
establishmentSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.passwordHash;
    }
})
const Establishment = mongoose.model('Establishment', establishmentSchema);
module.exports = {establishmentSchema, Establishment}