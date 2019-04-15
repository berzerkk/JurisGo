var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('localhost:3000/login');
});

router.get('/register', function(req, res, next) {
  res.render('register');
});

router.get('/login', function(req, res, next) {          
  res.render('login');
});

router.get('/home', function(req, res, next) {
  res.render('candidates_dashboard')
})

module.exports = router;
