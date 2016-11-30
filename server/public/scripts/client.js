angular.module('PodcastApp', ['ui.router']);

angular.module('PodcastApp').run(function($rootScope) {
  $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error){
    console.log.bind(console)
  }); // no idea if this is working -> yes is working
});

angular.module('PodcastApp').config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function($stateProvider, $urlRouterProvider, $httpProvider){
  $stateProvider.state({
    name: 'splash',
    url: '/',
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
    name: 'home',
    url: '/home',
    controller: 'HomeController',
    controllerAs: 'hc',
    templateUrl: 'views/home.html',
    resolve: {user: function(AuthCheckService){
      return AuthCheckService.resolveUser();
    }}
  })
  .state({
    name: 'home.feed',
    url: '/feed',
    templateUrl: 'views/home-feed.html',
    parent: 'home'
  })
  .state({
    name: 'home.episodes',
    url: '/episodes',
    templateUrl: 'views/home-episodes.html',
    parent: 'home'
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

angular.module('PodcastApp').controller('HomeController', ['$http', 'user', 'AuthCheckService', '$state', function($http, user, AuthCheckService, $state){
  console.log('Home controller loaded. ');
  var hc = this;
  if(!AuthCheckService.authCheck()){
    $state.go('login');
  }
  hc.user = user.data.user;
  hc.feed = {categories: [], itunes_category: []};

  hc.saveFeed = function(){
    $http.post('/podcast/create-feed', hc.feed).then(function(resp){
      console.log('create resp', resp);
    }, function(err){
      console.log('create fail:', err);
    });
  };

  hc.addCategory = function(dest, category){
    switch(dest){
      case 1:
        hc.feed.categories.push(category);
        break;
      case 2:
        hc.feed.itunes_category.push(category);
        break;
    }
  };

  hc.removeCategory = function(dest, i){
    switch(dest){
      case 1:
        hc.feed.categories.splice(i, 1);
        break;
      case 2:
        hc.feed.itunes_category.splice(i, 1);
        break;
    }
  };
}]);

angular.module('PodcastApp').controller('RootController', ['$http', '$state', 'AuthCheckService', '$scope', function($http, $state, AuthCheckService, $scope){
  console.log('Nav controller loaded. ');
  var rc = this;
  rc.auth = false;

  $scope.$on('auth', function(evt, args){
    // console.log('auth', evt, args);
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
