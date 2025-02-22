const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    location: { type: String, default: "Unknown location" } // Default value if not provided
});

const User = mongoose.model('User', userSchema);

module.exports = User;
