var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/users/dash');
    } else {
        res.redirect('/users/login');
    }
});

module.exports = router;
