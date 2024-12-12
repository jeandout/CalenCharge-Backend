const mongoose = require('mongoose');

const chargesSchema = mongoose.Schema({
    name: { required: true },   
    amount: { required: true },
    type: String,
    recurrence: { enum: ['monthly', 'quarterly', 'semi-annual', 'yearly'], required: true },
    first_date: { required: true },
    priority: { default: false }
}, { _id: false }); // desactives la génération automatique d'un champ ID mais à voir avec l'équipe

const accountsSchema = mongoose.Schema({
    name: { required: true },
    icon: String,
    charges: [chargesSchema]
}, { timestamps: true });

const Account = mongoose.model('Account', accountsSchema);

module.exports = Account;
