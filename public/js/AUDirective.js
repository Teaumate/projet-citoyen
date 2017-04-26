angular.module('AUD',[])
.directive('googleplace', function() {
    return {
        scope: {
                lat:"=",
                lon:"="
            },
        require: 'ngModel',
        link: function(scope, element, attrs, model) {
            var options = {
                types: ['geocode'],
                componentRestrictions: {country: 'FR'}
            };
            // Bias the autocomplete object to the user's geographical location,
            // as supplied by the browser's 'navigator.geolocation' object.
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
                    scope.gPlace.setBounds(circle.getBounds());
                });
            }
            scope.gPlace = new google.maps.places.Autocomplete(element[0], options);
            google.maps.event.addListener(scope.gPlace, 'place_changed', function() {

                var place = scope.gPlace.getPlace();
                var location = {
                    Latitude: place.geometry.location.lat(),
                    Longitude: place.geometry.location.lng()
                };
                console.log(location);
                scope.$apply(function() {
                    scope.lat = location.Latitude;
                    scope.lon = location.Longitude;
                    model.$setViewValue(element.val());
                });
            });
        }
    };
});