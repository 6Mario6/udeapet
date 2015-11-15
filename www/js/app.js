var app = angular.module('upet', [
  'ionic',
  'upet.controllers',
  'upet.factory',
  'ngMessages',
  'ngCordova',
  'ionic-datepicker',
  'angularMoment',
  'parse-angular',
  'parse-angular.enhance',
  'upet.controllers.meals',
  'upet.controllers.account',
  'upet.services.authentication',
  'upet.services.pets'
]);
app.run(function ($ionicPlatform) {
  $ionicPlatform.ready(function () {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleBlackTranslucent();
    }
  });
    // Initialise Parse
  Parse.initialize("pGjRYW5wooTCRNAX9zEtXZn3YeExbeBjSsA1I7KT", "JZoYvYpIQXn1dhpM7nE2tT5wT7Rn4cBtfCZwJVBK");  
});
app.run(['$rootScope', 'AuthFactory','$window',
    function($rootScope, AuthFactory, $window) {

        $rootScope.userEmail = null;
        var currentUser = Parse.User.current();
  
        if (currentUser) {
            $rootScope.isAuthenticated = true;
            $rootScope.user = currentUser;
            $window.location.href = '#/app/welcome';
        }
        // utility method to convert number to an array of elements
        $rootScope.getNumber = function(num) {
            return new Array(num);
        }

    }
]);

app.config(function ($stateProvider, $urlRouterProvider) {
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
     .state('app.newPet', {
      url: '/newpet',
      views: {
        'menuContent': {
          templateUrl: 'templates/newPet.html',
          controller: 'newCtrl'
        }
      }
    })
     .state('app.editPet', {
      url: '/editpet',
      views: {
        'menuContent': {
          templateUrl: 'templates/editPet.html',
          controller: 'editCtrl'
        }
      }
    })
  .state('app.detailpet', {
    url: '/detailpet',
    views: {
      'menuContent': {
        templateUrl: 'templates/detailpet.html',
        controller: 'detailCtrl'
      }
    }
  });
  $urlRouterProvider.otherwise('/app/welcome');
});
