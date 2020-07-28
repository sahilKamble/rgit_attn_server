var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var mongoose = require('mongoose');

mongoose.set('useUnifiedTopology', true);
//const url = 'mongodb://localhost:27017/rgitAttn';
const url = 'mongodb+srv://sahil:sahil@cluster0.xclwr.mongodb.net/test?retryWrites=true&w=majority';
const connect = mongoose.connect(url, { useNewUrlParser: true });

connect.then((db) => {
    console.log("Connected correctly to server");
}, (err) => { console.log(err); });

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var subjectRouter = require('./routes/subjectRouter');
var studentRouter = require('./routes/studentRouter');
var attnRouter = require('./routes/attnRouter');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use('/attn', attnRouter);
app.use('/subjects', subjectRouter);
app.use('/students', studentRouter);

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

module.exports = app;
