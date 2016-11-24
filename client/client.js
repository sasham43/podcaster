angular.module('PodcastApp', ['ui.router']);

angular.module('PodcastApp').config(['$stateProvider', function($stateProvider){
  $stateProvider.state({
    name: 'splash',
    url: '/',
    templateUrl: 'views/splash.html'
  });
  $stateProvider.state({
    name: 'login',
    url: '/login',
    templateUrl: 'views/login.html'
  });
  $stateProvider.state({
    name: 'about',
    url: '/about',
    templateUrl: 'views/about.html'
  });
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
