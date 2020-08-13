  
const mongoose = require('mongoose');
const passport = require('passport');
const User = require('../models/user');
const isAuth = require('./authMiddleware').isAuth;
const isAdmin = require('./authMiddleware').isAdmin;

const router = require('express').Router(); 

router.get('/', (req, res, next) => {
  res.send('<h1>Home</h1><p>Please <a href="/users/register">register</a></p>');
});

router.post('/register', (req, res, next) => {
  User.register(new User({username: req.body.username}), 
    req.body.password, (err, user) => {
    if(err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err: err});
    }
    else {
      passport.authenticate('local')(req, res, () => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, status: 'Registration Successful!'});
      });
    }
  });
});

router.get('/register', (req, res, next) => {

  const form = '<h1>Register Page</h1><form method="post" action="register">\
                  Enter Username:<br><input type="text" name="username">\
                  <br>Enter Password:<br><input type="password" name="password">\
                  <br><br><input type="submit" value="Submit"></form>';

  res.send(form);
  
});

router.get('/login', (req, res, next) => {
 
  const form = '<h1>Login Page</h1><form method="post" action="login">\
  Enter Username:<br><input type="text" name="username">\
  <br>Enter Password:<br><input type="password" name="password">\
  <br><br><input type="submit" value="Submit"></form>';
  res.send(form);

});

router.post('/login', passport.authenticate('local'), (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, status: 'You are successfully logged in!'});
});

router.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/users/');
});

router.get('/protected', isAuth, (req, res, next) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, status: 'welcome to protected route'});
});

module.exports = router;

















// // TODO


// router.post('/login', passport.authenticate('local'), (req,res,next) => {
//   console.log(req.user);
//   res.statusCode = 200;
//   res.setHeader('Content-Type', 'application/json');
//   res.json({status:'ok'});
// } );

// router.post('/register', (req, res, next) => {
//   const saltHash = genPassword(req.body.password);
  
//   const salt = saltHash.salt;
//   const hash = saltHash.hash;

//   const newUser = new User({
//       username: req.body.username,
//       hash: hash,
//       salt: salt,
//       admin: false
//   });

//   newUser.save()
//       .then((user) => {
//           console.log(user);
//       });

//   res.redirect('/users/login');
// });

// 

// // When you visit http://localhost:3000/login, you will see "Login Page"
// router.get('/login', (req, res, next) => {
 
//   const form = '<h1>Login Page</h1><form method="post" action="login">\
//   Enter Username:<br><input type="text" name="username">\
//   <br>Enter Password:<br><input type="password" name="password">\
//   <br><br><input type="submit" value="Submit"></form>';
//   res.send(form);

// });

// // When you visit http://localhost:3000/register, you will see "Register Page"
// router.get('/register', (req, res, next) => {

//   const form = '<h1>Register Page</h1><form method="post" action="register">\
//                   Enter Username:<br><input type="text" name="username">\
//                   <br>Enter Password:<br><input type="password" name="password">\
//                   <br><br><input type="submit" value="Submit"></form>';

//   res.send(form);
  
// });


// 
