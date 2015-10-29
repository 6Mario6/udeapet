angular.module('upet', ['ionic','firebase', 'upet.controllers', 'upet.factory'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})
.run(['$rootScope', 'AuthFactory','$firebaseAuth','$firebase','$window',
    function($rootScope, AuthFactory,$firebaseAuth,$firebase, $window) {

        $rootScope.isAuthenticated = AuthFactory.isLoggedIn();
        $rootScope.userEmail = null;
        $rootScope.baseUrl = 'https://udea.firebaseio.com/';
        var authRef = new Firebase($rootScope.baseUrl);
        $rootScope.auth = $firebaseAuth(authRef);

        // utility method to convert number to an array of elements
        $rootScope.getNumber = function(num) {
            return new Array(num);
        }
       
        $rootScope.checkSession = function() {
            var auth = new FirebaseSimpleLogin(authRef, function(error, user) {
                if (error) {
                    // no action yet.. redirect to default route
                    $rootScope.userEmail = null;
                    $window.location.href = '#/app/welcome';
                } else if (user) {
                    // user authenticated with Firebase
                    $rootScope.userEmail = user.email;
                    $window.location.href = ('#/app/petlist');
                } else {
                    // user is logged out
                    $rootScope.userEmail = null;
                    $window.location.href = '#/app/welcome';
                }
            });
        }

    }
])
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.welcome', {
      url: '/welcome',
      views: {
        'menuContent': {
          templateUrl: 'templates/welcome.html'
        }
      }
    })
    .state('app.petlist', {
      url: '/petlist',
      views: {
        'menuContent': {
          templateUrl: 'templates/petlist.html',
          controller: 'PetlistsCtrl'
        }
      }
    })

  .state('app.pet', {
    url: '/petlist/:petId',
    views: {
      'menuContent': {
        templateUrl: 'templates/playlist.html',
        controller: 'PetCtrl'
      }
    }
  });
  $urlRouterProvider.otherwise('/app/welcome');
});
