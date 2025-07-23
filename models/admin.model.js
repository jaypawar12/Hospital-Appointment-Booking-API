const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
    f_name: String,
    l_name: String,
    email: String,
    phone: String,
    age: Number,
    role: String,
    password: String,
    image: String
}, {
    timestamps: true,
});

module.exports = mongoose.model('Admin', AdminSchema, 'Admin');

