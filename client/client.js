angular.module('PodcastApp', ['ui.router', 'ngResource']);

angular.module('PodcastApp').run(function($rootScope) {
  $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error){
    console.log.bind(console)
  }); // no idea if this is working -> yes is working
});

angular.module('PodcastApp').config(['$stateProvider', '$urlRouterProvider', '$httpProvider', '$provide', '$locationProvider', function($stateProvider, $urlRouterProvider, $httpProvider, $provide, $locationProvider){
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
    // return true;
    }}
  })
  .state({
    name: 'feed',
    url: '/feed',
    templateUrl: 'views/feed.html',
    controller: 'HomeController',
    controllerAs: 'hc',
    resolve: {user: function(AuthCheckService){
      return AuthCheckService.resolveUser();
    // return true;
    }}
  })
  .state({
    name: 'episodes',
    url: '/episodes',
    templateUrl: 'views/episodes.html',
    controller: 'HomeController',
    controllerAs: 'hc',
    resolve: {user: function(AuthCheckService){
      return AuthCheckService.resolveUser();
    // return true;
    }}
  })
  .state({
    name: 'user',
    url: '/user',
    controller: 'UserController',
    controllerAs: 'uc',
    templateUrl: 'views/user.html',
    resolve: {user: function(AuthCheckService){
      return AuthCheckService.resolveUser();
    // return true;
    }}
  });

  $urlRouterProvider.otherwise('/');
  $provide.factory('DateInterceptor', ['$q', function($q){
    return {
      'response': function(resp){
        if(resp.data.pub_date){
          resp.data.pub_date = new Date(resp.data.pub_date);
          return resp;
        } else {
          return resp;
        }
      }
    }
  }])
  $httpProvider.interceptors.push('DateInterceptor');
  $locationProvider.html5Mode(true);
}]);

angular.module('PodcastApp').factory('FeedService', ['$resource', function($resource){
  return $resource('/podcast/:id/feed', {
    id: '@customer_id'
  }, {get: {
        method: 'GET',
        interceptor: 'DateInterceptor'
      }
  });
}]);

angular.module('PodcastApp').factory('EpisodeService', ['$resource', function($resource){
  return $resource('/podcast/:id/episodes', {
    id: '@customer_id'
  });
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
  // if(AuthCheckService.authCheck()){
  //   $state.go('user');
  // }
}]);

angular.module('PodcastApp').controller('AboutController', ['$http', function($http){
  console.log('About controller loaded. ');
}]);

angular.module('PodcastApp').controller('HomeController', ['$http', 'user', 'AuthCheckService', '$state', 'FeedService', 'EpisodeService', function($http, user, AuthCheckService, $state, FeedService, EpisodeService){
  console.log('Home controller loaded. ');
  var hc = this;
  // hc.auth = AuthCheckService.authCheck();
  hc.user = user.data.user;
  console.log('hc auth:', hc.auth);
  // if(hc.auth == null || hc.user == null){
  //   console.log('go login');
  //   $state.go('login');
  // } else {
    console.log('hc.user:', hc.user);
    hc.show_new_episode = false;
    hc.feed = {categories: [], itunes_category: []};
    hc.new_episode = {categories: []};
    hc.feed = FeedService.get({id:hc.user.id});
    hc.episodes = EpisodeService.query({id:hc.user.id});

    hc.expandEpisode = function(index){
      if(hc.expanded_episode == index){
        hc.expanded_episode = -1;
      } else {
        hc.expanded_episode = index;
      }
    };

    hc.toggleNewEpisode = function(){
      // console.log('toggle:', hc.episodes, hc.show_new_episode)
      hc.show_new_episode = !hc.show_new_episode;
    };

    hc.addEpisode = function(episode){
      EpisodeService.save({id: hc.user.id}, episode, function(resp){
        console.log('save episode:', resp);
      });
    };

    hc.publishFeed = function(){
      $http.get('/podcast/' + hc.user.id + '/publish').then(function(resp){
        console.log('published:', resp);
      }, function(err){
        console.log('err published:', err);
      });
    };

    hc.saveFeed = function(){
      FeedService.save({id:hc.user.id}, hc.feed, function(resp){
        console.log('save response:', resp);
      });
    };

    hc.addCategory = function(dest, category, evt){
      switch(dest){
        case 1:
          hc.feed.categories.push(category);
          break;
        case 2:
          hc.feed.itunes_category.push(category);
          break;
        case 3:
          hc.new_episode.categories.push(category);
          break;
      }
      category = '';
    };

    hc.removeCategory = function(dest, i){
      switch(dest){
        case 1:
          hc.feed.categories.splice(i, 1);
          break;
        case 2:
          hc.feed.itunes_category.splice(i, 1);
          break;
        case 3:
          hc.new_episode.categories.splice(i, 1);
          break;
      }
    };
  // }
}]);

angular.module('PodcastApp').controller('RootController', ['$http', '$state', 'AuthCheckService', '$scope', function($http, $state, AuthCheckService, $scope){
  console.log('Root controller loaded. ');
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
  // if(!AuthCheckService.authCheck()){
  //   $state.go('login');
  // }
  $scope.$emit('auth', {auth: true});
  console.log(user);
  uc.user = user.data.user;
}]);
