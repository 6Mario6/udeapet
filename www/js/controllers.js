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
app.controller('PetlistsCtrl', ['$scope', 'PetsFactory', 'LSFactory', 'Loader','$ionicModal',
    function($scope, BooksFactory, LSFactory, Loader,$ionicModal) {
        $scope.pets = [];
        $scope.noData = true;

        $ionicModal.fromTemplateUrl('templates/newPet.html', function(modal) {
        $scope.newTemplate = modal;
        });
       $scope.newPet = function() {
        $scope.newTemplate.show();
        };


    }
]);
app.controller('PetCtrl', function($scope, $stateParams) {
});
app.controller('newCtrl', function($rootScope, $ionicPopup, $ionicLoading, $scope, $window, Loader,PetService) {
  
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
            'idm': '',
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
      
            console.log("newCtrl::trackPet");

            $ionicLoading.show();
            PetService.track($scope.formData).then(function () {
                $scope.resetFormData();
                $ionicLoading.hide();
                form.$setPristine(true);
               // $state.go("tab.meals");
            });
        
};

  $scope.close = function() {
    $scope.modal.hide();
  };

});
