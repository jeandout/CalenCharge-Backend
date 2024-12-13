var express = require('express');
var router = express.Router();

const User = require('../models/users');


//CRUD on charges

router.get('/', (req, res) => {
  User.findOne({ email: req.body.email }).then(data => {

    if (data) {
     
      // let format = []
      // for (let el of data.places) {
      //   el.nickname = req.params.nickname
      //   format.push(el)
      // }
      // console.log(format)
      res.json({ result: true, obj: data.accounts.obj });
    } else {
      res.json({ result: false, error: 'User not found' });
    }
  })
});

module.exports = router;