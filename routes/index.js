var express = require('express');
var router = express.Router();
var stripe = require('stripe')('sk_test_o4FCQrr4N0Wts0Al7nTvWyej000rH70DsM');
const nodemailer = require("nodemailer");
var request = require('request');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.redirect('/login');
});

router.get('/register', function (req, res, next) {
  res.render('register');
});

router.get('/login', function (req, res, next) {
  res.render('login');
});

router.get('/home', function (req, res, next) {
  res.render('candidates_dashboard');
});

router.get('/candidate_resume', function (req, res, next) {
  res.render('candidates_my_resume');
});

router.get('/candidate_profile', function (req, res, next) {
  res.render('candidates_profile');
});

router.get('/recruiter_profile', function (req, res, next) {
  res.render('recruiters_profile');
});

router.get('/recruiter_jobs', function (req, res, next) {
  res.render('recruiters_jobs');
});

router.get('/recruiter_jobs_add', function (req, res, next) {
  res.render('recruiters_jobs_add');
});

router.get('/recruiter_jobs_update', function (req, res, next) {
  res.render('recruiters_jobs_update');
});

router.get('/recruiter_jobs_view', function (req, res, next) {
  res.render('recruiters_jobs_view');
});

router.get('/recruiter_jobs_view_candidate', function (req, res, next) {
  res.render('recruiters_jobs_view_candidate');
});

router.get('/recruiter_jobs_pricing', function (req, res, next) {
  res.render('recruiters_jobs_pricing');
});

router.get('/recruiter_favorite', function (req, res, next) {
  res.render('recruiters_favorite');
});


router.post("/charge_new", (req, res) => {
  stripe.customers.create({
    email: req.body.email,
    card: req.body.id
  })
    .then(customer => {
      stripe.charges.create({
        amount: req.body.amount,
        description: req.body.description,
        currency: "eur",
        customer: customer.id
      })
        .then(charge => {
          res.send(charge);
        })
        .catch(err => {
          console.log("Error:", err);
          res.status(500).send({ error: "Purchase Failed" });
        })
    })
});


router.post("/charge", (req, res) => {
  stripe.charges.create({
    amount: req.body.amount,
    description: req.body.description,
    currency: "eur",
    customer: req.body.customer
  })
    .then(charge => {
      res.send(charge);
    })
    .catch(err => {
      console.log("Error:", err);
      res.status(500).send({ error: "Purchase Failed" });
    })
});

let Mail = {
  sendMail: function (to, subject, text, next) {
    console.log(to, subject, text);
    var transporter = nodemailer.createTransport({
      host: "ssl0.ovh.net",
      port: 587,
      auth: {
        user: 'test-dev@petitesaffiches.fr',
        pass: 'g56qQZBf4'
      }
    });
    var mailOptions = {
      from: 'test-dev@petitesaffiches.fr',
      to: to,
      subject: subject,
      text: text
    };
    transporter.sendMail(mailOptions, function (err, info) {
      if (err) throw err;
      next(info);
    });
  }
};



router.post('/contact', (req, res, next) => {
  let data = req.body;
  Mail.sendMail(data.to, data.subject, data.text, (info) => {
    res.status(200).send("ok");
  });
});

// router.post('/account', (req, res, next) => {
//   let data = req.body;
//   Mail.sendMail(data.to, "Jurisgo, your account", "", (info) => {
//     res.status(200).send("ok")
//   });
// });

router.get('/callback_facebook', (req, res, next) => {
  console.log(req.query);
  res.render('login');
});

router.get('/callback_linkedin', (req, res, next) => {
  request.post({
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    url: 'https://www.linkedin.com/oauth/v2/accessToken',
    form: {
      grant_type: "authorization_code",
      code: req.query.code,
      redirect_uri: "http://localhost:3000/callback_linkedin",
      client_id: "86nhbra0gwjcrb",
      client_secret: "8g3Yrf4jjnq53E9a"
    }
  }, function (error, response, body) {
    console.log(req.query);
    res.set('Content-Type', 'text/html');
    res.send(new Buffer('<script>window.close();</script>'));});
});

module.exports = router;
