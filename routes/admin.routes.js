const express = require('express');
const route = express.Router();
const auth = require('../middlewares/auth.middleware');
const upload = require('../middlewares/admin.middleware');
const { addAdmin, login, getAdmins, getAdminById, deleteAdminById, updateAdmin, changePassword, adminProfile, addPatient, updatePatient, deletePatient, getPatient, fetchAllPatients, addDoctor, updateDoctor, fetchAllDoctors, getDoctor, deleteDoctor } = require('../controllers/admin.controller');


// ------------------ ADMIN ROUTES ------------------
route.post('/add', upload.single('image'), addAdmin);

route.post('/login', login);

route.get('/fetchAll', auth, getAdmins);

route.get('/:id', auth, getAdminById);

route.delete('/:id', auth, upload.single('image'), deleteAdminById);

route.patch('/:id', auth, upload.single('image'), updateAdmin);

route.put('/changePassword', auth, changePassword);

route.get('/profile/:id', auth, adminProfile);

route.post('/addPatient', auth, addPatient);

route.delete('/deletePatient/:id', auth, deletePatient);

route.patch('/updatePatient/:id', auth, updatePatient);

route.get('/getPatient/:id', auth, getPatient);

route.get('/fetchAllPatients', auth, fetchAllPatients);

route.post('/addDoctor', auth, addDoctor);

route.patch('/updateDoctor/:id', auth, updateDoctor);

route.get('/fetchAllDoctors', auth, fetchAllDoctors);

route.get('/getDoctor/:id', auth, getDoctor);

route.delete('/deleteDoctor/:id', auth, deleteDoctor);

module.exports = route;
