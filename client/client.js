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
    templateUrl: 'views/user.html'
  });
  // $locationProvider.html5Mode(true);
}]);

angular.module('PodcastApp').factory('AuthCheckService', ['$http', function($http){
  return {
    // authCheck: function(){
    //   $http.get('/auth/check').then(function(resp){
    //     console.log('auth check resp:', resp);
    //   }, function(err){
    //     console.log('auth check fail:', err)
    //   });
    // }
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
