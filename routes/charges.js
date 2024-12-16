var express = require('express');
var router = express.Router();

const jwt = require('jsonwebtoken');
const passport = require('passport');

const User = require('../models/users');
const Account = require('../models/accounts');


//CRUD on charges

router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {

  try {
    const data = await User.findById(req.user._id).populate('accounts')
    res.status(200).json({ result: true, data: data });

  } catch (err) {
    res.status(500).json({ result: false, error: err.message });
  }

});

//charge new OK
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
  const { account, oldCharge, updatedCharge } = req.body;
  try {
    const user = await User.findById(req.user._id).populate('accounts')
    if (user.accounts.find(e => e.name == account[0].name)) {
      const accountId = (user.accounts.find(e => e.name == account[0].name))._id
      console.log(accountId)
      const data = await Account.findById(accountId)
      const chargeToDelete = data.charges.find(e => e.name == oldCharge.name)
      const chargeToDeleteId = data.charges.id(chargeToDelete.id)
      if (chargeToDeleteId){
        chargeToDeleteId.remove()
        await data.save()
      }
      // data.charges = data.charges.map(e =>
      //   e.name === oldCharge.name && e = updatedCharge
      // );
      
    } else {
      res.status(500).json({ result: false, error: "Le compte n'existe pas" });
    }
  }
  catch (err) {
    res.status(500).json({ result: false, error: err.message });
  }
}
);

//charge delete

// router.put('/update', passport.authenticate('jwt', { session: false }), async (req, res) => {
//   const { account, charge } = req.body;
//   try {
//     const data = await User.findById(req.user._id).populate('accounts')
//     if (data.accounts.find(e => e.name == account)) {
//       data.accounts.find(e => e.name == account).charges.filter(e => e.name !== charge.name)

//       data.accounts.find(e => e.name == account).save()
//       res.status(200).json({ result: true, data });

//     } else {
//       res.status(500).json({ result: false, error: "Le compte n'existe pas" });
//     }
//   } catch (err) {
//     res.status(500).json({ result: false, error: err.message });
//   }
// });

module.exports = router;