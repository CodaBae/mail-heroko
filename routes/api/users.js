const express = require('express')
const router = express.Router()
const { User, validateFun } = require('../../model/User')
const _ = require('lodash')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('config')
const { auth } = require('../../middleware/auth')
const gravatar = require('gravatar')
var async = require("async");
var nodemailer = require("nodemailer");
var crypto = require("crypto");


router.get('/', async (req, res) => {
    const result = await User.find()
    res.send(result)
})
router.get('/me', async (req, res) => {
    const user = await User.findById(req.user._id).select('-password')
    res.send(user)
})
router.post('/', async (req, res) => {
    const { error } = validateFun(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    let user = await User.findOne({ email: req.body.email })
    if (user) return res.status(400).send('user with this email already exist')

    if (req.body.password !== req.body.confirmPass) return res.status(400).send('both password does not match')
    const { name, email, password } = req.body;
    const avatar = gravatar.url(req.body.email, {
        s: '200',
        r: 'pg',
        d: 'mm'
    });
    user = new User({
        name,
        email,
        avatar,
        password
    });
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(user.password, salt)
    await user.save()
    const token = jwt.sign({ _id: user._id }, 'mykey')
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']))
})

router.put('/me', auth, async (req, res) => {
    const { error } = validateFun(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const user = await User.findByIdAndUpdate(req.user._id, _.pick(req.body, ['name', 'email', 'password', 'confirmPass']), { new: true })

    if (!user) return res.status(404).send('user with id not found')

    res.send(user)
})

router.delete('/:id', auth, async (req, res) => {
    // const result = await User.deleteOne({ _id: id })
    const result = await User.findByIdAndRemove(req.params.id)
    if (!result) return res.status(404).send('user with id not found')
    res.send(result)
})


// forgot password
router.get('/forgot', function(req, res) {
    res.send('forgot');
  });
  
  router.post('/forgot', function(req, res, next) {
    async.waterfall([
      function(done) {
        crypto.randomBytes(20, function(err, buf) {
          var token = buf.toString('hex');
          done(err, token);
        });
      },
      function(token, done) {
        User.findOne({ email: req.body.email }, function(err, user) {
          if (!user) {
            return console.log('there is an account with this email');
          }
  
          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  
          user.save(function(err) {
            done(err, token, user);
          });
        });
      },
      function(token, user, done) {
        var smtpTransport = nodemailer.createTransport({
          service: 'Gmail', 
          auth: {
            user: 'miracle8093@gmail.com',
            pass: 'iamrootdev'
          }
        });
        var mailOptions = {
          to: user.email,
          from: 'miracle8093@gmail.com',
          subject: 'Password Reset',
          text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://' + req.headers.host + '/reset/' + token + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          console.log('mail sent');
          console.log('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
          done(err, 'done');
        });
      }
    ], function(err) {
      if (err) return next(err);
      res.send('go to next route');
    });
  });
  
  router.get('/reset/:token', function(req, res) {
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
      if (!user) {
        console.log('error', 'Password reset token is invalid or has expired.');
        return res.send('toback to forgot route,Password reset token is invalid or has expired. ');
      }
      res.send({token: req.params.token});
    });
  });
  
  router.post('/reset/:token', function(req, res) {
    async.waterfall([
      function(done) {
        User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
          if (!user) {
            console.log('error', 'Password reset token is invalid or has expired.');
            return res.send('back to forgot, Password reset token is invalid or has expired.');
          }
          if(req.body.password === req.body.confirm) {
            user.setPassword(req.body.password, function(err) {
              user.resetPasswordToken = undefined;
              user.resetPasswordExpires = undefined;
  
              user.save(function(err) {
                req.logIn(user, function(err) {
                  done(err, user);
                });
              });
            })
          } else {
              console.log("error", "Passwords do not match.");
              return res.send('back to forget pass,Passwords do not match ');
          }
        });
      },
      function(user, done) {
        var smtpTransport = nodemailer.createTransport({
          service: 'Gmail', 
          auth: {
            user: 'miracle8093@gmail.com',
            pass: 'iamrootdev'
          }
        });
        var mailOptions = {
          to: user.email,
          from: 'miracle8093@mail.com',
          subject: 'Your password has been changed',
          text: 'Hello,\n\n' +
            'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          console.log('success', 'Success! Your password has been changed.');
          done(err);
        });
      }
    ], function(err) {
      res.send('go to login page');
    });
  });

module.exports = router