// Dependencies
var mongoose        = require('mongoose');
var Employee        = require('./model.js');

// Opens App Routes
module.exports = function (app) {
  // GET Routes
  // -----------------------------------------------------------------------------
  // Retrieve records for all employees in the db
  app.get('/employees', function (req, res) {
    // Uses Mongoose schema to run the search (empty conditions)
    var query = Employee.find({});
    query.exec(function (err, employees) {
      if (err) {
				res.send(err);
			}

			// If no errors are found, it responds with a JSON of all employees
      res.json(employees);
    });
  });

  // POST Routes
  // -----------------------------------------------------------------------------
  // Provides method for saving new employees in the db
  app.post('/employees', function (req, res) {
		// Creates a new Employee based on the Mongoose schema and the post bo.dy
    var newemployee = new Employee(req.body);
		// New Employee is saved in the db.
    newemployee.save(function (err) {
    	if (err) {
				res.send(err);
			}

			// If no errors are found, it responds with a JSON of the new employee
      res.json(req.body);
    });
  });

  // Retrieves JSON records for all users who meet a certain set of query conditions
  app.post('/query', function (req, res) {
    // Grab all of the query parameters from the body.
    var lat         = req.body.latitude;
    var long        = req.body.longitude;
    var distance    = req.body.distance;
    var male        = req.body.male;
    var female      = req.body.female;
    var other       = req.body.other;
    var minAge      = req.body.minAge;
    var maxAge      = req.body.maxAge;
    var favGame     = req.body.favGame;
    var reqVerified = req.body.reqVerified;

    // Opens a generic Mongoose Query. Depending on the post body we will...
    var query = Employee.find({});

    // ...include filter by Max Distance (converting miles to meters)
    if (distance) {
      // Using MongoDB's geospatial querying features. (Note how coordinates are set [long, lat]
      query = query.where('location').near({
        center: { type: 'Point', coordinates: [long, lat] },
        maxDistance: distance * 1609.34, spherical: true
      });
    }

    // ...include filter by Gender (all options)
    if (male || female || other) {
      query.or([{ 'gender': male }, { 'gender': female }, { 'gender': other }]);
    }

    // ...include filter by Min Age
    if (minAge) {
      query = query.where('age').gte(minAge);
    }

    // ...include filter by Max Age
    if (maxAge) {
      query = query.where('age').lte(maxAge);
    }

    // ...include filter by Favorite Language
    if (favGame){
      query = query.where('favGame').equals(favGame);
    }

    // ...include filter for HTML5 Verified Locations
    if(reqVerified){
      query = query.where('htmlverified').equals("Yes!");
    }

    // Execute Query and Return the Query Results
    query.exec(function (err, employees) {
      if (err) {
        res.send(err);
      }

      // If no errors, respond with a JSON of all users that meet the criteria
      res.json(employees);
    });
  });
};
