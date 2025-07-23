const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
    date: String,
    time: String,
});

module.exports = mongoose.model('Appointment', AppointmentSchema, 'Appointments');

