// Creates the addCtrl Module and Controller. Note that it depends on the 'geolocation' module and service.
var addCtrl = angular.module('addUserCtrl', ['geolocation', 'ngAnimate', 'ui.bootstrap']);
addCtrl.controller('addUserCtrl',['$scope', '$http', '$rootScope', 'geolocation', '$location', function($scope, $http, $rootScope, geolocation,$location){

    // Initializes Variables
    // ----------------------------------------------------------------------------
    $scope.heures = [
      {name:'08 - 10'},
      {name:'10 - 12'},
      {name:'14 - 16'},
      {name:'16 - 18'}
    ];
    $scope.heure = $scope.heures[0]; 
    $scope.formData = {};
    var coords = {};
    var lat = 0;
    var long = 0;
    $scope.location = $location.path();
    $http.get('/loggedin').then(function(user){
      // Authenticated
      if (user.data !== '0'){
        if (user.data.hasOwnProperty('facebook'))
          $scope.formData.username = user.data.facebook.name;
        if (user.data.hasOwnProperty('google'))
          $scope.formData.username = user.data.google.name;
        if (user.data.hasOwnProperty('twitter'))
          $scope.formData.username = user.data.twitter.displayName;
      }
    });
    // Set initial coordinates to the center of the Bdx
    $scope.formData.latitude = 44.838;
    $scope.formData.longitude = -0.577;

      $scope.geolocate = function() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var geolocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            var circle = new google.maps.Circle({
              center: geolocation,
              radius: position.coords.accuracy
            });
            autocomplete.setBounds(circle.getBounds());
          });
        }
      };
      
    // Get User's actual coordinates based on HTML5 at window load
    geolocation.getLocation().then(function(data){

        // Set the latitude and longitude equal to the HTML5 coordinates
        coords = {lat:data.coords.latitude, long:data.coords.longitude};

        // Display coordinates in location textboxes rounded to three decimal points
        $scope.formData.longitude = parseFloat(coords.long).toFixed(3);
        $scope.formData.latitude = parseFloat(coords.lat).toFixed(3);

        // Display message confirming that the coordinates verified.
        $scope.formData.htmlverified = "Yep (Thanks for giving us real data!)";

        var latitude = $scope.formData.latitude;
        var longitude = $scope.formData.longitude;

        var geocoder = new google.maps.Geocoder();
        var address;

        if (geocoder) {
            var latlng = latitude+","+longitude;
            var latlngStr = latlng.split(',', 2);
            latlng = {lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1])};
            geocoder.geocode({'location': latlng}, function(results, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                    if (results[0]) {
                        address = results[0].formatted_address;
                        $scope.$apply(function(){
                            $scope.formData.adresse = address;
                            $scope.address = address;
                        });
                    } else {
                        window.alert('No results found');
                    }
                } else {
                    window.alert('Geocoder failed due to: ' + status);
                }
            });
        }
    });

    // Creates a new user based on the form fields
    $scope.createUser = function() {
        // Grabs all of the text box fields
        var userData = {
            username: $scope.formData.username,
            adresse: $scope.formData.adresse,
            tel: $scope.formData.tel,
            volume: $scope.formData.typeEncombrant,
            rdv: $scope.dt,
            heure: $scope.heure.name,
            location: [$scope.formData.longitude, $scope.formData.latitude],
            htmlverified: $scope.formData.htmlverified
        };

        // Saves the user data to the db
        $http.post('/users', userData)
            .then(function (data) {
                $scope.formData = {};
                // Once complete, clear the form (except location)
                // $scope.formData.username = "";
                // $scope.formData.adresse = "";
                // $scope.formData.tel = "";
                // $scope.formData.typeEncombrant = "";
                // $scope.formData.rdv = "";
            }, function (data) {
                console.log('Error: ' + data);
            });
    };

// gestion du calendrier -------------
//------------------------------------
    $scope.dt = new Date();

    var d = new Date();
    d.setDate(d.getDate() + 10);

  $scope.options = {
    dateDisabled: disabled,
    minDate: new Date(),
    maxDate: d,
    showWeeks: true,
    startingDay: 1
  };

  // Disable weekend selection
  function disabled(data) {
    var date = data.date,
      mode = data.mode;
    return mode === 'day' && (date.getDay() === 0);// || date.getDay() === 6);
  }

  function getDayClass(data) {
    var date = data.date,
      mode = data.mode;
    if (mode === 'day') {
      var dayToCheck = new Date(date).setHours(0,0,0,0);

      for (var i = 0; i < $scope.events.length; i++) {
        var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

        if (dayToCheck === currentDay) {
          return $scope.events[i].status;
        }
      }
    }

    return '';
  }
}]);