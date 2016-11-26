angular.module('PodcastApp', ['ui.router']);

angular.module('PodcastApp').run(function($rootScope) {
  $rootScope.$on("$stateChangeError", console.log.bind(console)); // no idea if this is working
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
    controller: 'LoginController',
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
    templateUrl: 'views/user.html',
    resolve: {user: function(AuthCheckService){
      return AuthCheckService.resolveUser();
    }}
  })
  // console.log('stateProvider:', $stateProvider);
  // $locationProvider.html5Mode(true);
}]);

angular.module('PodcastApp').factory('AuthCheckService', ['$http', '$location', '$state', function($http, $location, $state){
  var user = {};
  var authenticated = false;

  return {
    user: user,
    authCheck: function(){
      if (authenticated){
        return authenticated;
      } else {
        $http.get('/auth/check')
        .then(function(resp){
          console.log('auth check resp:', resp);
          authenticated = true;
          return true;
        }, function(err){
          console.log('auth check fail:', err);
          // $state.go('splash');
          return false;
        });
      }
    },
    getUser: function(){
      if(user.user != null){
        return {user:user};
      } else {
        $http.get('/auth/check').then(function(resp){
          user = resp.data;
          return {user:resp.data};
        }, function(err){
          return err;
        });
      }
    },
    resolveUser: function(){
      return $http.get('/auth/check');
    }
  }
}]);

angular.module('PodcastApp').controller('SplashController', ['$http', 'AuthCheckService', function($http, AuthCheckService){
  console.log('Splash controller loaded. ');
  // AuthCheckService.authCheck();
}]);

angular.module('PodcastApp').controller('LoginController', ['$http', 'AuthCheckService','$state', function($http, AuthCheckService, $state){
  console.log('Login controller loaded. ');
  if(AuthCheckService.authCheck()){
    $state.go('user');
  }
}]);

angular.module('PodcastApp').controller('AboutController', ['$http', function($http){
  console.log('About controller loaded. ');
}]);

angular.module('PodcastApp').controller('UserController', ['$http', 'AuthCheckService', '$state', 'user', function($http, AuthCheckService, $state, user){
  var uc = this;
  if(!AuthCheckService.authCheck()){
    $state.go('login');
  }
  console.log(user);
  uc.user = user.data;
}]);
