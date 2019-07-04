var express = require('express');
var router = express.Router();
var stripe = require('stripe')('sk_test_o4FCQrr4N0Wts0Al7nTvWyej000rH70DsM');
const nodemailer = require("nodemailer");
var request = require('request');
var fs = require('fs');

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

router.get('/terms_and_condition', function (req, res, next) {
  res.render('terms_and_condition')
})

router.get('/recruiter_jobs_view_candidate', function (req, res, next) {
  res.render('recruiters_jobs_view_candidate');
});

router.get('/recruiter_jobs_pricing', function (req, res, next) {
  res.render('recruiters_jobs_pricing');
});

router.get('/recruiter_favorite', function (req, res, next) {
  res.render('recruiters_favorite');
});

router.get('/recruiter_appointment', function (req, res, next) {
  res.render('recruiters_appointment');
});


router.get('/candidate_appointment', function (req, res, next) {
  res.render('candidates_appointment');
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
          console.log(req.body.amount);
          request.post({
            headers: { 'Content-Type': 'application/json' },
            url: 'https://api.jurisgo.fr/recruiter/point/add',
            form: {
              datas: {
                user_token: req.body.user_token,
                point: req.body.amount === '4999' ? 5 : req.body.amount === '9999' ? 10 : 2000000000
              }
            }
          }, function (error, response, body) {
            console.log(response.body);
            res.send(charge);
          });
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
      console.log(req.body.amount);
      request.post({
        headers: { 'Content-Type': 'application/json' },
        url: 'https://api.jurisgo.fr/recruiter/point/add',
        form: {
          datas: {
            user_token: req.body.user_token,
            point: req.body.amount === '4999' ? 5 : req.body.amount === '9999' ? 10 : 2000000000
          }
        }
      }, function (error, response, body) {
        console.log(response.body);
        res.send(charge);
      });
    })
    .catch(err => {
      console.log("Error:", err);
      res.status(500).send({ error: "Purchase Failed" });
    })
});

let Mail = {
  sendMail: function (to, subject, text, html, next) {
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
      text: text,
      html: html
    };
    transporter.sendMail(mailOptions, function (err, info) {
      if (err) throw err;
      next(info);
    });
  }
};



router.post('/contact', (req, res, next) => {
  let data = req.body;
  Mail.sendMail(data.to, data.subject, data.text, "", (info) => {
    res.status(200).send("ok");
  });
});

router.post('/mail_recruiter', (req, res, next) => {
  let data = req.body;
  fs.readFile('templates/recruiter.html', 'utf8', (err, contents) => {
    if (err) throw err;
    console.log(contents);
    Mail.sendMail(data.to, 'Jurisgo, your account', '', contents, (info) => {
      res.status(200).send("ok")
    });
  });
});

router.post('/mail_candidate', (req, res, next) => {
  let data = req.body;
  fs.readFile('templates/candidate.html', 'utf8', (err, contents) => {
    if (err) throw err;
    Mail.sendMail(data.to, 'Jurisgo, your account', '', contents, (info) => {
      res.status(200).send("ok")
    });
  });
});


router.get('/callback_facebook', (req, res, next) => {
  request.get({
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    url: 'https://graph.facebook.com/v3.3/oauth/access_token?client_id=657425804702385&redirect_uri=https://jurisgo.fr/callback_facebook&client_secret=eb8f926ae2844545e71bb98e0c7038b3&code=' + req.query.code
  }, function (error, token, body) {
    request.get({
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      url: 'https://graph.facebook.com/me?fields=id,first_name,last_name,email,birthday,gender,picture&access_token=' + JSON.parse(token.body).access_token
    }, function (error, user, body) {
      let datas = {
        linkedin_id: JSON.parse(user.body).id,
      };
      request.post({
        headers: { 'Content-Type': 'application/json' },
        url: 'https://api.jurisgo.fr/user/linkedin',
        form: {
          datas: datas
        }
      }, function (error, response, body) {
        if (JSON.parse(response.body).exist) {
          res.set('Content-Type', 'text/html');
          res.send(new Buffer('<script>document.cookie="' + 'user_token=' + JSON.parse(response.body).token + '"; window.close();</script>'));
        } else {
          res.set('Content-Type', 'text/html');
          res.send(new Buffer('<script>document.cookie="' + 'exist=true' +
            '";document.cookie="' + 'exist=true' +
            '";document.cookie="' + 'type=facebook' +
            '";document.cookie="' + 'firstname=' + JSON.parse(user.body).first_name +
            '";document.cookie="' + 'lastname=' + JSON.parse(user.body).last_name +
            '";document.cookie="' + 'picture=' + JSON.parse(user.body).picture.data.url +
            '";document.cookie="' + 'facebook_id=' + JSON.parse(user.body).id +
            '";document.cookie="' + 'email=' + JSON.parse(user.body).email +
            '";document.cookie="' + 'gender=' + JSON.parse(user.body).gender +
            '";document.cookie="' + 'birthday=' + JSON.parse(user.body).gender +
            '";document.cookie="' + 'email=' + JSON.parse(user.body).gender +
            '"; window.close();</script>'));
        }
      });
    });
  });
});

router.get('/callback_facebook_auth', (req, res, next) => {
  console.log(req.query);

  res.render('register');
});

router.get('/callback_linkedin', (req, res, next) => {
  request.post({
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    url: 'https://www.linkedin.com/oauth/v2/accessToken',
    form: {
      grant_type: "authorization_code",
      code: req.query.code,
      redirect_uri: "https://jurisgo.fr/callback_linkedin",
      client_id: "86nhbra0gwjcrb",
      client_secret: "8g3Yrf4jjnq53E9a"
    }
  }, function (error, token, body) {
    let parsedRes = JSON.parse(token.body);
    request.get({
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + parsedRes.access_token },
      url: 'https://api.linkedin.com/v2/me',
    }, function (error, user, body) {
      request.get({
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + parsedRes.access_token },
        url: 'https://api.linkedin.com/v2/me?projection=(id,firstName,lastName,profilePicture(displayImage~:playableStreams))',
      }, function (error, picture, body) {
        request.get({
          headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + parsedRes.access_token },
          url: 'https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))',
        }, function (error, mail, body) {

          let datas = {
            linkedin_id: JSON.parse(user.body).id,
          };

          request.post({
            headers: { 'Content-Type': 'application/json' },
            url: 'https://api.jurisgo.fr/user/linkedin',
            form: {
              datas: datas
            }
          }, function (error, response, body) {
            if (JSON.parse(response.body).exist) {
              res.set('Content-Type', 'text/html');
              res.send(new Buffer('<script>document.cookie="' + 'user_token=' + JSON.parse(response.body).token + '"; window.close();</script>'));
            } else {
              res.set('Content-Type', 'text/html');
              res.send(new Buffer('<script>document.cookie="' + 'exist=true' +
                '";document.cookie="' + 'exist=true' +
                '";document.cookie="' + 'type=linkedin' +
                '";document.cookie="' + 'firstname=' + JSON.parse(user.body).firstName.localized.fr_FR +
                '";document.cookie="' + 'lastname=' + JSON.parse(user.body).lastName.localized.fr_FR +
                '";document.cookie="' + 'picture=' + JSON.parse(picture.body).profilePicture['displayImage~'].elements[1].identifiers[0].identifier +
                '";document.cookie="' + 'linkedin_id=' + JSON.parse(user.body).id +
                '";document.cookie="' + 'email=' + JSON.parse(mail.body).elements[0]['handle~'].emailAddress +
                '"; window.close();</script>'));
            }
          });
        });
      });
    });
  });
});

module.exports = router;
