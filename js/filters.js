'use strict';

/* Filters */

angular.module('sportFilters', []).filter('gameClass', function() {
  return function(input, team1Goals, team2Goals) {
    if (Number.isInteger(team1Goals) && Number.isInteger(team2Goals)) {
      if (team1Goals > team2Goals) return 'bg-success';
      if (team1Goals == team2Goals) return 'bg-warning';
      if (team1Goals < team2Goals) return 'bg-danger';
    }
  };
})

.filter('showResult', function() {
  return function(input, team1, team2, group) {
    for (var game of group.games) {
      if (Number.isInteger(game.team1Goals) && Number.isInteger(game.team2Goals)) {
        if (game.team1 == team1 && game.team2 == team2) {
          return game.team1Goals + ':' + game.team2Goals;
        }
        if (group.mode == "one-game" && game.team1 == team2 && game.team2 == team1) { //tylko w trybie "one-game" (bez rewanży)
          return game.team2Goals + ':' + game.team1Goals;
        }
      }
    }
  };
})

.filter('showResultClass', function() {
  return function(input, team1, team2, group) {
    for (var game of group.games) {
      if (Number.isInteger(game.team1Goals) && Number.isInteger(game.team2Goals)) {
        if (game.team1 == team1 && game.team2 == team2) {
          if (game.team1Goals > game.team2Goals) return 'success';
          if (game.team1Goals == game.team2Goals) return 'warning';
          if (game.team1Goals < game.team2Goals) return 'danger';
        }
        if (group.mode == "one-game"  && game.team1 == team2 && game.team2 == team1) { //tylko w trybie "one-game" (bez rewanży
          if (game.team2Goals > game.team1Goals) return 'success';
          if (game.team2Goals == game.team1Goals) return 'warning';
          if (game.team2Goals < game.team1Goals) return 'danger';
        }
      }
      if (team1 == team2) {
        return 'info';
      }            
    }
  };
})