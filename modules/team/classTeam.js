function Team(teamName) {
  this.name = teamName;
  
  this.reset();
}

Team.prototype.reset = function() {
  this.points = 0;
  this.gamesNumber = 0;
  this.goalsWon = 0;
  this.goalsLost = 0;
  this.wins = 0;
  this.losses = 0;
  this.draws = 0;
  this.rank = 0;
};
