const express = require('express');
const route = express.Router();
const auth = require('../middlewares/auth.middleware');
const { addDoctor, loginDoctor, getDoctors, getDoctorById, updateDoctor, deleteDoctor, confirmAppointment, getAppointments, changePassword, doctorProfile, manageSchedule } = require('../controllers/doctor.controller');

// ------------------ Doctor routes ------------------
route.post('/add', addDoctor);

route.post('/login', loginDoctor);

route.get('/', auth, getDoctors);

route.get('/:id', auth, getDoctorById);

route.patch('/:id', auth, updateDoctor);

route.delete('/:id', auth, deleteDoctor);

route.put('/changePassword', auth, changePassword);

route.get('/profile/:id', auth, doctorProfile);

route.post('/schedule', auth, manageSchedule);

// ------------------ Appointment routes ------------------
route.get('/:doctorId/appointments', auth, getAppointments);

route.post('/:doctorId/appointments/:appointmentId/confirm', auth, confirmAppointment);

module.exports = route;