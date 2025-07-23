const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
    name: String,
    specialization: String,
    phone: String,
    email: String,
    experience: Number,
    password: String,
},
{
    timestamps: true,
});

module.exports = mongoose.model('Doctor', DoctorSchema, 'Doctors');

