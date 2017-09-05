// get gravatar icon from email
var gravatar = require('gravatar');
var passport = require('passport');
var fs = require('fs');
var mime = require('mime');
// get gravatar icon from email
var gravatar = require('gravatar');
var Letter = require('../models/letter');
var Books = require('../models/books');
var User = require('../models/users');
var mongoose = require ('mongoose');
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
   
Books.find().sort('-created').populate('user').exec(function(error, books){
            
    res.render('profile', { title: 'Your profile', 
        books: books,         
        user : req.user, 
        mistake: "",
        avatar: gravatar.url(req.user.email ,  {s: '100', r: 'x', d: 'identicon'}, true) });       
       
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



exports.updates = function(req, res) {   
    var name = req.body.name;
    var email = req.body.email; 
    var password = req.user.local.password;   
    var id = req.user.id;   
    User.findById(id, function (err, user) {
    user.local = { name: name, email: email, password: password };
    user.local.markModified; // nested object data before saving data
    user.save(); 
     // console.log("Обновленный объект", user);
    res.redirect('/profile');
})
};


exports.updatePassword = function(req, res, err) { 
    var name = req.user.local.name;
    var email = req.user.local.email;
    console.log(email);
    var currentPassword = req.user.local.password;  
    var oldPassword = req.body.currentPassword;
    var newPassword = req.body.newPassword;
    var newPassword_check = req.body.newPassword_check;  
    var id = req.user.id;   
     if (oldPassword != currentPassword) {
        throw err;
     }
     else if (newPassword != newPassword_check) {
        throw err;
     }

     else { 

    User.findById(id, function (err, user) {
    user.local = { name: name, email: email, password: newPassword};
    user.local.markModified;
    user.save(); // works
    // console.log("Обновленный объект", user);
    res.redirect('/profile');
})

    }
};


exports.trade = function(req, res) { 

    console.log("good");


};










