const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/users');
require('dotenv').config();

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET_KEY;

// Route d'inscription (sign-up)
router.post('/signup', async (req, res) => {
  const { email, password } = req.body; //RAJOUTER LE REQ DU STORE

  try {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email déjà utilisé' });
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer un nouvel utilisateur
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

        // Générer un token JWT
    const token = jwt.sign({ id: newUser._id }, SECRET_KEY, { expiresIn: '1h' });

    res.status(201).json({ message: 'Inscription réussie', token });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de l\'inscription', error: err.message });
  }
});

// Route de connexion (sign-in)
router.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Trouver l'utilisateur par email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Générer un token JWT
    const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: '1h' });

    res.json({ message: 'Connexion réussie', token });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la connexion', error: err.message });
  }
});

// Route protégée
router.get('/protected', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({ message: `Bienvenue, ${req.user.email}` });
});

module.exports = router;
