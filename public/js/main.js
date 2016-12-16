// Initialize our angular app, and add a controller to it.
angular
  .module('MyApp', [])
  .controller('MyController', MyController);

// Angular allows us to "inject" modules. We want the $http module to make AJAX requests.
MyController.$inject = ['$http'];

// Any modules we $inject need to be specified as arugments in the controller function
function MyController($http) {
  /***********************
   * "this" is the controller instance the view will have access to.
   * We set it to a variable so that we can access it in functions below.
   * "vm" is commonly used to signify "View Model"
   * For more info: https://johnpapa.net/angularjss-controller-as-and-the-vm-variable/
   ***********************/
  var vm = this;

  /***************************
   * Functions and variables set on the vm object are accessible in the HTML view.
   ***************************/

  // variables
  vm.currentView = 'search';
  vm.favorites = [];
  vm.searchString = '';
  vm.searchResults = [];
  vm.selectedMovie = null;

  // functions
  vm.searchMovies = searchMovies;
  vm.getMovieInfo = getMovieInfo;
  vm.saveFavorite = saveFavorite;

  // We just want to load the favorites as soon as the controller is initialized,
  // so we can just call it here, and don't need to put it on the vm object.
  getFavorites();

  /***************************
   * Function definitions
   ***************************/

  // Makes a GET requeast to the /favorites endpoint.
  function getFavorites() {
    $http({
      method: 'GET',
      url: '/favorites'
    }).then(function(response) {
      // We load the response's data into the vm.favorites var so the HTML view can access it
      vm.favorites = response.data;
    });
  }

  // Hits the OMBd API with a search string.
  function searchMovies() {
    $http({
      method: 'GET',
      url: 'https://www.omdbapi.com/',
      // The vm.searchString variable is bound to an <input> in the view
      params: { type: 'movie', s: vm.searchString }
    }).then(function(response) {
      vm.searchResults = response.data['Search'];
    });
  }

  // get more info about a movie by searching with an id param
  function getMovieInfo(imdbID) {
    // The user has selected a movie, so we can clear the search results and string.
    vm.searchResults = [];
    vm.searchString = '';

    $http({
      method: 'GET',
      url: 'https://www.omdbapi.com/',
      params: { i: imdbID }
    }).then(function(response) {
      vm.selectedMovie = response.data;
    });
  }

  // POSTs to the /favorites endpoint on our server to add a favorite to the list
  function saveFavorite() {
    $http({
      method: 'POST',
      url: '/favorites',
      // our server expects a name and an imdbID
      data: { name: vm.selectedMovie['Title'], imdbID: vm.selectedMovie['imdbID'] }
    }).then(function(response) {
      vm.favorites = response.data;
      vm.selectedMovie = null;
      vm.currentView = 'favorites';
    });
  }
}
