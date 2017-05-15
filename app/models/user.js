// load the things we need
var mongoose = require('mongoose');
var crypto   = require('crypto');

// define the schema for our user model
var UserSchema = mongoose.Schema({

    local            : {
        email        : String,
        password     : String,
        salt         : String
    },
    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    }

});


/**
 * Create instance method for hashing a password
 */
UserSchema.methods.generateHash = function (password) {
  if (this.local.salt && password) {
    return crypto.pbkdf2Sync(password, new Buffer(this.local.salt, 'base64'), 10000, 64, 'SHA1').toString('base64');
  } else {
    return password;
  }
};

/**
 * Create instance method for authenticating user
 */
UserSchema.methods.validPassword = function (password) {
  return this.local.password === this.generateHash(password);
};

/**
 * Hook a pre save method to hash the password
 */
UserSchema.pre('save', function (next) {
    this.local.salt = crypto.randomBytes(16).toString('base64');
    this.local.password = this.generateHash(this.local.password);
  next();
});

// create the model for users and expose it to our app
module.exports = mongoose.model('User', UserSchema);
