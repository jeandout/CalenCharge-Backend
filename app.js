require('dotenv').config();
require('./models/connection');
var express = require('express');
const passport = require('passport');
require('./config/passport');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const verifyAndRenewTokens = require('./middlewares/verifyAndRenewTokens');

const cors = require('cors');

var app = express();

app.use(cors());

app.use(verifyAndRenewTokens);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var accountsRouter = require('./routes/accounts');
var chargesRouter = require('./routes/charges');

app.use(logger('dev'));
app.use(express.json());

app.use(passport.initialize());

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/accounts', accountsRouter);
app.use('/charges', chargesRouter);

module.exports = app;
