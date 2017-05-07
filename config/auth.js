// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

	'facebookAuth' : {
		'clientID' 		: '1773399452989042', // your App ID
		'clientSecret' 	: '73558696b4802b6597a2acf77ee2fe04', // your App Secret
		'callbackURL' 	: 'http://127.0.0.1:8080/auth/facebook/callback'
	},

	'twitterAuth' : {
		'consumerKey' 		: 'FFrQbx6YJ3i1y7SBF8ez2qshV',
		'consumerSecret' 	: 'Hhi7zn7YkKGrSouzzXjyEWWqYuPTMUCR8mEvhbubVO1lDWBWLd',
		'callbackURL' 		: 'http://127.0.0.1:8080/auth/twitter/callback'
	},

	'googleAuth' : {
		'clientID' 		: '125795165533-aorjjvpb02r32ns1j426ss979gihiobm.apps.googleusercontent.com',
		'clientSecret' 	: 'bS9L1BcOzulgNk-1b672qPgV',
		'callbackURL' 	: 'http://127.0.0.1:8080/auth/google/callback'
	}

};