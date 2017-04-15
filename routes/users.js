var express = require('express');
var router = express.Router();
var multer = require('multer');
var uploads = multer({dest: './uploads'});
var user = require('../models/users');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.get('/register', function(req, res, next) {
  res.render('register', {title: 'Register'});
});

router.get('/login', function(req, res, next) {
  res.render('login', {title: 'Login'});
});

router.post('/register', uploads.single('profileimage') ,function(req, res, next) {
  var name = req.body.name;
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var parrword = req.body.password;
//handling file uploading(image)
  if(req.file){
    console.log('Uploading File...')
    var profileimage = req.file.filename;
  }
  else{
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

if(errors){
res.render('register',{
  errors: errors
});
}
//adding users to database
else{
    var newUser = new user({
      name: name,
      email: email,
      username: username,
      password: password,
      profileimage: profileimage
    });
    user.createUser(newUser, function(err, user){
      if(err) throw err;
      else{
        console.log(user);
      }
    });
    //content-flash for displaying messages
    req.flash('success' , 'Registration Successfull');
    res.location('/');
    res.redirect('/');
}
});

module.exports = router;
