const Patient = require('../models/patient.model');
const Appointment = require('../models/appointment.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Add this line

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // Use env variable in production

// Register Patient
exports.registerPatient = async (req, res) => {
    try {
        const existingPatient = await Patient.findOne({ email: req.body.email });
        if (existingPatient) {
            return res.status(409).json({ status: false, error: "Email already exists." });
        }
        req.body.password = await bcrypt.hash(req.body.password, 11);
        const patient = await Patient.create(req.body);
        const token = jwt.sign({ id: patient._id, role: 'patient' }, JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({ status: true, message: "Patient registered successfully.", data: patient, token: token });
    } catch (err) {
        res.status(500).json({ status: false, error: "Something went wrong.", error_data: err.message });
    }
};

// Login Patient
exports.loginPatient = async (req, res) => {
    try {
        const patient = await Patient.findOne({ email: req.body.email });
        if (!patient) {
            return res.status(401).json({ status: false, error: "Invalid email or password." });
        }
        const isMatch = await bcrypt.compare(req.body.password, patient.password);
        if (!isMatch) {
            return res.status(401).json({ status: false, error: "Invalid email or password." });
        }

        // Create JWT token
        const token = jwt.sign({ id: patient._id, role: 'patient' }, JWT_SECRET, { expiresIn: '7d' });

        res.status(200).json({ status: true, message: "Login successful.", data: patient, token: token });
    } catch (err) {
        res.status(500).json({ status: false, error: "Something went wrong.", error_data: err.message });
    }
};

// Get All Patients
exports.getPatients = async (req, res) => {
    try {
        const patients = await Patient.find();
        res.status(200).json({ status: true, data: patients });
    } catch (err) {
        res.status(500).json({ status: false, error: "Something went wrong.", error_data: err.message });
    }
};

// Get Patient by ID
exports.getPatientById = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) {
            return res.status(404).json({ status: false, error: "Patient not found." });
        }
        res.status(200).json({ status: true, data: patient });
    } catch (err) {
        res.status(500).json({ status: false, error: "Something went wrong.", error_data: err.message });
    }
};

// Update Patient
exports.updatePatient = async (req, res) => {
    try {
        const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!patient) {
            return res.status(404).json({ status: false, error: "Patient not found." });
        }
        res.status(200).json({ status: true, message: "Patient updated successfully.", data: patient });
    } catch (err) {
        res.status(500).json({ status: false, error: "Something went wrong.", error_data: err.message });
    }
};

// Delete Patient
exports.deletePatient = async (req, res) => {
    try {
        const patient = await Patient.findByIdAndDelete(req.params.id);
        if (!patient) {
            return res.status(404).json({ status: false, error: "Patient not found." });
        }
        res.status(200).json({ status: true, message: "Patient deleted successfully." });
    } catch (err) {
        res.status(500).json({ status: false, error: "Something went wrong.", error_data: err.message });
    }
};

// Change Patient Password
exports.changePassword = async (req, res) => {
    try {
        const patient = await Patient.findById(req.user.id);
        if (!patient) {
            return res.status(404).json({ status: false, error: "Patient not found." });
        }
        const isMatch = await bcrypt.compare(req.body.oldPassword, patient.password);
        if (!isMatch) {
            return res.status(400).json({ status: false, error: "Old password is incorrect." });
        }
        patient.password = await bcrypt.hash(req.body.newPassword, 11);
        await patient.save();
        res.status(200).json({ status: true, message: "Password changed successfully." });
    } catch (err) {
        res.status(500).json({ status: false, error: "Something went wrong.", error_data: err.message });
    }
};

// Patient Profile
exports.patientProfile = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id).select('-password');
        if (!patient) {
            return res.status(404).json({ status: false, error: "Patient not found." });
        }
        res.status(200).json({ status: true, data: patient });
    } catch (err) {
        res.status(500).json({ status: false, error: "Something went wrong.", error_data: err.message });
    }
};

// Forgot Password (Send OTP)
exports.forgotPassword = async (req, res) => {
    // Implement OTP generation and sending logic here
    res.status(200).json({ status: true, message: "OTP sent to registered email." });
};

// Verify OTP
exports.verifyOtp = async (req, res) => {
    // Implement OTP verification logic here
    res.status(200).json({ status: true, message: "OTP verified." });
};

// Reset Password
exports.resetPassword = async (req, res) => {
    // Implement password reset logic here
    res.status(200).json({ status: true, message: "Password reset successful." });
};

// Book Appointment
exports.bookAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.create({
            patient: req.user.id,
            doctor: req.body.doctorId,
            date: req.body.date,
            time: req.body.time,
            reason: req.body.reason
        });
        res.status(201).json({
            status: true,
            message: "Appointment booked successfully.",
            data: appointment
        });
    } catch (err) {
        res.status(500).json({
            status: false,
            error: "Something went wrong.",
            error_data: err.message
        });
    }
};

// Get All Appointments for Patient
exports.getPatientAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ patient: req.user.id });
        res.status(200).json({ status: true, data: appointments });
    } catch (err) {
        res.status(500).json({ status: false, error: "Something went wrong.", error_data: err.message });
    }
};

// Get Single Appointment by ID
exports.getPatientAppointmentById = async (req, res) => {
    try {
        const appointment = await Appointment.findOne({ _id: req.params.id, patient: req.user.id });
        if (!appointment) {
            return res.status(404).json({ status: false, error: "Appointment not found." });
        }
        res.status(200).json({ status: true, data: appointment });
    } catch (err) {
        res.status(500).json({ status: false, error: "Something went wrong.", error_data: err.message });
    }
};

// Update Appointment
exports.updatePatientAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findOneAndUpdate(
            { _id: req.params.id, patient: req.user.id },
            req.body,
            { new: true }
        );
        if (!appointment) {
            return res.status(404).json({ status: false, error: "Appointment not found." });
        }
        res.status(200).json({ status: true, message: "Appointment updated.", data: appointment });
    } catch (err) {
        res.status(500).json({ status: false, error: "Something went wrong.", error_data: err.message });
    }
};

// Delete Appointment
exports.deletePatientAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findOneAndDelete({ _id: req.params.id, patient: req.user.id });
        if (!appointment) {
            return res.status(404).json({ status: false, error: "Appointment not found." });
        }
        res.status(200).json({ status: true, message: "Appointment deleted." });
    } catch (err) {
        res.status(500).json({ status: false, error: "Something went wrong.", error_data: err.message });
    }
};