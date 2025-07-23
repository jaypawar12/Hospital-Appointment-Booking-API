const Doctor = require('../models/doctor.model');
const Appointment = require('../models/appointment.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 

// ------------------ Add Doctor (Register) ------------------
exports.addDoctor = async (req, res) => {
    try {
        const existingDoctor = await Doctor.findOne({ email: req.body.email });
        if (existingDoctor) {
            return res.status(409).json({
                status: false,
                error: "Email already exists."
            });
        }
        req.body.password = await bcrypt.hash(req.body.password, 11);
        const newDoctor = await Doctor.create(req.body);

        // Create JWT token
        const token = jwt.sign({ id: newDoctor._id, role: 'doctor' }, process.env.Secret, { expiresIn: '7d' });

        res.status(201).json({
            status: true,
            message: "Doctor registered successfully.",
            data: newDoctor,
            token: token
        });
    } catch (err) {
        res.status(500).json({
            status: false,
            error: "Something went wrong.",
            error_data: err.message,
        });
    }
};

// ------------------ Doctor Login ------------------
exports.loginDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ email: req.body.email });
        if (!doctor) {
            return res.status(401).json({
                status: false,
                error: "Invalid email or password."
            });
        }
        const isMatch = await bcrypt.compare(req.body.password, doctor.password);
        if (!isMatch) {
            return res.status(401).json({
                status: false,
                error: "Invalid email or password."
            });
        }

        // Create JWT token
        const token = jwt.sign({ id: doctor._id, role: 'doctor' }, process.env.Secret, { expiresIn: '7d' });

        res.status(200).json({
            status: true,
            message: "Login successful.",
            data: doctor,
            token: token
        });
    } catch (err) {
        res.status(500).json({
            status: false,
            error: "Something went wrong.",
            error_data: err.message,
        });
    }
};

// ------------------ Get All Doctors ------------------
exports.getDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find();
        res.status(200).json({
            status: true,
            message: "Doctors fetched successfully.",
            data: doctors
        });
    } catch (err) {
        res.status(500).json({
            status: false,
            error: "Something went wrong.",
            error_data: err.message,
        });
    }
};

// ------------------ Get Doctor By ID ------------------
exports.getDoctorById = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id);
        if (!doctor) {
            return res.status(404).json({
                status: false,
                error: "Doctor not found."
            });
        }
        res.status(200).json({
            status: true,
            message: "Doctor fetched successfully.",
            data: doctor
        });
    } catch (err) {
        res.status(500).json({
            status: false,
            error: "Something went wrong.",
            error_data: err.message,
        });
    }
};

// ------------------ Update Doctor ------------------
exports.updateDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body);
        if (!doctor) {
            return res.status(404).json({
                status: false,
                error: "Doctor not found."
            });
        }
        res.status(200).json({
            status: true,
            message: "Doctor updated successfully.",
            data: doctor
        });
    } catch (err) {
        res.status(500).json({
            status: false,
            error: "Something went wrong.",
            error_data: err.message,
        });
    }
};

// ------------------ Delete Doctor ------------------

exports.deleteDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findByIdAndDelete(req.params.id);
        if (!doctor) {
            return res.status(404).json({
                status: false,
                error: "Doctor not found."
            });
        }
        res.status(200).json({
            status: true,
            message: "Doctor deleted successfully."
        });
    } catch (err) {
        res.status(500).json({
            status: false,
            error: "Something went wrong.",
            error_data: err.message,
        });
    }
};

// ------------------ Get All Appointments for a Doctor ------------------
exports.getAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ doctor: req.params.doctorId });
        res.status(200).json({
            status: true,
            message: "Appointments fetched successfully.",
            data: appointments
        });
    } catch (err) {
        res.status(500).json({
            status: false,
            error: "Something went wrong.",
            error_data: err.message,
        });
    }
};

// ------------------ Confirm an Appointment ------------------
exports.confirmAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findOneAndUpdate(
            { _id: req.params.appointmentId, doctor: req.params.doctorId },
            { status: 'confirmed' },
        );
        if (!appointment) {
            return res.status(404).json({
                status: false,
                error: "Appointment not found."
            });
        }
        res.status(200).json({
            status: true,
            message: "Appointment confirmed.",
            data: appointment
        });
    } catch (err) {
        res.status(500).json({
            status: false,
            error: "Something went wrong.",
            error_data: err.message,
        });
    }
};

// ------------------ Change Doctor Password ------------------
exports.changePassword = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.user.id);
        if (!doctor) {
            return res.status(404).json({ status: false, error: "Doctor not found." });
        }
        const isMatch = await bcrypt.compare(req.body.oldPassword, doctor.password);
        if (!isMatch) {
            return res.status(400).json({ status: false, error: "Old password is incorrect." });
        }
        doctor.password = await bcrypt.hash(req.body.newPassword, 11);
        await doctor.save();
        res.status(200).json({ status: true, message: "Password changed successfully." });
    } catch (err) {
        res.status(500).json({ status: false, error: "Something went wrong.", error_data: err.message });
    }
};

// ------------------ Doctor Profile ------------------
exports.doctorProfile = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id).select('-password');
        if (!doctor) {
            return res.status(404).json({ status: false, error: "Doctor not found." });
        }
        res.status(200).json({ status: true, data: doctor });
    } catch (err) {
        res.status(500).json({ status: false, error: "Something went wrong.", error_data: err.message });
    }
};

// ------------------ Manage Schedule (example: add schedule slots) ------------------
exports.manageSchedule = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.user.id);
        if (!doctor) {
            return res.status(404).json({ status: false, error: "Doctor not found." });
        }
        doctor.schedule = req.body.schedule; // schedule: [{ date, slots }]
        await doctor.save();
        res.status(200).json({ status: true, message: "Schedule updated.", data: doctor.schedule });
    } catch (err) {
        res.status(500).json({ status: false, error: "Something went wrong.", error_data: err.message });
    }
};