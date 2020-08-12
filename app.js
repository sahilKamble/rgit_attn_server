var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
const session = require('express-session');
var passport = require('passport');
var crypto = require('crypto');

mongoose.set('useUnifiedTopology', true);
const url = 'mongodb://localhost:27017/rgitAttn';
//const url = 'mongodb+srv://sahil:sahil@cluster0.xclwr.mongodb.net/test?retryWrites=true&w=majority';
const connect = mongoose.connect(url, { useNewUrlParser: true });

connect.then((db) => {
    console.log("Connected correctly to server");
}, (err) => { console.log(err); });

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var subjectRouter = require('./routes/subjectRouter');
var studentRouter = require('./routes/studentRouter');
var attnRouter = require('./routes/attnRouter');
var absRouter = require('./routes/absenteesRouter');

var app = express();

app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(bodyParser.json())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const MongoStore = require('connect-mongo')(session);
const sessionStore = new MongoStore({ mongooseConnection: mongoose.connection, collection: 'sessions' });
app.use(session({
  //secret: process.env.SECRET,
  secret: 'WARNING : CHANGE THIS',
  resave: false,
  saveUninitialized: true,
  store: sessionStore,
  cookie: {
      maxAge: 1000 * 60 * 60 * 24, // Equals 1 day (1 day * 24 hr/1 day * 60 min/1 hr * 60 sec/1 min * 1000 ms / 1 sec)
  }
}));

require('./config/passport');

app.use(passport.initialize());
app.use(passport.session());

//app.use('/', indexRouter);
app.get('/', (req, res) => {
  fs.readFile(__dirname + '/public/index.html', 'utf8', (err, text) => {
      res.send(text);
  });
});

app.use('/users', usersRouter);
app.use('/abs', absRouter);
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
