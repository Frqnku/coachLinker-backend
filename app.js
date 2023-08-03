require('dotenv').config() 
require('./models/connection')

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var studentsRouter = require('./routes/students');
var coachsRouter = require('./routes/coachs');
var bookingsRouter = require('./routes/bookings');
var planningsRouter = require('./routes/plannings');

var app = express();
const cors = require('cors');
app.use(cors());

const fileUpload = require('express-fileupload');
app.use(fileUpload());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/students', studentsRouter);
app.use('/coachs', coachsRouter);
app.use('/bookings', bookingsRouter);
app.use('/plannings', planningsRouter);


module.exports = app;
