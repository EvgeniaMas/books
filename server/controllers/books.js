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


exports.lookFor = function (req, res, next) {
var allbooks = [];
 googleBooks.search(req.body.title, function(error, results) {
    if ( ! error ) {
       // var getResult = [];
       // newResult = getResult.push(results[0]); 
       //  console.log(newResult);
    res.render('books', { user: req.user, 
    search: req.body.title,
    author: results[0].authors,
    title: results[0].title,
    thumbnail: results[0].thumbnail,
    description: results[0].description,
    id: results[0].id
                    
    }); 

            book = new Book({
            bookid: results[0].id,
            title: results[0].title,
            author: results[0].authors,                           
            thumbnail: results[0].thumbnail                                
            });

            allbooks.push(book);
            console.log("here:" + allbooks);

             book.save(function(err) {
                        if (err) console.log(err);
                      
                    
    });


} 

    else {
        console.log(error);
    }
}); 


  
           
};


exports.addBook = function (req, res) {
book.find().sort('-created').populate('user').exec(function(error, book) {
        if (error) {
            return res.status(400).send({
                message: error

            });
        }
        // REnder 
        res.render('books', {
            title: 'Book trade club',
            book: book,
            user : req.user,
           
            
        });

    });

};





exports.delete = function(req, res) {
   
Books.findByIdAndRemove(req.params.bookid, function(err){
            if (err) throw err;
            res.redirect('/books');
        });
    
};



   

// exports.lookFor = function (req, res) {
   
// returnBookInfo(res, req, displayPage);

// function checkOwnership(bookID, userloc, res, req, book, owned){
//      User.findOne({
//             'id': userloc.id 
//         }, function(err, user) {
//             if (err)   return err;
            
//             console.log("book ID: " +bookID + " user.books: " + user.books)
//           if(user.books.indexOf(bookID) >= 0){
//                 console.log("I own this")
//                 owned = true;
//           }
//             allowned.push(owned);
//         });
        
// }


// function returnBookInfo(res, req, displayPage){
//       var searchlimit = 5;
        
//         //set to only return 1 best match book
        
//        var options = {
//             field: 'title',
//             offset: 0,
//             limit: searchlimit,
//             type: 'books',
//             order: 'relevance',
//             lang: 'en'
//         };
//           allbooks = [];
//         allowned = [];
//         var lookup = 0;
        
//         var thisBook = googleBooks.search(req.body.title, options, function(error, results) {
//                 if ( ! error ) {
//               results.forEach(function(result) {
//                 //book found in google books api, search our data base to see if it exists or add
         
//                   Books.findOne({
//                     'bookid': result.id 
//                   }, 

//                   function(err, book) {
//                     if (err) {
//                         return err;
//                     }
//                     //no book found, create one.
//                      if (!book) {
//                     console.log("no book");
//                      book = new Books({
//                               bookid: result.id,
//                               title: result.title,
//                             author: result.authors,
//                             rating: result.averageRating,
//                             thumbnail: result.thumbnail
                    
//                         });
//                             allbooks.push(book);
//                         console.log("here:" + allbooks);

//                         allowned.push(false);
//                     book.save(function(err) {
//                         if (err) console.log(err);
//                         //console.log(book);
                    
                    
//                     });
                        
//                 } else {
//                     //found book. Return. The only time to check if owned is if we know it's in collection.
//                     allbooks.push(book);
//                     var owned = false;
                    // if (req.user){
                    // checkOwnership(book.bookid, 
                    //     req.user, res, req, book, owned);
                        
                    // }
             
            // }
              // if (++lookup == results.length){
              //             console.log("allowned: right here" + allowned);
              //               res.render('index', { user: req.user, 
              //                   search: req.body.title, 
              //                   books: allbooks, 
              //                   owned: allowned });
              //  }
//         });
        
                
    
//     });
//     }
// });

// }

// function displayPage(res, req, owned, allbooks, results){

//   //console.log (allbooks);
//   res.render('books', { user: req.user, 
//             search: req.body.title, 
//             author: results[0].authors,
//             title: results[0].title,
//             thumbnail: results[0].thumbnail
                    
//                 });  
// }

// };


// Books authorization middleware
exports.hasAuthorization = function(req, res, next) {
	if (req.isAuthenticated())
        return next();
    res.redirect('/login');
};
