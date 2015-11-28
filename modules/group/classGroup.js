function Group($http, sport, mode, init_group_data) {
  this.teams = [];
  this.games = [];
  this.sport = sport;
  this.mode = mode;
  this.init_group_data = init_group_data;
  this.twoGamesModeApplied = false;
  
//  console.log(init_group_data);
  
  for (var key in init_group_data.teams) {
    this.teams.push(new Team(init_group_data.teams[key].name));
  }
  this.update();
  
//  var self = this;
//  $http.get('data/teams.json').success(function(data) {
//    self.teams = [];
//    for (var key in data) {
//      self.teams.push(new Team(data[key].name));
//    }
//    self.update();
//  });
}

Group.prototype.addTeam = function(teamName){
  this.teams.push(new Team(teamName));
  this.update();
}

Group.prototype.removeTeam = function(team){
  this.teams.splice(this.teams.indexOf(team), 1);
  this.update();
}

Group.prototype.update = function() {
  this.updateGames();
  this.updateRanking();
}

Group.prototype.updateGames = function(){    
    this.twoGamesModeApplied = false;
    var howManyTeams = this.teams.length;

    this.games = [];

    var isOddNumberOfTeams = false;
    if (howManyTeams % 2) {
      var tempTeam = new Team('PODSTAWIONY_TEAM');
      isOddNumberOfTeams = true;
      this.teams.push(tempTeam);
      howManyTeams++;
    }

    // tworzę tablicę wszystkich drużyn oprócz pierwszej
    var teamsExceptFirstTeam = [];
    for (var i = 1; i < this.teams.length; i++) {
      teamsExceptFirstTeam.push(this.teams[i]);
    }

    for (var i = 0; i < this.teams.length; i++) {
      this.teams[i].howManyGamesAtHome = 0;
    }

    for (var roundNumber = 1; roundNumber < howManyTeams; roundNumber++) {
      var round = [];
      
      for (var gameNumberInRound = 0; gameNumberInRound < howManyTeams/2; gameNumberInRound++) {
        var game = new Game(null, null, roundNumber);
        round.push(game);
        this.games.push(game);
      }

      round[0]['team1'] = this.teams[0]; //pierwszą drużyną zawsze wsadzam jako team1 w pierwszym meczu kolejki

      var teamsExceptFirstTeamWhichDidntPlayYet = teamsExceptFirstTeam.slice(); //klonowanie listy pozostałych drużyn

      for (var gameInRoundNumber = 1; gameInRoundNumber < this.teams.length/2; gameInRoundNumber++) { //najpierw obsadzam team1 w pozostałych meczach
        round[gameInRoundNumber]['team1'] = teamsExceptFirstTeamWhichDidntPlayYet.shift(); //ściągam stąd pierwszy element
      }
      for (gameInRoundNumber = this.teams.length/2 - 1; gameInRoundNumber>=0; gameInRoundNumber--) { //a potem obsadzam team2 we wszystkich meczach, ale idąc od końca
        round[gameInRoundNumber]['team2'] = teamsExceptFirstTeamWhichDidntPlayYet.shift(); //ściągam stąd pierwszy element
      }
      
      teamsExceptFirstTeam.unshift(teamsExceptFirstTeam.pop()); //na oryginalnej tablicy ostatni element idzie na początek

    }

    // równomierne rozkładanie gospodarzy/gości w poszczególnych rundach  
    for (var game of this.games) {
      if (game['team2'].howManyGamesAtHome < game['team1'].howManyGamesAtHome) {
        game['team2'].howManyGamesAtHome++;
        
        game.reverseTeams(); //zamiana kolejności teamów
      }
      else {
        game['team1'].howManyGamesAtHome++;
      }
    }

    // usuń podstawiony team dla nieparzystej liczby teamów
    if (isOddNumberOfTeams) {
      for (var key in this.games) {
        var game = this.games[key];
        if (game.team1 == tempTeam || game.team2 == tempTeam) {
          this.games.splice(key, 1);     
        }
      }
      this.teams.pop();
    }

    //zwiększ ilość meczy w trybie mecz-i-rewanż
    if (this.mode == "two-games" && !this.twoGamesModeApplied) {
      var howManyGames = Object.keys(this.games).length;
      for (var gameNumber = 0; gameNumber < howManyGames; gameNumber++) {
        var game = this.games[gameNumber];
        var newRoundNumber = game.roundNumber + this.teams.length - 1;
        if (isOddNumberOfTeams) {
          newRoundNumber++;
        }
        var newgame = new Game(game['team2'], game['team1'], newRoundNumber);
        this.games.push(newgame);
        this.twoGamesModeApplied = true;
      }
    }    
  };


Group.prototype.updateRanking = function(){    
  for (var team of this.teams) {
    team.reset();
  }
  for (var game of this.games) {
    if (Number.isInteger(game.team1Goals) && Number.isInteger(game.team2Goals)) {
      game.team1.gamesNumber += 1;
      game.team2.gamesNumber += 1;
      game.team1.goalsWon += game.team1Goals;
      game.team1.goalsLost += game.team2Goals;
      game.team2.goalsWon += game.team2Goals;
      game.team2.goalsLost += game.team1Goals;
      switch (this.sport) {
        case "football":
          if (game.team1Goals > game.team2Goals) {
            game.team1.points += 3;
            game.team1.wins++;
            game.team2.losses++;
          }
          if (game.team1Goals == game.team2Goals) {
            game.team1.points += 1;
            game.team2.points += 1;
            game.team1.draws++;
            game.team2.draws++;
          }
          if (game.team1Goals < game.team2Goals) {
            game.team2.points += 3;
            game.team2.wins++;
            game.team1.losses++;
          }
          break;
        case "volleyball":
          if (game.team1Goals == 3) {
            game.team1.wins++;
            game.team2.losses++;
            if (game.team2Goals == 2) {
              game.team1.points += 2;
              game.team2.points += 1;
            }
            else {
              game.team1.points += 3;
            }
          }
          if (game.team2Goals == 3) {
            game.team2.wins++;
            game.team1.losses++;
            if (game.team1Goals == 2) {
              game.team2.points += 2;
              game.team1.points += 1;
            }
            else {
              game.team2.points += 3;
            }                  
          }              
          break;
      }
      }
  }
//  
//  //  var orderBy = $filter('orderBy');
////  var TEMP = orderBy(this.teams, 'points');
//  var orderBy = $filter('orderBy');
////  var friends = [
////    { name: 'John',    phone: '555-1212',    age: 10 },
////    { name: 'Mary',    phone: '555-9876',    age: 19 },
////    { name: 'Mike',    phone: '555-4321',    age: 21 },
////    { name: 'Adam',    phone: '555-5678',    age: 35 },
////    { name: 'Julie',   phone: '555-8765',    age: 29 }
////  ];
//  var order = function(predicate, reverse) {
//    this.teams = orderBy(this.teams, predicate, reverse);
//  };
//  order('-points',false);
//  console.log(this.teams);
};