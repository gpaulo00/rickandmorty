const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// load .env
require('dotenv').config();

// load database
const db = require("./db/connection");
db.sequelize.sync().then(() => console.log("sequelize: database synced."));

// load routes
const verifyToken = require('./routes/verify-token');
const characterRouter = require('./routes/characters');
const episodeRouter = require('./routes/episodes');
const locationRouter = require('./routes/locations');
const userRouter = require('./routes/users');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// react frontend
app.use(express.static(path.join(__dirname, 'client', 'build')));

// api
app.use('/api', userRouter);
app.use('/api/episode', verifyToken, episodeRouter);
app.use('/api/character', verifyToken, characterRouter);
app.use('/api/location', verifyToken, locationRouter);

// react index
app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

module.exports = app;
