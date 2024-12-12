const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    email: String,
    google_credentials: String,
    settings: Object,
    token: String,
    accounts: [{ ref: 'accounts' }]
});

const User = mongoose.model('users', userSchema);

module.exports = User;