const mongoose = require('mongoose');
const passport = require('passport');
const User = require('../models/user');
var path = require('path');
var fs = require('fs');
const isAuth = require('./authMiddleware').isAuth;
const isAdmin = require('./authMiddleware').isAdmin;
const router = require('express').Router();
const cors = require('./cors');

router
    .route('/names')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get((req, res, next) => {
        User.find(req.query, 'username')
            .then(
                (user) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(user);
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    });

router
    .route('/')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get((req, res, next) => {
        User.find(req.query)
            .then(
                (user) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(user);
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })
    .delete((req, res, next) => {
        User.deleteMany(req.query)
            .then(
                (resp) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(resp);
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    });

router
    .route('/register')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get((req, res, next) => {
        dir = path.join(__dirname, '../public/register.html');
        fs.readFile(dir, 'utf8', (err, text) => {
            res.send(text);
        });
    })
    .post(isAdmin, (req, res, next) => {
        User.register(
            new User({ username: req.body.username }),
            req.body.password,
            (err, user) => {
                if (err) {
                    res.statusCode = 500;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({ err: err });
                } else {
                    passport.authenticate('local')(req, res, () => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({
                            success: true,
                            status: 'Registration Successful!',
                        });
                    });
                }
            }
        );
    });

router
    .route('/login')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get((req, res, next) => {
        dir = path.join(__dirname, '../public/login.html');
        fs.readFile(dir, 'utf8', (err, text) => {
            res.send(text);
        });
    })
    .post(cors.corsWithOptions, passport.authenticate('local'), (req, res) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({ success: true, status: 'You are successfully logged in!' });
    });

router.get('/dash', (req, res, next) => {
    if (req.isAuthenticated()) {
        dir = path.join(__dirname, '../public/dash.html');
        fs.readFile(dir, 'utf8', (err, text) => {
            res.send(text);
        });
    } else {
        res.redirect('/users/login');
    }

});

router.get('/addstud', (req, res, next) => {
    dir = path.join(__dirname, '../public/addStudents.html');
    fs.readFile(dir, 'utf8', (err, text) => {
        res.send(text);
    });
});

router.get('/addsub', (req, res, next) => {
    dir = path.join(__dirname, '../public/addSubject.html');
    fs.readFile(dir, 'utf8', (err, text) => {
        res.send(text);
    });
});

router
    .route('/me')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.corsWithOptions, isAuth, (req, res, next) => {
        User.findById(req.user._id)
            .populate('subjects', 'name')
            .then((user) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(user);
            });
    });

router.route('/shared').get(isAuth, (req, res, next) => {
    User.findById(req.user._id)
        .populate('sharedSubjects', 'name')
        .exec()
        .then((user) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(user);
        })
        .catch((err) => next(err));
});

router.route('/select').get((req, res, next) => {
    const page =
        '<a href=\'/users/login\'>LOGIN</a><br>\
            <a href=\'/users/updatepass\'>UPDATE PASSWORD</a>';
    res.send(page);
});

router
    .route('/updatepass')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get((req, res, next) => {
        dir = path.join(__dirname, '../public/update-password.html');
        fs.readFile(dir, 'utf8', (err, text) => {
            res.send(text);
        });
    })
    // .get((req, res, next) => {

//     const form = '<h1>Register Page</h1><form method="post" action="updatepass">\
//                 Enter Username:<br><input type="text" name="username">\
//                 <br>Enter Password:<br><input type="password" name="oldpassword">\
//                 <br>Enter New Password:<br><input type="password" name="newpassword">\
//                 <br><br><input type="submit" value="Submit"></form>';

//     res.send(form);
//     })

    .post(function (req, res) {
        // Search for user in database
        User.findOne({ username: req.body.username }, (err, user) => {
            // Check if error connecting
            if (err) {
                console.log('did not connect'),
                res.json({ success: false, message: 'did not connect' }); // Return error
            } else {
                // Check if user was found in database
                if (!user) {
                    console.log('User not found'),
                    res.json({ success: false, message: 'User not found' }); // Return error, user was not found in db
                } else {
                    user.changePassword(
                        req.body.oldpassword,
                        req.body.newpassword,
                        function (err) {
                            if (err) {
                                if (err.name === 'IncorrectPasswordError') {
                                    console.log('Incorrect password');
                                    res.json({
                                        success: false,
                                        message: 'Incorrect password',
                                    }); // Return error
                                } else {
                                    console.log(
                                        'Something went wrong!! Please try again after sometimes.'
                                    );
                                    res.json({
                                        success: false,
                                        message: 'Something went wrong!! Please try again after sometimes.',
                                    });
                                }
                            } else {
                                console.log(
                                    'Your password has been changed successfully'
                                );
                                res.json({
                                    success: true,
                                    message: 'Your password has been changed successfully',
                                });
                            }
                        }
                    );
                }
            }
        });
    });

router
    .route('/forgotpass')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get((req, res, next) => {
        const form =
            '<h1>Register Page</h1><form method="post" action="forgotpass">\
                Enter Username:<br><input type="text" name="username">\
                <br>Enter Password:<br><input type="password" name="password1">\
                <br>Enter Password Again:<br><input type="password" name="password2">\
                <br><br><input type="submit" value="Submit"></form>';

        res.send(form);
    })
    .post(function (req, res) {
        if (req.body.password1 === req.body.password2) {
            // Search for user in database
            User.findByUsername(req.body.username, (err, user) => {
                // Check if error connecting
                if (err) {
                    console.log(err);
                    res.json({ success: false, message: 'did not connect' }); // Return error
                } else {
                    // Check if user was found in database
                    if (!user) {
                        res.json({ success: false, message: 'User not found' }); // Return error, user was not found in db
                    } else {
                        user.setPassword(req.body.password1, function (
                            err,
                            user
                        ) {
                            if (err) {
                                console.log(err);
                                res.json({
                                    success: false,
                                    message: 'Password could not be saved. Please try again!',
                                });
                            } else {
                                user.save();
                                res.json({
                                    success: true,
                                    message: 'Your new password has been saved successfully',
                                });
                            }
                        });
                    }
                }
            });
        } else {
            res.json({ success: false, message: 'Passwords do not match' });
        }
    });

router.get('/attn/:subid', (req, res, next) => {
    dir = path.join(__dirname, '../public/table.html');
    fs.readFile(dir, 'utf8', (err, text) => {
        res.send(text);
    });
});

router.get('/sharedattn/:subid', (req, res, next) => {
    dir = path.join(__dirname, '../public/sharedtable.html');
    fs.readFile(dir, 'utf8', (err, text) => {
        res.send(text);
    });
});
router.route('/logout');

router
    .route('/logout')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.corsWithOptions, (req, res, next) => {
        req.logout();
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({ success: true, status: 'logout successful' });
    });

router
    .route('/protected')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.corsWithOptions, isAuth, (req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({ success: true, status: 'welcome to protected route' });
    });

router
    .route('/:userId')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get((req, res, next) => {
        User.findById(req.params.userId)
            .then(
                (user) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(user);
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /users/' + req.params.userId);
    })
    .put((req, res, next) => {
        User.findByIdAndUpdate(req.params.userId, {
            $set: req.body,
        })
            .then(
                (user) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(user);
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })
    .delete((req, res, next) => {
        User.findById(req.params.userId)
            .then(
                (user) =>
                    user.remove().then((resp) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(resp);
                    }),
                (err) => next(err)
            )
            .catch((err) => next(err));
    });

router
    .route('/:userId/subjects')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.corsWithOptions, (req, res, next) => {
        User.findById(req.params.userId)
            .populate('subjects')
            .then(
                (user) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(user);
                },
                (err) => next(err)
            )
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