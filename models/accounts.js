const mongoose = require('mongoose');
//{ "amount": "42", "chargeType": 3, "date": "2024-07-20T22:00:00.000Z", "name": "Abonnement Canard PC", "priority": false, "recurrence": 1, "recurrenceList": [6, 9, 0, 3] },
const chargesSchema = mongoose.Schema({
    name: {type: String, required: true },  
    amount: {type:Number, required: true },
    chargeType: Number,
    recurrence: Number,
    recurrenceList : [Number],
    date: String,
    priority: { type:Boolean, default: false }
}); //, { _id: false } desactives la génération automatique d'un champ ID mais à voir avec l'équipe

const accountSchema = mongoose.Schema({
    name: {type:String, required: true },
    icon: String,
    charges: [chargesSchema]
});

const Account = mongoose.model('accounts', accountSchema);

module.exports = Account;
