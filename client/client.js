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

angular.module('PodcastApp').factory('authHttpResponseInterceptor',['$q','$location',function($q,$location){
    return {
        response: function(response){
            if (response.status === 401) {
                console.log("Response 401");
            }
            return response || $q.when(response);
        },
        responseError: function(rejection) {
            if (rejection.status === 401) {
                console.log("Response Error 401",rejection);
                $location.path('/#/login');
            }
            return $q.reject(rejection);
        }
    }
}]);

angular.module('PodcastApp').config(['$httpProvider',function($httpProvider) {
    //Http Intercpetor to check auth failures for xhr requests
    $httpProvider.interceptors.push('authHttpResponseInterceptor');
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

angular.module('PodcastApp').controller('NavController', ['$http', '$state', 'AuthCheckService', function($http, $state, AuthCheckService){
  console.log('Nav controller loaded. ');
  var nc = this;
  var authenticated = AuthCheckService.auth;

  nc.authCheck = function(){

    if (authenticated == true){
      return true;
    } else {
      return false;
    }
  };
}]);

angular.module('PodcastApp').controller('UserController', ['$http', 'AuthCheckService', '$state', 'user', function($http, AuthCheckService, $state, user){
  var uc = this;
  if(!AuthCheckService.authCheck()){
    $state.go('login');
  }
  console.log(user);
  uc.user = user.data.user;
}]);
