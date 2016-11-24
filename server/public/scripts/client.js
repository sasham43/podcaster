angular.module('PodcastApp', ['ui.router']);

angular.module('PodcastApp').config(['$stateProvider', '$locationProvider', function($stateProvider, $locationProvider){
  $stateProvider.state({
    name: 'splash',
    url: '/',
    templateUrl: 'views/splash.html'
  }).state({
    name: 'login',
    url: '/login',
    templateUrl: 'views/login.html'
  }).state({
    name: 'about',
    url: '/about',
    templateUrl: 'views/about.html'
  });
  // $locationProvider.html5Mode(true);
}]);

angular.module('PodcastApp').controller('SplashController', ['$http', function($http){
  console.log('Splash controller loaded. ');
}]);

angular.module('PodcastApp').controller('LoginController', ['$http', function($http){
  console.log('Login controller loaded. ');
}]);

angular.module('PodcastApp').controller('AboutController', ['$http', function($http){
  console.log('About controller loaded. ');
}]);
