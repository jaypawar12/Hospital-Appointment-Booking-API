const Appointment = require('../models/appointment.model');
const Doctor = require('../models/doctor.model'); // Assuming Doctor model is in the same directory

// Book Appointment
exports.bookAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.create({
            patient: req.body.patientId,
            doctor: req.body.doctorId,
            date: req.body.date,
            time: req.body.time,
            reason: req.body.reason,
            status: 'pending'
        });
        res.status(201).json({ status: true, message: "Appointment booked.", data: appointment });
    } catch (err) {
        res.status(500).json({ status: false, error: "Something went wrong.", error_data: err.message });
    }
};

// Get All Appointments
exports.getAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find();
        res.status(200).json({ status: true, data: appointments });
    } catch (err) {
        res.status(500).json({ status: false, error: "Something went wrong.", error_data: err.message });
    }
};

// Get Appointments by Patient ID
exports.getAppointmentsByPatient = async (req, res) => {
    try {
        const appointments = await Appointment.find({ patient: req.params.id });
        res.status(200).json({ status: true, data: appointments });
    } catch (err) {
        res.status(500).json({ status: false, error: "Something went wrong.", error_data: err.message });
    }
};

// Cancel Appointment
exports.cancelAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndDelete(req.params.id);
        if (!appointment) {
            return res.status(404).json({ status: false, error: "Appointment not found." });
        }
        res.status(200).json({ status: true, message: "Appointment cancelled." });
    } catch (err) {
        res.status(500).json({ status: false, error: "Something went wrong.", error_data: err.message });
    }
};

// Get Doctor Slots
exports.getDoctorSlots = async (req, res) => {
    try {
        // Assuming doctor model has a 'slots' field
        const doctor = await Doctor.findById(req.params.doctorId);
        if (!doctor) {
            return res.status(404).json({ status: false, error: "Doctor not found." });
        }
        res.status(200).json({ status: true, slots: doctor.slots });
    } catch (err) {
        res.status(500).json({ status: false, error: "Something went wrong.", error_data: err.message });
    }
};

// Reschedule Appointment
exports.rescheduleAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            { date: req.body.date, time: req.body.time },

        );
        if (!appointment) {
            return res.status(404).json({ status: false, error: "Appointment not found." });
        }
        res.status(200).json({ status: true, message: "Appointment rescheduled.", data: appointment });
    } catch (err) {
        res.status(500).json({ status: false, error: "Something went wrong.", error_data: err.message });
    }
};

// Appointment Status Update
exports.updateAppointmentStatus = async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },

        );
        if (!appointment) {
            return res.status(404).json({ status: false, error: "Appointment not found." });
        }
        res.status(200).json({ status: true, message: "Status updated.", data: appointment });
    } catch (err) {
        res.status(500).json({ status: false, error: "Something went wrong.", error_data: err.message });
    }
};

// Filter by Date
exports.filterAppointmentsByDate = async (req, res) => {
    try {
        const appointments = await Appointment.find({ date: req.params.date });
        res.status(200).json({ status: true, data: appointments });
    } catch (err) {
        res.status(500).json({ status: false, error: "Something went wrong.", error_data: err.message });
    }
};