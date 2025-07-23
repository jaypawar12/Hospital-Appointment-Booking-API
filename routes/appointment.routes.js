const express = require('express');
const route = express.Router();
const {
    bookAppointment,
    getAppointments,
    getAppointmentsByPatient,
    cancelAppointment,
    getDoctorSlots,
    rescheduleAppointment,
    updateAppointmentStatus,
    filterAppointmentsByDate
} = require('../controllers/appointment.controller');

// Book Appointment
route.post('/book', bookAppointment);

// Get All Appointments
route.get('/fetchAll', getAppointments);

// Get Appointments by Patient ID
route.get('/patient/:id', getAppointmentsByPatient);

// Cancel Appointment
route.delete('/:id', cancelAppointment);

// Get Doctor Slots
route.get('/slots/:doctorId', getDoctorSlots);

// Reschedule Appointment
route.put('/reschedule/:id', rescheduleAppointment);

// Appointment Status Update
route.put('/status/:id', updateAppointmentStatus);

// Filter by Date
route.get('/date/:date', filterAppointmentsByDate);

module.exports = route;
