var express = require('express');
var router = express.Router();
const Account = require('../models/accounts');
const User = require('../models/users');
const jwt = require('jsonwebtoken');
const passport = require('passport');
require('dotenv').config();

//account/new : route pour ajouter un compte bancaire
router.post('/new', passport.authenticate('jwt', { session: false }) , async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('accounts');
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    const account= req.body.account;
    const newAccount = new Account({
      name: account.name,
      icon: account.icon,
      charges: [],
    });
    await newAccount.save();
  
    res.json({ result: true, message: 'Compte ajouté avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ result: false, message: 'Erreur lors de la création d\'un compte' });
  }
});


//account/delete : route pour supprimer un compte bancaire
router.delete('/delete', passport.authenticate('jwt', { session: false }), async (req, res) => {

  try {
    const user = await User.findById(req.user._id).populate('accounts');
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    const account= user.accounts.filter(e=>e.name === req.body.account.name) 
    console.log(user)
    console.log(account)
    await Account.findByIdAndDelete(account._id);
    res.json({ result: true, message: 'Compte supprimé avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ result: false, message: 'Erreur lors de la suppression du compte' });
  }
});

//acount/update : route pour mettre à jour un compte bancaire
router.put('/update', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('accounts');
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    const account= user.accounts.filter(e=>e.name === req.body.account.name) 
    await Account.updateOne(({ _id: account._id }, { 
      name: req.body.accountInput, 
      icon: req.body.iconInput,
    }));
    res.json({ result: true, message: 'Compte modifié avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ result: false, message: 'Erreur lors de la modification du compte' });
  }
});


module.exports = router;
