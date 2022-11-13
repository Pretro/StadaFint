const mongoose = require('mongoose')

// Databasschemat dvs databasstruktur

const userSchema = new mongoose.Schema({
    fullName: String,
    email: { type: String, unique: true},
    phoneNumber: String,
    address: String,
    isAdmin: { type: Boolean, select: false},
    dateCreated: Date,
    hashedPassword: { type: String, select: false }
})
const User = mongoose.model('User', userSchema)

const serviceSchema = new mongoose.Schema({
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    cleaner: { type: mongoose.Schema.Types.ObjectId, ref: 'Cleaner' },
    type: String, // 'fönsterputsning' | 'premium städning' | "standard städning"
    status: String, // väntar | godkänd | avvisade
    dateCreated: Date,
    dateApproved: Date,
    dateRejected: Date,
})
const Service = mongoose.model('Service', serviceSchema)

const cleanerSchema = new mongoose.Schema({
    userName: String,
    phoneNumber: String,
    isAvailable: Boolean,
    dateCreated: Date,
    services: {
        windowCleaning: Boolean,
        premiumCleaning: Boolean,
        standardCleaning: Boolean,
    }
})
const Cleaner = mongoose.model('Cleaner', cleanerSchema)

module.exports = {Service, User, Cleaner}
