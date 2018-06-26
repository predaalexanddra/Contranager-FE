(function() {
    var app = angular.module('loginapp', ['ui.bootstrap',"ngRoute"]);
    app.controller('loginController', function($scope, $http, $window) {
        $scope.login=function(){
            var dataObj={
                user: $scope.user,
                password: $scope.password
            };
            console.log(dataObj);
            fetch('http://localhost:8080/login', {
                method: 'POST', 
                body: JSON.stringify(dataObj), 
                headers:{
                  'Content-Type': 'application/json'
                }
              }).then(res => res.json())
              .catch(error => $window.alert("Incorrect username or password!"))
              .then(response =>{
                  $scope.role=response.role; 
                  console.log('Succes:',$scope.role);
                  $window.sessionStorage['role'] = $scope.role;
                  $window.location = "/contranager";
                  
            });
        }
    });

    app.controller("modalFormController", ['$scope', '$modal', '$log',

    function ($scope, $modal, $log) {

        $scope.showForm = function () {
            $scope.message = "Show Form Button Clicked";
            console.log($scope.message);

            var modalInstance = $modal.open({
                templateUrl: 'modal.html',
                controller: ModalInstanceCtrl,
                scope: $scope,
                resolve: {
                    userForm: function () {
                        return $scope.userForm;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
            }]);

var ModalInstanceCtrl = function ($scope, $window, $modalInstance, userForm) {
    $scope.form = {}
    $scope.submitForm = function () {
        if ($scope.form.userForm.$valid) {
            var dataObj={
                user: $scope.form.userForm.username["$viewValue"],
                password: $scope.form.userForm.oldPassword["$viewValue"],
                newPassword:$scope.form.userForm.newPassword["$viewValue"]
            };
            console.log(dataObj);
            fetch('http://localhost:8080/change', {
                method: 'POST', 
                body: JSON.stringify(dataObj), 
                headers:{
                  'Content-Type': 'application/json'
                }
              }).then(res => res.json())
              .catch(error => $window.alert("Incorrect username or password!"))
              .then(response =>{
                  $window.alert("New password saved.")
            });
            $modalInstance.close('closed');
        } else {
            console.log('userform is not in scope');
        }
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};

})();