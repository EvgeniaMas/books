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
            if (error) {
            return res.status(400).send({
                message: error

            });
        }

    res.render('profile', { title: 'Your profile', 
        books: books,         
        user : req.user, 
        message: "",
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



exports.updates = function(req, res, error) { 

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


exports.updatePassword = function(req, res, error) { 
    
    var name = req.user.local.name;
    var email = req.user.local.email;    
    var currentPassword = req.user.local.password;  
    var oldPassword = req.body.currentPassword;
    var newPassword = req.body.newPassword;
    var newPassword_check = req.body.newPassword_check;  
    var id = req.user.id;   
    if (oldPassword != currentPassword) {

    Books.find().sort('-created').populate('user').exec(function(error, books){
             res.render('profile', { title: 'Profile', user : req.user, books: books, message: 'Your current password is different'});
    })
          
    }
     else if (newPassword != newPassword_check){
       Books.find().sort('-created').populate('user').exec(function(error, books){
             res.render('profile', { title: 'Profile', user : req.user, books: books, message: 'Your new password is different when inputed twice'});
    })    
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


exports.trade = function(req, res, error) { 
    
    var newSender = req.body.sender;
    var newSenderId = req.body.newSenderId;
    console.log(newSenderId);    
    var newletter_text = req.body.letter_text;
    var recipient = req.body.recipient;
    var id = req.body.bookId;
    var recipientId = req.body.recipientId;
    console.log (req.user.id);    
    Books.findByIdAndUpdate(id, {$set: { senderId : newSenderId, sender: newSender, 
        letter_text: newletter_text, recipient:recipientId }} , function(err){
        if (err) throw err;       
        res.redirect('/all_books');
    });   
};



exports.decline = function(req, res) { 
        var id = req.params.id;
    Books.findByIdAndUpdate(id, {$set: { senderId : "", sender: "", 
        letter_text: "", recipient:"" }} , function(err){
        if (err) throw err;       
        res.redirect('/profile');
    });

   
};


exports.cancel = function(req, res) { 
        var id = req.params.id;
    Books.findByIdAndUpdate(id, {$set: { senderId : "", sender: "", 
        letter_text: "", recipient:"" }} , function(err){
        if (err) throw err;       
        res.redirect('/profile');
    });   
};














