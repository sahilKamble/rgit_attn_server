const mongoose = require('mongoose');
const passport = require('passport');
const User = require('../models/user');
var path = require('path');
var fs = require('fs')
const isAuth = require('./authMiddleware').isAuth;
const isAdmin = require('./authMiddleware').isAdmin;
const router = require('express').Router();

router.route('/')
    .get((req, res, next) => {
        User.find(req.query)
            .then((user) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(user);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete((req, res, next) => {
        User.deleteMany(req.query)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

router.route('/select')
    .get((req, res, next) => {
        const page = "<a href='http://localhost:3000/users/login'>LOGIN</a><br>\
                <a href='http://localhost:3000/users/updatepass'>UPDATE PASSWORD</a>"
        res.send(page);
    });

router.route('/register')
    .post((req, res, next) => {
        User.register(new User({ username: req.body.username }),
            req.body.password, (err, user) => {
                if (err) {
                    res.statusCode = 500;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({ err: err });
                } else {
                    passport.authenticate('local')(req, res, () => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({ success: true, status: 'Registration Successful!' });
                    });
                }
            });
    });

router.get('/register', (req, res, next) => {
    dir = path.join(__dirname, '../public/register.html');
    fs.readFile(dir, 'utf8', (err, text) => {
        res.send(text);
    });


    // const form = '<h1>Register Page</h1><form method="post" action="register">\
    //                 Enter Username:<br><input type="text" name="username">\
    //                 <br>Enter Password:<br><input type="password" name="password">\
    //                 <br><br><input type="submit" value="Submit"></form>';

    // res.send(form);

});

router.get('/login', (req, res, next) => {
    dir = path.join(__dirname, '../public/login.html');
    fs.readFile(dir, 'utf8', (err, text) => {
        res.send(text);
    });
});

router.get('/dash', (req, res, next) => {
    dir = path.join(__dirname, '../public/dash.html');
    fs.readFile(dir, 'utf8', (err, text) => {
        res.send(text);
    });
});

router.get('/me', isAuth, (req, res, next) => {

    User.findById(req.user._id)
        .populate('subjects')
        .then((user) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(user);
        })

})

router.post('/login', passport.authenticate('local'), (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({ success: true, status: 'You are successfully logged in!' });
});

router.route('/updatepass')
    .get((req, res, next) => {

        const form = '<h1>Register Page</h1><form method="post" action="updatepass">\
                  Enter Username:<br><input type="text" name="username">\
                  <br>Enter Password:<br><input type="password" name="oldpassword">\
                  <br>Enter New Password:<br><input type="password" name="newpassword">\
                  <br><br><input type="submit" value="Submit"></form>';

        res.send(form);

    })
    .post(function(req, res) {
        // Search for user in database
        User.findOne({ username: req.body.username }, (err, user) => {
            // Check if error connecting
            if (err) {
                res.json({ success: false, message: "did not connect" }); // Return error
            } else {
                // Check if user was found in database
                if (!user) {
                    res.json({ success: false, message: 'User not found' }); // Return error, user was not found in db
                } else {
                    user.changePassword(req.body.oldpassword, req.body.newpassword, function(err) {
                        if (err) {
                            if (err.name === 'IncorrectPasswordError') {
                                res.json({ success: false, message: 'Incorrect password' }); // Return error
                            } else {
                                res.json({ success: false, message: 'Something went wrong!! Please try again after sometimes.' });
                            }
                        } else {
                            res.json({ success: true, message: 'Your password has been changed successfully' });
                        }
                    })
                }
            }
        });
    });

router.get('/attn/:subid' , (req,res,next) => {
    dir = path.join(__dirname, '../public/table.html');
    fs.readFile(dir, 'utf8', (err, text) => {
        res.send(text);
    });
})
router.get('/logout', (req, res, next) => {
    req.logout();
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({ success: true, status: 'logout successful' });
});

router.get('/protected', isAuth, (req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({ success: true, status: 'welcome to protected route' });
});

router.route('/:userId')
    .get((req, res, next) => {
        User.findById(req.params.userId)
            .then((user) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(user);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /users/' + req.params.userId);
    })
    .put((req, res, next) => {
        User.findByIdAndUpdate(req.params.userId, {
                $set: req.body
            })
            .then((user) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(user);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete((req, res, next) => {
        User.findById(req.params.userId)
            .then(user =>
                user.remove()
                .then((resp) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(resp);
                }), (err) => next(err))
            .catch((err) => next(err));
    });

router.route('/:userId/subjects')
    .get((req, res, next) => {
        User.findById(req.params.userId)
            .populate('subjects')
            .then((user) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(user);
            }, (err) => next(err))
            .catch((err) => next(err));
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