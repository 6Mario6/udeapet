angular.module('upet.controllers', [])
.controller('AppCtrl', ['$rootScope', '$ionicModal', 'AuthFactory', '$location', 'UserFactory', '$scope', 'Loader', '$firebaseAuth',
    function($rootScope, $ionicModal, AuthFactory, $location, UserFactory, $scope, Loader, $firebaseAuth) {
        $rootScope.checkSession();
        $rootScope.$on('showLoginModal', function($event, scope, cancelCallback, callback) {
            $scope.user = {
                email: '',
                password: ''
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
                    Loader.showLoading('Ingresando...');
                    $rootScope.auth.$login('password', {
                      email: email,
                      password: password
                    }).then(function(user) {
                        $rootScope.userEmail = user.email;
                        AuthFactory.setUser(user);
                        $rootScope.isAuthenticated = true;
                        $scope.modal.hide();
                        Loader.hideLoading();
                         if (typeof callback === 'function') {
                            callback();
                        }
                    }, function(error) {
                        Loader.hideLoading();
                      if (error.code == 'INVALID_EMAIL') {
                        Loader.toggleLoadingWithMessage('Email incorrecto');
                      } else if (error.code == 'INVALID_PASSWORD') {
                        Loader.toggleLoadingWithMessage('Contraseña incorrecta');
                      } else if (error.code == 'INVALID_USER') {
                        Loader.toggleLoadingWithMessage('Usuario incorrecto');
                      } else {
                        Loader.toggleLoadingWithMessage('Oops something went wrong. Please try again later');
                      }

                  }); 
                }
                $scope.register = function() {
                    var email = this.user.email;
                    var password = this.user.password;
                    if (!email || !password) {
                      Loader.showLoading("Por favor ingresar campos validos");
                      return false;
                     }
                    Loader.showLoading('Registrando...');
                    $rootScope.auth.$createUser(email, password, function(error, user) {
                      if (!error) {
                        AuthFactory.setUser(user);
                        $rootScope.isAuthenticated = true;
                        $rootScope.userEmail = user.email;
                        Loader.hideLoading();
                        $scope.modal.hide();
                        if (typeof callback === 'function') {
                            callback();
                        }   
                      } else {
                         Loader.hideLoading();
                        if (error.code == 'INVALID_EMAIL') {
                           Loader.toggleLoadingWithMessage('Invalid Email Address');
                        } else if (error.code == 'EMAIL_TAKEN') {
                           Loader.toggleLoadingWithMessage('Email Address already taken');
                        } else {
                           Loader.toggleLoadingWithMessage('Oops something went wrong. Please try again later');
                        }
                      }
                    });
                }
            });
        });
        $rootScope.loginFromMenu = function() {
            $rootScope.$broadcast('showLoginModal', $scope, null, null);
        }
        $rootScope.logout = function() {
            $rootScope.auth.$logout();
            $rootScope.checkSession();
            UserFactory.logout();
            $rootScope.isAuthenticated = false;
            $location.path('/app/welcome');
            Loader.toggleLoadingWithMessage('Sesión cerrada con éxito !', 2000);
        }
    }
])
.controller('PetlistsCtrl', ['$scope', 'PetsFactory', 'LSFactory', 'Loader',
    function($scope, BooksFactory, LSFactory, Loader) {

        Loader.showLoading();

        // support for pagination
        var page = 1;
        $scope.pets = [];
        var pets = LSFactory.getAll();

        // if books exists in localStorage, use that instead of making a call
        if (pets.length > 0) {
            $scope.pets = pets;
            Loader.hideLoading();
        } else {
            PetsFactory.get(page).success(function(data) {

                // process books and store them 
                // in localStorage so we can work with them later on, 
                // when the user is offline
                processPets(data.data.pets);

                $scope.pets = data.data.pets;
                $scope.$broadcast('scroll.infiniteScrollComplete');
                Loader.hideLoading();
            }).error(function(err, statusCode) {
                Loader.hideLoading();
                Loader.toggleLoadingWithMessage(err.message);
            });
        }

        function processPets(pets) {
            LSFactory.clear();
            // we want to save each book individually
            // this way we can access each book info. by it's _id
            for (var i = 0; i < pets.length; i++) {
                LSFactory.set(pets[i]._id, pets[i]);
            };
        }

    }
])
.controller('PetCtrl', function($scope, $stateParams) {
});
function escapeEmailAddress(email) {
    if (!email) return false
    // Replace '.' (not allowed in a Firebase key) with ','
    email = email.toLowerCase();
    email = email.replace(/\./g, ',');
    return email.trim();
}