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
  res.render('candidates_dashboard');
});

 router.get('/candidates_resume_add', function(req, res, next) {
   res.render('candidates_my_resume_add_new');
 });

router.get('/candidate_resume', function(req, res, next) {
  res.render('candidates_my_resume');
});

router.get('/candidate_profile', function(req, res, next) {
  res.render('candidates_profile');
});



// router.get('/jobs_add', function(req, res, next) {
//   res.render('employer_post_new')
// });

// router.get('/matching', function(req, res, next) {
//   res.render('candidates_list2');
// });

// router.get('/order', function(req, res, next) {
//   res.render('employer_transactions');
// });

// router.get('/order_pack', function(req, res, next) {
//   res.render('pricing');
// });

module.exports = router;
