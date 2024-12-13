const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/users');
const Account = require('../models/accounts');
require('dotenv').config();

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET_KEY;

// Route d'inscription (sign-up)
router.post('/signup', async (req, res) => {
  const { email, password, store } = req.body;

  //POST to import all store

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({result:false, message: 'Email déjà utilisé' });
    }

    let accounts=[];

    if(store.accounts.length>0){
      store.accounts.forEach(async(account)=>{
        const newAccount = new Account({
          name:account.name,
          icon:account.icon,
          charges:account.charges
        })
        await newAccount.save();
        accounts.push(newAccount._id);
        console.log('account added');

        //newAccount.save().then(()=>{accounts.push(newAccount._id); console.log('account added')})
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ email, password: hashedPassword, settings:store.settings, accounts });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id, email }, SECRET_KEY, { expiresIn: '1h' });

    res.status(201).json({result:true, message: 'Inscription réussie', token });
  } catch (err) {
    res.status(500).json({result:false, message: 'Erreur lors de l\'inscription', error: err.message });
  }
});

// Route de connexion (sign-in)
router.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({result:false, message: 'Email ou mot de passe incorrect' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({result:false, message: 'Email ou mot de passe incorrect' });
    }

    const token = jwt.sign({ id: user._id, email }, SECRET_KEY, { expiresIn: '1h' });

    res.json({result:true, message: 'Connexion réussie', token });
  } catch (err) {
    res.status(500).json({result:false, message: 'Erreur lors de la connexion', error: err.message });
  }
});

// Route protégée
router.get('/protected', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({ message: `Bienvenue, ${req.user.email}` });
});

// Route pour supprimer un compte
router.delete('/delete-account', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    res.status(200).json({ message: 'Compte supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la suppression du compte', error: err.message });
  }
});

// Route pour changer le mot de passe
router.post('/change-password', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Mot de passe actuel incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Mot de passe modifié avec succès' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la modification du mot de passe', error: err.message });
  }
});

module.exports = router;
