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

router.get('/recruiter_profile', function(req, res, next) {
  res.render('recruiters_profile');
});

router.get('/recruiter_jobs', function(req, res, next) {
  res.render('recruiters_jobs');
});

router.get('/recruiter_jobs_add', function(req, res, next) {
  res.render('recruiters_jobs_add');
});

router.get('/recruiter_jobs_update', function(req, res, next) {
  res.render('recruiters_jobs_update');
});

router.get('/recruiter_jobs_view', function(req, res, next) {
  res.render('recruiters_jobs_view');
});

module.exports = router;
