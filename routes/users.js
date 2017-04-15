var express = require('express');
var router = express.Router();
var multer = require('multer');
var uploads = multer({ dest: './uploads' });
var User = require('../models/users');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});
router.get('/register', function (req, res, next) {
  res.render('register', { title: 'Register' });
});

router.get('/login', function (req, res, next) {
  res.render('login', { title: 'Login' });
});
router.post('/login',
  passport.authenticate('local', {
    successRedirect: '/',
    successFlash: 'LogIn Successfull',
    failureRedirect: '/users/login',
    failureFlash: 'Invalid Username or Password'
  })
);
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.getUserById(id, function (err, user) {
    done(err, user);
  });
});
passport.use(new LocalStrategy(
  function (username, password, done) {
    User.getUserByUsername(username, function (err, user) {
      if (err) throw err;
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      User.comparePassword(password, user.password, function (err, isMatch) {
        if (err) return done(err);
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Invalid Password' });
        }
      });
    });
  }
));

router.post('/register', uploads.single('profileimage'), function (req, res, next) {
  var name = req.body.name;
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var parrword = req.body.password;
  //handling file uploading(image)
  if (req.file) {
    console.log('Uploading File...')
    var profileimage = req.file.filename;
  }
  else {
    console.log('No file found.')
    var profileimage = 'noimage.jpeg'
  }

  //Checking validation of form
  req.checkBody('name', 'Name field is required').notEmpty();
  req.checkBody('email', 'Email field is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('username', 'Username field is required').notEmpty();
  req.checkBody('password', 'Password field is required').notEmpty();
  req.checkBody('password2', 'Password do not match').equals(req.body.password);

  var errors = req.validationErrors();

  if (errors) {
    res.render('register', {
      errors: errors
    });
  }
  //adding users to database
  else {
    var newUser = new user({
      name: name,
      email: email,
      username: username,
      password: password,
      profileimage: profileimage
    });
    user.createUser(newUser, function (err, user) {
      if (err) throw err;
      else {
        console.log(user);
      }
    });
    //content-flash for displaying messages
    req.flash('success', 'Registration Successfull');
    res.location('/');
    res.redirect('/');
  }
});
router.get('/logout', function(req, res){
  req.logout();
  req.flash('success' , 'Logout Successfull');
  res.redirect('/users/login')
});

module.exports = router;