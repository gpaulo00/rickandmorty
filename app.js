const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// load .env
require('dotenv').config();

// load database
const db = require("./db/connection");
db.sequelize.sync().then(() => console.log("Database synced."));

// load routes
const verifyToken = require('./routes/verify-token');
const indexRouter = require('./routes/index');
const characterRouter = require('./routes/characters');
const episodeRouter = require('./routes/episodes');
const locationRouter = require('./routes/locations');
const userRouter = require('./routes/users');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api', userRouter);
app.use('/api/episode', verifyToken, episodeRouter);
app.use('/api/character', verifyToken, characterRouter);
app.use('/api/location', verifyToken, locationRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

console.log("listening..");
module.exports = app;
