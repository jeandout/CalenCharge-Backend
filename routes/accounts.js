var express = require('express');
var router = express.Router();
const Account = require('../models/accounts');
const jwt = require('jsonwebtoken');
const passport = require('passport');
require('dotenv').config();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//account/new
router.post('/new', passport.authenticate('jwt', { session: false }) , async (req, res) => {
  const { name, charges } = req.body;
  try {
    const existingAccount = await Account.findOne({ name: req.body.name });
    if (!account) {
      return res.status(404).json({ result: false, message: 'Account not found' });
    }

    const newTweet = new Tweet({
      tweet: req.body.tweet,
      user: user._id,
      date: new Date(),
    });

    await newTweet.save();

    res.json({ result: true, tweet: 'Tweet successfully posted!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ result: false, message: 'Error posting tweet' });
  }
});


//acount/update

//account/delete





module.exports = router;

//CRUD on accounts