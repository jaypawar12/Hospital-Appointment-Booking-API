const Admin = require('../models/admin.model');
const Doctor = require('../models/doctor.model');
const Patient = require('../models/patient.model');
const Appointment = require('../models/appointment.model');

exports.getAnalytics = async (req, res) => {
    try {
        const adminCount = await Admin.countDocuments();
        const doctorCount = await Doctor.countDocuments();
        const patientCount = await Patient.countDocuments();
        const appointmentCount = await Appointment.countDocuments();

        res.json({
            adminCount,
            doctorCount,
            patientCount,
            appointmentCount
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};