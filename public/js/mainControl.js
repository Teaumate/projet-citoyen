angular.module('mainCtrlModule',[])
    .controller('mainControl',['$http', '$scope', function($http, $scope){
    $scope.admin = false ;
    $http.get('/isAdmin').then(function(user){
        // Authenticated
        if (user.data !== '0'){
            $scope.admin = true;
        }else{
            $scope.admin = false;
            }
        });
}]);