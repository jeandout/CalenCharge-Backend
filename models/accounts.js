const mongoose = require('mongoose');

const chargesSchema = mongoose.Schema({
    name: {String, required: true },  
    amount: {Number, required: true },
    type: String,
    recurrence: {String, enum: ['monthly', 'quarterly', 'semi-annual', 'yearly'], required: true },
    first_date: {String, required: true },
    priority: { Boolean, default: false }
}, { _id: false }); // desactives la génération automatique d'un champ ID mais à voir avec l'équipe

const accountSchema = mongoose.Schema({
    name: {String, required: true },
    icon: String,
    charges: [chargesSchema]
}, { timestamps: true });

const Account = mongoose.model('accounts', accountSchema);

module.exports = Account;
