const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URL, {
}).then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB error:', err));

