const jwt = require('jsonwebtoken');
const User = require('../models/users');
require('dotenv').config();

const SECRET_KEY = process.env.JWT_SECRET_KEY;

const verifyAndRenewTokens = async (req, res, next) => {
  if (req.path === '/users/signin' || req.path === '/users/signup' || req.path === '/users/reset-password') {
    return next();
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ result: false, message: 'Token manquant ou invalide' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    return next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      console.log('token expiré')
      return res.status(401).json({
        result: false,
        message: 'Token expiré',
        redirectToLogin: true,
      });
    }

    return res.status(403).json({
      result: false,
      message: 'Token invalide',
      redirectToLogin: true,
    });
  }
};

module.exports = verifyAndRenewTokens;