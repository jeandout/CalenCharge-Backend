var express = require('express');
var router = express.Router();

const jwt = require('jsonwebtoken');
const passport = require('passport');

const User = require('../models/users');


//CRUD on charges

router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {

  try {
    const data = await User.findById(req.user._id).populate('accounts')
    res.status(200).json({ result: true, data: data });

  } catch (err) {
    res.status(500).json({ result: false, error: err.message });
  }

});

//charge new
//post body 
//pour l'utilisateur qui est identifié avec son mail, rechercher un compte avec son nom, puis ajouter une charge
router.post('/new', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { account, charge } = req.body;
  try {
    const data = await User.findById(req.user._id).populate('accounts')
    if (data.accounts.find(e => e.name == account)) {
      data.accounts.find(e => e.name == account).charges.push(charge)
      data.accounts.find(e => e.name == account).save()
      res.status(200).json({ result: true, data });
    } else {
      res.status(500).json({ result: false, error: "Le compte n'existe pas" });
    }
  } catch (err) {
    res.status(500).json({ result: false, error: err.message });
  }
});



//charge update
router.put('/update', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { account, chargeToUpdate, charge } = req.body;
  try {
    const data = await User.findById(req.user._id).populate('accounts')
    if (data.accounts.find(e => e.name == account)) {
      data.accounts.find(e => e.name == account)=data.accounts.find(e => e.name == account).charges.filter(e => e.name !== chargeToUpdate.name)
      data.accounts.find(e => e.name == account).charges.push(charge)
      data.accounts.find(e => e.name == account).save()
      res.status(200).json({ result: true, data });

    } else {
      res.status(500).json({ result: false, error: "Le compte n'existe pas" });
    }
  } catch (err) {
    res.status(500).json({ result: false, error: err.message });
  }
});

//charge delete

router.put('/update', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { account, charge } = req.body;
  try {
    const data = await User.findById(req.user._id).populate('accounts')
    if (data.accounts.find(e => e.name == account)) {
      data.accounts.find(e => e.name == account).charges.filter(e => e.name !== charge.name)

      data.accounts.find(e => e.name == account).save()
      res.status(200).json({ result: true, data });

    } else {
      res.status(500).json({ result: false, error: "Le compte n'existe pas" });
    }
  } catch (err) {
    res.status(500).json({ result: false, error: err.message });
  }
});

module.exports = router;