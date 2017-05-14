// Dependencies
var mongoose        = require("mongoose");
mongoose.Promise    = require('bluebird');
var User            = require('./models/model');

// Opens App Routes
module.exports = function(app, passport) {

    //==================================================================
    // route to test if the user is admin in or not
    app.get('/isAdmin', function(req, res) {
        res.send((req.isAuthenticated() && req.user.google.email==="charlotte14@gmail.com") ? req.user : '0');
    });
    // route to test if the user is logged in or not
    app.get('/loggedin', function(req, res) {
        res.send(req.isAuthenticated() ? req.user : '0');
    });
    // route to log out
    app.post('/logout', function(req, res){
        req.logOut();
        res.sendStatus(200);
    });
    app.get('/social', function(req, res, next){
		isLoggedIn(req, res, next);
    });
    // GET Routes
    // --------------------------------------------------------
    // Retrieve records for all users in the db
    app.get('/users', function(req, res){

        // Uses Mongoose schema to run the search (empty conditions)
        var query = User.find({});
        query.exec(function(err, users){
            if(err)
                res.send(err);

            // If no errors are found, it responds with a JSON of all users
            res.json(users);
        });
    });

    // POST Routes
    // --------------------------------------------------------
    // Provides method for saving new users in the db
    app.post('/users', function(req, res){

        // Creates a new User based on the Mongoose schema and the post body
        var newuser = new User(req.body);

        // New User is saved in the db.
        newuser.save(function(err){
            if(err)
                res.send(err);

            // If no errors are found, it responds with a JSON of the new user
            res.json(req.body);
        });
    });

    // PUT Routes
    // --------------------------------------------------------
    // Provides method for saving new users in the db
    app.put('/users', function(req, res){

        var query = User.update({_id:req.body.id},{etat:req.body.etat});
        // update User 
        query.exec(function(err, users){
            if(err)
                res.send(err);

            // If no errors are found, it responds with a JSON of all users
            res.json(users);
        });
    });

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

	// locally --------------------------------
		// LOGIN ===============================
		// show the login form
		app.get('/login', function(req, res) {
			res.render('login.ejs', { message: req.flash('loginMessage') });
		});

		// process the login form
		app.post('/login', passport.authenticate('local-login', {
			successRedirect : '/#!/main', // redirect to the secure profile section
			failureRedirect : '/login', // redirect back to the signup page if there is an error
			failureFlash : true // allow flash messages
		}));

		// SIGNUP =================================
		// show the signup form
		app.get('/signup', function(req, res) {
			res.render('signup.ejs', { message: req.flash('loginMessage') });
		});

		// process the signup form
		app.post('/signup', passport.authenticate('local-signup', {
			successRedirect : '/#!/main', // redirect to the secure profile section
			failureRedirect : '/signup', // redirect back to the signup page if there is an error
			failureFlash : true // allow flash messages
		}));

	// facebook -------------------------------

		// send to facebook to do the authentication
		app.get('/auth/facebook',
            function authenticateFacebook (req, res, next) {
                req.session.returnTo = '/#!' + req.query.returnTo; 
                next ();
            },passport.authenticate('facebook', { scope : 'email' }));

		// handle the callback after facebook has authenticated the user
		app.get('/auth/facebook/callback',
            function (req, res, next) {
                var authenticator = passport.authenticate('facebook', {
				successRedirect : req.session.returnTo,
				failureRedirect : '/'
                });
            delete req.session.returnTo;
            authenticator (req, res, next);
			});


	// twitter --------------------------------

		// send to twitter to do the authentication
		app.get('/auth/twitter',
            function authenticateTwitter (req, res, next) {
                req.session.returnTo = '/#!' + req.query.returnTo; 
                next ();
            }, passport.authenticate('twitter', { scope : 'email' }));

		// handle the callback after twitter has authenticated the user
		app.get('/auth/twitter/callback',
            function (req, res, next) {
                var authenticator = passport.authenticate('twitter', {
                    successRedirect : req.session.returnTo,
                    failureRedirect : '/'
                });
            delete req.session.returnTo;
            authenticator (req, res, next);
			});


	// google ---------------------------------

		// send to google to do the authentication
		app.get('/auth/google',
            function authenticateGoogle (req, res, next) {
                req.session.returnTo = '/#!' + req.query.returnTo; 
                next ();
            }, passport.authenticate('google', { scope : ['profile', 'email'] }));

		// the callback after google has authenticated the user
		app.get('/auth/google/callback',
            function (req, res, next) {
                var authenticator = passport.authenticate('google', {
                    successRedirect : req.session.returnTo,
                    failureRedirect : '/'
                });
            delete req.session.returnTo;
            authenticator (req, res, next);
			});

// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

	// locally --------------------------------
		app.get('/connect/local', function(req, res) {
			res.render('connect-local.ejs', { message: req.flash('loginMessage') });
		});
		app.post('/connect/local', passport.authenticate('local-signup', {
			successRedirect : '/#!/main', // redirect to the secure profile section
			failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
			failureFlash : true // allow flash messages
		}));

	// facebook -------------------------------

		// send to facebook to do the authentication
		app.get('/connect/facebook', passport.authorize('facebook', { scope : 'email' }));

		// handle the callback after facebook has authorized the user
		app.get('/connect/facebook/callback',
			passport.authorize('facebook', {
				successRedirect : '/#!/main',
				failureRedirect : '/'
			}));

	// twitter --------------------------------

		// send to twitter to do the authentication
		app.get('/connect/twitter', passport.authorize('twitter', { scope : 'email' }));

		// handle the callback after twitter has authorized the user
		app.get('/connect/twitter/callback',
			passport.authorize('twitter', {
				successRedirect : '/#!/main',
				failureRedirect : '/'
			}));


	// google ---------------------------------

		// send to google to do the authentication
		app.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email'] }));

		// the callback after google has authorized the user
		app.get('/connect/google/callback',
			passport.authorize('google', {
				successRedirect : '/#!/main',
				failureRedirect : '/'
			}));
}
// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()){
		res.send(req.isAuthenticated() ? req.user : '0');
        next();
}
	res.redirect('/');
}