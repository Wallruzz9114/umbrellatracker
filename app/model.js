// Pulling Mongoose dependency for creating schemas
var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

// Creating a User Schema. This will be the basis of how user data is stored in the db
var EmployeeSchema = new Schema({
  username: { type: String, required: true },
  gender: { type: String, required: true },
  age: { type: Number, required: true },
  fav_game: { type: String, required: true },
  location: { type: [Number], required: true }, // [Long, Lat]
  html_verified: String,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// Setting the created_at parameter equal to the current time
EmployeeSchema.pre('save', function(next){
  now = new Date();
  this.updated_at = now;
  if (!this.created_at) {
    this.created_at = now
  }
  next();
});

// Indexing this schema in 2dsphere format (critical for running proximity searches)
EmployeeSchema.index({ location: '2dsphere' });

// Exporting the UserSchema for use elsewhere. Sets the MongoDB collection to be used as: "umbrella-employees"
module.exports = mongoose.model('umbrella-employees', EmployeeSchema);
