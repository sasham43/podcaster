angular.module('PodcastApp', ['ui.router']);

angular.module('PodcastApp').run(function($rootScope) {
  $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error){
    console.log('1 2 3', event, toState, toParams, fromState, fromParams, error);
    // if(error.status == 401){
    //   $state.go('login');
    // }
    console.log.bind(console)
  }); // no idea if this is working -> yes is working
});

angular.module('PodcastApp').config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function($stateProvider, $urlRouterProvider, $httpProvider){
  $stateProvider.state({
    name: 'splash',
    url: '/#/',
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
  });

  $urlRouterProvider.otherwise('/');
}]);

angular.module('PodcastApp').factory('AuthCheckService', ['$http', '$location', '$state', function($http, $location, $state){
  var user = {};
  var auth = false;

  return {
    auth: auth,
    user: user,
    authCheck: function(){
      if (auth == true){
        return auth;
      } else {
        $http.get('/auth/check')
        .then(function(resp){
          auth = resp.data.authenticated;
          return auth;
        }, function(err){
          console.log('auth check fail:', err);
          return false;
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

angular.module('PodcastApp').controller('RootController', ['$http', '$state', 'AuthCheckService', '$scope', function($http, $state, AuthCheckService, $scope){
  console.log('Nav controller loaded. ');
  var rc = this;
  rc.auth = false;

  $scope.$on('auth', function(evt, args){
    console.log('auth', evt, args);
    rc.auth = args.auth;
  });

  rc.authCheck = function(){
    return rc.auth;
  };
}]);

angular.module('PodcastApp').controller('UserController', ['$http', 'AuthCheckService', '$state', 'user', '$scope', function($http, AuthCheckService, $state, user, $scope){
  var uc = this;
  if(!AuthCheckService.authCheck()){
    $state.go('login');
  }
  $scope.$emit('auth', {auth: true});
  console.log(user);
  uc.user = user.data.user;
}]);
