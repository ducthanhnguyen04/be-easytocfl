require ("dotenv").config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var session = require('express-session')
var cors = require('cors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');
var levelRouter = require('./routes/level');
var lessonRouter = require('./routes/lesson');
var vocabRouter = require('./routes/vocabulary');
var exampleRouter = require('./routes/example');
var grammarRouter = require('./routes/grammar');

var app = express();


app.use(cors({
  origin: process.env.CLIENT_URL, 
  credentials: true,    
}  
))

app.use(session({
  secret: 'ducthanh',
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: false, 
    httpOnly: true 
  }
}))

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
app.use('/auth', authRouter);
app.use('/levels', levelRouter);
app.use('/lessons', lessonRouter);
app.use('/vocabularies', vocabRouter);
app.use('/examples', exampleRouter);
app.use('/grammars', grammarRouter);
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
