var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//account/new

//acount/update

//account/delete





module.exports = router;

//CRUD on accounts