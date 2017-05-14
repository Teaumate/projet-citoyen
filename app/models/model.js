var mongoose    = require("mongoose");
var Schema      = mongoose.Schema;

var garbageSchema = new Schema({
    username: {type: String, required: false},
    adresse:  {type: String, required: false},
    tel:      {type: String, required: false},
    volume:   {type: String, required: false},
    rdv:      {type: Date, required: false},
    heure:    {type: String, required: false},
    location: {type: [Number], required: false}, // [Long, Lat]
    etat:     {type: Boolean, default:false, required: false} ,
    htmlverified: String,
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}
});

// Sets the created_at parameter equal to the current time
garbageSchema.pre('save', function(next){
    now = new Date();
    // this.rdv = now;
    this.updated_at = now;
    if(!this.created_at) {
        this.created_at = now;
    }
    next();
});

// Indexes this schema in 2dsphere format (critical for running proximity searches)
garbageSchema.index({location: '2dsphere'});

// Exports the garbageSchema for use elsewhere. Sets the MongoDB collection to be used as: "garbage-user"
module.exports = mongoose.model('garbage-user', garbageSchema);
