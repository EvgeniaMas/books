// Import basic modules
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: true});
var googleBooks = require ('google-books-search');

// import multer
var multer  = require('multer');
var upload = multer({ dest:'./public/uploads/', limits: {fileSize: 10000000, files:1} });

// Import home controller
var index = require('./server/controllers/index');
// Import login controller
var auth = require('./server/controllers/auth');
// Import comments controller
var comments = require('./server/controllers/comments');

// Import images controller
var all_books = require('./server/controllers/all_books');
var books = require ('./server/controllers/books');
var letter = require('./server/controllers/letter');
// ODM With Mongoose
var mongoose = require('mongoose');
// Modules to store session
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
// Import Passport and Warning flash modules
var passport = require('passport');
var flash = require('connect-flash');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'server/views/pages'));
app.set('view engine', 'ejs');

// Database configuration
var config = require('./server/config/config.js');
// connect to our database
mongoose.Promise = global.Promise;
mongoose.connect(config.url);
// Check if MongoDB is running
mongoose.connection.on('error', function() {
	console.error('MongoDB Connection Error. Make sure MongoDB is running.');
});






// Passport configuration
require('./server/config/passport')(passport);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('node-sass-middleware')({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    indentedSyntax: true,
    sourceMap: true
}));
// Setup public directory
app.use(express.static(path.join(__dirname, 'public')));

// required for passport
// secret for session
app.use(session({
    secret: 'bookes',
    saveUninitialized: true,
    resave: true,
    //store session on MongoDB using express-session + connect mongo
    store: new MongoStore({
        url: config.url,
        collection : 'sessions'
    })
}));

// Init passport authentication
app.use(passport.initialize());
// persistent login sessions
app.use(passport.session());
// flash messages
app.route('./auth/twitter')
    .get(passport.authenticate('twitter'));

    app.route('./auth/twitter/callback')
    .get(passport.authenticate('twitter', {
            successRedirect: '/',
            failureRedirect: '/'
        }));
app.use(flash());

// Application Routes
// Index Route
app.get('/', index.show);
app.get('/login', auth.signin);
app.post('/login', passport.authenticate('local-login', {
    //Success go to Profile Page / Fail go to login page
    successRedirect : '/profile',
    failureRedirect : '/login',
    failureFlash : true
}));
app.get('/signup', auth.signup);
app.post('/signup', passport.authenticate('local-signup', {
    //Success go to Profile Page / Fail go to Signup page
    successRedirect : '/profile',
    failureRedirect : '/signup',
    failureFlash : true
}));

app.get('/profile', auth.isLoggedIn, auth.profile);

// Logout Page
app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});


app.post('/updates', auth.updates);
app.post('/updatePassword', auth.updatePassword);
app.post('/trade', auth.trade);


// Setup routes for comments
// app.get('/comments', comments.hasAuthorization, comments.list);
// app.post('/comments', comments.hasAuthorization, comments.create);

app.get('/letter?', letter.hasAuthorization, letter.list);


// Setup routes for all books

app.get('/all_books', all_books.hasAuthorization, all_books.show);

app.get('/delete/:id', auth.delete);
app.get('/cancel/:id', auth.cancel);
app.get('/decline/:id', auth.decline);

app.get('/comments/:id', comments.delete);

app.get('/books',  books.hasAuthorization, books.list, books.create, books.delete);


app.post('/books',  books.hasAuthorization, books.lookFor);
app.post('/addbook',  books.hasAuthorization, books.save);

// app.get('/books',  books.hasAuthorization, books.save);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });
}




// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + server.address().port);
    
});
