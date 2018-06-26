(function() {
var app = angular.module('myApp', ['ui.bootstrap', 'ngRoute']);
app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
      templateUrl : "index.html"
    })
    .when("/login", {
      templateUrl : "login/index.html"
    })
  });

app.run(['$rootScope', '$location', '$window', function ($rootScope, $location, $window) {
    $rootScope.$on('$routeChangeStart', function (event) {

        if ($window.sessionStorage['role'] !== 'admin' && $window.sessionStorage['role'] !== 'user' ) {
            $window.location = "/contranager/login";
        }
    });
}]);

app.controller('NavigationController', function($scope, $http, $window) {
    
    this.logout = function() {
        $window.sessionStorage['role'] = null;
        $window.location = "/contranager/login";
    }
    
});

app.controller('contractsController', function($scope, $http, $window) {
    var findAll = function(response)
    {
        $scope.names = response.data;     
    }
    $http.get("http://localhost:8080/ordered")
    .then(findAll);

    $scope.role = $window.sessionStorage['role'];
    console.log('localStorage: ', $window.sessionStorage['role']);
    $scope.removeRow = function(number){				
		var index = -1;		
		var comArr = eval( $scope.names );
		for( var i = 0; i < comArr.length; i++ ) {
			if( comArr[i].noContract === number ) {
				index = i;
				break;
			}
		}
		if( index === -1 ) {
			alert( "Something gone wrong" );
		}
        $scope.names.splice( index, 1 );
        $http.get("http://localhost:8080/deletecontract?no="+number)
        .then(function(){$window.alert("Contract deleted")});	
    };
    
    $scope.showPdf=function(path){
        $window.open(path);
    }
    
});

app.controller("modalContractFormController", ['$scope', '$modal', '$log', '$http', '$window',

    function ($scope, $modal, $log, $http, $window) {

              var findAll = function(response)
    {
        $scope.names = response.data;     
    }
    $http.get("http://localhost:8080/ordered")
    .then(findAll);

    $scope.role = $window.sessionStorage['role'];
    console.log('localStorage: ', $window.sessionStorage['role']);
    $scope.removeRow = function(number){				
		var index = -1;		
		var comArr = eval( $scope.names );
		for( var i = 0; i < comArr.length; i++ ) {
			if( comArr[i].noContract === number ) {
				index = i;
				break;
			}
		}
		if( index === -1 ) {
			alert( "Something gone wrong" );
		}
        $scope.names.splice( index, 1 );
        $http.get("http://localhost:8080/deletecontract?no="+number)
        .then(function(){$window.alert("Contract deleted")});	
    };

        $scope.showForm = function (contract) {
            var modalInstance = $modal.open({
                templateUrl: 'modal-form-contract.html',
                controller: ContractModalInstanceCtrl,
                scope: $scope,
                resolve: {
                    userForm: function () {
                        if(contract){
                        $scope.noContract=contract.noContract;
                        $scope.subject=contract.subject;
                        var date= contract.startDate[0]+"-"+contract.startDate[1]+"-"+contract.startDate[2];
                        $scope.startDate=new Date(date);
                        date=contract.endDate[0]+"-"+contract.endDate[1]+"-"+contract.endDate[2];
                        $scope.endDate=new Date(date);
                        $scope.value=contract.value;
                        $scope.currency=contract.currency;
                        $scope.document=contract.document;
                        $scope.contractType=contract.contractType;
                        $scope.partner=contract.partnerName;
                    }
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
        $scope.fileNameChanged = function (ele) {
            var file = ele.files[0];
            $scope.fileName="127.0.0.1:8887/"+file.name;
        }
        $scope.showEmptyForm=function(){
            var modalInstance=$modal.open({
                templateUrl:'modal-form-contract.html',
                controller:ContractModalInstanceCtrl,
                scope:$scope,
                resolve:{userForm:function(){ 
                    $scope.noContract="";
                    $scope.subject="";
                    $scope.startDate="";
                    $scope.endDate="";
                    $scope.value="";
                    $scope.currency="";
                    $scope.document="";
                    $scope.contractType="";
                    $scope.partner="";
                    return $scope.userForm}
            }
            })
        };
        
}]);

app.controller('partnersNamesController', function($scope, $http) {
    var findAll = function(response)
    {
        $scope.partners = response.data;     
    }
    $http.get("http://localhost:8080/partnersnames")
    .then(findAll);
});

app.controller('contractTypesController', function($scope, $http) {
    var findAll = function(response)
    {
        $scope.types = response.data;     
    }
    $http.get("http://localhost:8080/types")
    .then(findAll);
});

var ContractModalInstanceCtrl = function ($scope, $window,$modalInstance, userForm) {
    $scope.form = {}
    $scope.submitForm = function () {
       
        if ($scope.form.userForm.$valid) {    
            var dataObj={
                noContract: $scope.form.userForm.noContract['$viewValue'],
                subject: $scope.form.userForm.subject['$viewValue'],
                startDate: $scope.form.userForm.startDate['$viewValue'],
                endDate:$scope.form.userForm.endDate['$viewValue'],
                value:$scope.form.userForm.value['$viewValue'],
                currency:$scope.form.userForm.currency['$viewValue'],
                document:$scope.fileName,
                contractType:$scope.form.userForm.contractType['$viewValue'],
                partnerName:$scope.form.userForm.partner['$viewValue']
            }
            console.log(dataObj);
            fetch('http://localhost:8080/addcontract', {
                method: 'POST', 
                body: JSON.stringify(dataObj), 
                headers:{
                  'Content-Type': 'application/json'
                }
              }).then(function() {
                  res => res.json();
                  $window.location.reload();
              })
              .catch(error => console.error('Error:', error))
              .then(response => $window.alert("Contract added"));
            $modalInstance.close('closed');
        } else {
            console.log('userform is not in scope');
        }
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};

app.controller('partnersController', function($scope, $http, $window) {
    $scope.role = $window.sessionStorage['role'];
    var findAll = function(response)
    {
        $scope.names = response.data;     
    }
    $http.get("http://localhost:8080/partners")
    .then(findAll);
    $scope.removeRow = function(cui){				
		var index = -1;		
		var comArr = eval( $scope.names );
		for( var i = 0; i < comArr.length; i++ ) {
			if( comArr[i].cui === cui ) {
				index = i;
				break;
			}
		}
		if( index === -1 ) {
			alert( "Something gone wrong" );
        }
        $scope.names.splice( index, 1 );
        var flag=false;
        $http.get("http://localhost:8080/deletepartner?cui="+cui)
        .then(function(){$window.alert("Partner deleted"); flag=true;},function(){$window.alert("Patner can't be deleted")});	
	};
});

app.controller("modalPartnerFormController", ['$scope', '$modal', '$log', '$http',

    function ($scope, $modal, $log) {

        $scope.showForm = function (partner) {
            var modalInstance = $modal.open({               
                templateUrl: 'modal-form-partner.html',
                controller: PartnerModalInstanceCtrl,
                scope: $scope,
                resolve: {
                    userForm: function () {
                        if(partner){
                            console.log(partner);
                            $scope.cui=partner.cui;
                            $scope.name=partner.name;
                            $scope.postalCode=partner.postalCode;
                            $scope.country=partner.country;
                            $scope.city=partner.city;
                            $scope.street=partner.street;
                            $scope.contactName=partner.contactName;
                            $scope.email=partner.email;
                            $scope.phone=partner.phone;
                        }
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
        $scope.showEmptyForm=function(){
            var modalInstance=$modal.open({
                templateUrl:'modal-form-partner.html',
                controller:PartnerModalInstanceCtrl,
                scope:$scope,
                resolve:{userForm:function(){ 
                    $scope.cui="";
                    $scope.name="";
                    $scope.postalCode="";
                    $scope.country="";
                    $scope.city="";
                    $scope.street="";
                    $scope.contactName="";
                    $scope.email="";
                    $scope.phone="";
                    return $scope.userForm}
            }
            })
        };
}]);

var PartnerModalInstanceCtrl = function ($scope,$window, $modalInstance, userForm) {
    $scope.form = {}
    $scope.submitForm = function () {
        if ($scope.form.userForm.$valid) {
            var dataObj={
                cui: $scope.form.userForm.cui['$viewValue'],
                name: $scope.form.userForm.name['$viewValue'],
                postalCode: $scope.form.userForm.postalCode['$viewValue'],
                city:$scope.form.userForm.city['$viewValue'],
                country:$scope.form.userForm.country['$viewValue'],
                street:$scope.form.userForm.street['$viewValue'],
                contactName:$scope.form.userForm.contactName['$viewValue'],
                email:$scope.form.userForm.email['$viewValue'],
                phone:$scope.form.userForm.phone['$viewValue']
            }
            console.log(dataObj);
            fetch('http://localhost:8080/addpartner', {
                method: 'POST', 
                body: JSON.stringify(dataObj), 
                headers:{
                  'Content-Type': 'application/json'
                }
              }).then(res => res.json())
              .catch(error => console.error('Error:', error))
              .then(response => {$window.alert("Partner added");$window.location.reload();});
            $modalInstance.close('closed');
        } else {
            console.log('userform is not in scope');
        }
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};

app.controller('usersController', function($scope, $http, $window) {
    $scope.role = $window.sessionStorage['role'];
    var findAll = function(response)
    {
        $scope.names = response.data;     
    }
    $http.get("http://localhost:8080/users")
    .then(findAll);

    $scope.removeRow = function(phone){				
		var index = -1;		
		var comArr = eval( $scope.names );
		for( var i = 0; i < comArr.length; i++ ) {
			if( comArr[i].phone === phone ) {
				index = i;
				break;
			}
		}
		if( index === -1 ) {
			alert( "Something gone wrong" );
		}
        $scope.names.splice( index, 1 );
        $http.get("http://localhost:8080/deleteuser?phone="+phone)
        .then(function(){$window.alert("User deleted")});	
    };
  
});

app.controller("modalAccountFormController", ['$scope', '$modal', '$log', '$http',

    function ($scope, $modal, $log) {

        $scope.showForm = function (user) {
            console.log($scope.names);
            var modalInstance = $modal.open({
                templateUrl: 'modal-form.html',
                controller: ModalInstanceCtrl,
                scope: $scope,
                resolve: {
                    userForm: function () {
                        if(user){
                            $scope.cnp=user.cnp;
                            $scope.name=user.name;
                            $scope.email=user.email;
                            $scope.phone=user.phone;
                            $scope.department=user.department;
                            $scope.admin=user.admin;                 
                        }
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
        $scope.showEmptyForm=function(){
            var modalInstance=$modal.open({
                templateUrl:'modal-form.html',
                controller:ModalInstanceCtrl,
                scope:$scope,
                resolve:{userForm:function(){ 
                    $scope.cnp="";
                    $scope.name="";
                    $scope.email="";
                    $scope.phone="";
                    $scope.department="";
                    $scope.admin="";  
                    return $scope.userForm}
            }
            })
        };
}]);
app.controller("departmentsController",function($scope, $http) {
    var findAll = function(response)
    {
        $scope.departments = response.data;     
    }
    $http.get("http://localhost:8080/departments")
    .then(findAll);})

var ModalInstanceCtrl = function ($scope,$window, $modalInstance, userForm) {
    $scope.form = {}
    $scope.submitForm = function () {
        if ($scope.form.userForm.$valid) {
            var isAdmin='No';
            if($scope.form.userForm.admin)
                isAdmin="Yes";

            var dataObj={
                cnp: $scope.form.userForm.cnp['$viewValue'],
                name: $scope.form.userForm.name['$viewValue'],
                phone: $scope.form.userForm.phone['$viewValue'],
                department:$scope.form.userForm.department['$viewValue'],
                email:$scope.form.userForm.email['$viewValue'],
                password:$scope.form.userForm.password['$viewValue'],
                admin:isAdmin
            }
            console.log(dataObj);
            fetch('http://localhost:8080/adduser', {
                method: 'POST', 
                body: JSON.stringify(dataObj), 
                headers:{
                  'Content-Type': 'application/json'
                }
              }).then(res => res.json())
              .catch(error => console.error('Error:', error))
              .then(response =>{ $window.alert("User added"); $window.location.reload();});
            $modalInstance.close('closed');
        } else {
            console.log('userform is not in scope');
        }
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};

app.controller('chartController', function($scope, $http, $window) {
    var findAll = function(response)
    {
        $scope.partners = response.data;     
    }
    $http.get("http://localhost:8080/partnersnames")
    .then(findAll);

    $scope.sendPartner= function(){
        fetch('http://localhost:8080/getData', {
            method: 'POST', 
            body: $scope.partnerData, 
            headers:{
              'Content-Type': 'application/json'
            }
          }).then(function(response) {
            return response.json();
          })
          .then(function(myJson) {
            var ctxB4=document.getElementById("line-chart").getContext('2d');
           
            var lineChart=new Chart(ctxB4, {
            type: 'line',
            data: {
                labels: myJson.years,
                datasets: [{ 
                    data: myJson.values,
                    label: $scope.partnerData,
                    borderColor: "#3e95cd",
                    fill: false
                }
                ]
            },
             options: {
                title: {
                display: true,
                text: 'Contracts values over years'
                }
            }
          });
        });
    }

   
}); 

app.controller('secondChartController', function($scope, $http, $window){

    var findAll = function(response)
    {
        $scope.years = response.data;     
    }
    $http.get("http://localhost:8080/getyears")
    .then(findAll);
    
    $scope.sendYear= function(){
        fetch('http://localhost:8080/getbyyear', {
            method: 'POST', 
            body: String($scope.yearData), 
            headers:{
              'Content-Type': 'application/json'
            }
          }).then(function(response) {
            return response.json();
          })
          .then(function(myJson) {
            var ctxB5=document.getElementById("line-chart2").getContext('2d');
           
            var lineChart=new Chart(ctxB5, {
            type: 'line',
            data: {
                labels: myJson.months,
                datasets: [{ 
                    data: myJson.values,
                    label: $scope.yearData,
                    borderColor: "#3e95cd",
                    fill: false
                }
                ]
            },
             options: {
                title: {
                display: true,
                text: 'Contracts values for one year'
                }
            }
          });
        });
    }

});

})();