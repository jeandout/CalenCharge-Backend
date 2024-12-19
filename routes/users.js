const express = require('express');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/users');
const Account = require('../models/accounts');
require('dotenv').config();

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET_KEY;


//mailgun
const formData = require('form-data');
const Mailgun = require('mailgun.js');

const mailgun = new Mailgun(formData);

const mg = mailgun.client({
  username: 'api',
  key: process.env.MG_API_KEY,
  url: 'https://api.eu.mailgun.net',
});

// Route d'inscription (sign-up)
router.post('/signup', async (req, res) => {
  const { email, password, store } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ result: false, message: 'Email déjà utilisé' });
    }

    let accounts = [];
    if (store.accounts.length > 0) {
      for (const account of store.accounts) {
        const newAccount = new Account({
          name: account.name,
          icon: account.icon,
          charges: account.charges,
        });
        await newAccount.save();
        accounts.push(newAccount._id);
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
      token: uuidv4(),
      settings: store.settings,
      accounts,
    });
    await newUser.save();

    const jwtToken = jwt.sign({ token: newUser.token }, SECRET_KEY, { expiresIn: '15d' });

    res.status(201).json({
      result: true,
      message: 'Inscription réussie',
      token: jwtToken,
    });
  } catch (err) {
    res.status(500).json({ result: false, message: 'Erreur lors de l\'inscription', error: err.message });
  }
});

// Route de connexion (sign-in)
router.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).populate('accounts');
    if (!user) {
      return res.status(401).json({ result: false, message: 'Email ou mot de passe incorrect' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ result: false, message: 'Email ou mot de passe incorrect' });
    }

    const jwtToken = jwt.sign({ token: user.token }, SECRET_KEY, { expiresIn: '15d' });

    res.json({
      result: true,
      message: 'Connexion réussie',
      token: jwtToken,
      accounts: user.accounts,
      settings: user.settings,
    });
  } catch (err) {
    res.status(500).json({ result: false, message: 'Erreur lors de la connexion', error: err.message });
  }
});

// Route pour supprimer un compte
router.delete('/delete-account', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {

    const token = req.user.token;

    const user = await User.findOne({ token });

    if (!user) {
      return res.status(404).json({ result:false, message: 'Utilisateur non trouvé' });
    }

    await User.deleteOne({ _id: user._id });

    res.status(200).json({result:true, message: 'Compte supprimé avec succès' });
  } catch (err) {
    res.status(500).json({result:false, message: 'Erreur lors de la suppression du compte', error: err.message });
  }
});

// Route pour changer le mot de passe

router.post('/change-password', passport.authenticate('jwt', { session: false }), async (req, res) => {
  
  const { currentPassword, newPassword } = req.body;

  try {

    const token = req.user.token;

    const user = await User.findOne({ token });
    if (!user) {
      return res.status(404).json({ result:false, message: 'Utilisateur non trouvé' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ result:false, message: 'Mot de passe actuel incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({result:true, message: 'Mot de passe modifié avec succès' });
  } catch (err) {
    res.status(500).json({
      message: 'Erreur lors de la modification du mot de passe',
      error: err.message,
    });
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        result: false,
        message: 'Veuillez fournir une adresse e-mail.',
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        result: false,
        message: 'Aucun utilisateur trouvé avec cette adresse e-mail.',
      });
    }

    const newPassword = generateRandomPassword(12);
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    const data = {
      from: 'noreply@calencharge.fr',
      to: email,
      subject: 'Réinitialisation de votre mot de passe',
      text: `Bonjour,\n\nVotre nouveau mot de passe est : ${newPassword}\n\nVeuillez le changer dans les paramètres de l'application dès votre prochaine connexion.\n\nCordialement,\nL'équipe CalenCharge.`,
    };

    await mg.messages.create(process.env.MG_DOMAIN, data);

    res.status(200).json({
      result: true,
      message: 'Un nouvel e-mail avec le mot de passe a été envoyé.',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      result: false,
      message: 'Erreur lors de la réinitialisation du mot de passe.',
      error: err.message,
    });
  }
});

function generateRandomPassword(length) {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$&!';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

module.exports = router;
