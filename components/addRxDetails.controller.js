var app = angular.module('main', []);
app.controller('addRxDetailCtrl',function($scope,$location,$rootScope){
  $scope.patientDetails = $rootScope.patientDetails;
});
  