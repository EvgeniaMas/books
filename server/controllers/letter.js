// get gravatar icon from email
var gravatar = require('gravatar');
// get Comments model
var Letter = require('../models/letter');
var User = require ('../models/users');
var Books = require ('../models/books')
// List Letter
exports.list = function(req, res) {
	     var id = req.query.id; 
         console.log(id);
         var bookId = req.query.bookId;
         User.findById(id).populate('books').exec(function(error, user, books){
        

         // User.findById(id, function (err, user) {
         var recipient = user.local.name;
         // console.log(recipient);
         var owner = user.id;
         console.log(owner);

        res.render('letter', {
            title: 'New trade',
            recipient: recipient,
            books: books,
            recipientId: id, 
            user : req.user, 
            owner: owner,
            bookId: bookId           
        });
    });    
};


// // Create Letter
// exports.create = function(req, res) {
// 	// create a new instance of the Comments model with request body
//     var letter = new Letter(req.body);
//     // Set current user (id)
//     letter.user = req.user;
//     // save the data received
//     letter.save(function(error) {
//         if (error) {
//             return res.send(400, {
//                 message: error
//             });
//         }
//         // Redirect to comments
//         res.redirect('/letter');
//     });
// };

// exports.delete = function(req, res) {
   
// Letter.findByIdAndRemove(req.params.id, function(err){
//             if (err) throw err;
//             res.redirect('/letter');
//         });
    
// };




// Comments authorization middleware
exports.hasAuthorization = function(req, res, next) {
	if (req.isAuthenticated())
        return next();
    res.redirect('/login');
};
