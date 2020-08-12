  
const mongoose = require('mongoose');
const router = require('express').Router(); 
const passport = require('passport');
const genPassword = require('../lib/passwordUtils').genPassword;  
const User = require('../models/users');
const isAuth = require('./authMiddleware').isAuth;
const isAdmin = require('./authMiddleware').isAdmin;

// TODO
router.get('/protected', isAuth, (req, res, next) => {
  res.send('You made it to the route. <a href="/users/logout">logout</a>');
});

router.post('/login', passport.authenticate('local'), (req,res,next) => {
  console.log(req.user);
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({status:'ok'});
} );

router.post('/register', (req, res, next) => {
  const saltHash = genPassword(req.body.password);
  
  const salt = saltHash.salt;
  const hash = saltHash.hash;

  const newUser = new User({
      username: req.body.username,
      hash: hash,
      salt: salt,
      admin: false
  });

  newUser.save()
      .then((user) => {
          console.log(user);
      });

  res.redirect('/users/login');
});

router.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/users/');
});

router.get('/', (req, res, next) => {
  res.send('<h1>Home</h1><p>Please <a href="/users/register">register</a></p>');
});

// When you visit http://localhost:3000/login, you will see "Login Page"
router.get('/login', (req, res, next) => {
 
  const form = '<h1>Login Page</h1><form method="post" action="login">\
  Enter Username:<br><input type="text" name="username">\
  <br>Enter Password:<br><input type="password" name="password">\
  <br><br><input type="submit" value="Submit"></form>';
  res.send(form);

});

// When you visit http://localhost:3000/register, you will see "Register Page"
router.get('/register', (req, res, next) => {

  const form = '<h1>Register Page</h1><form method="post" action="register">\
                  Enter Username:<br><input type="text" name="username">\
                  <br>Enter Password:<br><input type="password" name="password">\
                  <br><br><input type="submit" value="Submit"></form>';

  res.send(form);
  
});


module.exports = router;
