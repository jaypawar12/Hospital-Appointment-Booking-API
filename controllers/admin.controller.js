const Admin = require('../models/admin.model');
const Patient = require('../models/patient.model');
const Doctor = require('../models/doctor.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const fs = require('fs');

// ------------------ LOGIN CONTROLLER ------------------
exports.login = async (req, res) => {
    try {
        const currentAdmin = await Admin.findOne({ email: req.body.email });
        console.log("Current Admin: ", currentAdmin);


        if (!currentAdmin) {
            res.status(401).json({
                status: false,
                error: "Admin not found..."
            });
        }

        const isMatch = await bcrypt.compare(req.body.password, currentAdmin.password);
        console.log("Password Match: ", isMatch);
        if (isMatch) {
            const token = jwt.sign(
                { current_user: currentAdmin },
                process.env.Secret,
                { expiresIn: "7d" }
            );

            res.status(201).json({
                status: true,
                success: "Admin Login Successfully...",
                user: currentAdmin,
                auth_token: token,
            });
        } else {
            res.status(401).json({
                status: false,
                error: "Password is incorrect..."
            });
        }
    } catch (e) {
        res.status(400).json({
            status: false,
            error: "Something went wrong...",
            error_data: e.message,
        });
    }
};

// ------------------ ADD ADMIN CONTROLLER ------------------
exports.addAdmin = async (req, res) => {
    try {
        const existingAdmin = await Admin.findOne({ email: req.body.email });

        if (existingAdmin) {
            return res.status(401).json({
                status: false,
                error: "Email already exists..."
            });
        }

        req.body.password = await bcrypt.hash(req.body.password, 11);
        req.body.image = req.file.path;
        const newAdmin = await Admin.create(req.body);

        if (newAdmin) {
            const token = jwt.sign(
                { id: newAdmin._id, role: 'admin' },
                process.env.Secret,
                { expiresIn: "7d" }
            );
            return res.status(201).json({
                status: true,
                success: "Admin registered successfully.",
                data: newAdmin,
                token: token
            });
        } else {
            return res.status(401).json({
                status: false,
                error: "Admin registration failed."
            });
        }
    } catch (err) {
        return res.status(400).json({
            status: false,
            error: "Something went wrong...",
            error_data: err.message,
        });
    }
};

// ------------------ GET ADMIN CONTROLLERS ------------------
exports.getAdmins = async (req, res) => {
    try {
        const admins = await Admin.find();
        if (admins.length > 0) {
            res.status(200).json({
                status: true,
                message: "Admins Got successfully.",
                data: admins
            });
        } else {
            res.status(404).json({
                status: false,
                error: "No admins found."
            });
        }
    } catch (err) {
        res.status(400).json({
            status: false,
            error: "Something went wrong...",
            error_data: err.message,
        });
    }
}

// ------------------ GET Admin by ID ------------------ 
exports.getAdminById = async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id);
        if (admin) {
            res.status(200).json({
                status: true,
                message: "Admin found successfully.",
                data: admin
            });
        } else {
            res.status(404).json({
                status: false,
                error: "Admin not found."
            });
        }
    } catch (err) {
        res.status(400).json({
            status: false,
            error: "Something went wrong...",
            error_data: err.message,
        });
    }
};

// ------------------ DELETE ADMIN CONTROLLER ------------------
exports.deleteAdminById = async (req, res) => {
    try {
        const admin = await Admin.findByIdAndDelete(req.params.id);
        if (admin) {
            fs.unlinkSync(admin.image);
            res.status(200).json({
                status: true,
                message: "Admin deleted successfully."
            });
        } else {
            res.status(404).json({
                status: false,
                error: "Admin not found."
            });
        }
    } catch (err) {
        res.status(400).json({
            status: false,
            error: "Something went wrong...",
            error_data: err.message,
        });
    }
}

// ------------------ UPDATE ADMIN CONTROLLER ------------------
exports.updateAdmin = async (req, res) => {
    try {
        if (req.file) {
            req.body.image = req.file.path;
        }
        const updatedAdmin = await Admin.findByIdAndUpdate(req.params.id, req.body);
        if (req.file && updatedAdmin.image) {
            fs.unlinkSync(updatedAdmin.image);
        }
        if (updatedAdmin) {
            res.status(200).json({
                status: true,
                message: "Admin updated successfully.",
                data: updatedAdmin
            });
        } else {
            res.status(404).json({
                status: false,
                error: "Admin not found."
            });
        }
    } catch (err) {
        res.status(400).json({
            status: false,
            error: "Something went wrong...",
            error_data: err.message,
        });
    }
};

// ------------------ CHANGE PASSWORD CONTROLLER ------------------
exports.changePassword = async (req, res) => {
    try {
        const admin = await Admin.findById(req.user._id);
        if (!admin) {
            return res.status(404).json({
                status: false,
                error: "Admin not found."
            });
        }

        const isMatch = await bcrypt.compare(req.body.oldPassword, admin.password);
        if (!isMatch) {
            return res.status(401).json({
                status: false,
                error: "Old password is incorrect."
            });
        }

        const newPassword = await bcrypt.hash(req.body.newPassword, 11);
        admin.password = newPassword;
        await admin.save();

        res.status(200).json({
            status: true,
            message: "Password changed successfully."
        });
    } catch (err) {
        res.status(400).json({
            status: false,
            error: "Something went wrong...",
            error_data: err.message,
        });
    }
};

// ------------------ ADMIN PROFILE CONTROLLER ------------------
exports.adminProfile = async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id);
        if (admin) {
            res.status(200).json({
                status: true,
                message: "Admin profile fetched successfully.",
                data: admin
            });
        } else {
            res.status(404).json({
                status: false,
                error: "Admin not found."
            });
        }
    } catch (err) {
        res.status(400).json({
            status: false,
            error: "Something went wrong...",
            error_data: err.message,
        });
    }
}

// ------------------ ADD PATIENT CONTROLLER ------------------
exports.addPatient = async (req, res) => {
    try {
        const newPatient = await Patient.create(req.body);
        if (newPatient) {
            res.status(201).json({
                status: true,
                message: "Patient added successfully.",
                data: newPatient
            });
        } else {
            res.status(400).json({
                status: false,
                error: "Failed to add patient."
            });
        }
    } catch (err) {
        res.status(400).json({
            status: false,
            error: "Something went wrong...",
            error_data: err.message,
        });
    }
}

// ------------------ UPDATE PATIENT CONTROLLER ------------------
exports.updatePatient = async (req, res) => {
    try {
        const updatedPatient = await Patient.findByIdAndUpdate(req.params.id, req.body);
        if (updatedPatient) {
            res.status(200).json({
                status: true,
                message: "Patient updated successfully.",
                data: updatedPatient
            });
        } else {
            res.status(404).json({
                status: false,
                error: "Patient not found."
            });
        }
    } catch (err) {
        res.status(400).json({
            status: false,
            error: "Something went wrong...",
            error_data: err.message,
        });
    }
}

// ------------------ DELETE PATIENT CONTROLLER ------------------
exports.deletePatient = async (req, res) => {
    try {
        const patient = await Patient.findByIdAndDelete(req.params.id);
        if (patient) {
            res.status(200).json({
                status: true,
                message: "Patient deleted successfully."
            });
        } else {
            res.status(404).json({
                status: false,
                error: "Patient not found."
            });
        }
    } catch (err) {
        res.status(400).json({
            status: false,
            error: "Something went wrong...",
            error_data: err.message,
        });
    }
}

// ------------------ GET PATIENT BY ID CONTROLLER ------------------
exports.getPatient = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (patient) {
            res.status(200).json({
                status: true,
                message: "Patient found successfully.",
                data: patient
            });
        } else {
            res.status(404).json({
                status: false,
                error: "Patient not found."
            });
        }
    } catch (err) {
        res.status(400).json({
            status: false,
            error: "Something went wrong...",
            error_data: err.message,
        });
    }
}

// ------------------ FETCH ALL PATIENTS CONTROLLER ------------------
exports.fetchAllPatients = async (req, res) => {
    try {
        const patients = await Patient.find();
        if (patients) {
            res.status(200).json({
                status: true,
                message: "Patients fetched successfully.",
                data: patients
            });
        } else {
            res.status(404).json({
                status: false,
                error: "No patients found."
            });
        }
    } catch (err) {
        res.status(400).json({
            status: false,
            error: "Something went wrong...",
            error_data: err.message,
        });
    }
}

// ------------------ ADD DOCTOR CONTROLLER ------------------
exports.addDoctor = async (req, res) => {
    try {
        const newDoctor = await Doctor.create(req.body);
        if (newDoctor) {
            res.status(201).json({
                status: true,
                message: "Doctor added successfully.",
                data: newDoctor
            });
        } else {
            res.status(400).json({
                status: false,
                error: "Failed to add doctor."
            });
        }
    } catch (err) {
        res.status(400).json({
            status: false,
            error: "Something went wrong...",
            error_data: err.message,
        });
    }
}

// ------------------ UPDATE DOCTOR CONTROLLER ------------------
exports.updateDoctor = async (req, res) => {
    try {
        const updatedDoctor = await Doctor.findByIdAndUpdate(req.params.id, req.body);
        if (updatedDoctor) {
            res.status(200).json({
                status: true,
                message: "Doctor updated successfully.",
                data: updatedDoctor
            });
        } else {
            res.status(404).json({
                status: false,
                error: "Doctor not found."
            });
        }
    } catch (err) {
        res.status(400).json({
            status: false,
            error: "Something went wrong...",
            error_data: err.message,
        });
    }
}

// ------------------ FETCH ALL DOCTORS CONTROLLER ------------------
exports.fetchAllDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find();
        if (doctors) {
            res.status(200).json({
                status: true,
                message: "Doctors fetched successfully.",
                data: doctors
            });
        } else {
            res.status(404).json({
                status: false,
                error: "No doctors found."
            });
        }
    } catch (err) {
        res.status(400).json({
            status: false,
            error: "Something went wrong...",
            error_data: err.message,
        });
    }
}

// ------------------ GET DOCTOR BY ID CONTROLLER ------------------
exports.getDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id);
        if (doctor) {
            res.status(200).json({
                status: true,
                message: "Doctor found successfully.",
                data: doctor
            });
        } else {
            res.status(404).json({
                status: false,
                error: "Doctor not found."
            });
        }
    } catch (err) {
        res.status(400).json({
            status: false,
            error: "Something went wrong...",
            error_data: err.message,
        });
    }
}

// ------------------ DELETE DOCTOR CONTROLLER ------------------
exports.deleteDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findByIdAndDelete(req.params.id);
        if (doctor) {
            res.status(200).json({
                status: true,
                message: "Doctor deleted successfully."
            });
        } else {
            res.status(404).json({
                status: false,
                error: "Doctor not found."
            });
        }
    } catch (err) {
        res.status(400).json({
            status: false,
            error: "Something went wrong...",
            error_data: err.message,
        });
    }
}