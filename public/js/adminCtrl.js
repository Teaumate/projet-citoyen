var adminModule = angular.module('adminModule', ['geolocation', 'ngAnimate', 'ui.bootstrap']);
adminModule.controller('adminCtrl',['$scope', '$http', '$rootScope', 'geolocation', function($scope, $http, $rootScope, geolocation){

    $http.get('/users').then(function(response){

        // Convert the results into Google Map Format
        $scope.res = response.data;
        // for(var i= 0; i < response.length; i++) {
            
        // }
        }, function(){});

    $scope.update = function(x) {
        var newData = {
            id: x._id,
            etat: x.etat
        };

        $http.put('/users', newData).then(function(response){

            
        }, function(){});
    };

    $scope.orderBy = function(x) {
        $scope.ordre = x;
    };
}]);