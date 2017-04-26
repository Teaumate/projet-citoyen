angular.module('mainApp', ['AUD', 'adminModule', 'ui.bootstrap', 'ngRoute', 'ngTouch', 'addGarbage', 'addUserCtrl', 'geolocation', 'gservice'])
             .config(['$locationProvider', '$routeProvider', function config($locationProvider, $routeProvider) {
      $locationProvider.hashPrefix('!');

      $routeProvider.
        when('/admin', {
          templateUrl: 'partials/admin.html'
        }).
        when('/main', {
          templateUrl: 'partials/main.html'
        }).
        when('/rdv', {
          controller: 'addUserCtrl',
          templateUrl: 'partials/rdv.html'
        }).
        when('/mobile', {
            controller: 'addGarbageCtrl',
            templateUrl: 'partials/mobile.html'
        }).
        otherwise('/main');
    }
  ]);

