var app = angular.module('main',['ngRoute']);

app.config(function ($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: './components/login.html',
        controller: 'homeCtrl'
    }).when('/dashboardRx', {
      templateUrl: './components/home.html',
      controller: 'homeCtrl'
    })
    .when('/addRx', {
        templateUrl: './components/addRx.html',
        controller: 'addRxDetailCtrl'
    }).when('/confirmationPatientDetails', {
        templateUrl: './components/patientDetailsConfirmation.html',
        controller: 'patientConfirmationCtrl'
    }).otherwise({
        template: "404"
    })
});

app.controller('homeCtrl',function($scope,$location,$http,$rootScope){
  $scope.patients = [];

  var headers = {
      'Content-Type': 'application/json'
  }
  var reqUrl = 'http://10.190.15.221:8080/api/getAll';
  $http({
      method: 'GET',
      url: reqUrl,
      data: '',
      headers: headers
  }).success(function (res) {
      console.log('success');
      $scope.patients  = res;
  }).error(function (err) {
      console.log('error');

  });

$scope.getPtDetail = function () {
  $scope.showbutton=true;

  var id = $scope.patientSelected.id;
  var headers = {
      'Content-Type': 'application/json'
  }
  var reqUrl = 'http://10.190.15.221:8080/api/patientId/' + id;
  $http({
      method: 'GET',
      url: reqUrl,
      data: '',
      headers: headers
  }).success(function (res) {
      console.log('success');
      $scope.patientDetail = res.medicines;
      console.log(JSON.stringify( $scope.patientDetail))
  }).error(function (err) {
      console.log('error');

  });

} 

    $scope.goToAddPatientDetails = function(patient){
      $rootScope.prescribedBy = $scope.patientSelected.prescribedBy;
      $rootScope.patientDetails = patient;
      console.log($rootScope.patientDetails);
      $location.path('/addRx');
  };
  $scope.goDashBoard = function(){
    $location.path('/dashboardRx');
};
});


app.controller('addRxDetailCtrl',function($scope,$location,$rootScope,$http){
 
  $scope.alerts = [
    {"value": "6", "label": "06:00"},
    {"value": "8", "label": "08:00"},
    {"value": "10", "label": "10:00"},
    {"value": "12", "label": "12:00"},
    {"value": "14", "label": "14:00"},
    {"value": "16", "label": "16:00"},
    {"value": "18", "label": "18:00"},
    {"value": "20", "label": "20:00"},
    {"value": "22", "label": "22:00"}
];

  $scope.patientDetails = $rootScope.patientDetails;
  $scope.submitStudnetForm = function (data) {
    var alertTimes = [];
    angular.forEach($scope.alerts, function(alert) {
      if (alert.selected) {
        alertTimes.push(alert.value);
      
    }
  });
    //alert(JSON.stringify(alertTimes));
    var req={
    "id" :$scope.patientDetails.id,
    "name": $scope.patientDetails.name,
    "medicines" :[
      {
        "name":data.medicineName,
        "timeToBuzz":alertTimes
      }
    ],
    "when":data.when,
    "frequency":data.frequency,
    "note":data.remarks,
    "prescribedBy":$rootScope.patientDetails.medicines[0].prescribedBy,
  };
    console.log(JSON.stringify($rootScope.patientDetails.medicines[0].prescribedBy));

    var onSuccess = function (data, status, headers, config) {
      $location.path('/dashboardRx');
    };

    var onError = function (data, status, headers, config) {
      $location.path('/dashboardRx');
    }
    
    $http.post('http://10.190.15.221:8080/api/add-medicines-with-schedules', {
      Method:"POST",
      requestBody:req
    })
        .success(onSuccess)
        .error(onError);

};

  });
  