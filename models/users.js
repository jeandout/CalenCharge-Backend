const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    email: String,
    password:String,
    google_credentials: String,
    settings: Object,
    token: String,
    accounts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'accounts', }]
});

const User = mongoose.model('users', userSchema);

module.exports = User;