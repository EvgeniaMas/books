// Import modules
var fs = require('fs');
var mime = require('mime');
// get gravatar icon from email
var gravatar = require('gravatar');
var Books = require('../models/books');

// Show books
exports.show = function (req, res) {
 
    Books.find().sort('-created').populate('user').exec(function(error, books) {
        if (error) {
            return res.status(400).send({
                message: error

            });
        }
        // Render all books
        res.render('all_books', {
            title: 'Books',
            books: books
            
        });
    });   
};



// Books authorization middleware
exports.hasAuthorization = function(req, res, next) {
    if (req.isAuthenticated())
    return next();
    res.redirect('/login');
};
