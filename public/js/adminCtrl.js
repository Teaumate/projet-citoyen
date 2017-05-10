var adminModule = angular.module('adminModule', ['geolocation', 'ngAnimate', 'ui.bootstrap']);
adminModule.controller('adminCtrl',['$scope', '$http', '$rootScope', 'geolocation', 'gservice', function($scope, $http, $rootScope, geolocation, gservice){
    $scope.templates =
        [{ name: 'admin', url: 'partials/adminV.html'},
        { name: 'carte', url: 'partials/carte.html'}];
    $scope.template = $scope.templates[0];
    
    $scope.$watchCollection('template', function(newNames, oldNames) {
        if(newNames.name === 'carte')
            gservice.refresh(44.843, -0.595);
    });
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
    $scope.reverse = true;
    $scope.ordre = 'etat';
    $scope.orderBy = function(x) {
        $scope.reverse = ($scope.ordre === x) ? !$scope.reverse : false;
        $scope.ordre = x;
    };
}]);