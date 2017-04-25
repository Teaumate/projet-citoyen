var express         = require('express');
var mongoose        = require("mongoose");
var port            = process.env.PORT || 4000;
var bodyParser      = require('body-parser');
var app             = express();

// Connection à MongoDB
mongoose.connect('mongodb://localhost/PrjCitoyen');
// Logging and Parsing
app.use(express.static(__dirname + '/public'));                 // sets the static files location to public
app.use('/node_modules',  express.static(__dirname + '/node_modules')); // Use NodesComponents
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.urlencoded({extended: true}));               // parse application/x-www-form-urlencoded
app.use(bodyParser.text());                                     // allows bodyParser to look at raw text
app.use(bodyParser.json({ type: 'application/vnd.api+json'}));  // parse application/vnd.api+json as json
// Routes
require('./app/routes.js')(app);
// Listen
app.listen(port);