var express = require('express');
var router = express.Router();

const jwt = require('jsonwebtoken');
const passport = require('passport');

const User = require('../models/users');


//CRUD on charges

// router.get('/', (req, res) => {

//   User.find().populate('accounts').then(data => {

//     if (data) {
//       //afficher un compte
//       res.json({
//         result: true, obj: data
//         //afficher une charge
//         // res.json({ result: true, obj: data[0].accounts[0].charges[0]
//       });
//     } else {
//       res.json({ result: false, error: 'User not found' });
//     }
//   })

// });

router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {



  try {
    const data = await User.find().populate('accounts')
    res.status(200).json({ result: true, data });

  } catch (err) {
    res.status(500).json({ result: false, error: err.message });
  }



});

//charge new
//post body 
//pour l'utilisateur qui est identifié avec son mail, rechercher un compte avec son nom, puis ajouter une charge
router.post('/new', (req, res) => {

  User.findOne({ email: req.body.email }).populate('accounts').then(data => {

    if (data) { //si l'utilisateur existe

      if (data.accounts.find(e => e.name == req.body.account)) { //si le compte existe

        data.accounts.find(e => e.name == req.body.account).charges.push(req.body.newCharge)//ajouter l'objet charge transmis au compte
        data.accounts.find(e => e.name == req.body.account).save(); //sauvegarder la charge ajouté
        res.json({ result: true, obj: data });

      } else {
        res.json({ result: false, error: 'Account not found' });
      }
    }
    else {
      res.json({ result: false, error: 'User not found' });
    }
  })


});

//charge update
router.put('/update', (req, res) => {

  User.findOne({ email: req.body.email }).populate('accounts').then(data => {

    if (data) { //si l'utilisateur existe

      if (data.accounts.find(e => e.name == req.body.account)) { //si le compte existe

        if ((data.accounts.find(e => e.name == req.body.account)).find(e => e.name == req.body.charge)) {
          //update charge with req.body.charge
        } else {
          res.json({ result: false, error: 'Charge does not exist' });
        }

      } else {
        res.json({ result: false, error: 'Account not found' });
      }
    }
    else {
      res.json({ result: false, error: 'User not found' });
    }
  })


});

//charge delete

module.exports = router;