const express = require('express');
const route = express.Router();
const auth = require('../middlewares/auth.middleware');
const {
    registerPatient,
    loginPatient,
    getPatients,
    getPatientById,
    updatePatient,
    deletePatient,
    changePassword,
    patientProfile,
    bookAppointment,
    getPatientAppointments,
    getPatientAppointmentById,
    updatePatientAppointment,
    deletePatientAppointment,
} = require('../controllers/patient.controller');

// ------------------ Register Patient ------------------
route.post('/register', registerPatient);

// ------------------ Login Patient ------------------
route.post('/login', loginPatient);

// ------------------ Get All Patients ------------------
route.get('/fetchAll', auth, getPatients);

// ------------------ Get Patient by ID ------------------
route.get('/:id', auth, getPatientById);

// ------------------ Update Patient ------------------
route.put('/:id', auth, updatePatient);

// ------------------ Delete Patient ------------------
route.delete('/:id', auth, deletePatient);

// ------------------ Change Patient Password ------------------
route.put('/changePassword', auth, changePassword);

// ------------------ Patient Profile ------------------
route.get('/profile/:id', auth, patientProfile);

// // ------------------ Forgot Password (Send OTP) ------------------
// route.post('/forgotPassword', forgotPassword);

// // ------------------ Verify OTP ------------------
// route.post('/verifyOtp', verifyOtp);

// // ------------------ Reset Password ------------------
// route.post('/resetPassword', resetPassword);

// Book Appointment
route.post('/bookAppointment', auth, bookAppointment);

// Get All Appointments for Patient
route.get('/appointments', auth, getPatientAppointments);

// Get Single Appointment by ID
route.get('/appointments/:id', auth, getPatientAppointmentById);

// Update Appointment
route.put('/appointments/:id', auth, updatePatientAppointment);

// Delete Appointment
route.delete('/appointments/:id', auth, deletePatientAppointment);

module.exports = route;
