angular.module('mainApp', ['AUD', 'adminModule', 'ui.bootstrap', 'ngRoute', 'ngTouch', 'addGarbage', 'addUserCtrl', 'geolocation', 'gservice'])
             .config(['$locationProvider', '$routeProvider', '$httpProvider', function config($locationProvider, $routeProvider, $httpProvider) {
      $locationProvider.hashPrefix('!');
    //================================================
    // Check if the user is connected
    //================================================
    var checkLoggedin = function($q, $timeout, $http, $location, $rootScope){
      // Initialize a new promise
      var deferred = $q.defer();

      // Make an AJAX call to check if the user is logged in
      $http.get('/loggedin').then(function(user){
        // Authenticated
        if (user.data !== '0'){
          /*$timeout(deferred.resolve, 0);*/
          console.log(user);
          deferred.resolve();

        // Not Authenticated
      }else {
          console.log('not loggedin');
          $rootScope.message = 'You need to log in.';
          //$timeout(function(){deferred.reject();}, 0);
          deferred.reject();
          $location.url('/auth');
        }
      });

      return deferred.promise;
    };
    //================================================
    
    //================================================
    // Add an interceptor for AJAX errors
    //================================================
    $httpProvider.interceptors.push(function($q, $location) {
      return {
        response: function(response) {
          // do something on success
          return response;
        },
        responseError: function(response) {
          if (response.status === 401)
            $location.url('/login');
          return $q.reject(response);
        }
      };
    });
    //================================================

    //================================================
    // Define all the routes
    //================================================
      $routeProvider.
        when('/admin', {
          controller: 'adminCtrl',
          templateUrl: 'partials/admin.html',
          resolve: {
            loggedin: checkLoggedin
          }
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
        when('/auth', {
            templateUrl: 'partials/auth.html'
        }).
        otherwise('/auth');
    }
  ]) // end of config()
  .run(function($rootScope, $http){
    $rootScope.message = '';

    // Logout function is available in any pages
    $rootScope.logout = function(){
      $rootScope.message = 'Logged out.';
      $http.post('/logout');
    };
  });

