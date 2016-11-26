angular.module('PodcastApp', ['ui.router']);

angular.module('PodcastApp').run(function($rootScope) {
  $rootScope.$on("$stateChangeError", console.log.bind(console));
});

angular.module('PodcastApp').config(['$stateProvider', '$locationProvider', function($stateProvider, $locationProvider){
  $stateProvider.state({
    name: 'splash',
    url: '',
    templateUrl: 'views/splash.html'
  })
  .state({
    name: 'login',
    url: '/login',
    templateUrl: 'views/login.html'
  })
  .state({
    name: 'about',
    url: '/about',
    templateUrl: 'views/about.html'
  })
  .state({
    name: 'user',
    url: '/user',
    controller: 'UserController',
    controllerAs: 'uc',
    templateUrl: 'views/user.html'
  })
  // console.log('stateProvider:', $stateProvider);
  // $locationProvider.html5Mode(true);
}]);

angular.module('PodcastApp').factory('AuthCheckService', ['$http', '$location', '$state', function($http, $location, $state){
  return {
    authCheck: function(){
      $http.get('/auth/check').then(function(resp){
        console.log('auth check resp:', resp);
        return resp.data;
      }, function(err){
        console.log('auth check fail:', err);
        $state.go('splash');
      });
    }
  }
}]);

angular.module('PodcastApp').controller('SplashController', ['$http', 'AuthCheckService', function($http, AuthCheckService){
  console.log('Splash controller loaded. ');
  // AuthCheckService.authCheck();
}]);

angular.module('PodcastApp').controller('LoginController', ['$http', function($http){
  console.log('Login controller loaded. ');
}]);

angular.module('PodcastApp').controller('AboutController', ['$http', function($http){
  console.log('About controller loaded. ');
}]);

angular.module('PodcastApp').controller('UserController', ['$http', 'AuthCheckService', function($http, AuthCheckService){
  var uc = this;

  uc.user = AuthCheckService.authCheck();
}]);
