var express = require('express');
var router = express.Router();

const jwt = require('jsonwebtoken');
const passport = require('passport');

const User = require('../models/users');
const Account = require('../models/accounts');


//CRUD on charges

router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const user = await User.findOne({ token: req.user.token }).populate('accounts');
    if (!user) {
      return res.status(404).json({ result: false, error: "Utilisateur introuvable." });
    }

    res.status(200).json({ result: true, data: user });
  } catch (err) {
    res.status(500).json({ result: false, error: err.message });
  }
});

//POST new charge

router.post('/new', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { account, charge } = req.body;

  try {
    const user = await User.findOne({ token: req.user.token }).populate('accounts');
    if (!user) {
      return res.status(404).json({ result: false, error: "Utilisateur introuvable." });
    }

    const userAccount = user.accounts.find(e => e.name === account.name);
    if (userAccount) {
      const accountData = await Account.findById(userAccount._id);
      accountData.charges.push(charge);
      await accountData.save();

      res.status(200).json({ result: true, message: "Nouvelle charge enregistrée" });
    } else {
      res.status(404).json({ result: false, error: "Le compte n'existe pas." });
    }
  } catch (err) {
    res.status(500).json({ result: false, error: err.message });
  }
});

router.put('/update', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { account, oldCharge, updatedCharge } = req.body;

  try {
    const user = await User.findOne({ token: req.user.token }).populate('accounts');
    if (!user) {
      return res.status(404).json({ result: false, error: "Utilisateur introuvable." });
    }

    const userAccount = user.accounts.find(e => e.name === account.name);
    if (!userAccount) {
      return res.status(404).json({ result: false, error: "Le compte n'existe pas." });
    }

    const accountData = await Account.findById(userAccount._id);
    const chargeToUpdate = accountData.charges.find(e => e.name === oldCharge.name);
    if (!chargeToUpdate) {
      return res.status(404).json({ result: false, error: "La charge à mettre à jour est introuvable." });
    }

    accountData.charges.pull(chargeToUpdate);
    accountData.charges.push(updatedCharge);

    await accountData.save();

    res.status(200).json({ result: true, message: "Charge mise à jour avec succès." });
  } catch (err) {
    res.status(500).json({ result: false, error: err.message });
  }
});

//charge delete

router.delete('/delete', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { account, oldCharge } = req.body;

  try {
    const user = await User.findOne({ token: req.user.token }).populate('accounts');
    if (!user) {
      return res.status(404).json({ result: false, error: "Utilisateur introuvable." });
    }

    const userAccount = user.accounts.find(e => e.name === account.name);
    if (!userAccount) {
      return res.status(404).json({ result: false, error: "Le compte n'existe pas." });
    }

    const accountData = await Account.findById(userAccount._id);
    const chargeToDelete = accountData.charges.find(e => e.name === oldCharge.name);
    if (!chargeToDelete) {
      return res.status(404).json({ result: false, error: "La charge à supprimer est introuvable." });
    }

    accountData.charges.pull(chargeToDelete);

    await accountData.save();

    res.status(200).json({ result: true, message: "Charge supprimée avec succès." });
  } catch (err) {
    res.status(500).json({ result: false, error: err.message });
  }
});

module.exports = router;