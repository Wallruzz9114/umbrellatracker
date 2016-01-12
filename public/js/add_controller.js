// Creating the add_controller module and controller.
var add_controller = angular.module('add_controller', ['geolocation', 'gservice']);

add_controller.controller('add_controller', function ($scope, $http, $rootScope, geolocation, gservice) {
  // Initializes Variables
  // ----------------------------------------------------------------------------
  $scope.formData = {};
  var coords = {};
  var lat = 0;
  var long = 0;

  // Set initial coordinates to Edmonton, Canada
  $scope.formData.latitude = 53.5333;
  $scope.formData.longitude = -113.5;

  // Get User's actual coordinates based on HTML5 at window load
  geolocation.getLocation().then(function (data) {
    // Set the latitude and longitude equal to the HTML5 coordinates
    coords = { lat:data.coords.latitude, long:data.coords.longitude };

    // Display coordinates in location textboxes rounded to three decimal points
    $scope.formData.longitude = parseFloat(coords.long).toFixed(3);
    $scope.formData.latitude = parseFloat(coords.lat).toFixed(3);

    // Display message confirming that the coordinates verified.
    $scope.formData.html_verified = "Yes!";
    gservice.refresh($scope.formData.latitude, $scope.formData.longitude);
  });

  // Functions
  // ----------------------------------------------------------------------------
  // Get coordinates based on mouse click. When a click event is detected....
  $rootScope.$on("clicked", function () {
    // Run the gservice functions associated with identifying coordinates
    $scope.$apply(function () {
      $scope.formData.latitude = parseFloat(gservice.clickLat).toFixed(3);
      $scope.formData.longitude = parseFloat(gservice.clickLong).toFixed(3);
      $scope.formData.html_verified = "Not interested";
    });
  });

  // Creates a new employee based on the form fields
  $scope.createEmployee = function () {
    // Grabs all of the text box fields
    var employeeData = {
      username: $scope.formData.username,
      gender: $scope.formData.gender,
      age: $scope.formData.age,
      fav_game: $scope.formData.fav_game,
      location: [$scope.formData.longitude, $scope.formData.latitude],
      html_verified: $scope.formData.html_verified
    };

    // Saves the employee data to the db
    $http.post('/employees', employeeData)
      .success(function (data) {
        // Once complete, clear the form (except location)
        $scope.formData.username = "";
        $scope.formData.gender = "";
        $scope.formData.age = "";
        $scope.formData.fav_game = "";
        gservice.refresh($scope.formData.latitude, $scope.formData.longitude);
      })
      .error(function (data) {
        console.log('Error: ' + data);
      }
    );
  };
});
