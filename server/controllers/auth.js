// get gravatar icon from email
var gravatar = require('gravatar');
var passport = require('passport');
var fs = require('fs');
var mime = require('mime');
// get gravatar icon from email
var gravatar = require('gravatar');
var Letter = require('../models/letter');
var Books = require('../models/books');
// set image file types

// Signin GET
exports.signin = function(req, res) {
    // List all Users and sort by Date
    res.render('login', { title: 'Login Page', message: req.flash('loginMessage') });
};
// Signup GET
exports.signup = function(req, res) {
    // List all Users and sort by Date
    res.render('signup', { title: 'Signup Page', message: req.flash('signupMessage') });

};
// Profile GET
exports.profile = function(req, res) {
   
Books.find().sort('-created').populate('user', 'letter').exec(function(error, books){
            
    res.render('profile', { title: 'Your profile', 
        books: books, 
        user : req.user, 
        avatar: gravatar.url(req.user.email ,  {s: '100', r: 'x', d: 'identicon'}, true) });
        letter: letter;
       
    })
    
};

exports.delete = function(req, res) {
   
Books.findByIdAndRemove(req.params.id, function(err){
            if (err) throw err;
            res.redirect('/profile');
        });
    
};



// Images authorization middleware
exports.hasAuthorization = function(req, res, next) {
    if (req.isAuthenticated())
    return next();
    res.redirect('/login');
};




// Logout function
exports.logout = function () {
    req.logout();
    res.redirect('/');
};

// check if user is logged in
exports.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/login');
};





