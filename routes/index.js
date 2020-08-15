var express = require('express');
var router = express.Router();
var path = require('path');
const fs = require('fs');

router.get('/', (req, res) => {
  if(req.isAuthenticated()) {
    // const dir = path.join(__dirname, '../public/dash.html');
    // fs.readFile(dir, 'utf8', (err, text) => {
    //   res.send(text);
    // });
    res.redirect('/users/dash')

  }
  else {
    res.redirect('/users/login')
  }
});



module.exports = router;
