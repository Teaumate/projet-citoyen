angular.module('addGarbage', ['geolocation', 'gservice'])
    .controller('addGarbageCtrl', 
                ['$scope', '$http', '$rootScope', 'geolocation', 'gservice', function($scope, $http, $rootScope, geolocation, gservice){
    // Initializes Variables
    // ----------------------------------------------------------------------------
    var coords = {};
    $scope.option = ["mobilier", "matelas", "sommier", "électroménager "];
    // Set initial coordinates to the center of Bdx
    $scope.latitude = 44.843;
    $scope.longitude = -0.595;
    
    // Get User's actual coordinates based on HTML5 at window load
    geolocation.getLocation().then(function(data){

        // Set the latitude and longitude equal to the HTML5 coordinates
        coords = {lat:data.coords.latitude, long:data.coords.longitude};
        // Display coordinates in location textboxes rounded to three decimal points
        $scope.longitude = parseFloat(coords.long);
        $scope.latitude = parseFloat(coords.lat);
        // Display message confirming that the coordinates verified.
        $scope.htmlverified = "Yep (Thanks for giving us real data!)";

        gservice.refresh($scope.latitude, $scope.longitude);

    });
    coords.long = parseFloat(coords.long);
    coords.lat = parseFloat(coords.lat);
    // Functions
    // ----------------------------------------------------------------------------
    // Get coordinates based on mouse click. When a click event is detected....
    $rootScope.$on("clicked", function(){

        // Run the gservice functions associated with identifying coordinates
        $scope.$apply(function(){
            $scope.latitude = parseFloat(gservice.clickLat).toFixed(5);
            $scope.longitude = parseFloat(gservice.clickLong).toFixed(5);
            $scope.htmlverified = "Nope (Thanks for spamming my map...)";
            $scope.adresse = gservice.address;
            $scope.address = gservice.address;
            coords.long = $scope.longitude;
            coords.lat = $scope.latitude;
        });

    });
    // Creates a new user based on the form fields
    $scope.createUser = function() {
        // Grabs all of the text box fields
        var userData = {
            username: $scope.username,
            adresse: $scope.adresse,
            tel: $scope.tel,
            volume: $scope.selectedName,
            rdv: $scope.rdv,
            location: [coords.long, coords.lat],
            htmlverified: $scope.htmlverified
        };

        // Saves the user data to the db
        $http.post('/users', userData)
            .then(function (data) {

                // Once complete, clear the form (except location)
                $scope.username = "";
                $scope.adresse = "";
                $scope.tel = "";
                $scope.typeEncombrant = "";
                $scope.rdv = "";
                // Refresh the map with new data
                gservice.refresh(coords.lat, coords.long);
            }, function (data) {
                console.log('Error: ' + data);
            });
    };
}]);