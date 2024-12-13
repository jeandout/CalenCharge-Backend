const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/users');
const Account = require('../models/accounts');
require('dotenv').config();

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET_KEY;

// GET infos of authenticated user
router.get('/user', passport.authenticate('jwt', { session: false }), async (req, res) => {

  try {
    const user = await User.findById(req.user._id).populate('accounts');

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.status(200).json({ result:true, user});
  } catch (err) {
    res.status(500).json({result:false, message: 'Erreur lors de la synchronisation des données', error: err.message });
  }

});

<<<<<<< HEAD
//get pour toute la base 
//post 

module.exports = router;

//GET all accounts info
=======
module.exports = router;
>>>>>>> 34ed40f5d12830499137efb3d8248664ed2238d4
