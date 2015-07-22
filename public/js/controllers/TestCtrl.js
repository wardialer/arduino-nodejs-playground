angular.module('TestCtrl', [])
.controller('TestController', ['$scope', '$http', function($scope, $http) {
    $scope.message = 'hello';
}]);