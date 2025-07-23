const express = require('express');
require('dotenv').config();
const app = express();
require('./config/database');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/admin', require('./routes/admin.routes'));
app.use('/api/doctor', require('./routes/doctor.routes'));
app.use('/api/patient', require('./routes/patient.routes'));
app.use('/api/appointment', require('./routes/appointment.routes'));
app.use('/api/dashboard', require('./routes/dashboard.routes'));

app.listen(process.env.PORT, (err) => {
    if (err) {
        console.log("Error: ", err);
        return;
    }
    console.log(`Server started at http://localhost:${process.env.PORT}`);
});

