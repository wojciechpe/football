'use strict';

/* Controllers */

var sportControllers = angular.module('sportControllers', []);

sportControllers.controller('SportCtrl', ['$scope', '$http',
  function($scope, $http) {

    $scope.tournament = {
      groups: [],
      sport: 'football',
      mode: 'two-games',
      loaded_data: [],
      init_group_title: "",
    
      addGroup: function() {
        var init_group_data = {};
        for (var key in this.loaded_data) {
          if (this.loaded_data[key].group_title == this.init_group_title) {
            init_group_data = this.loaded_data[key];
          }
        }
        
        this.groups.push(new Group($http, this.sport, this.mode, init_group_data));
      },
      
      removeGroup: function(group) {
        var index = this.groups.indexOf(group);
        this.groups.splice(index, 1);  
      }
      
    };
    
    $http.get('data/teams.json').success(function(data) {
      $scope.tournament.loaded_data = data;
    });
    
  }
]);