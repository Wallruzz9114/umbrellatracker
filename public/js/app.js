// Declareing the initial angular module "UmbrellaTracking". The module grabs other controllers and services.
var app = angular.module('UmbrellaTracking', ['add_controller', 'query_controller', 'geolocation', 'gservice', 'ngRoute'])
  .config(function ($routeProvider) {
    // Join Team Control Panel
    $routeProvider.when('/join', {
      controller: 'add_controller',
      templateUrl: 'partials/add.html',
    }).when('/find', {
      controller: 'query_controller',
      templateUrl: 'partials/query.html',
    }).otherwise({redirectTo:'/join'})
  }
);
