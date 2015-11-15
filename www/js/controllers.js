var app =angular.module('upet.controllers', []);
app.controller('AppCtrl', ['$rootScope', '$ionicModal', 'AuthFactory', '$location', 'UserFactory', '$scope', 'Loader', 'AuthService',
    function($rootScope, $ionicModal, AuthFactory, $location, UserFactory, $scope, Loader,AuthService) {
       
           $rootScope.$on('showLoginModal', function($event, scope, cancelCallback, callback) {
           $scope.user = {
                "name": "",
                "email": "",
                "password": ""
            };
            $scope = scope || $scope;
            $scope.viewLogin = true;
            $ionicModal.fromTemplateUrl('templates/login.html', {
                scope: $scope
            }).then(function(modal) {
                $scope.modal = modal;
                $scope.modal.show();
                $scope.switchTab = function(tab) {
                    if (tab === 'login') {
                        $scope.viewLogin = true;
                    } else {
                        $scope.viewLogin = false;
                    }
                }
                $scope.hide = function() {
                    $scope.modal.hide();
                    if (typeof cancelCallback === 'function') {
                        cancelCallback();
                    }
                }
                $scope.login = function() {
                    var email = this.user.email;
                    var password = this.user.password;
                    if (!email || !password) {
                      Loader.showLoading("Por favor ingresar campos validos");
                      return false;
                     }
                   
                    AuthService.login($scope.user.email, $scope.user.password)
                    .then(function (user) {
                        $rootScope.userEmail = $scope.user.email;
                        $rootScope.isAuthenticated = true;
                        $scope.modal.hide();
                         
                    });

                }
                $scope.register = function() {
                    var name = this.user.name;
                    var email = this.user.email;
                    var password = this.user.password;
            
                    if (!name||!email || !password) {
                      Loader.toggleLoadingWithMessage("Por favor ingresar campos validos");
                      return false;
                     }
                    AuthService.signup($scope.user.email,
                    $scope.user.name,
                    $scope.user.password)
                     .then(function(user) {
                        $rootScope.userEmail = user.email;
                        AuthFactory.setUser(user);
                        $rootScope.isAuthenticated = true;
                        $scope.modal.hide();
                    });

                }
            });
        });
        $rootScope.loginFromMenu = function() {
            $rootScope.$broadcast('showLoginModal', $scope, null, null);
        }
        $rootScope.logout = function() {
        Parse.User.logOut();
        Loader.toggleLoadingWithMessage('Sesión cerrada con éxito !', 2000);
        UserFactory.logout();
        $rootScope.isAuthenticated = false;
        $location.path('/app/welcome');
     
        };
    }
]);
app.controller('PetlistsCtrl', ['$scope', 'PetsFactory', 'LSFactory', 'Loader','$ionicModal','PetService','$ionicLoading','Internalselection','$ionicPopup',
    function($scope, PetsFactory, LSFactory, Loader,$ionicModal,PetService,$ionicLoading,Internalselection,$ionicPopup) {
        $scope.pets = PetService;
        $ionicLoading.show();
        $scope.pets.load().then(function () {
        $ionicLoading.hide();  
        });

        $scope.refreshItems = function () {
        $scope.pets.refresh().then(function () {
            $scope.$broadcast('scroll.refreshComplete');
        });
        };

        $scope.nextPage = function () {
        $scope.pets.next().then(function () {
            $scope.$broadcast('scroll.refreshComplete');
        });
        };

        $scope.selectPet=function(pet){
          Internalselection.setSelectedpet(pet);
        };
       

        $scope.showConfirm = function(pet) {
          var confirmPopup = $ionicPopup.confirm({
          title: 'Borrar mascota',
          template: '¿Seguro que quieres borrar esta mascota?',
          okType: 'button-royal'
          });
          confirmPopup.then(function(res) {
            if(res) {
            PetService.remove(pet);
            console.log('You are not sure');
              
            } else {
              console.log('You are not sure');
            }
          });
        };
    }
]);
app.controller('detailCtrl', function($scope, $stateParams,Internalselection) {
  $scope.pet = Internalselection.getSelectedpet();
});
app.controller('newCtrl', function($rootScope,$state, $ionicPopup, $ionicLoading, $scope, $window, Loader,PetService) {
  
 $scope.datepickerObject = {
      titleLabel: 'Fecha de nacimiento', 
      todayLabel: 'Hoy',  
      closeLabel: 'Cerrar',  
      setLabel: 'OK',  
      setButtonType : 'button-royal',  
      todayButtonType : 'button-royal',  
      closeButtonType : 'button-royal',  
      inputDate: new Date(),   
      mondayFirst: true,  
      templateType: 'popup', 
      showTodayButton: 'false', 
      modalHeaderColor: 'bar-positive',
      modalFooterColor: 'bar-positive', 
      from: new Date(1988, 8, 2),  
      to: new Date(2018, 8, 25),   
      callback: function (val) {    
        datePickerCallback(val);
      }
    };

  var datePickerCallback = function (val) {
  if (typeof(val) === 'undefined') {
    console.log('No date selected');
  } else {
    $scope.datepickerObject.inputDate = val;
  }
};

$scope.resetFormData = function () {
        $scope.formData = {  
            'name': '',
            'species': '',
            'breed': '',
            'gender': '',
            'birthdate': '',
            'picture': null
        };
    };
$scope.resetFormData();

$scope.trackPet = function (form) {
        $scope.formData.birthdate = $scope.datepickerObject.inputDate ;
        
            if (!$scope.formData.name   || !$scope.formData.species|| !$scope.formData.breed|| !$scope.formData.gender|| !$scope.formData.birthdate) {
             Loader.toggleLoadingWithMessage("Por favor ingrese los datos", 2000);
            return false;
            }
            PetService.track($scope.formData).then(function () {     
                $scope.resetFormData(); 
                $state.go("app.petlist");                         
            });
        
};

$scope.addPicture = function () {
  alert("Foto");
  };

});
app.controller('editCtrl', function($rootScope,$state, $ionicPopup, $ionicLoading, $scope, $window, Loader,PetService,Internalselection) {
 $scope.pet = Internalselection.getSelectedpet();
 /*  $scope.petData = {  
            'name': $scope.pet.attributes.name,
            'species': $scope.pet.attributes.species,
            'breed': $scope.pet.attributes.breed,
            'gender': $scope.pet.attributes.gender,
            'birthdate': $scope.pet.attributes.birthdate,
            'picture': $scope.pet.attributes.picture
        };
    console.log( $scope.petData);*/
 $scope.datepickerObject = {
      titleLabel: 'Fecha de nacimiento', 
      todayLabel: 'Hoy',  
      closeLabel: 'Cerrar',  
      setLabel: 'OK',  
      setButtonType : 'button-royal',  
      todayButtonType : 'button-royal',  
      closeButtonType : 'button-royal',  
      inputDate: new Date(),   
      mondayFirst: true,  
      templateType: 'popup', 
      showTodayButton: 'false', 
      modalHeaderColor: 'bar-positive',
      modalFooterColor: 'bar-positive', 
      from: new Date(1988, 8, 2),  
      to: new Date(2018, 8, 25),   
      callback: function (val) {    
        datePickerCallback(val);
      }
    };

  var datePickerCallback = function (val) {
  if (typeof(val) === 'undefined') {
    console.log('No date selected');
  } else {
    $scope.datepickerObject.inputDate = val;
  }
};

$scope.resetFormData = function () {
        $scope.formData = {  
            'name': '',
            'species': '',
            'breed': '',
            'gender': '',
            'birthdate': '',
            'picture': null
        };
    };

$scope.resetFormData();

$scope.editPet = function (form) {
 
 $scope.formData.id=$scope.pet.id;   
 $scope.formData.birthdate = $scope.datepickerObject.inputDate ;

        
            console.log("newCtrl::trackPet");
            if (!$scope.formData.name   || !$scope.formData.species|| !$scope.formData.breed|| !$scope.formData.gender|| !$scope.formData.birthdate) {
             Loader.toggleLoadingWithMessage("Por favor ingrese los datos", 2000);
            return false;
            }
            PetService.update($scope.formData).then(function () {     
                $scope.resetFormData(); 
                $state.go("app.petlist");                         
            });
        
};

$scope.addPicture = function () {
  alert("Foto edit");
  };

});
