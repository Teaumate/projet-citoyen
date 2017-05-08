var express         = require('express');
var app             = express();
var mongoose        = require("mongoose");
var port            = process.env.PORT || 8080;
var bodyParser      = require('body-parser');
//var cookieParser    = require('cookie-parser');
var session         = require('express-session');
var passport        = require('passport');
var flash           = require('connect-flash');

var configDB = require('./config/database.js');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

// Logging and Parsing
app.use(express.static(__dirname + '/public'));                 // sets the static files location to public
app.use('/node_modules',  express.static(__dirname + '/node_modules')); // Use NodesComponents
//app.use(cookieParser());                                        // read cookies (needed for auth)
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.urlencoded({extended: true}));               // parse application/x-www-form-urlencoded
app.use(bodyParser.text());                                     // allows bodyParser to look at raw text
app.use(bodyParser.json({ type: 'application/vnd.api+json'}));  // parse application/vnd.api+json as json
app.use(session({ secret: 'ilovescotchscotchyscotchscotch',
                  resave: false,
                  saveUninitialized: true })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
// set the view engine to ejs
app.set('view engine', 'ejs');
// Routes
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport
// Listen 
app.listen(port);