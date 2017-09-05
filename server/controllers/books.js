var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Books = require('../models/books');
var User = require('../models/users');
var googleBooks = require ('google-books-search');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: true});
var Book = require('../models/books');



exports.list = function (req, res) {
    
    Books.find().sort('-created').populate('user').exec(function(error, books) {
        if (error) {
            return res.status(400).send({
                message: error

            });
        }
        // REnder 
        res.render('books', {
            title: 'Book trade club',
            books: books,
            user : req.user,
            search: ""
            
        });

    });
   
};


// Create Comments
exports.create = function(req, res) {
	// create a new instance of the books model with request body
    var books = new Books(req.body);
    // Set current user (id)
    books.user = req.user;
    // save the data received
    books.save(function(error) {
        if (error) {
            return res.send(400, {
                message: error
            });
        }
        // Redirect to comments
        res.redirect('/books');
    });
};

exports.delete = function(req, res) {
   
Books.findByIdAndRemove(req.params.bookid, function(err){
            if (err) throw err;
            res.redirect('/books');
        });
    
};


exports.lookFor = function (req, res) {
var allbooks = [];
 googleBooks.search(req.body.title, function(error, results) {
    if ( ! error ) {
       
    res.render('books', { user: req.user, 
    search: req.body.title,
    results: results[0]
                    
    });             

            // allbooks.push(results);
            // console.log("here:" + allbooks);            
            } 

    else {
        console.log(error);
        }
    }); 
           
};


exports.save = function (req, res) {
   var books = new Books(req.body);
        // Set the image file name
        books.title = req.body.title;
        console.log('title is' + books.title);
        books.author = req.body.author;
        books.description = req.body.description;
        books.thumbnail = req.body.thumbnail;
        // Set current user (id)
        books.user = req.user;
        // save the data receivedbook
        books.save(function(error) {
            if (error) {
                return res.status(400).send({
                    message: error
                });
            }
        });
        res.redirect('/');
    
};


exports.delete = function(req, res) {
   
Books.findByIdAndRemove(req.params.bookid, function(err){
            if (err) throw err;
            res.redirect('/books');
        });
    
};
   



// Books authorization middleware
exports.hasAuthorization = function(req, res, next) {
	if (req.isAuthenticated())
        return next();
    res.redirect('/login');
};
